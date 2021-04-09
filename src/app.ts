import * as express from "express"
import * as expressWinston from "express-winston"
import * as fileSystem from "fs"
import * as http from "http"
import * as https from "https"
import * as winston from "winston"
import getRootController from "./controllers/get/get-root-controller"
import postAuthForgotPasswordController from "./controllers/post/post-auth-forgot-password-controller"
import postAuthForgotPasswordUpdateController from "./controllers/post/post-auth-forgot-password-update-controller"
import postAuthLoginController from "./controllers/post/post-auth-login-controller"
import postAuthSignUpController from "./controllers/post/post-auth-signup-controller"
import {
	DEBUG,
	SERVER_PORT,
	SERVER_SSL_CERTIFICATE_PATH,
	SERVER_SSL_KEY_PATH
} from "./helpers/constants"
import basicAuthMiddleware from "./middlewares/basic-auth-middleware"
import corsMiddleware from "./middlewares/cors-middleware"

const app = express()
app.use(express.json())
app.use(corsMiddleware)
app.use(basicAuthMiddleware)
app.use("/visual/admin", express.static(__dirname + "/static/admin"))

if (DEBUG) {
	app.use(
		expressWinston.logger({
			requestFilter: (req: expressWinston.FilterRequest, propName: string) => {
				switch (propName) {
					case "headers":
						return { "user-agent": req.headers["user-agent"] }
					default:
						return req[propName]
				}
			},
			transports: [new winston.transports.Console()],
			format: winston.format.combine(
				winston.format.colorize(),
				winston.format.simple()
			),
			meta: true,
			colorize: true
		})
	)
}

const server =
	SERVER_PORT == "443"
		? https.createServer(
				{
					key: fileSystem.readFileSync(SERVER_SSL_KEY_PATH, "utf8"),
					cert: fileSystem.readFileSync(SERVER_SSL_CERTIFICATE_PATH, "utf8")
				},
				app
		  )
		: http.createServer(app)
const serverPort = SERVER_PORT || 80
server.listen(serverPort, () => {
	console.log(`Running server on port ${serverPort}`)
})

/**
 * Route: /
 * Method: GET
 * Description: Shows a JSON Object with the status of the server
 * Params: none
 */
app.get("/", getRootController)

/**
 * Route: /auth/signup
 * Method: POST
 * Description: Sign up a user
 * Params: `email`, `password`
 */
app.post("/auth/signup", postAuthSignUpController)

/**
 * Route: /auth/login
 * Method: POST
 * Description: Log in a user
 * Params: `email`, `password`
 */
app.post("/auth/login", postAuthLoginController)

/**
 * Route: /auth/forgot-password
 * Method: POST
 * Description: Send a reset password link
 * Params: `email`
 */
app.post("/auth/forgot-password", postAuthForgotPasswordController)

/**
 * Route: /auth/forgot-password/update
 * Method: POST
 * Description: Update the password from the reset link
 * Params: `password`
 */
app.post("/auth/forgot-password/update", postAuthForgotPasswordUpdateController)
