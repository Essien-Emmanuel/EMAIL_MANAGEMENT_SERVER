const { Schema, model } = require("mongoose");

const DraftSchema = new Schema(
  {
    title: String,
    content: String,
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

exports.DraftModel = model("Draft", DraftSchema);
