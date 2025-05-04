import express from "express";
import   {fetchandSaveQuote,rateQuote,getQuoteOfTheDay,getQuotesByAuthor}    from "../Controller/quoteController";
const router=express.Router();

router.post("/quote",fetchandSaveQuote);
router.patch("/quote/rate",rateQuote)
router.get("/qotd",getQuoteOfTheDay)
router.get('/', getQuotesByAuthor);

export default router;