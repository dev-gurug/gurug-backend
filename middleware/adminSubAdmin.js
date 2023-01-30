module.exports = function (req, res, next) {
    if (req.user.isSubAdmin || req.user.isAdmin) return next();
    res.status(403).send("Access denied");
  };