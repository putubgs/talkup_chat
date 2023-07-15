import { NextApiRequest, NextApiResponse } from 'next';
import { connectMongoDB } from '@/lib/MongoConnect';
import Card from "@/models/card";
import mongoose, { MongooseError } from "mongoose";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  
  await connectMongoDB();

  switch (method) {
    case 'GET':
      try {
        const stories = await Card.find({});

        res.status(200).json({ success: true, data: stories });
      } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
      }
      break;

    case 'DELETE':
      try {
        console.log(res.status(200).json({success: true, data: req.query.id}))
        const story = await Card.findByIdAndDelete(req.query.id);

        if (!story) {
          return res.status(404).json({ success: false, message: 'Story not found' });
        }

        res.status(200).json({ success: true, data: {}, message: 'Story deleted successfully' });
      } catch (error) {
        console.log(res.status(200).json({success: true, data: req.query.id}))
        const mongoError = error as MongooseError;
  
        if (mongoError instanceof mongoose.Error.CastError) {
          return res.status(400).json({ success: false, error: 'Invalid story id' });
        }

        return res.status(500).json({ success: false, error: mongoError.message });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
