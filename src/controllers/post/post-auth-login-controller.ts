import * as express from "express"
import * as sanitizer from "sanitize-html"
import AuthManager from "../../helpers/auth"
import { Errors, Responses } from "../../helpers/constants"

export const handle = (req: express.Request, res: express.Response) => {
	const isInputValid =
		req.body &&
		new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).test(req.body.email) &&
		req.body.password &&
		req.body.password.length > 5

	if (!isInputValid) {
		return res.status(Responses.BAD_REQUEST).json({
			success: false,
			error: Errors.INVALID_INPUT
		})
	}

	AuthManager.getInstance()
		.signIn(sanitizer(req.body.email), req.body.password)
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
