import ratelimit from "../config/upstash.js";

const rateLimiter = async (req, res, next) => {
  if (!ratelimit) return next();

  try {
    const identifier =
      req.ip || req.headers["x-forwarded-for"] || "anonymous";
    const { success } = await ratelimit.limit(identifier);

    if (!success) {
      return res
        .status(429)
        .json({ message: "too many requests, please try again later" });
    }

    next();
  } catch (error) {
    console.error("Rate limit error:", error.message);
    next();
  }
};

export default rateLimiter;
