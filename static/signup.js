const signupBtn = document.getElementById("signup-btn");

// Remove error message on username input.
const usernameInput = document.getElementById("username");
if (usernameInput) {
  usernameInput.addEventListener("input", () => {
    const errorMessage = document.getElementById("error-message");
    if (errorMessage) {
      errorMessage.textContent = "";
      signupBtn.disabled = false;
    }
  });
}

// Validate password match.
const passwordInput = document.getElementById("password");
const confirmInput = document.getElementById("confirm-password");
const passMsg = document.getElementById("password-match-message");

function checkPasswordMatch() {
  if (passwordInput.value === "" && confirmInput.value === "") {
    passMsg.textContent = "";
    signupBtn.disabled = false;
    return;
  }
  if (passwordInput.value !== confirmInput.value) {
    passMsg.textContent = "Passwords do not match!";
    passMsg.style.color = "red";
    signupBtn.disabled = true;
  } else {
    passMsg.textContent = "";
    signupBtn.disabled = false;
  }
}

passwordInput.addEventListener("input", checkPasswordMatch);
confirmInput.addEventListener("input", checkPasswordMatch);

// Update error and success messages dynamically
function updateErrorMessage(message) {
  const errorMessage = document.getElementById("error-message");
  if (errorMessage) {
    errorMessage.textContent = message;
    errorMessage.style.color = "red";
  }
}

function updateSuccessMessage(message) {
  const successMessage = document.getElementById("success-message");
  successMessage.textContent = message;
  successMessage.style.color = "green";
}

// Handle signup form submission via fetch.
const signupForm = document.getElementById("signup-form");
if (signupForm) {
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(signupForm);
    fetch(signupForm.action, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.text())
      .then((html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const newErrorMessage = doc.getElementById("error-message");
        const newSuccessMessage = doc.getElementById("success-message");
        if (newErrorMessage && newErrorMessage.textContent) {
          updateErrorMessage(newErrorMessage.textContent);
        } else if (newSuccessMessage && newSuccessMessage.textContent) {
          updateSuccessMessage(newSuccessMessage.textContent);
          setTimeout(() => {
            window.location.href = loginUrl;
          }, 2000);
        }
      });
  });
}
