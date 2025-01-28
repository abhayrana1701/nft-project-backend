import mongoose, { Schema, Document } from "mongoose";
import {INFT} from './nft.dto';

const nftSchema: Schema = new Schema<INFT>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  attributes: { type: Schema.Types.Mixed, required: true },
  media: { type: mongoose.Schema.Types.ObjectId, ref: 'Media', required: true }, 
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  
}, { timestamps: true });

const NFT = mongoose.model<INFT>("NFT", nftSchema);

export default NFT;
