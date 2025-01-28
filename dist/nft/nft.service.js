"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaginatedNFTs = exports.createNFTMetadata = void 0;
const media_schema_1 = __importDefault(require("../media/media.schema"));
const nft_schema_1 = __importDefault(require("../nft/nft.schema"));
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
const createNFTMetadata = (name, description, attributes, mediaFile, ownerId) => __awaiter(void 0, void 0, void 0, function* () {
    const fileUrl = mediaFile.path;
    const filetype = mediaFile.mimetype;
    const filename = mediaFile.filename;
    const media = new media_schema_1.default({
        filename,
        filetype,
        fileUrl,
    });
    yield media.save();
    const nft = new nft_schema_1.default({
        name,
        description,
        attributes,
        media: media._id,
        owner: ownerId,
    });
    yield nft.save();
    return nft;
});
exports.createNFTMetadata = createNFTMetadata;
const getPaginatedNFTs = (_a) => __awaiter(void 0, [_a], void 0, function* ({ page, limit }) {
    try {
        const skip = (page - 1) * limit;
        const totalCount = yield nft_schema_1.default.countDocuments();
        const nfts = yield nft_schema_1.default.find()
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
    }
    catch (error) {
        throw new Error('Error fetching NFTs ');
    }
});
exports.getPaginatedNFTs = getPaginatedNFTs;
