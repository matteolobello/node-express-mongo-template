import * as express from "express"
import { Responses } from "../constants"

export default (req: express.Request, res: express.Response) => {
    res.status(Responses.OK).json({
        status: "OK"
    })
}