import { Schema, model, models } from "mongoose";

const memberSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true },
  activation: { type: Boolean, required: true },
});

const chatSchema = new Schema(
  {
    members: [memberSchema],
    schedule: {
      type: new Schema({
        date: { type: String, required: true },
        time: { type: String, required: true },
      }),
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Chat = models.Chat || model("Chat", chatSchema);

export default Chat;
