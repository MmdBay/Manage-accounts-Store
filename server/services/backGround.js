"use strict";

/**
 * Imports the default export of the 'axios' module.
 * @requires axios
 * @type {Object}
 */
const axios = require('axios').default;

/**
 * Imports the 'cheerio' module.
 * @requires cheerio
 * @type {Object}
 */
const cheerio = require('cheerio');
/**
 * Imports the 'CookieJar' class from the 'tough-cookie' module and creates a new instance of it.
 * @requires tough-cookie
 * @type {CookieJar}
 */
const { CookieJar } = require('tough-cookie');
const cookieJar = new CookieJar();

/** @type {string} - url */
const url = 'https://wallpaper.mob.org/pc/gallery/tag=nature/';


/**
 * Fetches the background images from https://wallpaper.mob.org/pc/gallery/tag=nature/
 * @async
 * @function backGround
 * @returns {Promise<string[]>} A Promise object that resolves to an array of strings (URLs of images)
 */

const backGround = () => {
  return new Promise(async (resolve, reject) => {
    try {
      /**
 * Fetches data from the specified URL using axios.
 * @async
 * @function get
 * @memberof axios
 * @param {string} url - The URL to fetch data from.
 * @param {Object} options - The options object.
 * @param {Object} options.headers - An object containing the request headers.
 * @param {string} options.headers.User-Agent - The user agent string to use in the request header.
 * @param {string} options.headers.Referer - The referer URL to use in the request header.
 * @param {string} options.headers.Accept - The accept header to use in the request header.
 * @param {string} options.headers.Accept-Language - The accept language to use in the request header.
 * @param {string} options.headers.Connection - The connection type to use in the request header.
 * @param {Object} options.jar - The cookie jar object to use for cookie handling.
 * @param {boolean} options.withCredentials - A flag indicating whether to send cookies with the request.
 * @returns {Promise<Object>} A Promise object that resolves to the response data from the request.
 */
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Safari/537.3',
          'Referer': 'https://www.google.com/',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
          'Accept-Language': 'en-US,en;q=0.9',
          'Connection': 'keep-alive',
        },
        jar: cookieJar,
        withCredentials: true,
      });
      /** @type {[string]} */
      const imgS = [];

      /**
    * Parses the HTML response using Cheerio library.
    * @function load
    * @memberof cheerio
    * @param {string|Buffer} html - The HTML content to be parsed.
    * @returns {CheerioAPI} A Cheerio instance representing the parsed HTML content.
    */

      const $ = cheerio.load(response.data)

      /**
 * Iterates over a collection of elements that match the specified selector using jQuery-like syntax
 * and retrieves the value of the `src` attribute of each `img` element found.
 * @function each
 * @memberof cheerio.Cheerio
 * @param {function} callback - A function to execute for each element in the collection.
 * @param {number} i - The index of the current element in the collection.
 * @param {CheerioElement} el - The current element in the collection.
 * @returns {Cheerio} A Cheerio instance representing the collection of elements.
 */
      $('.image-gallery-image__inner').each((i, el) => {
        imgS.push($(el).find('img').attr('src'))
      })
      /**
 * Filters the elements of an array that are not null or empty strings.
 * @function filter
 * @memberof Array
 * @param {function} callback - A function to test each element of the array.
 * @param {*} x - The current element being processed in the array.
 * @returns {Array} A new array containing the elements that passed the test.
 */
      const filtered = imgS.filter(x => x != null && x !== '');

      /**
 * Resolves a Promise object with a given value.
 * @function resolve
 * @memberof Promise
 * @param {*} value - The resolved value of the Promise object.
 */
      resolve(filtered);

    } catch (error) {
      reject(error);
    }
  });
};

module.exports = backGround;
