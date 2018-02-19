import AWS from 'aws-sdk';
let aws = require('../../aws');
import errorType from './errorType';

// Amazon s3 config
AWS.config.update(aws.s3);
const s3 = new AWS.S3();

export const willUploadObject = (key, body) => new Promise(
	(resolve, reject) => {
		s3.putObject({
			Bucket: 'thetripbeyond', Key: key, Body: body, ACL: 'public-read', // your permisions
		}, (err) => {
			if (err) {
				console.log(err);
				//TODO LOG throw errorType(2)
				return reject(errorType(2))
			}
			return resolve("upload successful")
		})
	}
)

export const willDeleteObject = (key) => new Promise((resolve, reject) => {
	s3.deleteObject({
		Bucket: 'thetripbeyond',
		Key: key
	}, (err) => {
		if (err) {
			console.log(err);
			//TODO LOG throw errorType(2)
			return reject(errorType(2))
		}
		return resolve("delete successful")
	})
})
