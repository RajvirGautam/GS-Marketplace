import { createClerkClient } from "@clerk/backend";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

export const requireAuth = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: "No token provided. Please login.",
      });
    }

    const token = authHeader.split(" ")[1];

    // Verify token with Clerk
    try {
      const decoded = await clerkClient.verifyToken(token);
      
      // Attach user info to request
      req.clerkUserId = decoded.sub; // Clerk user ID
      
      // Get full user info from Clerk
      const user = await clerkClient.users.getUser(decoded.sub);
      req.userEmail = user.emailAddresses[0]?.emailAddress;
      
      next();
    } catch (verifyError) {
      return res.status(401).json({
        success: false,
        error: "Invalid or expired token",
      });
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({
      success: false,
      error: "Authentication failed",
    });
  }
};

// Optional: middleware to check SGSITS email
export const requireSGSITSEmail = (req, res, next) => {
  if (!req.userEmail || !req.userEmail.endsWith("@sgsits.ac.in")) {
    return res.status(403).json({
      success: false,
      error: "Access denied. SGSITS email required.",
    });
  }
  next();
};
