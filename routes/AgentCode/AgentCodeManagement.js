const ResponseHandler = require('../../utils/responseHandler');
const { Op } = require('sequelize');
const db = require('../../models');

exports.handleAddEditAgent = async (req, res) => {
    try {
        const { id, agent_name,agent_code } = req.body;

        if (!agent_name || !agent_code) {
            return ResponseHandler.validationError(res, 'Agent name and Agent code required.');
        }

        const check = await db.agentscode.findOne({
            where: {
                [Op.or]: [
                    { agent_code },
                ],
                id: { [Op.ne]: id || 0 }
            }
        });

        if (check) {
            return ResponseHandler.conflict(res, 'Agent code aldready Exists.');
        }

        let agent;
        if (!id) {
            agent = await db.agentscode.create({
                agent_name,
                agent_code,
                is_active: 1
            });
            if (!agent) {
                return ResponseHandler.error(res, 500, 'Failed to add agent.');
            }
            return ResponseHandler.created(res, 'New agent created successfully.');
        } else {
            const [updatedRows] = await db.agentscode.update({
                agent_name,
                agent_code,
            }, {
                where: { id }
            });
            if (updatedRows === 0) {
                return ResponseHandler.error(res, 500, 'Failed to update agentcode.');
            }
            return ResponseHandler.updated(res, 'Agentcode updated successfully.');
        }
    } catch (error) {
        return ResponseHandler.error(res, 500, 'An internal server error occurred:= '+ error);
    }
};

exports.listAgents = async (req, res) => {
    try {
        let agents;
        agents = await db.agentscode.findAll({
            where: { is_active: 1 },
            order: [['agent_name', 'ASC']]
        });
        if (!agents || agents.length === 0) {
            return res.status(404).json({ success: false, message: 'No agentscode found.' });
        }
        return res.status(200).json({ success: true, data: agents });
    } catch (error) {
        return ResponseHandler.error(res, 500, 'An internal server error occurred.', error);
    }
};

exports.handleDeleteAgentCode = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ success: false, message: 'AgentCode ID is required.' });
        }
        const [updatedRows] = await db.agentscode.update({ is_active: 0 }, { where: { id } });
        if (updatedRows === 0) {
            return res.status(404).json({ success: false, message: 'AgentCode not found.' });
        }
        return res.status(200).json({ success: true, message: 'AgentCode deactivated successfully.' });
    } catch (error) {
        return ResponseHandler.error(res, 500, 'An internal server error occurred.', error);
    }
};



