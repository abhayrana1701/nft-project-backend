"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const nft_controller_1 = require("./nft.controller");
const multerConfig_1 = __importDefault(require("../common/services/multerConfig"));
const auth_middleware_1 = require("../common/middleware/auth.middleware");
const rate_limiter_middleware_1 = require("../common/middleware/rate.limiter.middleware");
const nftValidator = __importStar(require("./nft.validation"));
const router = (0, express_1.Router)();
const asyncHandler = (fn) => (req, res, next) => {
    return Promise.resolve(fn(req, res, next)).catch(next);
};
/**
 * @swagger
 * /nfts/create:
 *   post:
 *     summary: Create a new NFT
 *     description: This endpoint allows you to create a new NFT with its metadata and associated media file.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "CryptoPunk #1234"
 *               description:
 *                 type: string
 *                 example: "A rare CryptoPunk NFT"
 *               attributes:
 *                 type: object
 *                 example: {"rarity": "Legendary", "color": "green"}
 *               media:
 *                 type: string
 *                 format: binary
 *                 description: The media file (image/video) associated with the NFT.
 *     responses:
 *       201:
 *         description: NFT created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "NFT created successfully"
 *                 nft:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "CryptoPunk #1234"
 *                     description:
 *                       type: string
 *                       example: "A rare CryptoPunk NFT"
 *                     attributes:
 *                       type: object
 *                       example: {"rarity": "Legendary", "color": "green"}
 *                     media:
 *                       type: object
 *                       properties:
 *                         filename:
 *                           type: string
 *                           example: "image1234.png"
 *                         filetype:
 *                           type: string
 *                           example: "image/png"
 *                         fileUrl:
 *                           type: string
 *                           example: "/uploads/media/image1234.png"
 *                     owner:
 *                       type: string
 *                       example: "5f4d3b2a1c1d4a5b6c7d8e9f"
 *       400:
 *         description: Missing or invalid input data
 *       500:
 *         description: Internal server error
 */
router.post('/create', rate_limiter_middleware_1.applyRateLimiter, nftValidator.createNFT, asyncHandler(auth_middleware_1.authenticate), multerConfig_1.default.single('media'), asyncHandler(nft_controller_1.createNFTController));
/**
 * @swagger
 * /nfts/nfts:
 *   get:
 *     summary: Get a paginated list of NFTs
 *     description: This endpoint retrieves a paginated list of NFTs with their media and other details.
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: A paginated list of NFTs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 nfts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: "CryptoPunk #1234"
 *                       description:
 *                         type: string
 *                         example: "A rare CryptoPunk NFT"
 *                       attributes:
 *                         type: object
 *                         example: {"rarity": "Legendary", "color": "green"}
 *                       media:
 *                         type: object
 *                         properties:
 *                           filename:
 *                             type: string
 *                             example: "image1234.png"
 *                           filetype:
 *                             type: string
 *                             example: "image/png"
 *                           fileUrl:
 *                             type: string
 *                             example: "/uploads/media/image1234.png"
 *                       owner:
 *                         type: string
 *                         example: "5f4d3b2a1c1d4a5b6c7d8e9f"
 *                 totalCount:
 *                   type: integer
 *                   example: 100
 *                 currentPage:
 *                   type: integer
 *                   example: 1
 *                 totalPages:
 *                   type: integer
 *                   example: 10
 *       500:
 *         description: Error fetching NFTs
 */
router.get('/nfts', rate_limiter_middleware_1.applyRateLimiter, nft_controller_1.getNFTs);
exports.default = router;
