import * as express from "express"
import * as sanitizer from "sanitize-html"
import { Responses, Errors } from "../../helpers/constants"
import AuthManager from "../../helpers/auth"

interface Params {
	email: string
	password: string
}

export default (req: express.Request, res: express.Response) => {
	const params = req.body as Params

	if (!params) {
		return res
			.status(Responses.BAD_REQUEST)
			.json({ success: false, error: Errors.INVALID_INPUT })
	}

	AuthManager.getInstance()
		.signUp(sanitizer(params.email), params.password)
		.then((token) => {
			res.status(Responses.OK).json({
				success: true,
				token
			})
		})
		.catch((error) => {
			res.status(Responses.INTERNAL_SERVER_ERROR).json({
				success: false,
				error
			})
		})
}
