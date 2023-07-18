import { NextApiRequest, NextApiResponse } from "next";
import { connectMongoDB } from "@/lib/MongoConnect";
import Notification from "@/models/notification";
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
        const notifications = await Notification.find({});

        res.status(200).json({ success: true, data: notifications });
      } catch (error) {
        res.status(500).json({ success: false, error: "Server Error" });
      }
      break;

    case "DELETE":
      try {
        console.log(
          res.status(200).json({ success: true, data: req.query.id })
        );
        const notification = await Notification.findByIdAndDelete(req.query.id);

        if (!notification) {
          return res
            .status(404)
            .json({ success: false, message: "Notification not found" });
        }

        res
          .status(200)
          .json({
            success: true,
            data: {},
            message: "Notification deleted successfully",
          });
      } catch (error) {
        console.log(
          res.status(200).json({ success: true, data: req.query.id })
        );
        const mongoError = error as MongooseError;

        if (mongoError instanceof mongoose.Error.CastError) {
          return res
            .status(400)
            .json({ success: false, error: "Invalid notification id" });
        }

        return res
          .status(500)
          .json({ success: false, error: mongoError.message });
      }
      break;

    case "PUT":
      try {
        const notification = await Notification.findByIdAndUpdate(
          req.body.id,
          { approval: req.body.newApproval },
          { new: true, runValidators: true }
        );

        if (!notification) {
          return res.status(400).json({ success: false });
        }

        res.status(200).json({ success: true, data: notification });
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
      res.setHeader("Allow", ["GET", "DELETE", "PUT"]);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
