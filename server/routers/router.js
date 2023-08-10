"use strict"

/**
 * The Express module.
 * @external express
 * @see {@link https://expressjs.com/|Express}
 */

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
 * Creates an Express router object with several route handlers.
 *
 * @param {Object} db - The database connection object.
 * @returns {Object} The Express router object.
 */
module.exports = function (db) {
    /**
     * Route handler that returns all customers, ordered by creation date in descending order.
     *
     * @name GET /customers
     * @function
     * @memberof module.exports
     * @inner
     * @param {Object} req - The Express request object.
     * @param {Object} res - The Express response object.
     * @returns {Object} The JSON response containing an array of customer objects.
     */
    router.get("/customers", (req, res) => {
        if (req.session && req.session.loggedIn) {
            db.all("SELECT * FROM users ORDER BY created_at DESC", (err, rows) => {
                if (err) {
                    console.error(err);
                    res.json({ error: StatusCodes.INTERNAL_SERVER_ERROR });
                } else {
                    res.json(rows);
                }
            });
        } else {
            // User is not logged in or session is not saved
            res.status(StatusCodes.UNAUTHORIZED).json({ error: "Unauthorized" });
        }
    });

    /**
     * Route handler that returns the number of users in the database.
     *
     * @name GET /count
     * @function
     * @memberof module.exports
     * @inner
     * @param {Object} req - The Express request object.
     * @param {Object} res - The Express response object.
     * @returns {Object} The JSON response containing the count of users.
     */
    router.get("/count", (req, res) => {
        if (req.session && req.session.loggedIn) {
            // Query the database for the number of users
            db.get("SELECT COUNT(*) AS count FROM users", [], (err, row) => {
                if (err) {
                    console.error(err);
                    res.json({ error: StatusCodes.INTERNAL_SERVER_ERROR });
                } else {
                    res.json({ count: row.count });
                }
            });
        } else {
            // User is not logged in or session is not saved
            res.status(StatusCodes.UNAUTHORIZED).json({ error: "Unauthorized" });
        }
    });

    /**
     * Route handler that returns the sum of purchased products and received price for a user.
     *
     * @name GET /sum
     * @function
     * @memberof module.exports
     * @inner
     * @param {Object} req - The Express request object.
     * @param {Object} res - The Express response object.
     * @returns {Object} The JSON response containing the sum of purchased products and received price for a user.
     */
    try {
        router.get("/sum", (req, res) => {
            // Query the database for the total price of purchased products
            try {
                if (req.session && req.session.loggedIn) {
                    let buy = "SELECT SUM(price) AS total FROM purchased_products";
                    db.all(buy, (err, rowsBuy) => {
                        if (err) {
                            console.error("Error Sum inside Router " + err);
                            res.status(500).json({ error: "Server error" });
                        } else {
                            const totalBuy = rowsBuy[0].total || 0;
                            try {
                                // Query the database for the total price of received payments
                                let receive = "SELECT SUM(price) AS total FROM recived_price";
                                db.all(receive, (err, rowsReceive) => {
                                    if (err) {
                                        console.error("Error Sum inside Router " + err);
                                        res.json({ error: StatusCodes.INTERNAL_SERVER_ERROR });
                                    } else {
                                        const totalReceive = rowsReceive[0].total || 0;
                                        const sum = totalBuy - totalReceive;
                                        res.json({ sum_price: sum });
                                    }
                                });
                            } catch (error) {
                                console.log("Error Sum inside Router:" + error);
                            }
                        }
                    });
                } else {
                    // User is not logged in or session is not saved
                    res.status(StatusCodes.UNAUTHORIZED).json({ error: "Unauthorized" });
                }
            } catch (error) {
                console.log("Error Sum inside Router:" + error);
            }

        });
    } catch (error) {
        console.log("Error Sum Router:" + error);
    }


    /**
     * Route handler that returns the purchased products for a given user.
     *
     * @name GET /purchased_products/:userId
     * @function
     * @memberof module.exports
     * @inner
     * @param {Object} req - The Express request object.
     * @param {Object} res - The Express response object.
     * @returns {Object} The JSON response containing an array of purchased product objects.
     */
    router.get("/purchased_products/:userId", (req, res) => {
        if (req.session && req.session.loggedIn) {
            const userId = req.params.userId;
            const sql = "SELECT * FROM purchased_products WHERE user_id = ?";

            // Query the database for the purchased products for the given user
            db.all(sql, [userId], (err, rows) => {
                if (err) {
                    console.error(err);
                    res.json({ error: StatusCodes.INTERNAL_SERVER_ERROR });
                } else {
                    res.json(rows);
                    if (rows.length == 0) {
                        const sql = "DELETE FROM recived_price WHERE user_id = ?";
                        db.run(sql, [userId], (err) => {
                            if (err) {
                                console.error(err.message);
                                return res.json({ error: StatusCodes.INTERNAL_SERVER_ERROR, message: "Failed to add received price" });
                            }
                        });
                    }
                }
            });
        } else {
            // User is not logged in or session is not saved
            res.status(StatusCodes.UNAUTHORIZED).json({ error: "Unauthorized" });
        }
    });

    /**
     * Route handler that returns the received payments for a given user.
     *
     * @name GET /recived_price/:userId
     * @function
     * @memberof module.exports
     * @inner
     * @param {Object} req - The Express request object.
     * @param {Object}res - The Express response object.
     * @returns {Object} The JSON response containing an array of received payment objects.
     */
    router.get("/recived_price/:userId", (req, res) => {
        if (req.session && req.session.loggedIn) {
            const userId = req.params.userId;
            const sql = "SELECT * FROM recived_price WHERE user_id = ?";

            // Query the database for the received payments for the given user
            db.all(sql, [userId], (err, rows) => {
                if (err) {
                    console.error(err);
                    res.json({ error: StatusCodes.INTERNAL_SERVER_ERROR });
                } else {
                    res.json(rows);
                }
            });
        } else {
            // User is not logged in or session is not saved
            res.status(StatusCodes.UNAUTHORIZED).json({ error: "Unauthorized" });
        }
    });

    // Return the router object
    return router;
}