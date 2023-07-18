import { Schema, model, models } from "mongoose";

const notificationSchema = new Schema(
  {
    cardId: {
      type: Schema.Types.ObjectId,
      ref: "Card",
      required: true,
    },
    requesterId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
