const createError = require('http-errors');

const isAdmin = async (req, res, next) => {
   try {
      const userRole = req.body.accessRole;
      if (userRole != 'Admin') {
         throw createError(403, "You are not allowed to access this data");
      }

      next();

   } catch (error) {
      next(error);
   }
}


module.exports = {
   isAdmin
}