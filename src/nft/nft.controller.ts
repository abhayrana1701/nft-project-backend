import { Request, Response } from 'express';
import { createNFTMetadata, getPaginatedNFTs } from './nft.service';
import mongoose from 'mongoose';

/**
 * Controller function to handle the creation of an NFT.
 * It receives the NFT details, including media file, and creates a new NFT record.
 * 
 * @param {Request} req - The request object containing the new NFT details.
 * @param {Response} res - The response object used to send the response.
 * 
 * @returns {Promise<Response>} A JSON response containing the created NFT details.
 */
export const createNFTController = async (req: Request, res: Response) => {
  try {
    const { name, description, attributes } = req.body;
    const ownerId = req.user?._id; 
    const mediaFile = req.file;  

    if (!mediaFile) {
      return res.status(400).json({ message: 'No media file uploaded.' });
    }

    const ownerObjectId = new mongoose.Types.ObjectId(ownerId);

    const nft = await createNFTMetadata(name, description, attributes, mediaFile, ownerObjectId);

    res.status(201).json({
      message: 'NFT created successfully',
      nft: nft,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating NFT' });
  }
};

/**
 * Controller function to retrieve a paginated list of NFTs.
 * 
 * @param {Request} req - The request object containing pagination parameters.
 * @param {Response} res - The response object used to send the response.
 * 
 * @returns {Promise<Response>} A JSON response containing the paginated list of NFTs.
 */
export const getNFTs = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const result = await getPaginatedNFTs({ page, limit });
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching NFTs.' });
  }
};
