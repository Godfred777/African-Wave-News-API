import { getArticles } from "../controllers/articleControllers.mjs";
import { getArticleInFrench, getArticleInEnglish, getArticleInGerman, getArticleInSpanish } from "../controllers/articleControllers.mjs";
import { Router } from "express";

export const articleRouter = Router();

articleRouter.get('/api/v1/articles', getArticles);
articleRouter.get('/api/v1/articles/french', getArticleInFrench);
articleRouter.get('/api/v1/articles/german', getArticleInGerman);
articleRouter.get('/api/v1/articles/spanish', getArticleInSpanish);
articleRouter.get('/api/v1/articles/english', getArticleInEnglish);