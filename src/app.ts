import * as express from "express"
import * as fileSystem from "fs"
import * as http from "http"
import * as https from "https"
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
import loggerMiddleware from "./middlewares/logger-middleware"

const app = express()
app.use(express.json())
app.use(corsMiddleware)
app.use(basicAuthMiddleware)
app.use("/visual/admin", express.static(__dirname + "/static/admin"))

if (DEBUG) {
	app.use(loggerMiddleware)
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

app.get("/", getRootController)

app.post("/auth/signup", postAuthSignUpController)
app.post("/auth/login", postAuthLoginController)
app.post("/auth/forgot-password", postAuthForgotPasswordController)
app.post("/auth/forgot-password/update", postAuthForgotPasswordUpdateController)
