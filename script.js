document.addEventListener("DOMContentLoaded", function () {

    /* =========================
       GET ELEMENTS
    ========================= */

    const loginTab = document.getElementById("loginTab");
    const registerTab = document.getElementById("registerTab");

    const loginBox = document.getElementById("loginBox");
    const registerBox = document.getElementById("registerBox");

    const goRegister = document.getElementById("goRegister");
    const goLogin = document.getElementById("goLogin");

    const registerButton =
        document.getElementById("registerButton");


    /* =========================
       TAB SWITCH FUNCTION
    ========================= */

    function showLogin() {

        loginTab.classList.add("active");
        registerTab.classList.remove("active");

        loginBox.classList.add("active");
        registerBox.classList.remove("active");
    }


    function showRegister() {

        registerTab.classList.add("active");
        loginTab.classList.remove("active");

        registerBox.classList.add("active");
        loginBox.classList.remove("active");
    }


    /* =========================
       TAB BUTTONS
    ========================= */

    loginTab.addEventListener("click", function () {
        showLogin();
    });


    registerTab.addEventListener("click", function () {
        showRegister();
    });


    /* =========================
       SWITCH TEXT BUTTONS
    ========================= */

    goRegister.addEventListener("click", function () {
        showRegister();
    });


    goLogin.addEventListener("click", function () {
        showLogin();
    });


    /* =========================
       REGISTER BUTTON TEST
    ========================= */

    registerButton.addEventListener("click", function (event) {

        event.preventDefault();

        alert("🔥 CREATE ACCOUNT CLICKED 🔥");

    });


});
