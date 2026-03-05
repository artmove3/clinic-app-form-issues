const mongoose = require("mongoose");

const FormIssueSchema = mongoose.Schema({
  issueData: {
    type: Date,
  },
  userName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  issueText: {
    type: String,
    required: true,
  },
});

const FormIssue = mongoose.model("FormIssue", FormIssueSchema);

module.exports = FormIssue;
