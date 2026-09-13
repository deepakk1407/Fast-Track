alert("FAST-TRACK JS WORKING");

const loginTab = document.getElementById("loginTab");
const registerTab = document.getElementById("registerTab");

const loginBox = document.getElementById("loginBox");
const registerBox = document.getElementById("registerBox");

registerTab.addEventListener("click", () => {
    loginBox.style.display = "none";
    registerBox.style.display = "block";
});

loginTab.addEventListener("click", () => {
    registerBox.style.display = "none";
    loginBox.style.display = "block";
});
