"use strict"

/**
 * Loads and configures various modules and dependencies required by the application
 * @requires dotenv
 * @requires Telegraf
 * @requires express
 * @requires cors
 * @requires path
 * @requires body-parser
 * @requires https
 * @requires helmet
 * @requires fs
 * @requires ./functions/Time
 * @requires ./db/conection
 * @requires express-session
 */
require("dotenv").config();
const { Telegraf } = require("telegraf");
const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const https = require('https');
const helmet = require('helmet');
const fs = require('fs');
const { changeTime, time } = require("./functions/Time");
const db = require("./db/conection");
const session = require("express-session");


/**
 * Creates an instance of the 'express' application, sets the port to listen on, and creates a new instance of the 'Telegraf' bot.
 * @type {Object}
 */
const app = express();
const PORT = process.env.PORT || 2086;
const bot = new Telegraf(process.env.BOT_TOKEN);

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
 * Middleware for rate-limiting incoming HTTP requests.
 * @typedef {function} RateLimitMiddleware
 * @param {Request} req - The HTTP request object.
 * @param {Response} res - The HTTP response object.
 * @param {function} next - The next middleware function in the stack.
 */

/**
 * The `express-rate-limit` module.
 * @typedef {Object} ExpressRateLimit
 * @property {function} RateLimit - A constructor for creating a rate limiting middleware function.
 */

/**
 * The `rateLimit` middleware function returned by `express-rate-limit`.
 * @type {RateLimitMiddleware}
 */
const rateLimit = require('express-rate-limit');

/**
 * Configuration options for the `express-rate-limit` middleware.
 * @typedef {Object} RateLimitOptions
 * @property {number} windowMs - The length of the time window for rate limiting, in milliseconds.
 * @property {number} max - The maximum number of requests allowed per IP address within the time window.
 * @property {boolean} [standardHeaders=true] - Whether to include rate limit info in the `RateLimit-*` headers.
 * @property {boolean} [legacyHeaders=false] - Whether to include rate limit info in the `X-RateLimit-*` headers (deprecated).
 */

/**
 * The `limiter` middleware function returned by `express-rate-limit`.
 * @typedef {function} RateLimitMiddleware
 * @param {Request} req - The HTTP request object.
 * @param {Response} res - The HTTP response object.
 * @param {function} next - The next middleware function in the stack.
 */

/**
 * The rate limiting middleware for the current application.
 * @type {RateLimitMiddleware}
 */
const limiter = rateLimit({
  /**
   * Configuration options for the rate limiter.
   * @type {RateLimitOptions}
   */
  windowMs: 15 * 60 * 1000, // 15 minutes
  message: 'Too many requests, please try again later.',
  max: 10, // Limit each IP address to 50 requests per `windowMs` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    // Send an error message to the user indicating that they have exceeded the rate limit
    res.status(StatusCodes.TOO_MANY_REQUESTS).json({ip: req.ip, message: 'Too many requests, please try again later.' });
  },
});

/**
 * Sets up a CORS (Cross-Origin Resource Sharing) middleware for the Express.js application instance.
 * @returns {void}
 */
app.use(cors());

/**
 * Middleware that adds security-related HTTP headers to the response.
 * @function
 * @name helmet
 * @returns {function} Returns a middleware function that can be used with Express.js.
*/
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      // Allow requests to http://api-bdc.net
      'connect-src': ["'self'", "https://api.ipify.org/?format=json"]
    }
  }
}));

/**
 * Sets up a middleware for parsing JSON data in the request body of the Express.js application instance.
 * @returns {void}
 */
app.use(bodyParser.json());

/**
 * Sets up a middleware for serving static files from a directory in the Express.js application instance.
 * @param {string} __dirname - The directory name of the current module.
 * @param {string} "build" - The name of the directory containing the static files.
 * @returns {void}
 */
app.use(express.static(path.join(__dirname, "build")));

