import express from "express";
import userRoutes from "./user/user.route";
import nftRoutes from "./nft/nft.route";

const router = express.Router();

router.use("/users", userRoutes);
router.use("/nft", nftRoutes);

export default router;