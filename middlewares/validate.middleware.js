const User =require('../models/User')

const authorize =async(req, res, next) => {
    // console.log("hi")
    if (!req.user) {
      return res.status(403).json({ message: 'User is not authenticated' });
    }

    try {
        const user=await User.findByPk(req.user.id);

        if(user.role != "Admin"){
            return res.status(403).json({ message: 'Access denied. Insufficient permissions' });
        }
        req.user=user.dataValues;
        next()
    } catch (err) {
        return res.status(500).json({ message: 'Authorization failed' });
    }
  
  
    next(); 
  };
  
  module.exports =  authorize;