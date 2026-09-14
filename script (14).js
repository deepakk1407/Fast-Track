document.addEventListener("DOMContentLoaded", function () {

    const loginTab = document.getElementById("loginTab");
    const registerTab = document.getElementById("registerTab");

    const loginBox = document.getElementById("loginBox");
    const registerBox = document.getElementById("registerBox");

    // LOGIN TAB
    loginTab.addEventListener("click", function () {

        loginTab.classList.add("active");
        registerTab.classList.remove("active");

        loginBox.classList.add("active");
        registerBox.classList.remove("active");

    });

    // REGISTER TAB
    registerTab.addEventListener("click", function () {

        registerTab.classList.add("active");
        loginTab.classList.remove("active");

        registerBox.classList.add("active");
        loginBox.classList.remove("active");

    });

});
