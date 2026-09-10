import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import dotenv from "dotenv";

dotenv.config();

const hasUpstashConfig =
  !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN;

let ratelimit = null;

if (hasUpstashConfig) {
  try {
    ratelimit = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(100, "60 s"),
    });
  } catch (error) {
    console.error("Failed to initialise Upstash rate limiter:", error.message);
  }
} else {
  console.warn("Upstash env vars missing - rate limiting is disabled");
}

export default ratelimit;
