import { IsEmail, IsString } from "class-validator"
import * as express from "express"
import * as sanitizer from "sanitize-html"
import AuthManager from "../../helpers/auth"
import { Responses } from "../../helpers/constants"

export class BodyParams {
	@IsEmail()
	email: string

	@IsString()
	password: string
}

export const handle = async (
	req: express.Request<any, any, BodyParams, any>,
	res: express.Response
) => {
	console.log("Handling...")

	AuthManager.getInstance()
		.signUp(sanitizer(req.body.email), req.body.password)
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
