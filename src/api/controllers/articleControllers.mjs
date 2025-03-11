import { getAllArticles } from "../../services/articleServices.mjs";

export const getArticles =  async (req, res) => {
    try {
        const articles = await getAllArticles();
        res.status(200).send(articles);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}