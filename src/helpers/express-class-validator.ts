/**
 * Code from: https://github.com/ISNIT0/express-class-validator
 */
import { transformAndValidate } from "class-transformer-validator"
import * as express from "express"

const isProd = process.env.NODE_ENV === "production"

export const makeValidateBody = <T>(
	c: T,
	errorHandler?: (
		err: any,
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	) => void
) => {
	return (
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	) => {
		const toValidate = req.body
		if (!toValidate) {
			if (errorHandler) {
				errorHandler({ type: "no-body" }, req, res, next)
			} else {
				res.status(400).json({
					error: true,
					message: "Validation failed",
					...(isProd
						? {}
						: { originalError: { message: "No request body found" } })
				})
			}
		} else {
			transformAndValidate(c as any, toValidate)
				.then((transformed) => {
					req.body = transformed
					next()
				})
				.catch((err) => {
					if (errorHandler) {
						errorHandler(err, req, res, next)
					} else {
						res.status(400).json({
							success: false,
							error: err[0]?.constraints
						})
					}
				})
		}
	}
}
