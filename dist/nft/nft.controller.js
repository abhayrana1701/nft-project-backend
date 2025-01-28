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
exports.getNFTs = exports.createNFTController = void 0;
const nft_service_1 = require("./nft.service");
const mongoose_1 = __importDefault(require("mongoose"));
/**
 * Controller function to handle the creation of an NFT.
 * It receives the NFT details, including media file, and creates a new NFT record.
 *
 * @param {Request} req - The request object containing the new NFT details.
 * @param {Response} res - The response object used to send the response.
 *
 * @returns {Promise<Response>} A JSON response containing the created NFT details.
 */
const createNFTController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { name, description, attributes } = req.body;
        const ownerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const mediaFile = req.file;
        if (!mediaFile) {
            return res.status(400).json({ message: 'No media file uploaded.' });
        }
        const ownerObjectId = new mongoose_1.default.Types.ObjectId(ownerId);
        const nft = yield (0, nft_service_1.createNFTMetadata)(name, description, attributes, mediaFile, ownerObjectId);
        res.status(201).json({
            message: 'NFT created successfully',
            nft: nft,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating NFT' });
    }
});
exports.createNFTController = createNFTController;
/**
 * Controller function to retrieve a paginated list of NFTs.
 *
 * @param {Request} req - The request object containing pagination parameters.
 * @param {Response} res - The response object used to send the response.
 *
 * @returns {Promise<Response>} A JSON response containing the paginated list of NFTs.
 */
const getNFTs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const result = yield (0, nft_service_1.getPaginatedNFTs)({ page, limit });
        res.json(result);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching NFTs.' });
    }
});
exports.getNFTs = getNFTs;
