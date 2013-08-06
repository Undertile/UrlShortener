/*
 * A nodeJs implementation to convert longUrl to shortUrl.
 * Version 0.1 
 * Author: Undertile develop team.
 * Distributed under the GPL_v3 License
 * 
 * 
 * Notes:
 * Long URLs should be URL-encoded. You can not include a longUrl in the request that has &, ?, #, or other reserved parameters without first encoding it.
 * Long URLs should not contain spaces: any longUrl with spaces will be rejected. All spaces should be either percent encoded %20 or plus encoded +. 
 * Note that tabs, newlines and trailing spaces are all indications of errors. Please remember to strip leading and trailing whitespace from any user input before saving.
 * Long URLs must have a slash between the domain and the path component. For example, http://example.com?query=parameter is invalid, and instead should be formatted as http://example.com/?query=parameter
 */



var server = require("./server3");

server.start();