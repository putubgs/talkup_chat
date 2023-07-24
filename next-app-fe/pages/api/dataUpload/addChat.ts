import { connectMongoDB } from "@/lib/MongoConnect";
import Chat from "@/models/chat";
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

    const { cardId, members, schedule } = req.body;

    try {
        const chatDoc = await Chat.create({
            cardId,
            members,
            schedule,
        });

        const chat = chatDoc.toObject();

        return res.status(201).json({
            success: true,
            chat
        });
    } catch (error) {
      const mongoError = error as MongooseError;

      if (mongoError instanceof mongoose.Error.ValidationError) {
        const firstErrorKey = Object.keys(mongoError.errors)[0];
        const msg = mongoError.errors[firstErrorKey].message;
        return res.status(409).json({ error: msg });
      }

      return res.status(500).json({ error: mongoError.message });
    }
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
};

export default handler;
