import mongoose from "mongoose";
import { type BaseSchema } from "../common/dto/base.dto";

export interface INFT extends BaseSchema {
  name: string;
  description: string;
  media: mongoose.Types.ObjectId;  
  owner: mongoose.Types.ObjectId;  
  attributes: object; 
}
