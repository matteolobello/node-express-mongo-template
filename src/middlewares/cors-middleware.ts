import * as express from "express"

export default (
	req: express.Request,
	res: express.Response,
	next: Function
) => {
	res.header("Access-Control-Allow-Origin", "*")
	res.header("Access-Control-Allow-Headers", "*")
	next()
}
