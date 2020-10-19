import * as mongoose from "mongoose"

export default new mongoose.Schema(
	{
		email: {
			type: String,
			unique: true,
			required: true,
			lowercase: true,
			trim: true
		},
		password: {
			type: String,
			required: true
		}
	},
	{ collection: "users" }
)
