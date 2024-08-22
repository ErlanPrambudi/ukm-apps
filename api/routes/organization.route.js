import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { create, deleteorganization, getorganizations, getorganizationsbyUserId, updateorganization, updateuserorganization } from "../controllers/organization.controller.js";

const router = express.Router();

router.post('/create', verifyToken, create);
router.get('/getorganizations', getorganizations);
router.get('/getorganizations-by-id', getorganizationsbyUserId);
router.delete('/deleteorganization/:organizationId/:userId', verifyToken, deleteorganization);
router.put('/updateorganization/:organizationId/:userId', verifyToken, updateorganization);
router.put('/updateorganization/:organizationId/:userId', verifyToken, updateuserorganization);

export default router;