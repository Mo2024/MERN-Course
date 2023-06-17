import { InferSchemaType, Schema, model } from "mongoose";

const userSchema = new Schema({
    username: { type: String, required: true, unique: true, },
    email: { type: String, required: true, unique: true, select: false, }, // select:false means that when we retrivee a user from the databse
    password: { type: String, required: true, select: false }, //by default it will not return those values unless specfified 
});

type User = InferSchemaType<typeof userSchema>;
export default model<User>("User", userSchema);