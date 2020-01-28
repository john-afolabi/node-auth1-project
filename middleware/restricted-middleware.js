module.exports = (req, res, next) => {
  if (req.session.loggedInUser) {
    next();
  } else {
    res.status(401).json({
      message: `Your cookie is either not there, or it contains no valid session id in sess`
    });
  }
};
