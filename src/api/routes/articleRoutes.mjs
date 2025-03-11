import { getArticles } from "../controllers/articleControllers.mjs";
import { Router } from "express";

export const articleRouter = Router();

articleRouter.get('/api/v1/articles', getArticles);