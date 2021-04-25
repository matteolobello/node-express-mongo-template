import * as express from "express"
import * as sanitizer from "sanitize-html"
import AuthManager from "../../helpers/auth"
import { Errors, Responses } from "../../helpers/constants"

export default (req: express.Request, res: express.Response) => {
	if (!req.body.email || !req.body.password) {
		res.json({ success: false, error: Errors.INVALID_INPUT })
		return
	}

	AuthManager.getInstance()
		.signIn(sanitizer(req.body.email), req.body.password)
		.then((data: any) => {
			res.status(Responses.OK).json({
				success: true,
				token: data.token
			})
		})
		.catch((error) => {
			res.status(Responses.INTERNAL_SERVER_ERROR).json({
				success: false,
				error
			})
		})
}
