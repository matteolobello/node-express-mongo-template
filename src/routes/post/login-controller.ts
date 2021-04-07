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
		.catch((err) => {
			res.status(Responses.OK).json({
				success: false,
				error: err
			})
		})
}
