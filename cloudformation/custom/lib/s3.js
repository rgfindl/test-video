'use strict';

const AWS = require('aws-sdk');
const s3 = new AWS.S3();

var functions = {};

functions.putObject = function(params, done) {
    s3.putObject(params, done);
};

functions.deleteObject = function(params, done) {
    s3.deleteObject(params, done);
};

module.exports = functions;