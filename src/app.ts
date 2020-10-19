import * as dotenv from "dotenv"
dotenv.config()

import * as bodyParser from "body-parser"
import * as express from "express"
import * as fileSystem from "fs"
import * as http from "http"
import * as https from "https"
import * as morganBody from "morgan-body"
import {
	DEBUG,
	SERVER_PORT,
	SERVER_SSL_CERTIFICATE_PATH,
	SERVER_SSL_KEY_PATH,
	MAX_LOGS_CHARS
} from "./helpers/constants"
import rootController from "./controllers/get/root-controller"
import forgotPasswordController from "./controllers/post/forgot-password-controller"
import forgotPasswordUpdateController from "./controllers/post/forgot-password-update-controller"
import loginController from "./controllers/post/login-controller"
import signUpController from "./controllers/post/signup-controller"
import basicAuthMiddleware from "./middlewares/basic-auth-middleware"
import corsMiddleware from "./middlewares/cors-middleware"

const app = express()
app.use(bodyParser.json())
app.use(corsMiddleware)
app.use(basicAuthMiddleware)
app.use("/visual/admin", express.static(__dirname + "/static/admin"))

if (DEBUG) {
	morganBody(app, { maxBodyLength: MAX_LOGS_CHARS })
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
app.get("/", rootController)

/**
 * Route: /signup
 * Method: POST
 * Description: Sign up a user
 * Params: `email`, `password`
 */
app.post("/signup", signUpController)

/**
 * Route: /login
 * Method: POST
 * Description: Log in a user
 * Params: `email`, `password`
 */
app.post("/login", loginController)

/**
 * Route: /forgot-password
 * Method: POST
 * Description: Send a reset password link
 * Params: `email`
 */
app.post("/forgot-password", forgotPasswordController)

/**
 * Route: /forgot-password/update
 * Method: POST
 * Description: Update the password from the reset link
 * Params: `password`
 */
app.post("/forgot-password/update", forgotPasswordUpdateController)
