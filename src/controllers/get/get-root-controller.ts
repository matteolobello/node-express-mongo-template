import * as express from "express"
import { Responses } from "../../helpers/constants"

export const handle = async (req: express.Request, res: express.Response) => {
	res.status(Responses.OK).json({
		status: "OK"
	})
}
