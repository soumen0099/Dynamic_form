import express from "express";
import {
    createFormData,
    updateFormData,
    getAllFormData,
    deleteFormData,
} from "../controllers/dynamicData.controller.js";

import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

router.post("/", upload.fields([
    { name: 'courseImage', maxCount: 1 },
    { name: 'studentPhoto', maxCount: 1 },
    { name: 'signature', maxCount: 1 },
    { name: 'documents', maxCount: 1 },
    { name: 'branchDocument1', maxCount: 1 },
    { name: 'branchDocument2', maxCount: 1 },
    { name: 'examPaper', maxCount: 1 }
]), createFormData);

router.put("/:id", upload.any(), updateFormData); // also fix this

router.get("/type/:formType", getAllFormData);

router.delete("/:id", deleteFormData);

export default router;
