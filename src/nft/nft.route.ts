import express, { Router } from 'express';
import { createNFTController, getNFTs } from './nft.controller';
import upload from '../common/services/multerConfig';
import { authenticate } from '../common/middleware/auth.middleware';
import { applyRateLimiter } from '../common/middleware/rate.limiter.middleware';
import * as nftValidator from "./nft.validation";

const router = Router();

type RouteHandler = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => Promise<any> | any;

const asyncHandler = (fn: RouteHandler) => (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
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
router.post('/create', applyRateLimiter, nftValidator.createNFT, asyncHandler(authenticate), upload.single('media'), asyncHandler(createNFTController));

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
router.get('/nfts', applyRateLimiter, getNFTs);

export default router;
