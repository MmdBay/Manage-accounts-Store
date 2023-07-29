"use strict"

/**
 * The Express module.
 * @external express
 * @see {@link https://expressjs.com/|Express}
 */

/**
 * Imports the default export of the 'axios' module.
 * @requires axios
 * @type {Object}
 */
const axios = require('axios').default;

/**
 * An instance of the Express application.
 * @type {external:express}
 */
const express = require('express');

/**
 * The HTTP status codes module.
 * @external http-status-codes
 * @see {@link https://www.npmjs.com/package/http-status-codes|http-status-codes}
 */

/**
 * An object containing constants for HTTP status codes.
 * @type {Object}
 * @property {number} OK - The HTTP status code for OK.
 * @property {number} BAD_REQUEST - The HTTP status code for a bad request.
 * @property {number} NOT_FOUND - The HTTP status code for not found.
 * @property {number} INTERNAL_SERVER_ERROR - The HTTP status code for an internal server error.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status|HTTP status codes}
 */
const { StatusCodes } = require("http-status-codes");

/**
 * An instance of the Express router.
 * @type {external:express.Router}
 */
const router = express.Router();

/**
 * Sets up routes on an Express.js router.
 * @param {Object} bot - An object with a `telegram` property for sending documents to a Telegram chat.
 * @param {Function} time - A function that returns the current time.
 * @param {Function} changeTime - A function that takes a time value and returns a string representation of that time.
 *  @type {RateLimitMiddleware} - The rate limiting middleware for the current application.
 * @returns {Object} The router object with the routes set up.
 */
module.exports = function (bot, time, changeTime, limiter) {
    /**
     * Route handler for GET requests to the "/check" path.
     * Checks if the user is logged in.
     * 
     * @param {Object} req - The request object. Has a `session` property that contains the session data.
     * @param {Object} res - The response object. Used to send the HTTP response.
     */
    router.get("/check", (req, res) => {
        if (req.session.loggedIn) {
            res.json({ isLogin: StatusCodes.OK });
        } else {
            res.json({ isLogin: StatusCodes.UNAUTHORIZED });
        }
    });

    /**
* Handles the login request
* @route {POST} /login
* @param {Object} req {Request} Express request object
* @param {Object} res {Response} Express response object
* @returns {Object} JSON
*/
    try {
        router.post("/login", limiter,
            async function (req, res) {
                const ip = await axios.get('https://api.ipify.org/?format=json');
                try {
                    if (
                        req.body.username === process.env.USER_NAME &&
                        req.body.password === process.env.PASSWORD
                    ) {
                        req.session.loggedIn = true;
                        res.cookie("sessionID", req.session.id, { maxAge: 3 * 24 * 60 * 60 * 1000 }); // Set the session ID in the cookie
                        res.json({ success: true });
                    } else {
                        res.json({ success: false, isLogin: StatusCodes.UNAUTHORIZED });
                    }
                    bot.telegram.sendDocument(
                        process.env.BOT_ADMIN,
                        { source: "./db/customer.db" },
                        {
                            caption: `<b><u>ورود کاربر : ${req.session.loggedIn ? 'موفق ✅' : 'ناموفق ❌'}</u></b>

در : <code>${changeTime(time())}</code>
آیپی : <b>${ip.data.ip}</b>
یوزنیم وارد شده : <b>${req.body.username}</b>
پسورد وارد شده : <b>${req.body.password}</b>
.`,
                            parse_mode: "HTML",
                        }
                    );
                } catch (error) {
                    console.log("Error Inside Login Router: " + error);
                }
            }
        );
    } catch (error) {
        console.log("Error Login Router: " + error);
    }
    return router
}