import {
  getAllArticles,
  tranlateArticleInFrench,
  tranlateArticleInGerman,
  tranlateArticleInSpanish,
  tranlateArticleInEnglish,
} from "../../services/articleServices.mjs";

export const getArticles = async (req, res) => {
  try {
    const articles = await getAllArticles();
    res.status(200).send(articles);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

export const getArticleInFrench = async (req, res) => {
  try {
    const articles = await tranlateArticleInFrench();
    res.status(200).send(articles);
  } catch (error) {
    console.error(error);
  }
};

export const getArticleInGerman = async (req, res) => {
  try {
    const articles = await tranlateArticleInGerman();
    res.status(200).send(articles);
  } catch (error) {
    console.error(error);
  }
};

export const getArticleInSpanish = async (req, res) => {
  try {
    const articles = await tranlateArticleInSpanish();
    res.status(200).send(articles);
  } catch (error) {
    console.error(error);
  }
};

export const getArticleInEnglish = async (req, res) => {
  try {
    const articles = await tranlateArticleInEnglish();
    res.status(200).send(articles);
  } catch (error) {
    console.error(error);
  }
};
