import Media from '../media/media.schema';
import NFT from '../nft/nft.schema';
import { Types } from 'mongoose';

/**
 * Creates a new NFT metadata by saving its details in the database.
 * 
 * @param {string} name - The name of the NFT.
 * @param {string} description - The description of the NFT.
 * @param {object} attributes - The attributes of the NFT, such as rarity, color, etc.
 * @param {Express.Multer.File} mediaFile - The media file (image/video) associated with the NFT.
 * @param {Types.ObjectId} ownerId - The ObjectId of the owner of the NFT.
 * 
 * @returns {Promise<NFT>} The newly created NFT document.
 */
export const createNFTMetadata = async (name: string, description: string, attributes: object, mediaFile: Express.Multer.File, ownerId: Types.ObjectId) => {
 
  const fileUrl = mediaFile.path;  
  const filetype = mediaFile.mimetype;  
  const filename = mediaFile.filename;  

  const media = new Media({
    filename,
    filetype,
    fileUrl,
  });

  await media.save(); 

  const nft = new NFT({
    name,
    description,
    attributes,
    media: media._id,
    owner: ownerId,
  });

  await nft.save(); 

  return nft; 
};

/**
 * Retrieves a paginated list of NFTs with their associated media.
 * 
 * @param {Object} paginateOptions - Pagination options containing `page` and `limit`.
 * @param {number} paginateOptions.page - The current page number.
 * @param {number} paginateOptions.limit - The number of NFTs per page.
 * 
 * @returns {Promise<Object>} An object containing the following:
 *   - `nfts`: The list of NFTs for the current page.
 *   - `totalCount`: The total count of NFTs in the database.
 *   - `currentPage`: The current page number.
 *   - `totalPages`: The total number of pages available.
 */
interface PaginateOptions {
  page: number;
  limit: number;
}

export const getPaginatedNFTs = async ({ page, limit }: PaginateOptions) => {
  try {
    const skip = (page - 1) * limit;

    const totalCount = await NFT.countDocuments();

    const nfts = await NFT.find()
      .skip(skip)
      .limit(limit)
      .populate('media') 
      .exec();

    return {
      nfts,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
    };
  } catch (error) {
    throw new Error('Error fetching NFTs ');
  }
};
