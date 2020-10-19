import * as bcrypt from "bcryptjs"
import * as jsonWebToken from "jsonwebtoken"
import * as sanitizer from "sanitize-html"
import * as Database from "../db/db"
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

	private constructor() {
		throw new Error("Call the AuthManager.getInstance() method instead")
	}

	signUp(email: string, password: string) {
		return new Promise((resolve, reject) => {
			Database.User.create({
				email: email,
				password: this.encryptPassword(password)
			})
				.then((user: any) => {
					const token = this.generateToken({ _id: user._id, email: user.email })
					resolve(token)
				})
				.catch((err: any) => {
					if (err.code === 11000) reject(Errors.DUPLICATED_RECORD)
					else reject(Errors.UNKNOWN)
				})
		})
	}

	signIn(email: string, password: string) {
		return new Promise((resolve, reject) => {
			Database.User.findOne({ email })
				.then((user: any) => {
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
							resolve({ token, userType: user.userType })
						}
					}
				})
				.catch((err: any) => {
					reject(Errors.UNKNOWN)
				})
		})
	}

	encryptPassword(password: string): any {
		return bcrypt.hashSync(password, 10)
	}

	fetchUserByHeaderToken(req: any) {
		if (req.headers && req.headers.authorization) {
			const authorization = sanitizer(req.headers.authorization)
			return this.fetchUserByToken(authorization)
		} else {
			return new Promise((_, rej) => rej(Errors.AUTH_TOKEN_NOT_FOUND))
		}
	}

	fetchUserByToken(token: string) {
		return new Promise((resolve, reject) => {
			const decoded = this.decodeJWT(token)

			const userId = decoded?._id
			if (!userId) {
				reject(null)
				return
			}

			Database.User.findById(userId)
				.then((user: any) => {
					resolve(user)
				})
				.catch((err) => {
					reject(Errors.RECORD_NOT_FOUND)
				})
		})
	}

	generateToken(tokenPayload: TokenPayload, exp = JWT_CODE_EXPIRATION) {
		return jsonWebToken.sign(
			{ _id: tokenPayload._id, email: tokenPayload.email },
			SECRET_JWT_CODE,
			{ expiresIn: exp }
		)
	}

	private decodeJWT(token: string): any {
		try {
			return jsonWebToken.verify(token, SECRET_JWT_CODE)
		} catch (e) {
			return null
		}
	}
}
