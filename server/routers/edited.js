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
 * JavaScript module that exports a function which sets up routes for purchased_products and recived_price resources.
 * @param {Object} bot - Telegram bot instance used to send messages.
 * @param {function} time - Function which returns the current time.
 * @param {function} changeTime - Function which transforms time.
 * @param {Object} db - Database instance to run queries.
 * @returns {Object} Express router handling related routes.
 */
module.exports = function (bot, time, changeTime, db) {

    /**
 * PUT endpoint for updating purchased products and sending a Telegram document with updated details.
 * @name purchased_products/:id/:userId
 * @param {string} :id - purchased product id.
 * @param {string} :userId - user's id.
 * @param {Object} req.body - Body of the request which contains the updated data for purchased product.
 */
    router.put("/purchased_products/:id/:userId", (req, res) => {
        if (req.session && req.session.loggedIn || process.env.NODE_ENV === 'DEV') {

            const purchasedProductId = req.params.id;
            const userId = req.params.userId;
            const updatedPurchasedProductData = req.body;
            const infoUser = `SELECT * FROM users WHERE id = ?`;
            const query = `UPDATE purchased_products SET product_name = ?, price = ? WHERE id = ?`;
            const updateDateQuery = `UPDATE users SET created_at = ? WHERE id = (
          SELECT user_id FROM purchased_products WHERE id = ?
        )`;
            const userIdQuery = `SELECT user_id FROM purchased_products WHERE id = ?`;

            db.get(userIdQuery, [purchasedProductId], () =>
                db.run(updateDateQuery, [time(), purchasedProductId])
            );

            db.run(
                query,
                [
                    updatedPurchasedProductData.product_name,
                    updatedPurchasedProductData.price,
                    purchasedProductId,
                ],
                function (error) {
                    if (error) {
                        console.error("Error updating purchased product:", error);
                        return res.json({ error: StatusCodes.INTERNAL_SERVER_ERROR, message: "Error updating purchased product" });
                    } else {
                        res.json({ id: purchasedProductId, ...updatedPurchasedProductData });
                        db.get(infoUser, [userId], (err, row) => {
                            if (err) {
                                console.error("Error updating purchased product_2:", error);
                                return res.json({ error: StatusCodes.INTERNAL_SERVER_ERROR, message: "Error updating purchased product" });
                            }
                            bot.telegram.sendDocument(
                                process.env.BOT_ADMIN,
                                { source: "./db/customer.db" },
                                {
                                    caption: `<b><u>آپدیت محصول مشتری :</u></b>
      
    در : <code>${changeTime(time())}</code>
    نام مشتری : <b>${row.name} ${row.family}</b>
    نام محصول : <b>${updatedPurchasedProductData.product_name}</b>
    قیمت محصول : <b>${updatedPurchasedProductData.price}</b>
    .`,
                                    parse_mode: "HTML",
                                }
                            );
                        });
                    }
                }
            );
        } else {
            // User is not logged in or session is not saved
            res.status(StatusCodes.UNAUTHORIZED).json({ error: "Unauthorized" });
        }
    });

    /**
 * PUT endpoint for updating received price and sending a Telegram document with updated details.
 * @name recived_price/:id/:userId
 * @param {string} :id - received price id.
 * @param {string} :userId - user's id.
 * @param {Object} req.body - Body of the request which contains the updated data for received price.
 */
    router.put("/recived_price/:id/:userId", (req, res) => {
        if (req.session && req.session.loggedIn || process.env.NODE_ENV === 'DEV') {

            const recivedPriceId = req.params.id;
            const userId = req.params.userId;
            const updatedRecivedPrice = req.body;
            const infoUser = `SELECT * FROM users WHERE id = ?`;
            const query = `UPDATE recived_price SET price = ? WHERE id = ?`;
            const updateDateQuery = `UPDATE users SET created_at = ? WHERE id = (
          SELECT user_id FROM recived_price WHERE id = ?
        )`;
            const userIdQuery = `SELECT user_id FROM recived_price WHERE id = ?`;

            db.get(userIdQuery, [recivedPriceId], () =>
                db.run(updateDateQuery, [time(), recivedPriceId])
            );

            db.run(
                query,
                [
                    updatedRecivedPrice.price,
                    recivedPriceId,
                ],
                function (error) {
                    if (error) {
                        console.error("Error updating purchased product:", error);
                        return res.json({ error: StatusCodes.INTERNAL_SERVER_ERROR, message: "Error updating purchased product" });
                    } else {
                        res.json({ id: recivedPriceId, ...updatedRecivedPrice });
                        db.get(infoUser, [userId], (err, row) => {
                            if (err) {
                                console.log(err.message);
                                return res.json({ error: StatusCodes.INTERNAL_SERVER_ERROR, message: "Error updating purchased product" });
                            }
                            bot.telegram.sendDocument(
                                process.env.BOT_ADMIN,
                                { source: "./db/customer.db" },
                                {
                                    caption: `<b><u>آپدیت مبلغ دریافتی :</u></b>
      
    در : <code>${changeTime(time())}</code>
    نام مشتری : <b>${row.name} ${row.family}</b>
    مبلغ دریافتی : <b>${updatedRecivedPrice.price}</b>
    .`,
                                    parse_mode: "HTML",
                                }
                            );
                        });
                    }
                }
            );
        } else {
            // User is not logged in or session is not saved
            res.status(StatusCodes.UNAUTHORIZED).json({ error: "Unauthorized" });
        }
    });

    return router;
}