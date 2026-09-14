document.addEventListener("DOMContentLoaded", function () {

    const registerButton = document.getElementById("registerButton");

    if (!registerButton) {
        alert("BUTTON NOT FOUND ❌");
        return;
    }

    alert("BUTTON FOUND ✅");

    registerButton.onclick = function (event) {

        event.preventDefault();

        alert("🔥 CREATE ACCOUNT CLICKED 🔥");

    };

});
