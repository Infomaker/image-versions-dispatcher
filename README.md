# Image versions dispatcher

## Description

This lambda creates and dispatches commands for versions (or variants), of a specified image. The
command is a message that is put on a SNS for further processing. Messages created by this lambda
will have the following structure:

``` 
{
  "bucket": "image_bucket",
  "folder": "versions",
  "version": "w250_h250",
  "key": "maxresdefault.jpg"
}
```
For more information om usage of this lambda, please see paragraph "Upload image" in google document [Writer image routes](https://docs.google.com/document/d/1jAc_aCcPZT7QAcPnG5EKgyXQSjffs8VU4KimWQNiOoY/edit#heading=h.l5eud61ns20u).

## Installation

Clone this repository and install dependencies:

```
$ git clone git@github.com:Infomaker/image-versions-dispatcher.git
$ cd image-versions-dispatcher
$ npm install 
```

## Packaging

1. Check in your changes
2. Run `make lambda`
3. Upload the created zip file `ImageVersionsDispatcher.zip` to AWS lambda (see "AWS Lambda config" below)

## Configuration
Specify the environment variables for the lambda (in the code tab).

| Variable key | Value |
| ------------ | ----- |
| TOPIC_ARN    | The SNS ARN to which lambda should push command messages to, _e.g. arn:aws:sns:eu-west-1:713907151212:image_processing_ |
| VERSIONS     | The versions of the image for which command messages should be created. Versions are described using width and height using the naming convention "w1500_h1200". _E.g. w024_h,w_800,w1500_h1200,w_h460_ |
| BASE_FOLDER  | In order to stop infinite recursive loop, the image versions will end up under a specific folder which is determined by this variable. If left out it will default to "versions" |

## AWS Lambda config

- Function name: [env]-ImageVersionsDispatcher
- Description: Creates image versions commands and push to sns.
- Runtime: Node.js 6.10
- Handler: index.handler
- Role: Role need to have read permission on the S3 bucket to which lambda is configured.
- Memory: 128 MB
- Timeout: Recommended value 10 sec.

## Triggers

Add S3 trigger and specify S3 bucket to which lambda should be configured for. Specify `Object created (All)`
as trigger.

## Usage
See Triggers above.

