import pino from 'pino'
import { logflarePinoVercel } from 'pino-logflare'

// create pino-logflare console stream for serverless functions and send function for browser logs
const { stream, send } = logflarePinoVercel({
	apiKey: process.env.NEXT_PUBLIC_LOGFLARE_APIKEY,
	sourceToken: process.env.NEXT_PUBLIC_LOGFLARE_SOURCETOKEN
});

// create pino loggger
const logger = pino({
	browser: {
		transmit: {
			send: send,
		}
	},
	level: "debug",
	base: {
		processes_str: JSON.stringify(process.versions),
		revision: process.env.VERCEL_GITHUB_COMMIT_SHA,
	},
}, stream);

// Export Functions
const loggerError_Serverside = (req, res, e, text: string | null) => {
	logger.error({
		request: {
			headers: formatObjectKeys(req.headers),
			url: req.url,
			method: req.method
		},
		response: {
			statusCode: res.statusCode
		}
	},
		`${text}, e.message: ${e.message}`)
}

const loggerError_Clientside = (e, text: string | null) => {
	logger.error(null, `${text}, e.message: ${e.message}`)
}


// util
const formatObjectKeys = headers => {

	const keyValues = {}
	Object.keys(headers).map(key => {
		const newKey = key.replace(/-/g, "_");
		keyValues[newKey] = headers[key]
	});

	return keyValues
}

export { loggerError_Serverside, loggerError_Clientside }