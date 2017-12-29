'use static';

const async = require('async');
const _ = require('lodash');

const AWS = require('aws-sdk');
const elastictranscoder = new AWS.ElasticTranscoder();

var functions = {};

functions.createPipeline = function(params, done) {
    elastictranscoder.createPipeline(params, done);
};

functions.deletePipeline = function(params, done) {
    elastictranscoder.deletePipeline(params, done);
};

functions.createPreset = function(params, done) {
    elastictranscoder.createPreset(params, done);
};

functions.deletePreset = function(params, done) {
    if (_.isNil(params.Description)) {
        params.Description = '';
    }
    elastictranscoder.deletePreset(params, done);
};


module.exports = functions;