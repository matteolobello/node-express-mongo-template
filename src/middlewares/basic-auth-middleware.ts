import * as basicAuth from "basic-auth"
import * as express from "express"
import {
	BASIC_AUTH_PASS,
	BASIC_AUTH_USER,
	Responses
} from "../helpers/constants"

const basicAuthProtectedPaths = ["/visual/admin"]

export default (
	req: express.Request,
	res: express.Response,
	next: Function
) => {
	const isProtectedPath = basicAuthProtectedPaths.some((path) =>
		req.path.startsWith(path)
	)

	if (!isProtectedPath) {
		return next()
	}

	const user = basicAuth(req)
	if (
		user === undefined ||
		user["name"] !== BASIC_AUTH_USER ||
		user["pass"] !== BASIC_AUTH_PASS
	) {
		res.statusCode = Responses.UNAUTHORIZED
		res.setHeader("WWW-Authenticate", 'Basic realm="Node"')
		res.end("Unauthorized")
	} else {
		next()
	}
}
