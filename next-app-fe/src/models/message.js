import { Schema, model, models } from "mongoose";

const msgSchema = new Schema(
  {
    chatId: {
        type: Schema.Types.ObjectId,
        ref: "Chat",
        required: true,
    },
    senderId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    content: {
        type: String,
        required: true
    }
  },
  {
    timestamps: true,
  }
);

const Message = models.Message || model("Message", msgSchema);

export default Message;
