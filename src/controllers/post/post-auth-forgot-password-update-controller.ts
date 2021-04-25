import * as express from "express"
import AuthManager from "../../helpers/auth"
import { Responses, Errors } from "../../helpers/constants"

export default (req: express.Request, res: express.Response) => {
	if (!req.body.password || req.body.password.length < 6) {
		return res.status(Responses.BAD_REQUEST).json({
			success: false,
			error: Errors.INVALID_INPUT
		})
	}

	const authManager = AuthManager.getInstance()

	authManager
		.fetchUserByHeaderToken(req)
		.then((user: any) => {
			user.password = authManager.encryptPassword(req.body.password)
			user
				.save()
				.then(() => {
					res.status(Responses.OK).json({
						success: true
					})
				})
				.catch((err: any) => {
					res.status(Responses.INTERNAL_SERVER_ERROR).json({
						success: false,
						error: err
					})
				})
		})
		.catch((err: any) => {
			res.status(Responses.INTERNAL_SERVER_ERROR).json({
				success: false,
				error: err
			})
		})
}
