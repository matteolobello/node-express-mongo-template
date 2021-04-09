import * as express from "express"
import * as sanitizer from "sanitize-html"
import { Responses, Errors } from "../../helpers/constants"
import AuthManager from "../../helpers/auth"

export default (req: express.Request, res: express.Response) => {
	if (!req.body.email || !req.body.password) {
		res.json({ success: false, error: Errors.INVALID_INPUT })
		return
	}

	AuthManager.getInstance()
		.signUp(sanitizer(req.body.email), req.body.password)
		.then((token) => {
			res.status(Responses.OK).json({
				success: true,
				token
			})
		})
		.catch((error) => {
			res.status(Responses.OK).json({
				success: false,
				error
			})
		})
}
