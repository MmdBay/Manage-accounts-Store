"use strict";

// Import background service module
const backGround = require("../services/backGround");

/**
 * Defines a route handler for the /background endpoint.
 *
 * @param {Object} app - The Express application object.
 */
const getBackGround = (app) => {
  app.get("/background", async (req, res) => {
    try {
      // Call the backGround function from the background service module and store the result in backArr
      const backArr = await backGround();

      // Send the backArr array as a JSON response to the requester
      res.json(backArr);
    } catch (err) {
      // Log any errors to the console and send a 500 Internal Server Error response to the requester
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  });
};

// Export the getBackGround function so that it can be used by other modules
module.exports = getBackGround;