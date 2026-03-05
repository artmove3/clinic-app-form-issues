const FormIssue = require("./models/FormIssue");

async function addIssue(userName, phoneNumber, issueText) {
  FormIssue.create({
    issueData: new Date(),
    userName,
    phoneNumber,
    issueText,
  });
}

async function getIssues() {
  return FormIssue.find();
}

module.exports = { addIssue, getIssues };
