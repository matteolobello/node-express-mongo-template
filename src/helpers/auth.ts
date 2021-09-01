import { DocumentType } from "@typegoose/typegoose"
import * as bcrypt from "bcryptjs"
import * as express from "express"
import * as jsonWebToken from "jsonwebtoken"
import * as sanitizer from "sanitize-html"
import * as Database from "../db/db"
import UserSchema from "../db/schemas/user"
import { Errors, JWT_CODE_EXPIRATION, SECRET_JWT_CODE } from "./constants"

interface TokenPayload {
	_id: string
	email: string
}

export default class AuthManager {
	private static instance: AuthManager = null

	public static getInstance() {
		if (AuthManager.instance == null) {
			AuthManager.instance = new AuthManager()
		}

		return AuthManager.instance
	}

	private constructor() {}

	signUp(email: string, password: string): Promise<string> {
		return new Promise((resolve, reject) => {
			Database.Users.create({
				email: email,
				password: this.encryptPassword(password)
			})
				.then((user) => {
					const token = this.generateToken({ _id: user._id, email: user.email })
					resolve(token)
				})
				.catch((err) => {
					if (err.code === 11000) {
						reject(Errors.DUPLICATED_RECORD)
					} else {
						reject(Errors.UNKNOWN)
					}
				})
		})
	}

	signIn(email: string, password: string): Promise<string> {
		return new Promise((resolve, reject) => {
			Database.Users.findOne({ email })
				.then((user) => {
					if (!user) {
						reject(Errors.RECORD_NOT_FOUND)
					} else {
						if (!bcrypt.compareSync(password, user.password)) {
							reject(Errors.BAD_AUTHENTICATION)
						} else {
							const token = this.generateToken({
								_id: user._id,
								email: user.email
							})
							resolve(token)
						}
					}
				})
				.catch(() => {
					reject(Errors.UNKNOWN)
				})
		})
	}

	encryptPassword(password: string): string {
		return bcrypt.hashSync(password, 10)
	}

	fetchUserByHeaderToken(
		req: express.Request
	): Promise<DocumentType<UserSchema>> {
		return new Promise(async (resolve, reject) => {
			if (req.headers && req.headers.authorization) {
				const authorization = sanitizer(req.headers.authorization)
				if (!authorization.includes("Bearer")) {
					return reject(Errors.BAD_AUTHENTICATION)
				}

				const [_, token] = authorization.split("Bearer")

				try {
					const user = this.fetchUserByToken(token.trim())
					resolve(user)
				} catch (err) {
					reject(err)
				}
			}

			return reject(Errors.AUTH_TOKEN_NOT_FOUND)
		})
	}

	fetchUserByToken(token: string): Promise<DocumentType<UserSchema>> {
		return new Promise((resolve, reject) => {
			const decoded = this.decodeJWT(token)

			const userId = decoded?._id
			if (!userId) {
				reject(null)
				return
			}

			Database.Users.findById(userId)
				.then(resolve)
				.catch(() => {
					reject(Errors.RECORD_NOT_FOUND)
				})
		})
	}

	generateToken(tokenPayload: TokenPayload, exp = JWT_CODE_EXPIRATION): string {
		return jsonWebToken.sign(tokenPayload, SECRET_JWT_CODE, { expiresIn: exp })
	}

	private decodeJWT(token: string): TokenPayload | undefined {
		try {
			return jsonWebToken.verify(token, SECRET_JWT_CODE) as TokenPayload
		} catch (e) {
			return undefined
		}
	}
}
