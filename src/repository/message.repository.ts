import { PaginateOptions, PaginateResult, QueryFilter, UpdateQuery } from "mongoose";
import { IMessage, Message } from "../model/message.model";

class MessageRepository {  
    async createMessage(messageData: Partial<IMessage>) {
        const message = new Message(messageData);   
        return await message.save();
    }


    async findById(id: string) {
        return await Message.findById(id)
    }


    async findAll(filter: QueryFilter<IMessage> = {}, options: PaginateOptions = {}): Promise<PaginateResult<IMessage>> {
        const defaultOptions: PaginateOptions = {
            page: 1,
            limit: 10,
            sort: { createdAt: -1 },
            ...options,
        };
        return await Message.paginate(filter, defaultOptions);
    }


    async updateById(id: string, updateData: UpdateQuery<IMessage>) {
        return await Message.findByIdAndUpdate(id, updateData, {
            returnDocument: 'after',
            runValidators: true,
        })
    }


    async deleteById(id: string) {
        return await Message.findByIdAndDelete(id)
    }
}


export const messageRepository = new MessageRepository()    
export default messageRepository