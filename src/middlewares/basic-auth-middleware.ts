import * as basicAuth from "basic-auth"
import { Responses } from "../constants"

import * as express from "express"

const basicAuthProtectedPaths = [
    "/visual/docs"
]

export default (req: express.Request, res: express.Response, next: Function) => {
    const isProtectedPath = basicAuthProtectedPaths.find(
        (path) => req.path.startsWith(path)) != undefined

    if (!isProtectedPath) {
        return next()
    }

    const user = basicAuth(req)
    if (user === undefined
        || user["name"] !== process.env.BASIC_AUTH_USER
        || user["pass"] !== process.env.BASIC_AUTH_PASS
    ) {
        res.statusCode = Responses.UNAUTHORIZED
        res.setHeader("WWW-Authenticate", 'Basic realm="Node"')
        res.end("Unauthorized")
    } else {
        next()
    }
}