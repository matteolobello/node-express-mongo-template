import { prop } from "@typegoose/typegoose"

export default class UserSchema {
	@prop({
		type: String,
		unique: true,
		required: true,
		lowercase: true,
		trim: true
	})
	public email: string

	@prop({ type: String, required: true })
	public password: string
}
