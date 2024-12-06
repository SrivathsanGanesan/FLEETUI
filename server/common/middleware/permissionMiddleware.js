const { authRegisterModel } = require("../models/authRegisterSchema");

// Middleware to check permissions
const checkPermission = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.id; // Assuming req.user is populated with the authenticated user's info

      const user = await authRegisterModel.findById(userId);

      if (!user) {
        return res.status(403).json({ message: "User not found." });
      }

      // Check if the user has the required role or permission
      if (
        user.role !== "Administrator" && // Administrators bypass all permissions
        (!user.permissions[requiredPermission] || !user.permissions[requiredPermission].enabled)
      ) {
        return res
          .status(403)
          .json({ message: "Access denied. Insufficient permissions." });
      }

      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      console.error("Error in permission middleware:", error);
      res.status(500).json({ message: "Internal server error", error });
    }
  };
};

module.exports = { checkPermission };
