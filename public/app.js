const phoneInput = document.getElementById("phoneNumber");
const submitButton = document.getElementById("submitButton");
const formIssue = document.getElementById("formIssue");
const successAlert = document.getElementById("success");
const error = document.getElementById("danger");
const warning = document.getElementById("warning");

phoneInput.addEventListener("input", function (e) {
  let value = this.value.replace(/\D/g, "");
  let formattedValue = "";

  if (value.length > 0) {
    formattedValue = "+7 (" + value.substring(1, 4);
  }
  if (value.length >= 4) {
    formattedValue += ") " + value.substring(4, 7);
  }
  if (value.length >= 7) {
    formattedValue += "-" + value.substring(7, 9);
  }
  if (value.length >= 9) {
    formattedValue += "-" + value.substring(9, 11);
  }

  this.value = formattedValue;
});

submitButton.addEventListener("click", (e) => {
  e.preventDefault();

  if (!!formIssue[0].value && !!formIssue[1].value && !!formIssue[2].value) {
    submitButton.setAttribute("disabled", true);
    try {
      postIssue().then(() => {
        successAlert.style.visibility = "visible";
        warning.style.visibility = "hidden";
        formIssue.reset();
        setTimeout(() => {
          successAlert.style.visibility = "hidden";
          submitButton.removeAttribute("disabled");
        }, 2000);
      });
    } catch (err) {
      error.style.visibility = "visible";
      console.error(err);
    }
  } else {
    warning.style.visibility = "visible";
  }
});

async function postIssue() {
  await fetch(`/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify({
      userName: formIssue[0].value,
      phoneNumber: formIssue[1].value,
      issueText: formIssue[2].value,
    }),
  });
}
