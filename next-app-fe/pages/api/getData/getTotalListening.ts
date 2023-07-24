import { NextApiRequest, NextApiResponse } from "next";
import { connectMongoDB } from "@/lib/MongoConnect";
import Card from "@/models/card";
import { MongooseError } from "mongoose";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { listenerId } = req.query;

  try {
    await connectMongoDB();
  } catch (err) {
    const mongoError = err as MongooseError;
    return res.status(500).json({ error: mongoError.message });
  }

  if (req.method === "GET") {
    try {
      const listeningCount = await Card.countDocuments({ listenerId });

      res.status(200).json({ listeningCount });
    } catch (error) {
      const mongoError = error as MongooseError;
      return res.status(500).json({ error: mongoError.message });
    }
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
