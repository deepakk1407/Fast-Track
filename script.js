const registerButton = document.getElementById("registerButton");

console.log("Register Button:", registerButton);

if (registerButton) {
    registerButton.addEventListener("click", function () {
        alert("REGISTER BUTTON CLICKED 🔥");
    });
} else {
    alert("REGISTER BUTTON NOT FOUND ❌");
}
