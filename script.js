console.log("FAST-TRACK JS LOADED");

const registerForm = document.getElementById("registerForm");
const registerButton = document.getElementById("registerButton");

const toast = document.getElementById("toast");

function showToast(message, type = "success") {
    if (!toast) {
        console.log(message);
        return;
    }

    toast.textContent = message;

    toast.style.background =
        type === "error"
            ? "#dc2626"
            : "#111827";

    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 4000);
}


/* CHECK REGISTER ELEMENTS */

console.log("Register Form:", registerForm);
console.log("Register Button:", registerButton);


/* REGISTER BUTTON */

if (registerButton) {

    registerButton.addEventListener("click", function () {

        console.log("REGISTER BUTTON CLICKED");

        showToast("REGISTER BUTTON WORKING");

    });

} else {

    console.log("REGISTER BUTTON NOT FOUND");

}


/* REGISTER FORM */

if (registerForm) {

    registerForm.addEventListener("submit", function (event) {

        event.preventDefault();

        console.log("REGISTER FORM SUBMITTED");

        showToast("REGISTER FORM WORKING");

    });

} else {

    console.log("REGISTER FORM NOT FOUND");

}
