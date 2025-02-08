import mongoose from "mongoose";

const storySchema = new mongoose.Schema({
  title: { type: String, required: true },
  city: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to User
  createdAt: { type: Date, default: Date.now },
});

const Story = mongoose.model("Story", storySchema);

export default Story;
