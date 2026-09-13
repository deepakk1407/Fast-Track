alert("FAST-TRACK JS WORKING");

const loginTab = document.getElementById("loginTab");
const registerTab = document.getElementById("registerTab");

const loginBox = document.getElementById("loginBox");
const registerBox = document.getElementById("registerBox");

registerTab.addEventListener("click", () => {

    // Change white selection
    loginTab.classList.remove("active");
    registerTab.classList.add("active");

    // Change form
    loginBox.classList.remove("active");
    registerBox.classList.add("active");

});

loginTab.addEventListener("click", () => {

    // Change white selection
    registerTab.classList.remove("active");
    loginTab.classList.add("active");

    // Change form
    registerBox.classList.remove("active");
    loginBox.classList.add("active");

});
