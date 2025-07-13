const ResponseHandler = require('../../utils/responseHandler');
const { Op } = require('sequelize');
const db = require('../../models');

exports.handleAddEditAgent = async (req, res) => {
    try {
        const { id, full_name, email, primary_mobile } = req.body;

        if (!full_name || !email || !primary_mobile) {
            return ResponseHandler.validationError(res, 'Full name, email and primary mobile required.');
        }

        // Check if the email or primary mobile already exists in the database
        const check = await db.agents.findOne({
            where: {
                [Op.or]: [
                    { email },
                    { primary_mobile }
                ],
                id: { [Op.ne]: id || 0 }
            }
        });

        if (check) {
            return ResponseHandler.conflict(res, 'Email or primary mobile already exists.');
        }

        let agent;
        if (!id) {
            agent = await db.agents.create({
                full_name,
                email,
                primary_mobile,
                user_id: req.userID,
                is_active: 1
            });
            if (!agent) {
                return ResponseHandler.error(res, 500, 'Failed to add agent.');
            }
            return ResponseHandler.created(res, 'New agent created successfully.');
        } else {
            const [updatedRows] = await db.agents.update({
                full_name,
                email,
                primary_mobile,
                user_id: req.userID
            }, {
                where: { id }
            });
            if (updatedRows === 0) {
                return ResponseHandler.error(res, 500, 'Failed to update agent.');
            }
            return ResponseHandler.updated(res, 'Agent updated successfully.');
        }
    } catch (error) {
        return ResponseHandler.error(res, 500, 'An internal server error occurred.'+ error);
    }
};

exports.listAgents = async (req, res) => {
    try {
        let agents;
        if (req.admintype === 'Admin') {
            agents = await db.agents.findAll({ where: { is_active: 1 } });
        } else {
            agents = await db.agents.findAll({ where: { user_id: req.userID, is_active: 1 } });
        }
        if (!agents || agents.length === 0) {
            return res.status(404).json({ success: false, message: 'No agents found.' });
        }
        return res.status(200).json({ success: true, data: agents });
    } catch (error) {
        return ResponseHandler.error(res, 500, 'An internal server error occurred.', error);
    }
};

exports.handleDeleteAgent = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ success: false, message: 'Agent ID is required.' });
        }
        const [updatedRows] = await db.agents.update({ is_active: 0 }, { where: { id } });
        if (updatedRows === 0) {
            return res.status(404).json({ success: false, message: 'Agent not found.' });
        }
        return res.status(200).json({ success: true, message: 'Agent deactivated successfully.' });
    } catch (error) {
        return ResponseHandler.error(res, 500, 'An internal server error occurred.', error);
    }
};

exports.agentscount = async (req, res) => {
    try {
        let count;
        if (req.userType === 'Admin') {
            count = await db.agents.count({ where: { is_active: 1 } });
        } else {
            count = await db.agents.count({ where: { user_id: req.userID, is_active: 1 } });
        }
        return res.status(200).json({ success: true, data: count });
    } catch (error) {
        return ResponseHandler.error(res, 500, 'An internal server error occurred.', error);
    }
};

