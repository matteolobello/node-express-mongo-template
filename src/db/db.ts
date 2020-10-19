import * as mongoose from "mongoose"
import { DATABASE_URI } from "../helpers/constants"
import UserSchema from "./schemas/user"

mongoose.connect(DATABASE_URI, {
	useUnifiedTopology: true,
	useNewUrlParser: true,
	useCreateIndex: true,
	useFindAndModify: false
})

export const User = mongoose.model("User", UserSchema)
