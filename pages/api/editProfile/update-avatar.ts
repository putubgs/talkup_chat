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
        // Update the user's avatar in the database
        const user = await User.findByIdAndUpdate(
          req.body.userId, // use the ID to find the user
          { avatar: req.body.newAvatar }, // set the new avatar
          { new: true, runValidators: true } // options
        );

        if (!user) {
          return res.status(400).json({ success: false });
        }

        res.status(200).json({ success: true, data: user });
      } catch (error) {
        const mongoError = error as MongooseError;
  
        if (mongoError instanceof mongoose.Error.ValidationError) {
          // Extracting the first error message from the validation error
          const firstErrorKey = Object.keys(mongoError.errors)[0];
          const msg = mongoError.errors[firstErrorKey].message;
          return res.status(409).json({ error: msg });
        }
  
        // If it's not a validation error, just return the error message
        return res.status(500).json({ error: mongoError.message });
      }
      break;

    default:
      res.setHeader('Allow', ['PUT']);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}