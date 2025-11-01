const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_change_in_production';

module.exports = function (req, res, next) {
  const auth = req.headers['authorization'];
  
  if (!auth) {
    console.error('❌ No authorization header');
    return res.status(401).json({ error: 'Missing token' });
  }
  
  const token = auth.split(' ')[1];
  
  if (!token) {
    console.error('❌ Token not found in header');
    return res.status(401).json({ error: 'Invalid token format' });
  }
  
  jwt.verify(token, SECRET, (err, user) => {
    if (err) {
      console.error('❌ Token verification failed:', err.message);
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    
    console.log('✅ Token verified for user:', user.email);
    req.user = user;
    next();
  });
};

