import * as express from "express"
import * as nodeMailer from "nodemailer"
import * as Database from "../../db/db"
import AuthManager from "../../helpers/auth"
import {
	Responses,
	Errors,
	WEB_APP_URL,
	EMAIL_SERVER_PORT,
	EMAIL_USER,
	EMAIL_PASS,
	PROJECT_NAME,
	FORGOT_PASSWORD_NOREPLY_EMAIL
} from "../../helpers/constants"

export default (req: express.Request, res: express.Response) => {
	let isInputValid =
		req.body.email &&
		new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).test(req.body.email)
	if (!isInputValid) {
		return res.status(Responses.BAD_REQUEST).json({
			success: false,
			error: Errors.INVALID_INPUT
		})
	}

	Database.User.findOne({ email: req.body.email })
		.then((user: any) => {
			const jwt = AuthManager.getInstance().generateToken(
				{ _id: user._id, email: user.email },
				"1d"
			)
			const passwordResetLink = `${WEB_APP_URL}/reset-password/${jwt}`

			let transporter = nodeMailer.createTransport({
				service: "gmail",
				host: EMAIL_SERVER_PORT,
				port: Number(EMAIL_SERVER_PORT) || 0,
				secure: EMAIL_SERVER_PORT == "465",
				auth: {
					user: EMAIL_USER,
					pass: EMAIL_PASS
				},
				debug: false,
				logger: false
			})

			transporter
				.sendMail({
					from: `"${PROJECT_NAME}" <${FORGOT_PASSWORD_NOREPLY_EMAIL}>`,
					to: user.email,
					subject: `Reset ${PROJECT_NAME} Password ✔`,
					text: `Hi! We received an attempt to reset your password. Click on this link to proceed with the password reset: ${passwordResetLink}`
				})
				.then((sentMessageInfo: nodeMailer.SentMessageInfo) => {
					res.status(Responses.OK).json({
						success: true
					})
				})
				.catch((err) => {
					res.status(Responses.OK).json({
						success: false,
						error: err
					})
				})
		})
		.catch((err) => {
			res.status(Responses.INTERNAL_SERVER_ERROR).json({
				success: false,
				error: err
			})
		})
}
