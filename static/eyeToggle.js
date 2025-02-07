// Toggle eye icon for password fields.
const pwShowHide = document.querySelectorAll(".eye-icon");
pwShowHide.forEach((eyeIcon) => {
  eyeIcon.addEventListener("click", () => {
    const pwFields =
      eyeIcon.parentElement.parentElement.querySelectorAll(".password");
    pwFields.forEach((password) => {
      if (password.type === "password") {
        password.type = "text";
        eyeIcon.classList.replace("bx-hide", "bx-show");
      } else {
        password.type = "password";
        eyeIcon.classList.replace("bx-show", "bx-hide");
      }
    });
  });
});
