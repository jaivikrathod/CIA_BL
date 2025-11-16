const e = require('express');
const db = require('../../models');
const { Op, fn, col, literal, where: sequelizeWhere } = require('sequelize');

/**
 * Helper: parse preset/range into rangeStart and rangeEnd Date objects
 */
const computeRange = (preset, start_date, end_date) => {
  const now = new Date();
  const toDateOnly = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

  let rangeStart = null;
  let rangeEnd = null;

  if (preset && preset !== 'custom') {
    const end = toDateOnly(now);
    let start = new Date(end);
    switch (preset) {
      case 'this_month':
        start = new Date(end.getFullYear(), end.getMonth(), 1);
        break;
      case '2m':
        start = new Date(end.getFullYear(), end.getMonth() - 1, 1);
        break;
      case '3m':
        start = new Date(end.getFullYear(), end.getMonth() - 2, 1);
        break;
      case '6m':
        start = new Date(end.getFullYear(), end.getMonth() - 5, 1);
        break;
      case '1y':
        start = new Date(end.getFullYear(), end.getMonth() - 11, 1);
        break;
      case 'all':
        start = null;
        break;
      default:
        start = new Date(end.getFullYear(), end.getMonth() - 11, 1);
    }
    rangeStart = start;
    // For this_month end should be the last day of the month
    if (preset === 'this_month') {
      rangeEnd = new Date(end.getFullYear(), end.getMonth() + 1, 0);
    } else {
      rangeEnd = end;
    }
  } else if (start_date && end_date) {
    rangeStart = new Date(start_date);
    rangeEnd = new Date(end_date);
  } else {
    // default: last 12 months
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    rangeStart = new Date(currentYear, currentMonth - 11, 1);
    rangeEnd = new Date(currentYear, currentMonth + 1, 0);
  }

  return { rangeStart, rangeEnd };
};

/**
 * Build whereClause for combined queries based on filters (filters = [{type:'user', id:12}, ...])
 */
const buildWhereForFilters = (filters, rangeStart, rangeEnd, noDateFilter) => {
  const whereClause = { is_active: 1 };

  if (!(noDateFilter)) {
    whereClause.policy_start_date = { [Op.gte]: rangeStart, [Op.lte]: rangeEnd };
  }

  if (filters && filters.length > 0) {
    // separate user and agent ids
    const userIds = filters.filter(f => f.type === 'user').map(f => f.id).filter(Boolean);
    const agentIds = filters.filter(f => f.type === 'agent').map(f => f.id).filter(Boolean);

    const orConds = [];
    if (userIds.length) {
      orConds.push({ user_id: { [Op.in]: userIds }, [Op.or]: [{ case_type: 'office' }, { case_type: 'self' }] });
    }
    if (agentIds.length) {
      // agent entries expected to be case_type 'agent'
      orConds.push({ agent_id: { [Op.in]: agentIds }, case_type: 'agent' });
    }

    if (orConds.length) {
      whereClause[Op.or] = orConds;
    } else {
      // If no valid ids found, ensure nothing matches
      whereClause.id = -1;
    }
  }

  return whereClause;
};

