import * as mongoose from "mongoose"

const databaseUri = process.env.DATABASE_URI

mongoose.connect(databaseUri, {
	useUnifiedTopology: true,
	useNewUrlParser: true,
	useCreateIndex: true,
	useFindAndModify: false,
})

const UserSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			unique: true,
			required: true,
			lowercase: true,
			trim: true,
		},
		password: {
			type: String,
			required: true,
		}
	},
	{ collection: "users" }
)

export const User = mongoose.model("User", UserSchema)