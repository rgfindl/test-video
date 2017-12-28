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

functions.createPresets = function(input, done) {
    var output = {};
    var i = 0;
    var ids = '';
    var div = '';
    async.eachSeries(input.presets, function(preset, next) {
        var params = _.pick(preset, [
            'Container',
            'Name',
            'Audio',
            'Description',
            'Thumbnails',
            'Video'
        ]);
        if (_.isNil(params.Description)) {
            params.Description = '';
        }
        params.Name = input.environment + ' - ' + params.Name;
        console.log(JSON.stringify(params, null, 3));
        elastictranscoder.createPreset(params, function(err, data) {
            if (err) return next(err);
            output['Id'+i] = data.Preset.Id;
            output['Name'+i] = data.Preset.Name;
            ids += div+data.Preset.Id;
            div = ',';
            next(err);
        });
    }, function(err) {
        output.Ids = ids;
        console.log(JSON.stringify(output, null, 3));
        done(err, output);
    });
};


module.exports = functions;