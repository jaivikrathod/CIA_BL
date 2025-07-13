const db = require('../../models');
const ResponseHandler = require('../../utils/responseHandler'); 

exports.listUsers = async (req, res) => {
    try {
        const Users = await db.users.findAll({
            where: {
                id: { [db.Sequelize.Op.ne]: req.userID },
                is_active: 1
            }
        });
        return ResponseHandler.success(res, 200, 'Users retrieved successfully', Users);
    } catch (error) {
        console.error('Error in listUsers:', error);
        return ResponseHandler.error(res, 500, 'An internal server error occurred.', error);
    }
};

exports.getParticularUserDetails = async (req, res) => {
  try{
    const { user_id } = req.query;

    if (!user_id) {
      return ResponseHandler.validationError(res, 'User ID is required.');
    }

    const userDetails = await db.users.findOne({ where: { id: user_id } });

    if (!userDetails) {
      return ResponseHandler.notFound(res, 'User not found.');
    }

    return ResponseHandler.success(res, 200, 'User details retrieved successfully', userDetails);

  }catch(error){
    console.error('Error in getParticularUserDetails:', error);
    return ResponseHandler.error(res, 500, 'An internal server error occurred.', error);
  }
}

exports.updateParticularUserDetails = async (req, res) => { 
    try{
        const {id, full_name, email, mobile} = req.body;

        if (!id ||  !full_name || !email || !mobile) {
            return ResponseHandler.validationError(res, 'Full name, email and mobile are required.');
        }

        const [affectedRows] = await db.users.update(
            { full_name, email, mobile },
            { where: { id } }
        );

        if(affectedRows === 0) {
            return ResponseHandler.notFound(res, 'User not found.');
        }
        
        return ResponseHandler.updated(res, 'User details updated successfully.');
          
    }catch(error){
        console.error('Error in updateParticularUserDetails:', error);
        return ResponseHandler.error(res, 500, 'An internal server error occurred.', error);
    }
}