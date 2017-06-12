'use strict';

const aws = require('aws-sdk');
const sns = new aws.SNS();

const topicArn = process.env['TOPIC_ARN']
const versionsEnv = process.env['VERSIONS']
const folder = process.env['BASE_FOLDER'] || 'versions'

console.log('Loading image-versions-dispatcher function');

exports.handler = (event, context, callback) => {
    console.log('Received event:', JSON.stringify(event, null, 2));

    const bucket = event.Records[0].s3.bucket.name;
    const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));

    // Filter out non-original versions in order to avoid infinite loop
    // i.e. lambda creating image versions trigger this lambda etc.
    if (key.startsWith(folder)) {
        callback(null, 'Done! No versions will be created for ' + key + ' due to filter')
    } else {
        const versions = versionsEnv.split(',')

        // Iterate over configured versions and dispatch create version message
        for (let i = 0; i < versions.length; i++) {

            let message = {
                bucket: bucket,
                folder: folder,
                version: versions[i],
                key: key
            }

            notify(message, function (error, data) {
                if (error) {
                    callback(error)
                } else {
                    callback(null, data);
                }
            })
        }
    }
};

let notify = function (message, callback) {
    sns.publish({
        TopicArn: topicArn,
        Message: JSON.stringify(message)
    }, function (err, data) {
        if (err) {
            console.error('Error publishing to SNS', err);
            callback(err);
        } else {
            console.info('Message published to SNS', data);
            callback(null, data);
        }
    });
}