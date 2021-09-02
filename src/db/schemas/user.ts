import { prop } from "@typegoose/typegoose"
import { IsString } from "class-validator"

export default class UserSchema {
	@IsString()
	@prop({
		type: String,
		unique: true,
		required: true,
		lowercase: true,
		trim: true
	})
	public email: string

	@IsString()
	@prop({ type: String, required: true })
	public password: string
}
