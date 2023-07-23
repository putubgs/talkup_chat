import { connectMongoDB } from "@/lib/MongoConnect";
import Card from "@/models/card";
import { NextApiRequest, NextApiResponse } from "next";
import mongoose, { MongooseError } from "mongoose";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await connectMongoDB();
  } catch (err) {
    const mongoError = err as MongooseError;
    return res.status(500).json({ error: mongoError.message });
  }

  if (req.method === "POST") {
    if (!req.body) return res.status(400).json({ error: "Data is missing" });

    const {
        storyType,
        story,
        category,
        schedules,
        algorithm,
        duration,
        userId,
        activation
    } = req.body;

    try {
      const duplicatedStory = await Card.findOne({ userId, activation: true });
      if (duplicatedStory && activation == true) {
        return res
          .status(409)
          .json({ error: "You can't post more than one story" });
      }

      const userDoc = await Card.create({
        storyType,
        story,
        category,
        schedules,
        algorithm,
        duration,
        userId,
        activation
      });

      const user = userDoc.toObject();

      return res.status(201).json({
        success: true,
        user,
      });
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
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
};

export default handler;
