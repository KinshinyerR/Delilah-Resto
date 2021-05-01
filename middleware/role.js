const verifyRole = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    res.status(401).send("Rol no permitido");
  }

  next();
};

module.exports = verifyRole;
