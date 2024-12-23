const rateLimiter = require("express-rate-limit");
const loginLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 login attempts per IP
  message: {
    status: 429,
    message: "Too many login attempts. Please try again later.",
  },
});

const resetPasswordLimiter = rateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 5 attempts per IP
  message: {
    status: 429,
    message: "Too many password reset attempts. Please try again in an hour.",
  },
});
const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per IP
  message: {
    status: 429,
    message: "Too many requests. Please try again later.",
  },
});

const searchLimiter = rateLimiter({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 50, // 50 search requests per IP
  message: {
    status: 429,
    message: "Too many search requests. Please slow down.",
  },
});
const uploadLimiter = rateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 uploads per IP
  message: {
    status: 429,
    message: "Too many upload attempts. Please try again later.",
  },
});
const feedbackLimiter = rateLimiter({
  windowMs: 30 * 60 * 1000, // 30 minutes
  max: 5, // 5 requests per IP
  message: {
    status: 429,
    message: "Too many submissions. Please try again later.",
  },
});

module.exports = {
  uploadLimiter,
  feedbackLimiter,
  loginLimiter,
  resetPasswordLimiter,
  searchLimiter,
  apiLimiter,
};
