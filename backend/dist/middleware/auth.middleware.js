"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkLogout = exports.checkLogin = void 0;
const checkLogin = (req, res, next) => {
    if (!req.session || !req.session.username) {
        res.status(401).json({
            message: "You are not allowed to access this!"
        });
        return;
    }
    next(); // Proceed to next middleware
};
exports.checkLogin = checkLogin;
const checkLogout = (req, res, next) => {
    if (req.session && req.session.username) {
        res.status(500).json({
            message: "You are already logged in!"
        });
        return;
    }
    next(); // Proceed to next middleware
};
exports.checkLogout = checkLogout;
