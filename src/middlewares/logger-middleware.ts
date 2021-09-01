import * as expressWinston from "express-winston"
import * as winston from "winston"

export default expressWinston.logger({
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
