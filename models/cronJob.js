const mongoose = require("mongoose");
const schedulesHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      trim: true,
    },
    apiURL: {
      type: String,
      trim: true,
    },
    method: {
      type: String,
      trim: true,
    },
    body: {
      type: String,
      trim: true,
    },
    header: {
      type: String,
      trim: true,
    },
    time: {
      type: String,
      trim: true,
    },
    statusCode: [{
      type: Number,
      trim: true,
    }],
    email: {
      type: String,
      trim: true,
    },
    isScheduled: {
      type: Boolean,
      default: true,
    },
    isResolved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
module.exports = new mongoose.model("schedulesHistory", schedulesHistorySchema);
