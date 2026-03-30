import mongoose, { Document, Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { PaginateModel } from "mongoose";

export interface IMessage extends Document {
    id: string
    fullName: string
    email: string
    subject: string
    message: string 
    isRead: boolean
}

const messageSchema = new Schema<IMessage>({
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
}, {
    timestamps: true   
})

messageSchema.index({ email: 1, subject: 1, message: 1 }); // Add an index for faster queries on these fields
messageSchema.plugin(mongoosePaginate)

export const Message = mongoose.model<IMessage, PaginateModel<IMessage>>('Message', messageSchema);  

