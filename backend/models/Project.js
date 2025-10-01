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
    appName: {
      type: String,
    },
    entities: [
      {
        type: String,
      },
    ],
    roles: [
      {
        type: String,
      },
    ],
    features: [
      {
        type: String,
      },
    ],
    uiMockup: {
      type: String,
    },
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);

export default Project;
