import * as express from "express"
import AuthManager from "../../helpers/auth"
import { Errors, Responses } from "../../helpers/constants"

export const handle = (req: express.Request, res: express.Response) => {
	const isValidInput = req.body.password && req.body.password.length > 5
	if (!isValidInput) {
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
