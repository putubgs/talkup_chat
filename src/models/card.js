import { Schema, model, models } from "mongoose";

const cardSchema = new Schema(
  {
    storyType: {
      type: String,
      required: true,
    },
    story: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    schedules: {
      type: Array,
    },
    algorithm: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    listenerId: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    activation: {
        type: Boolean,
        required: true
    }
  },
  {
    timestamps: true,
  }
);

const Card = models.Card || model("Card", cardSchema);

export default Card;
