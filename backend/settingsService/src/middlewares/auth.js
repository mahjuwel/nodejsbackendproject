const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const { jwtAccessKey } = require('../secret');

const isLoggedIn = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];
            
            //decodes token id
            const decoded = jwt.verify(token, jwtAccessKey);
            req.body.creatorId = decoded.data.userId;
            req.body.accessRole = decoded.data.userRole;
            next();

        } catch (error) {
            res.status(401).json(`Not authorized! Why? Ans:${error}`);
        }
    }
    if (!token) {
        res.status(401).json("Not authorized, no token!");

    }

}


const isLoggedOut = async (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken;
        if (accessToken) {
            throw createError(401, "User is already logged in.");
        }
        next();
    } catch (error) {
        return next(error);
    }

}

module.exports = { isLoggedIn, isLoggedOut }