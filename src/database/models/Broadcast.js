const { Schema, model } = require("mongoose");

const BroadCastSchema = new Schema(
  {
    email: String,
    subject: String,
    providerConfig: [
      {
        type: Schema.Types.ObjectId,
        ref: "ProviderConfig",
        required: true,
      },
    ],
    subscribers: [
      {
        type: Schema.Types.ObjectId,
        ref: "Subscriber",
      },
    ],
    total_subscribers: Number,
    publish_status: { type: Boolean, default: false },
    publish_date: Date,
    scheduled_time: Date,
    copy_count: { type: Number, default: 0 },
    isDuplicate: { type: Boolean, default: false },
    originalBroadcastId: {
      type: String,
      default: null,
    },
    opens: Number,
    clicks: Number,
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

exports.BroadcastModel = model("Broadcast", BroadCastSchema);
