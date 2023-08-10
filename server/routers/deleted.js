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
 * Returns a function that exports a router with three delete routes to delete purchased products, received payments, and users from the database and send a message to a Telegram bot.
 *
 * @param {Object} bot - The Telegram bot object.
 * @param {function} time - A function that returns the current time.
 * @param {function} changeTime - A function that formats a timestamp.
 * @param {Object} db - The SQLite3 database object.
 */
module.exports = function (bot, time, changeTime, db) {

    /**
 * Deletes a purchased product from the database and sends a message to a Telegram bot.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
    router.delete(
        "/purchased_products/:productId/:userId/:nameProduct",
        (req, res) => {
            if (req.session && req.session.loggedIn) {

                const productId = req.params.productId;
                const nameProduct = req.params.nameProduct;
                const userId = req.params.userId;
                const sql = "DELETE FROM purchased_products WHERE id = ?";
                const infoUser = `SELECT * FROM users WHERE id = ?`;
                const updateDateQuery = `UPDATE users SET created_at = ? WHERE id = ?`;

                db.run(updateDateQuery, [time(), userId]);
                db.run(sql, [productId], (err) => {
                    if (err) {
                        console.error(err.message);
                        return res.json({ error: StatusCodes.INTERNAL_SERVER_ERROR, message: "Failed to add received price" });
                    }
                    res.json({ success: true });
                    db.get(infoUser, [userId], (err, row) => {
                        if (err) {
                            console.error(err.message);
                            return res.json({ error: StatusCodes.INTERNAL_SERVER_ERROR, message: "Failed to add received price" });
                        }
                        bot.telegram.sendDocument(
                            process.env.BOT_ADMIN,
                            { source: "./db/customer.db" },
                            {
                                caption: `<b><u>حذف کالا :</u></b>
  
  در : <code>${changeTime(time())}</code>
  نام مشتری : <b>${row.name} ${row.family}</b>
  نام محصول : <b>${nameProduct}</b>
  .`,
                                parse_mode: "HTML",
                            }
                        );
                    });
                });
            } else {
                // User is not logged in or session is not saved
                res.status(StatusCodes.UNAUTHORIZED).json({ error: "Unauthorized" });
            }
        }
    );

    /**
 * Deletes a purchased product from the database and sends a message to a Telegram bot.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
    router.delete(
        "/recived_price/:productId/:userId/:nameProduct",
        (req, res) => {
            if (req.session && req.session.loggedIn) {

                const productId = req.params.productId;
                const nameProduct = req.params.nameProduct;
                const userId = req.params.userId;
                const sql = "DELETE FROM recived_price WHERE id = ?";
                const infoUser = `SELECT * FROM users WHERE id = ?`;
                const updateDateQuery = `UPDATE users SET created_at = ? WHERE id = ?`;

                db.run(updateDateQuery, [time(), userId]);
                db.run(sql, [productId], (err) => {
                    if (err) {
                        console.error(err.message);
                        return res.json({ error: StatusCodes.INTERNAL_SERVER_ERROR, message: "Failed to add received price" });
                    }
                    res.json({ success: true });
                    db.get(infoUser, [userId], (err, row) => {
                        if (err) {
                            console.error(err.message);
                            return res.json({ error: StatusCodes.INTERNAL_SERVER_ERROR, message: "Failed to add received price" });
                        }
                        bot.telegram.sendDocument(
                            process.env.BOT_ADMIN,
                            { source: "./db/customer.db" },
                            {
                                caption: `<b><u>حذف کالا :</u></b>
  
  در : <code>${changeTime(time())}</code>
  نام مشتری : <b>${row.name} ${row.family}</b>
  نام محصول : <b>${nameProduct}</b>
  .`,
                                parse_mode: "HTML",
                            }
                        );
                    });
                });
            } else {
                // User is not logged in or session is not saved
                res.status(StatusCodes.UNAUTHORIZED).json({ error: "Unauthorized" });
            }
        }
    );

    /**
 * Deletes a purchased product from the database and sends a message to a Telegram bot.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
    router.delete("/users/:id/:name/:family", (req, res) => {
        if (req.session && req.session.loggedIn) {

            const Id = req.params.id;
            const name = req.params.name;
            const family = req.params.family;
            const sql = "DELETE FROM users WHERE id = ?";
            const sql1 = "DELETE FROM purchased_products WHERE user_id = ?";
            const sql2 = "DELETE FROM recived_price WHERE user_id = ?";

            db.run(sql, [Id], (err) => {
                if (err) {
                    console.error(err.message);
                    return res.json({ error: StatusCodes.INTERNAL_SERVER_ERROR, message: "Failed to add received price" });
                }
                res.json({ success: true });
                bot.telegram.sendDocument(
                    process.env.BOT_ADMIN,
                    { source: "./db/customer.db" },
                    {
                        caption: `<b><u>حذف مشتری :</u></b>
  
  در : <code>${changeTime(time())}</code>
  نام مشتری : <b>${name} ${family}</b>
  .`,
                        parse_mode: "HTML",
                    }
                );
            });
            db.run(sql1, [Id]);
            db.run(sql2, [Id]);
        } else {
            // User is not logged in or session is not saved
            res.status(StatusCodes.UNAUTHORIZED).json({ error: "Unauthorized" });
        }
    });

    return router
}