'use strict';

const assert = require('assert');
const winston = require('winston');
const proxyquire =  require('proxyquire');
const _ = require('lodash');


describe('index', function() {
    it('keypair - Ignored', function (done) {
        var cfn_response = {
            send: function (event, context, responseStatus, responseData, physicalResourceId) {
                assert.equal(responseStatus, 'SUCCESS');
                context.done();
            }
        };
        var index = proxyquire('../index', {
            "cfn-response": cfn_response
        });
        index.handler(require('./resources/custom-resource-01.json'), {
            done: done
        });
    });
    it('keypair - CREATE', function (done) {
        var cfn_response = {
            send: function (event, context, responseStatus, responseData, physicalResourceId) {
                assert.equal(responseStatus, 'SUCCESS');
                context.done();
            }
        };
        var ec2 = {
            createKeyPair: function(params, done) {
                winston.info('ec2.createKeyPair');
                assert.equal(params.KeyName, 'video-prod');
                done(null, {
                    foo: 'bar'
                });
            }
        };
        var s3 = {
            putObject: function(params, done) {
                winston.info('s3.putObject');
                assert.equal(params.Bucket, 'bucket');
                assert.equal(params.Key, 'EC2-KEY-PAIR-prod');
                assert.equal(params.Body.toString(), JSON.stringify({foo: 'bar'}, null, 3));
                done(null, {});
            }
        };
        var index = proxyquire('../index', {
            "cfn-response": cfn_response,
            "./lib/ec2": ec2,
            "./lib/s3": s3
        });
        process.env.PipelinesBucket = 'bucket';
        index.handler(require('./resources/custom-resource-02.json'), {
            done: done
        });
    });
    it('keypair - DELETE', function (done) {
        var cfn_response = {
            send: function (event, context, responseStatus, responseData, physicalResourceId) {
                assert.equal(responseStatus, 'SUCCESS');
                context.done();
            }
        };
        var ec2 = {
            deleteKeyPair: function(params, done) {
                winston.info('ec2.createKeyPair');
                assert.equal(params.KeyName, 'video-prod');
                done(null, {});
            }
        };
        var s3 = {
            deleteObject: function(params, done) {
                winston.info('s3.putObject');
                assert.equal(params.Bucket, 'bucket');
                assert.equal(params.Key, 'EC2-KEY-PAIR-prod');
                done(null, {});
            }
        };
        var index = proxyquire('../index', {
            "cfn-response": cfn_response,
            "./lib/ec2": ec2,
            "./lib/s3": s3
        });
        process.env.PipelinesBucket = 'bucket';
        index.handler(require('./resources/custom-resource-03.json'), {
            done: done
        });
    });
});