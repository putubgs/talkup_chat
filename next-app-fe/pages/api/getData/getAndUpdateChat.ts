import { NextApiRequest, NextApiResponse } from "next";
import { connectMongoDB } from "@/lib/MongoConnect";
import Chat from "@/models/chat";
import mongoose, { MongooseError } from "mongoose";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  await connectMongoDB();

  switch (method) {
    case "GET":
      try {
        const chats = await Chat.find({});

        res.status(200).json({ success: true, data: chats });
      } catch (error) {
        res.status(500).json({ success: false, error: "Server Error" });
      }
      break;

    case "PUT":
      try {
        const chat = await Chat.findByIdAndUpdate(
          req.body.members.usersId,
          { activation: req.body.activation },
          { new: true, runValidators: true }
        );

        if (!chat) {
          return res.status(400).json({ success: false });
        }

        res.status(200).json({ success: true, data: chat });
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
      res.setHeader("Allow", ["GET", "PUT"]);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
