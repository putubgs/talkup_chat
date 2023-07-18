import { Schema, model, models } from "mongoose";

const notificationSchema = new Schema(
  {
    cardId: {
      type: Schema.Types.ObjectId,
      ref: "Card",
      required: true,
      unique: true 
    },
    requesterId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    schedule: {
      type: new Schema({
        date: { type: String, required: true },
        time: { type: String, required: true },
      }),
      default: null,
    },
    approval: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Notification =
  models.Notification || model("Notification", notificationSchema);

export default Notification;
