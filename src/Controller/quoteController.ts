import axios from "axios";
import { Request, Response } from "express";
import { Quote } from "../model/quoteModel";

export const fetchandSaveQuote = async (req: Request, res: Response):Promise<void> => {
    try{
        const response=await axios.get("https://zenquotes.io/api/random");
        const content=response.data[0].q
        const author=response.data[0].a

        const existingQuote=await Quote.findOne({quote:content});

        if(existingQuote){
            res.status(400).json({message:"Quote already exists"});
            return;
        }

        const newQuote=new Quote({
            quote:content,
            author:author,
            ratings: [],
        })

        await newQuote.save();
        res.status(201).json({message:"Quote saved successfully", quote:newQuote});
    }catch(error){
        console.error("Error fetching quote:", error);
        res.status(500).json({message:"Internal server error"});}

    }

export const rateQuote = async (req: Request, res: Response):Promise<void> => {
        try {
          const { quoteId, rating } = req.body;
      
          // 1. Validate input
          if (!quoteId || typeof rating !== 'number') {
            res.status(400).json({ message: 'quoteId and rating are required.' });
            return 
          }
      
          if (rating < 1 || rating > 5) {
            res.status(400).json({ message: 'Rating must be between 1 and 5.' });
            return 
          }
      
          // 2. Find the quote
          const quote = await Quote.findById(quoteId);
          if (!quote) {
            res.status(404).json({ message: 'Quote not found.' });
            return
          }
      
          // 3. Push the rating
          quote.ratings.push(rating);
      
          // 4. Save the updated quote
          await quote.save();
      
          res.status(200).json({
            message: 'Rating added successfully',
            quote,
          });
        } catch (err) {
          console.error(err);
          res.status(500).json({ message: 'Server error' });
        }
      };
export const getQuoteOfTheDay = async (req: Request, res: Response):Promise<void> => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // normalize
      
        // Check if today's quote already exists
        let quote = await Quote.findOne({
          isQuoteOfTheDay: true,
          quoteOfTheDayDate: today,
        });
      
        if (!quote) {
          const count = await Quote.countDocuments();
          const random = Math.floor(Math.random() * count);
          quote = await Quote.findOne().skip(random);
      
          if (!quote) {
            res.status(404).json({ message: 'No quotes available.' });
            return 
          }
      
          // Remove any old quote-of-the-day flags
          await Quote.updateMany(
            { isQuoteOfTheDay: true },
            { $set: { isQuoteOfTheDay: false, quoteOfTheDayDate: null } }
          );
      
          quote.isQuoteOfTheDay = true;
          quote.quoteOfTheDayDate = today;
          await quote.save();
        }
      
        res.status(200).json({ quote });
};

export const getQuotesByAuthor = async (req: Request, res: Response):Promise<void> => {
    const author = req.query.author as string;
  
    if (!author) {
      res.status(400).json({ message: 'Author is required' });
      return 
    }
  
    const quotes = await Quote.find({ author: new RegExp(author, 'i') });
  
    if (quotes.length === 0) {
      res.status(404).json({ message: 'No quotes found for this author' });
      return 
    }
  
    res.status(200).json({ results: quotes.length, quotes });
  };