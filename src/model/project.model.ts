import mongoose, { Document, Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { IUser } from './users.model';

export interface IProject extends Document {
  name: string;
  description: string;
  techStack: string[];
  status: 'Live' | 'Draft' | 'Archived';
  category: string;
  coverImage?: string;
  links?: { live_url?: string; repo?: string; code?: string };
  userId: mongoose.Types.ObjectId;
  user?: IUser; // Populated user data
}

const ProjectSchema = new Schema<IProject>({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  techStack: [{ type: String }],
  status: { type: String, enum: ['Live', 'Draft', 'Archived'], default: 'Draft' },
  category: { type: String, default: '' },
  coverImage: { type: String },
  links: {
    live_url: String,
    repo: String,
    code: String,
  },
  userId: { 
      type: Schema.Types.ObjectId, 
      ref: 'User',                    
      required: true,
      index: true 
    },
}, { timestamps: true });

ProjectSchema.plugin(mongoosePaginate);

export const Project = mongoose.model<IProject>('Project', ProjectSchema);