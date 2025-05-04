import mongoose from 'mongoose';

export interface IQuote extends Document {
    quote: string;
    author: string;
    ratings: number[]; // Explicitly define ratings as an array of numbers
    createdAt: Date;
    isQuoteOfTheDay: boolean;
    quoteOfTheDayDate: Date | null; // Allow null for quoteOfTheDayDate
  }

const quoteSchema= new mongoose.Schema({
    quote:{type:String ,required:true,unique:true},
    author:{type:String, required:true},
    ratings: { type: [Number], default: [] },
    createdAt:{type:Date,default:Date.now},
    isQuoteOfTheDay: { type: Boolean, default: false },
    quoteOfTheDayDate: { type: Date },
})

export const Quote= mongoose.model<IQuote>('Quote',quoteSchema);

