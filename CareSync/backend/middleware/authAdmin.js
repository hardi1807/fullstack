import jwt from "jsonwebtoken";

const authAdmin = (req, res, next) => {
  try {
    console.log("HEADERS:", req.headers);

    let token;

    // ✅ Support BOTH formats
    if (req.headers.authorization) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.headers.token) {
      token = req.headers.token;
    }

    if (!token) {
      return res.json({
        success: false,
        message: "Not Authorized, Login Again",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("DECODED TOKEN:", decoded);

    if (decoded.role !== "admin") {
      return res.json({
        success: false,
        message: "Access Denied",
      });
    }

    req.user = decoded;

    next();

  } catch (error) {
    console.log("AUTH ERROR:", error.message);

    return res.json({
      success: false,
      message: "Token Failed",
    });
  }
};

export default authAdmin;