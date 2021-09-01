import * as express from "express"
import AuthManager from "../../helpers/auth"
import { Errors, Responses } from "../../helpers/constants"

interface Params {
	password: string
}

export default (req: express.Request, res: express.Response) => {
	const params = req.body as Params

	if (!params || params.password.length < 6) {
		return res.status(Responses.BAD_REQUEST).json({
			success: false,
			error: Errors.INVALID_INPUT
		})
	}

	const authManager = AuthManager.getInstance()

	authManager
		.fetchUserByHeaderToken(req)
		.then((user) => {
			user.password = authManager.encryptPassword(req.body.password)
			user
				.save()
				.then(() => {
					res.status(Responses.OK).json({
						success: true
					})
				})
				.catch((error) => {
					res.status(Responses.INTERNAL_SERVER_ERROR).json({
						success: false,
						error
					})
				})
		})
		.catch((error) => {
			res.status(Responses.INTERNAL_SERVER_ERROR).json({
				success: false,
				error
			})
		})
}
