import RateLimit from 'express-rate-limit';

export var generalRateLimiter = RateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes',
});

export var loginRateLimiter = RateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 5, // Limit each IP to 5 login attempts per windowMs
    message: 'Too many login attempts from this IP, please try again after a minute',
});


