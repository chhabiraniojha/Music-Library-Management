const User = require('../models/User')
const jwt = require('jsonwebtoken');


const authenticate =async (req, res, next) => {
  const authHeader = req.headers.authorization; 
//   console.log(authHeader)

  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  const token = authHeader;
  console.log(token)
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
    // console.log(decoded)
    const user = await User.findByPk(decoded.id)
    console.log(user.dataValues)
    if(!user){
      return res.status(404).json({ message: "User not found." });
    }
    req.user = user.dataValues; 
    // console.log(req.user)
    next(); 
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports=authenticate;