/**
 * Sets up a session middleware for the Express.js application instance.
 * @param {Object} options - The session middleware options.
 * @param {string} options.secret - The secret used to sign the session ID cookie.
 * @param {boolean} options.resave - Whether to save the session on every request, even if it hasn't changed.
 * @param {boolean} options.saveUninitialized - Whether to save uninitialized sessions.
 * @param {Object} options.cookie - The session cookie options.
 * @param {number} options.cookie.maxAge - The maximum age of the session cookie in milliseconds.
 * @returns {void}
 */
app.use(
  session({
      secret: "mohammadhasanbeygi1376",
      resave: false,
      saveUninitialized: true,
      cookie: { maxAge: 3 * 24 * 60 * 60 * 1000 },
  })
);

/**
 * Defines a route handler for the root URL path.
 * @function get
 * @memberof app
 * @param {string} path - The URL path to handle.
 * @param {function} callback - The function to handle the request.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 */
app.get("/", (req, res) => {
  const filePath = path.join(__dirname, "build", "index.html");
  res.sendFile(filePath);
});

/**
 * Imports a router module and mounts it as middleware on the 'app' instance.
 * @requires ./routers/router
 * @param {Object} db - The database connection object.
 * @returns {Object} - The router middleware object.
 */
const Routers = require("./routers/router")(db);
app.use('/v1', Routers);

/**
 * Imports an authentication router module and mounts it as middleware on the 'app' instance.
 * @requires ./routers/auth
 * @param {Object} bot - The Telegram bot instance.
 * @param {function} time - A function for getting the current time.
 * @param {function} changeTime - A function for changing the current time.
 * @type {RateLimitMiddleware} - The rate limiting middleware for the current application.
 * @returns {Object} - The authentication router middleware object.
 */
const authRouter = require("./routers/auth")(bot, time, changeTime, limiter);
app.use('/api/auth', authRouter);

/**
 * Imports an "add" router module and mounts it as middleware on the 'app' instance.
 * @requires ./routers/added
 * @param {Object} bot - The Telegram bot instance.
 * @param {function} time - A function for getting the current time.
 * @param {function} changeTime - A function for changing the current time.
 * @param {Object} db - The database connection object.
 * @returns {Object} - The "add" router middleware object.
 */
const addRouter = require("./routers/added")(bot, time, changeTime, db);
app.use('/api/insert', addRouter);

/**
 * Imports a "delete" router module and mounts it as middleware on the 'app' instance.
 * @requires ./routers/deleted
 * @param {Object} bot - The Telegram bot instance.
 * @param {function} time - A function for getting the current time.
 * @param {function} changeTime - A function for changing the current time.
 * @param {Object} db - The database connection object.
 * @returns {Object} - The "delete" router middleware object.
 */
const deleteRouter = require("./routers/deleted")(bot, time, changeTime, db);
app.use('/api/del', deleteRouter);

/**
 * Imports an "edit" router module and mounts it as middleware on the 'app' instance.
 * @requires ./routers/edited
 * @param {Object} bot - The Telegram bot instance.
 * @param {function} time - A function for getting the current time.
 * @param {function} changeTime - A function for changing the current time.
 * @param {Object} db - The database connection object.
 * @returns {Object} - The "edit" router middleware object.
 */
const editRouter = require("./routers/edited")(bot, time, changeTime, db);
app.use('/api/edit', editRouter);


/**
 * Starts the Node.js server and listens for incoming requests on the specified port.
 * @param {number} PORT - The port number to listen on.
 * @returns {void}
 */

    /**
     * Default route handler for 404 errors.
     *
     * @name GET /*
     * @function
     * @inner
     * @param {Object} req - The Express request object.
     * @param {Object} res - The Express response object.
     * @returns {Object} The response containing a 404 status code.
     */
    app.get('*', (req, res) => {
      res.json({ error: StatusCodes.NOT_FOUND });
  });


if (process.env.NODE_ENV === 'PRO') {
  const httpsOptions = {
    cert: fs.readFileSync('./cert.crt'),
    key: fs.readFileSync('./private.key')
  };
  https.createServer(httpsOptions, app).listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
} else {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}