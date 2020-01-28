const restricted = (req, res, next) => {
  if (req.session.loggedInUser) {
    next();
  } else {
    res.status(401).json({
      message: `Your cookie is either not there, or it contains no valid session id in sess`
    });
  }
};

const globalRestriction = (req, res, next) => {
  const path = req.path.split("/");
  if (path[1] === "restricted") {
    if (req.session.loggedInUser) {
      next();
    } else {
      res.status(401).json({
        message: `You are not logged in`
      });
    }
  } else {
    next();
  }
};

module.exports = {
  restricted,
  globalRestriction
};
