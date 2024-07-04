const { Schema, model } = require("mongoose");

const SequenceSchema = new Schema(
  {
    title: String,
    subject: String,
    email: String,
    subscribers: [
      {
        type: Schema.Types.ObjectId,
        ref: "Subscriber",
      },
    ],
    scheduled_at: Date,
    publish_status: { type: Boolean, default: false },
    publish_at: Date,
    opens: Number,
    clicks: Number,
  },
  { timestamps: true }
);

exports.SequenceModel = model("Sequence", SequenceSchema);
