'use strict';

const winston = require('winston');
const async = require('async');
const _ = require('lodash');
const cfn_response = require('cfn-response');

const ec2 = require('./lib/ec2');
const s3 = require('./lib/s3');

const KEY_PAIR_NAME = "video";
const KEY_PAIR_S3 = "EC2-KEY-PAIR";

//
// Handle the CloudFormation custom resources
//

exports.handler = function(event, context) {
    winston.info('handleCustomResource');

    if (event.RequestType === 'Create') {
        //
        // Handle the CloudFormation 'Create' stage.
        //
        winston.info('Create');
        switch (event.ResourceProperties.Resource) {
            case 'KeyPair':
                //
                // Create the EC2 KeyPair and store it in S3
                //
                winston.info('KeyPair');
                async.waterfall([
                    function(next) {
                        var params = {
                            KeyName: KEY_PAIR_NAME+'-'+event.ResourceProperties.Environment
                        };
                        ec2.createKeyPair(params, next);
                    },
                    function(data, next) {
                        var params = {
                            ACL: "private",
                            Body: Buffer.from(JSON.stringify(data, null, 3)),
                            Bucket: process.env.PipelinesBucket,
                            Key: KEY_PAIR_S3+'-'+event.ResourceProperties.Environment
                        };
                        s3.putObject(params, next);
                    }
                ], function(err, results) {
                    if (err) {
                        winston.error(err);
                        cfn_response.send(event, context, cfn_response.FAILED, err);
                    } else {
                        cfn_response.send(event, context, cfn_response.SUCCESS, {
                            Name: KEY_PAIR_NAME+'-'+event.ResourceProperties.Environment,
                            Bucket: process.env.PipelinesBucket,
                            Key: KEY_PAIR_S3+'-'+event.ResourceProperties.Environment
                        });
                    }
                });
                break;
            default:
                console.log('no case match, sending success response');
                cfn_response.send(event, context, cfn_response.SUCCESS);
            // default response if Resource or RequestType (delete update) not defined.
        }
    } else if (event.RequestType === 'Delete') {
        //
        // Handle the CloudFormation 'Delete' stage.
        //
        winston.info('Delete');
        switch (event.ResourceProperties.Resource) {
            case 'KeyPair':
                //
                // Delete the EC2 KeyPair and the S3 value
                //
                winston.info('KeyPair');
                async.waterfall([
                    function(next) {
                        var params = {
                            KeyName: KEY_PAIR_NAME+'-'+event.ResourceProperties.Environment
                        };
                        ec2.deleteKeyPair(params, next);
                    },
                    function(data, next) {
                        var params = {
                            Bucket: process.env.PipelinesBucket,
                            Key: KEY_PAIR_S3+'-'+event.ResourceProperties.Environment
                        };
                        s3.deleteObject(params, next);
                    }
                ], function(err, results) {
                    if (err) {
                        winston.error(err);
                        cfn_response.send(event, context, cfn_response.FAILED, err);
                    } else {
                        cfn_response.send(event, context, cfn_response.SUCCESS);
                    }
                });
                break;
            default:
                console.log('no case match, sending success response');
                cfn_response.send(event, context, cfn_response.SUCCESS);
            // default response if Resource or RequestType (delete update) not defined.
        }
    } else {
        console.log('no case match, sending success response');
        cfn_response.send(event, context, cfn_response.SUCCESS);
        // default response if Resource or RequestType (delete update) not defined.
    }
};