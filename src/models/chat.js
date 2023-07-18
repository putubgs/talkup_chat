import { Schema, model, models } from "mongoose";

const chatSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    listenerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userConnect: {
        type: Boolean,
        required: true
    },
    listenerConnect: {
        type: Boolean,
        required: true
    },
    chatActivation: {
        type: Boolean,
        required: true
    }
  },
  {
    timestamps: true,
  }
);

const Chat = models.Chat || model("Chat", chatSchema);

export default Chat;
