import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    prompt: {
      type: String,
      required: true,
    },
    appName: String,
    entities: [String],
    roles: [String],
    features: [String],
    uiMockup: String,
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);

export default Project;
