import jwt from 'jsonwebtoken';

// ✅ Protect route for any authenticated user
export const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // support "Bearer <token>" format
  if (!token) return res.status(401).json({ message: 'No token, access denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // contains id and role
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// ✅ Restrict access to specific role(s)
export const allowRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};
