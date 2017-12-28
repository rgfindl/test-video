'use strict';

const AWS = require('aws-sdk');
const ec2 = new AWS.EC2();

var functions = {};

functions.createKeyPair = function(params, done) {
    ec2.createKeyPair(params, done);
};

functions.deleteKeyPair = function(params, done) {
    ec2.deleteKeyPair(params, done);
};

module.exports = functions;