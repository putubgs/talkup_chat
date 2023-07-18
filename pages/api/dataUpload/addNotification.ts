import { connectMongoDB } from "@/lib/MongoConnect";
import Notification from "@/models/notification";
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

    const { cardId, requesterId, schedule } = req.body;

    try {
      const existingNotification = await Notification.findOne({ cardId });
      if (existingNotification) {
        return res.status(400).json({ error: "cardId already exists" });
      }

      const notificationDoc = await Notification.create({
        cardId,
        requesterId,
        schedule,
      });

      const notification = notificationDoc.toObject();

      return res.status(201).json({
        success: true,
        notification,
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
