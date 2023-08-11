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
 * JavaScript module that exports a function which sets up routes for purchased_products, recived_price and users resources.
 * @param {Object} bot - Telegram bot instance used to send messages.
 * @param {function} time - Function which returns the current time.
 * @param {function} changeTime - Function which transforms time.
 * @param {Object} db - Database instance to run queries.
 * @returns {Object} Express router handling related routes.
 */
module.exports = function (bot, time, changeTime, db) {

    /**
 * JavaScript module that exports a function which sets up routes for purchased_products, recived_price and users resources.
 * @param {Object} bot - Telegram bot instance used to send messages.
 * @param {function} time - Function which returns the current time.
 * @param {function} changeTime - Function which transforms time.
 * @param {Object} db - Database instance to run queries.
 * @returns {Object} Express router handling related routes.
 */
    router.post("/purchased_products/:userName/:userfamily", (req, res) => {
        if (req.session && req.session.loggedIn || process.env.NODE_ENV === 'DEV') {

            const userName = req.params.userName;
            const userfamily = req.params.userfamily;
            const { user_id, product_name, price } = req.body;
            const sql =
                "INSERT INTO purchased_products (user_id, product_name, price, created_at) VALUES (?, ?, ?, ?)";

            const updateDateQuery = `UPDATE users SET created_at = ? WHERE id = ?`;
            db.run(updateDateQuery, [time(), user_id], function (err) {
                if (err) {
                    console.error(err.message);
                    return res.json({ error: StatusCodes.INTERNAL_SERVER_ERROR, message: "Failed to add received price" });
                }
                db.run(
                    sql,
                    [user_id, product_name, price, changeTime(time())],
                    function (err) {
                        if (err) {
                            console.error(err.message);
                            return res.json({ error: StatusCodes.INTERNAL_SERVER_ERROR, message: "Failed to add received price" });
                        }
                        res.json({ id: this.lastID });
                        bot.telegram.sendDocument(
                            process.env.BOT_ADMIN,
                            { source: "./db/customer.db" },
                            {
                                caption: `<b><u>افزودن کالا :</u></b>
  
  در : <code>${changeTime(time())}</code>
  نام مشتری : <b>${userName} ${userfamily}</b>
  نام محصول : <b>${product_name}</b>
  مبلغ : <b>${price}</b>
  .`,
                                parse_mode: "HTML",
                            }
                        );
                    }
                );
            });
        } else {
            // User is not logged in or session is not saved
            res.status(StatusCodes.UNAUTHORIZED).json({ error: "Unauthorized" });
        }
    });

    /**
 * POST endpoint for adding new received price and sending Telegram document with details.
 * @name recived_price/:userName/:userfamily
 * @param {string} :userName - User's name.
 * @param {string} :userfamily - User's family.
 * @param {Object} req.body - Body of the request containing fields like user_id, price.
 */
    router.post("/recived_price/:userName/:userfamily", (req, res) => {
        if (req.session && req.session.loggedIn || process.env.NODE_ENV === 'DEV') {
            const userName = req.params.userName;
            const userfamily = req.params.userfamily;
            const { user_id, price } = req.body;
            const sql =
                "INSERT INTO recived_price (user_id, price, created_at) VALUES (?, ?, ?)";

            const updateDateQuery = `UPDATE users SET created_at = ? WHERE id = ?`;
            db.run(updateDateQuery, [time(), user_id], function (err) {
                if (err) {
                    console.error(err.message);
                    return res.json({ error: StatusCodes.INTERNAL_SERVER_ERROR, message: "Failed to add received price" });
                }
                db.run(
                    sql,
                    [user_id, price, changeTime(time())],
                    function (err) {
                        if (err) {
                            console.error(err.message);
                            return res.json({ error: StatusCodes.INTERNAL_SERVER_ERROR, message: "Failed to add received price" });
                        }
                        res.json({ id: this.lastID });
                        bot.telegram.sendDocument(
                            process.env.BOT_ADMIN,
                            { source: "./db/customer.db" },
                            {
                                caption: `<b><u>وجه دریافتی :</u></b>
  
  در : <code>${changeTime(time())}</code>
  نام مشتری : <b>${userName} ${userfamily}</b>
  مبلغ : <b>${price}</b>
  .`,
                                parse_mode: "HTML",
                            }
                        );
                    }
                );
            });
        } else {
            // User is not logged in or session is not saved
            res.status(StatusCodes.UNAUTHORIZED).json({ error: "Unauthorized" });
        }
    });

    /**
 * POST endpoint for adding a new user.
 * @name adduser
 * @param {Object} req.body - Body of the request containing fields like name, family, phone.
 */
    router.post("/adduser", (req, res) => {
        if (req.session && req.session.loggedIn || process.env.NODE_ENV === 'DEV') {
            const { name, family, phone } = req.body;

            // Validate the request body
            if (!name || !family || !phone) {
                return res.json({ error: StatusCodes.NOT_FOUND, message: "Name, family, and phone are required" });
            }

            // Insert the user data into the database
            db.run(
                "INSERT INTO users (name, family, phone, created_at) VALUES (?, ?, ?, ?)",
                [name, family, phone, time()],
                function (err) {
                    if (err) {
                        console.error(err.message);
                        return res.json({ error: StatusCodes.INTERNAL_SERVER_ERROR, message: "Failed to add user" });
                    }

                    console.log(`User ${this.lastID} added to the database`);

                    // Send a response indicating success
                    res.send("User added successfully");
                    bot.telegram.sendDocument(
                        process.env.BOT_ADMIN,
                        { source: "./db/customer.db" },
                        {
                            caption: `<b><u>افزودن مشتری : </u></b>
        
در : <code>${changeTime(time())}</code>
نام مشتری : <b>${name} ${family}</b>
شماره تماس مشتری : <b>${phone}</b>
.`,
                            parse_mode: "HTML",
                        }
                    );
                }
            );
        } else {
            // User is not logged in or session is not saved
            res.status(StatusCodes.UNAUTHORIZED).json({ error: "Unauthorized" });
        }
    });

    return router
}