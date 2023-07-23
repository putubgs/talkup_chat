import type { NextApiRequest, NextApiResponse } from 'next';
import { connectMongoDB } from '@/lib/MongoConnect';
import User from '@/models/user';
import mongoose, { MongooseError } from "mongoose";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  
  await connectMongoDB();

  switch (method) {
    case 'PUT':
      try {
        const user = await User.findByIdAndUpdate(
          req.body.userId,
          { avatar: req.body.newAvatar },
          { new: true, runValidators: true }
        );

        if (!user) {
          return res.status(400).json({ success: false });
        }

        res.status(200).json({ success: true, data: user });
      } catch (error) {
        const mongoError = error as MongooseError;
  
        if (mongoError instanceof mongoose.Error.ValidationError) {
          const firstErrorKey = Object.keys(mongoError.errors)[0];
          const msg = mongoError.errors[firstErrorKey].message;
          return res.status(409).json({ error: msg });
        }
  
        return res.status(500).json({ error: mongoError.message });
      }
      break;

    default:
      res.setHeader('Allow', ['PUT']);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}