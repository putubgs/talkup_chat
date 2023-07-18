import { Schema, model, models } from "mongoose";

const feedbackSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    }
  },
  {
    timestamps: true,
  }
);

const Feedback = models.Feedback || model("Feedback", feedbackSchema);

export default Feedback;
