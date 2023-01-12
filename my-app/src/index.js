const S3 = require('aws-sdk/clients/s3')

const accountId = ''
const accessKeyId = ''
const secretAccessKey = ''

const s3client = new S3({
	endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
	accessKeyId: accessKeyId,
	secretAccessKey: secretAccessKey,
	s3ForcePathStyle: true,
	signatureVersion: 'v4'
})

const corsHeaders = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'GET,HEAD,POST,OPTIONS,PUT',
	'Access-Control-Max-Age': '86400',
};

async function handleRequest(request) {

	const presignedDownload = s3client.getSignedUrl('getObject', {
		Bucket: 'testing',
		Key: 'demo.jpg',
		Expires: 60,
		ResponseContentDisposition: 'attachment; filename="demo.jpg"'
	})


	return new Response(JSON.stringify({
		url: presignedDownload
	}), null)


}


function handleOptions(request) {
	let headers = request.headers;
	if (headers.get('Origin') !== null && headers.get('Access-Control-Request-Method') !== null && headers.get('Access-Control-Request-Headers') !== null) {
		let respHeaders = {
			...corsHeaders, 'Access-Control-Allow-Headers': request.headers.get('Access-Control-Request-Headers'),
		};

		return new Response(null, {
			headers: respHeaders,
		});
	} else {
		let respHeaders = {
			...corsHeaders, 'Access-Control-Allow-Headers': request.headers.get('Access-Control-Request-Headers'),
		};

		return new Response(null, {
			headers: respHeaders,
		});
	}
}

addEventListener('fetch', event => {
	const request = event.request;
	const url = new URL(request.url);
	if (request.method === 'OPTIONS') {
		// Handle CORS preflight requests
		event.respondWith(handleOptions(request));
	} else {
		// Handle requests to the API server
		event.respondWith(handleRequest(request));
	}

});