exports.getInsuranceReports = async (req, res) => {
  try {
    const {
      user_id,
      entity_type = 'user',
      entity_id,
      entity_ids, // new: CSV of type-id values: user-12,agent-3
      preset,
      start_date,
      end_date,
      detailed = false,
      adminType
    } = req.query;

    if (!user_id) {
      return res.status(400).json({ success: false, message: 'User ID is required.' });
    }

    // parse filters
    let filters = []; // array of { type: 'user'|'agent', id: Number }
    if (entity_ids) {
      filters = entity_ids.split(',').map(s => {
        const [type, idStr] = (s || '').split('-');
        const id = Number(idStr);
        return (type && !isNaN(id)) ? { type, id } : null;
      }).filter(Boolean);
    } else if (entity_type === 'user' && entity_id) {
      filters = [{ type: 'user', id: Number(entity_id) }];
    } else if (entity_type === 'agent' && entity_id) {
      filters = [{ type: 'agent', id: Number(entity_id) }];
    } else if (entity_type === 'user' && !entity_id && adminType !== 'Admin') {
      // non-admin user: default to self
      filters = [{ type: 'user', id: Number(user_id) }];
    } else {
      // no explicit filters -> may be admin 'all' or default
      filters = [];
    }

    const { rangeStart, rangeEnd } = computeRange(preset, start_date, end_date);
    const noDateFilter = (preset === 'all');

    // Build the top-level whereClause for combined queries
    let combinedWhere = { is_active: 1 };
    if (!noDateFilter) {
      combinedWhere.policy_start_date = { [Op.gte]: rangeStart, [Op.lte]: rangeEnd };
    }

    // If filters provided -> build combinedWhere using buildWhereForFilters
    if (filters && filters.length > 0) {
      combinedWhere = buildWhereForFilters(filters, rangeStart, rangeEnd, noDateFilter);
    } else {
      // If entity_type supplied as 'agent' but no entity_id - nothing to restrict; if admin and entity_type === 'all' keep no further filtering
      if (entity_type === 'agent' && entity_id) {
        combinedWhere.agent_id = entity_id;
        combinedWhere.case_type = 'agent';
      } else if (entity_type === 'user') {
        // if admin passed user and no id then leave as all users
        if (entity_id) {
          combinedWhere.user_id = entity_id;
          combinedWhere[Op.or] = [{ case_type: 'office' }, { case_type: 'self' }];
        } else if (adminType !== 'Admin') {
          // non-admin default to self
          combinedWhere.user_id = user_id;
          combinedWhere[Op.or] = [{ case_type: 'office' }, { case_type: 'self' }];
        }
      } else if (entity_type === 'all') {
        // nothing to add
      }
    }

    // --- Combined monthly series (legacy `data`) ---
    const results = await db.insurance_details.findAll({
      attributes: [
        [fn('DATE_FORMAT', col('insurance_date'), '%Y-%m'), 'ym'],
        [fn('COUNT', col('*')), 'count']
      ],
      where: combinedWhere,
      group: [literal("DATE_FORMAT(insurance_date, '%Y-%m')")],
      order: [[literal("DATE_FORMAT(insurance_date, '%Y-%m')"), 'ASC']]
    });

    const ymToCount = new Map();
    results.forEach(r => {
      const ym = r.get('ym');
      const cnt = parseInt(r.get('count'), 10) || 0;
      ymToCount.set(ym, cnt);
    });

    // Build combined `data` array for months (respecting date range if set)
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const data = [];

    let cursor;
    let endCursor;
    if (!noDateFilter && rangeStart && rangeEnd) {
      cursor = new Date(rangeStart.getFullYear(), rangeStart.getMonth(), 1);
      endCursor = new Date(rangeEnd.getFullYear(), rangeEnd.getMonth(), 1);
    } else if (ymToCount.size > 0) {
      const yms = Array.from(ymToCount.keys()).sort();
      const [minYm, maxYm] = [yms[0], yms[yms.length - 1]];
      const [minY, minM] = minYm.split('-').map(Number);
      const [maxY, maxM] = maxYm.split('-').map(Number);
      cursor = new Date(minY, minM - 1, 1);
      endCursor = new Date(maxY, maxM - 1, 1);
    } else {
      const now = new Date();
      cursor = new Date(now.getFullYear(), now.getMonth(), 1);
      endCursor = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    while (cursor <= endCursor) {
      const ymKey = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}`;
      data.push({
        month: `${monthNames[cursor.getMonth()]} ${String(cursor.getFullYear()).slice(-2)}`,
        count: ymToCount.get(ymKey) || 0
      });
      cursor.setMonth(cursor.getMonth() + 1);
    }

    // --- Combined sums & counts (for dashboard cards) ---
    const [
      insuranceCount,
      packagePremium,
      premium,
      amount,
      od_premium,
      tp_premium,
      gst,
      net_payout_percent,
      net_amount,
      net_income,
      payout_percent
    ] = await Promise.all([
      db.insurance_details.count({ where: combinedWhere }),
      db.insurance_details.sum('package_premium', { where: combinedWhere }),
      db.insurance_details.sum('premium', { where: combinedWhere }),
      db.insurance_details.sum('amount', { where: combinedWhere }),
      db.insurance_details.sum('od_premium', { where: combinedWhere }),
      db.insurance_details.sum('tp_premium', { where: combinedWhere }),
      db.insurance_details.sum('gst', { where: combinedWhere }),
      db.insurance_details.sum('net_payout_percent', { where: combinedWhere }),
      db.insurance_details.sum('net_amount', { where: combinedWhere }),
      db.insurance_details.sum('net_income', { where: combinedWhere }),
      db.insurance_details.sum('payout_percent', { where: combinedWhere }),
    ]);

    // Users / Customers / Agents counts (with date filters for customers)
    const usersCount = await db.users.count({ where: { is_active: 1 } });

    const customersWhere = { is_active: 1 };
    if (!noDateFilter && rangeStart && rangeEnd) {
      customersWhere.created_at = { [Op.gte]: rangeStart, [Op.lte]: rangeEnd };
    }
    if (filters && filters.length > 0) {
      // If filters specify user ids and admin wants customer counts per selected users, use those user_ids
      const userIds = filters.filter(f => f.type === 'user').map(f => f.id);
      if (userIds.length) customersWhere.user_id = { [Op.in]: userIds };
    } else if (entity_id && entity_type !== 'all') {
      if (entity_type === 'user') customersWhere.user_id = entity_id;
    }
    const customersCount = await db.customers.count({ where: customersWhere });

    // new customers in last 5 days (option preserved)
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
    const newCustomersWhere = { is_active: 1, created_at: { [Op.gte]: fiveDaysAgo } };
    if (filters && filters.length > 0) {
      const userIds = filters.filter(f => f.type === 'user').map(f => f.id);
      if (userIds.length) newCustomersWhere.user_id = { [Op.in]: userIds };
    } else if (entity_id && entity_type !== 'all') {
      if (entity_type === 'user') newCustomersWhere.user_id = entity_id;
    }
    const newCustomersCount = await db.customers.count({ where: newCustomersWhere });

    const agentsCount = await db.agents.count({ where: { is_active: 1 } });

    // --- Per-entity monthly series & per-entity summaries (if filters provided) ---
    let per_entity_series = [];
    let summariesPerEntity = [];

    if (filters && filters.length > 0) {
      // Use for-loop sequential queries (safe & clear). If performance becomes an issue, refactor into a single grouped query.
      for (const f of filters) {
        const whereForEntity = { is_active: 1 };
        if (!noDateFilter && rangeStart && rangeEnd) {
          whereForEntity.policy_start_date = { [Op.gte]: rangeStart, [Op.lte]: rangeEnd };
        }

        if (f.type === 'user') {
          whereForEntity.user_id = f.id;
          whereForEntity[Op.or] = [{ case_type: 'office' }, { case_type: 'self' }];
        } else if (f.type === 'agent') {
          whereForEntity.agent_id = f.id;
          whereForEntity.case_type = 'agent';
        } else {
          // unknown type — continue
          continue;
        }

        // monthly counts per entity
        const rows = await db.insurance_details.findAll({
          attributes: [
            [fn('DATE_FORMAT', col('insurance_date'), '%Y-%m'), 'ym'],
            [fn('COUNT', col('*')), 'count']
          ],
          where: whereForEntity,
          group: [literal("DATE_FORMAT(insurance_date, '%Y-%m')")],
          order: [[literal("DATE_FORMAT(insurance_date, '%Y-%m')"), 'ASC']]
        });

        const entitySeries = {
          id: f.id,
          type: f.type,
          label: `${f.type === 'user' ? 'User' : 'Agent'} ${f.id}`,
          data: rows.map(r => ({ ym: r.get('ym'), count: parseInt(r.get('count'), 10) || 0 }))
        };

        // Try to resolve nice label from users/agents table (non-blocking)
        try {
          if (f.type === 'user') {
            const u = await db.users.findOne({ where: { id: f.id }, attributes: ['full_name'] });
            if (u) entitySeries.label = u.full_name;
          } else if (f.type === 'agent') {
            const a = await db.agents.findOne({ where: { id: f.id }, attributes: ['full_name'] });
            if (a) entitySeries.label = a.full_name;
          }
        } catch (e) {
          // ignore label resolution errors
        }

        per_entity_series.push(entitySeries);

        // Summaries: sum numeric columns for the entity
        const [
          policiesCount,
          sum_od,
          sum_tp,
          sum_package,
          sum_premium,
          sum_gst,
          sum_amount,
          sum_net_amount,
          sum_net_income
        ] = await Promise.all([
          db.insurance_details.count({ where: whereForEntity }),
          db.insurance_details.sum('od_premium', { where: whereForEntity }),
          db.insurance_details.sum('tp_premium', { where: whereForEntity }),
          db.insurance_details.sum('package_premium', { where: whereForEntity }),
          db.insurance_details.sum('premium', { where: whereForEntity }),
          db.insurance_details.sum('gst', { where: whereForEntity }),
          db.insurance_details.sum('amount', { where: whereForEntity }),
          db.insurance_details.sum('net_amount', { where: whereForEntity }),
          db.insurance_details.sum('net_income', { where: whereForEntity }),
        ]);

        summariesPerEntity.push({
          id: f.id,
          type: f.type,
          label: entitySeries.label,
          totals: {
            policies: Number(policiesCount || 0),
            od_premium: Number(sum_od || 0),
            tp_premium: Number(sum_tp || 0),
            package_premium: Number(sum_package || 0),
            premium: Number(sum_premium || 0),
            gst: Number(sum_gst || 0),
            amount: Number(sum_amount || 0),
            net_amount: Number(sum_net_amount || 0),
            net_income: Number(sum_net_income || 0),
          }
        });
      }
    }

    // --- Combined summary (if filters) or simple combined from earlier sums ---
    // If summariesPerEntity exists, combine them; else fallback to sums computed earlier.
    let combinedSummary = {};
    if (summariesPerEntity.length > 0) {
      combinedSummary = summariesPerEntity.reduce((acc, s) => {
        acc.policies = (acc.policies || 0) + (s.totals.policies || 0);
        acc.od_premium = (acc.od_premium || 0) + (s.totals.od_premium || 0);
        acc.tp_premium = (acc.tp_premium || 0) + (s.totals.tp_premium || 0);
        acc.package_premium = (acc.package_premium || 0) + (s.totals.package_premium || 0);
        acc.premium = (acc.premium || 0) + (s.totals.premium || 0);
        acc.gst = (acc.gst || 0) + (s.totals.gst || 0);
        acc.amount = (acc.amount || 0) + (s.totals.amount || 0);
        acc.net_amount = (acc.net_amount || 0) + (s.totals.net_amount || 0);
        acc.net_income = (acc.net_income || 0) + (s.totals.net_income || 0);
        return acc;
      }, {});
    } else {
      combinedSummary = {
        policies: Number(insuranceCount || 0),
        packagePremium: Number(packagePremium || 0),
        premium: Number(premium || 0),
        amount: Number(amount || 0),
        od_premium: Number(od_premium || 0),
        tp_premium: Number(tp_premium || 0),
        gst: Number(gst || 0),
        net_payout_percent: Number(net_payout_percent || 0),
        net_amount: Number(net_amount || 0),
        net_income: Number(net_income || 0),
        payout_percent: Number(payout_percent || 0)
      };
    }

    // --- detailed_data (if requested) ---
    let detailedData = null;
    if (detailed === 'true' || detailed === true) {
      // fetch the detailed records matching the combinedWhere (which already includes filters)
        // const detailedResults = await db.insurance_details.findAll({
        //   where: combinedWhere,
        //   include: [
        //     {
        //       model: db.insurance_common_details,
        //       as: 'insurance_common_detail',
        //       attributes: [
        //         'customer_id','user_id', 'segment', 'vehicle_number', 'insurance_type',
        //         'segment_vehicle_type', 'segment_vehicle_detail_type', 'model',
        //         'manufacturer', 'fuel_type', 'yom'
        //       ],
        //       include: [
        //         {
        //           model: db.customers,
        //           as: 'customer',
        //           attributes: ['full_name', 'email', 'primary_mobile', 'additional_mobile', 'dob', 'city']
        //         },
        //          {
        //           model: db.users,
        //           as: 'users',
        //           attributes: ['full_name', 'type']
        //         }
        //       ]
        //     }
        //   ],
        //   include: [
        //     {
        //       model: db.agents,
        //       as: 'agents',
        //       attributes: ['full_name']
        //     } 
        //   ],
        //   order: [['insurance_date', 'DESC']]
        // });
        const detailedResults = await db.insurance_details.findAll({
  where: combinedWhere,
  include: [
    {
      model: db.insurance_common_details,
      as: 'insurance_common_detail',
      attributes: [
        'customer_id', 'user_id', 'segment', 'vehicle_number', 'insurance_type',
        'segment_vehicle_type', 'segment_vehicle_detail_type', 'model',
        'manufacturer', 'fuel_type', 'yom'
      ],
      include: [
        {
          model: db.customers,
          as: 'customer',
          attributes: ['full_name', 'email', 'primary_mobile', 'additional_mobile', 'dob', 'city']
        },
        {
          model: db.users,
          as: 'user',   // ⚠️ FIX: your model alias is "user", not "users"
          attributes: ['full_name', 'type']
        }
      ]
    },
    {
      model: db.agents,
      as: 'agent',
      attributes: ['full_name']
    }
  ],
  order: [['insurance_date', 'DESC']]
});

        
        detailedData = detailedResults.map(result => {
          const record = result.toJSON();          
          const commonDetail = record.insurance_common_detail;
          const customer = commonDetail?.customer;
          const user = commonDetail?.user;
        const agents = record?.agent;

      
        
        
        

        // Calculate age from DOB
        let age = null;
        if (customer?.dob) {
          const dobDate = new Date(customer.dob);
          const diff = Date.now() - dobDate.getTime();
          const ageDate = new Date(diff);
          age = Math.abs(ageDate.getUTCFullYear() - 1970);
        }

        const LoggedUserID = req.headers['x-user-id'];
        let showOfficeEmployee = false;
        if(record.case_type === 'self' && record.user_id !=LoggedUserID){
            showOfficeEmployee = true;
        }

        let returnData = {
          "Business Type": record.business_type,
          "Case Type": showOfficeEmployee ? 'office' : record.case_type,
          "Office Employee":  user.full_name || '',
          "Agent Name": agents?.full_name || '',
          "Vehicle Number": commonDetail?.vehicle_number || '',
          "Customer Name": customer?.full_name || '',
          "DOB": customer?.dob || '',
          age: age,
          "Mobile": customer?.primary_mobile || '',
          "Additional Mobile": customer?.additional_mobile || '',
          "Email": customer?.email || '',
          "Address": customer?.city || '',
          "Manufacturer": commonDetail?.manufacturer || '',
          "Model": commonDetail?.model || '',
          "Fuel Type": commonDetail?.fuel_type || '',
          "YOM": commonDetail?.yom || '',
          "Current NCB": record.currentncb || '',
          "Insurance Company": record.insurance_company || '',
          "Policy No": record.policy_no || '',
          "OD Premium": Number(record.od_premium) || 0,
          "Package Premium": Number(record.package_premium) || 0,
          "Final Premium": Number(record.premium) || 0,
          "Policy Start Date": record.policy_start_date || '',
          "Policy Expiry Date": record.policy_expiry_date || '',
          "Agent Code": record.agent_code || '',
          "Payout Percent": Number(record.payout_percent) || 0,
          "Net Payout Percent": Number(record.net_payout_percent) || 0,
          "Net Amount": Number(record.net_amount) || 0,
          "Net Income": Number(record.net_income) || 0,
        };

        if (adminType !== 'Admin') {
          delete returnData['Final Premium'];
          delete returnData['Payout Percent'];
          delete returnData['Net Income'];
        }

        return returnData;
      });
    }

    // --- Response assembly ---
    const responseData = {
      success: true,
      data, // legacy combined monthly series
      per_entity_series, // per-entity monthly series (if filters provided)
      summaries: {
        per_entity: summariesPerEntity,
        combined: combinedSummary
      },
      counts: {
        users: Number(usersCount || 0),
        customers: Number(customersCount || 0),
        insurance: Number(insuranceCount || 0),
        newCustomers: Number(newCustomersCount || 0),
        agents: Number(agentsCount || 0)
      },
      insurance_data: {
        packagePremium: Number(packagePremium || 0),
        premium: Number(premium || 0),
        amount: Number(amount || 0),
        od_premium: Number(od_premium || 0),
        tp_premium: Number(tp_premium || 0),
        gst: Number(gst || 0),
        net_payout_percent: Number(net_payout_percent || 0),
        net_amount: Number(net_amount || 0),
        net_income: Number(net_income || 0),
        payout_percent: Number(payout_percent || 0)
      }
    };

    if (detailedData) {
      responseData.detailed_data = detailedData;
    }

    return res.status(200).json(responseData);
  } catch (error) {
    // console.error('Error in getInsuranceReports:', error);
    return res.status(500).json({ success: false, message: 'An internal server error occurred.' });
  }
};

/**
 * getInsuranceCategoryReports
 * - returns customer distribution per segment
 * - supports same date presets and entity filters
 */
exports.getInsuranceCategoryReports = async (req, res) => {
  try {
    const { user_id, entity_type = 'user', entity_id, entity_ids, preset, start_date, end_date } = req.query;
    if (!user_id) {
      return res.status(400).json({ success: false, message: 'User ID is required.' });
    }

    // parse filters (same semantics)
    let filters = [];
    if (entity_ids) {
      filters = entity_ids.split(',').map(s => {
        const [type, idStr] = (s || '').split('-');
        const id = Number(idStr);
        return (type && !isNaN(id)) ? { type, id } : null;
      }).filter(Boolean);
    } else if (entity_type === 'user' && entity_id) {
      filters = [{ type: 'user', id: Number(entity_id) }];
    } else if (entity_type === 'agent' && entity_id) {
      filters = [{ type: 'agent', id: Number(entity_id) }];
    }

    const { rangeStart, rangeEnd } = computeRange(preset, start_date, end_date);
    const noDateFilterCat = (preset === 'all');

    // base where clause
    let whereClause = { is_active: 1 };
    if (!noDateFilterCat && rangeStart && rangeEnd) {
      whereClause.policy_start_date = { [Op.gte]: rangeStart, [Op.lte]: rangeEnd };
    }

    // apply filters to where clause (like above)
    if (filters && filters.length > 0) {
      whereClause = buildWhereForFilters(filters, rangeStart, rangeEnd, noDateFilterCat);
    } else {
      if (entity_type === 'agent' && entity_id) {
        whereClause.agent_id = entity_id;
        whereClause.case_type = 'agent';
      } else if (entity_type === 'user') {
        if (entity_id) {
          whereClause.user_id = entity_id;
          whereClause[Op.or] = [{ case_type: 'office' }, { case_type: 'self' }];
        }
      }
    }

    const results = await db.insurance_details.findAll({
      attributes: [],
      where: whereClause,
      include: [
        {
          model: db.insurance_common_details,
          as: 'insurance_common_detail',
          attributes: ['segment'],
          where: { is_active: 1 }
        }
      ]
    });

    const segmentCounts = {};
    results.forEach(result => {
      const segment = result.insurance_common_detail?.segment || 'Unknown';
      segmentCounts[segment] = (segmentCounts[segment] || 0) + 1;
    });

    const customerData = {
      labels: Object.keys(segmentCounts),
      data: Object.values(segmentCounts)
    };

    return res.status(200).json({
      success: true,
      data: customerData
    });
  } catch (error) {
    // console.error('Error in getInsuranceCategoryReports:', error);
    return res.status(500).json({ success: false, message: 'An internal server error occurred.' + error });
  }
};
