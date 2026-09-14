document.addEventListener("DOMContentLoaded", function () {

    const registerButton = document.getElementById("registerButton");

    alert(
        registerButton
            ? "REGISTER BUTTON FOUND ✅"
            : "REGISTER BUTTON NOT FOUND ❌"
    );

    if (registerButton) {

        registerButton.addEventListener("click", function () {

            alert("REGISTER BUTTON CLICKED 🔥");

        });

    }

});
