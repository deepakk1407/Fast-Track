/* =====================================================
   FAST-TRACK JAVASCRIPT
   Neocities Compatible
===================================================== */


/* ================= GET ELEMENTS ================= */

const loginTab =
    document.getElementById("loginTab");

const registerTab =
    document.getElementById("registerTab");

const loginBox =
    document.getElementById("loginBox");

const registerBox =
    document.getElementById("registerBox");


/* ================= SWITCH FORMS ================= */

function showLogin(){

    loginBox.classList.add("active");

    registerBox.classList.remove("active");

    loginTab.classList.add("active");

    registerTab.classList.remove("active");

}


function showRegister(){

    registerBox.classList.add("active");

    loginBox.classList.remove("active");

    registerTab.classList.add("active");

    loginTab.classList.remove("active");

}


/* ================= TAB BUTTONS ================= */

loginTab.addEventListener(
    "click",
    showLogin
);


registerTab.addEventListener(
    "click",
    showRegister
);


/* ================= BOTTOM LINKS ================= */

document
    .getElementById("goRegister")
    .addEventListener(
        "click",
        showRegister
    );


document
    .getElementById("goLogin")
    .addEventListener(
        "click",
        showLogin
    );



/* =====================================================
   PASSWORD SHOW / HIDE
===================================================== */

function passwordToggle(
    inputId,
    eyeId
){

    const input =
        document.getElementById(inputId);

    const eye =
        document.getElementById(eyeId);


    if(input.type === "password"){

        input.type = "text";

        eye.textContent = "🙈";

    }
    else{

        input.type = "password";

        eye.textContent = "👁";

    }

}


/* LOGIN PASSWORD */

document
    .getElementById("loginEye")
    .addEventListener(
        "click",
        function(){

            passwordToggle(
                "loginPassword",
                "loginEye"
            );

        }
    );


/* REGISTER PASSWORD */

document
    .getElementById("registerEye")
    .addEventListener(
        "click",
        function(){

            passwordToggle(
                "registerPassword",
                "registerEye"
            );

        }
    );


/* CONFIRM PASSWORD */

document
    .getElementById("confirmEye")
    .addEventListener(
        "click",
        function(){

            passwordToggle(
                "confirmPassword",
                "confirmEye"
            );

        }
    );



/* =====================================================
   PASSWORD STRENGTH
===================================================== */

document
    .getElementById("registerPassword")
    .addEventListener(
        "input",
        function(){

            const password =
                this.value;

            const bar =
                document.getElementById(
                    "strengthBar"
                );

            const text =
                document.getElementById(
                    "strengthText"
                );


            let strength = 0;


            if(password.length >= 6){
                strength++;
            }


            if(/[A-Z]/.test(password)){
                strength++;
            }


            if(/[0-9]/.test(password)){
                strength++;
            }


            if(/[^A-Za-z0-9]/.test(password)){
                strength++;
            }


            if(password.length === 0){

                bar.style.width = "0%";

                text.textContent =
                    "Password strength";

            }

            else if(strength === 1){

                bar.style.width = "25%";

                text.textContent =
                    "Weak password";

            }

            else if(strength === 2){

                bar.style.width = "50%";

                text.textContent =
                    "Medium password";

            }

            else if(strength === 3){

                bar.style.width = "75%";

                text.textContent =
                    "Strong password";

            }

            else{

                bar.style.width = "100%";

                text.textContent =
                    "Very strong password";

            }

        }
    );



/* =====================================================
   REGISTER
===================================================== */

document
    .getElementById("registerForm")
    .addEventListener(
        "submit",
        function(event){

            event.preventDefault();


            const name =
                document
                    .getElementById(
                        "registerName"
                    )
                    .value
                    .trim();


            const email =
                document
                    .getElementById(
                        "registerEmail"
                    )
                    .value
                    .trim()
                    .toLowerCase();


            const role =
                document.querySelector(
                    'input[name="role"]:checked'
                );


            const password =
                document
                    .getElementById(
                        "registerPassword"
                    )
                    .value;


            const confirmPassword =
                document
                    .getElementById(
                        "confirmPassword"
                    )
                    .value;



            /* Password Length */

            if(password.length < 6){

                showToast(
                    "Password must contain at least 6 characters."
                );

                return;

            }


            /* Password Match */

            if(password !== confirmPassword){

                showToast(
                    "Passwords do not match ❌"
                );

                return;

            }


            /* Get Existing Users */

            let users = [];

            try{

                users =
                    JSON.parse(
                        localStorage.getItem(
                            "fastTrackUsers"
                        )
                    ) || [];

            }
            catch(error){

                users = [];

            }


            /* Check Existing Email */

            const existingUser =
                users.find(
                    function(user){

                        return user.email === email;

                    }
                );


            if(existingUser){

                showToast(
                    "This email is already registered."
                );

                return;

            }


            /* Create User */

            const newUser = {

                name:name,

                email:email,

                role:role.value,

                password:password

            };


            /* Save */

            users.push(newUser);


            localStorage.setItem(
                "fastTrackUsers",
                JSON.stringify(users)
            );


            /* Success */

            showToast(
                "Account created successfully 🚀"
            );


            /* Clear */

            document
                .getElementById(
                    "registerForm"
                )
                .reset();


            document
                .getElementById(
                    "strengthBar"
                )
                .style.width = "0%";


            document
                .getElementById(
                    "strengthText"
                )
                .textContent =
                    "Password strength";


            /* Go Login */

            setTimeout(
                function(){

                    document
                        .getElementById(
                            "loginEmail"
                        )
                        .value = email;


                    showLogin();

                },
                1200
            );

        }
    );



/* =====================================================
   LOGIN
===================================================== */

document
    .getElementById("loginForm")
    .addEventListener(
        "submit",
        function(event){

            event.preventDefault();


            const email =
                document
                    .getElementById(
                        "loginEmail"
                    )
                    .value
                    .trim()
                    .toLowerCase();


            const password =
                document
                    .getElementById(
                        "loginPassword"
                    )
                    .value;


            let users = [];

            try{

                users =
                    JSON.parse(
                        localStorage.getItem(
                            "fastTrackUsers"
                        )
                    ) || [];

            }
            catch(error){

                users = [];

            }


            const user =
                users.find(
                    function(item){

                        return (
                            item.email === email &&
                            item.password === password
                        );

                    }
                );


            if(user){

                showToast(
                    "Login successful! Welcome "
                    + user.name
                    + " 🚀"
                );

            }
            else{

                showToast(
                    "Invalid email or password ❌"
                );

            }

        }
    );



/* =====================================================
   GOOGLE BUTTON
===================================================== */

function googleLogin(){

    showToast(
        "Google Sign-In integration coming soon 🔵"
    );

}


document
    .getElementById("loginGoogle")
    .addEventListener(
        "click",
        googleLogin
    );


document
    .getElementById("registerGoogle")
    .addEventListener(
        "click",
        googleLogin
    );



/* =====================================================
   FORGOT PASSWORD
===================================================== */

const forgotModal =
    document.getElementById(
        "forgotModal"
    );


document
    .getElementById("forgotButton")
    .addEventListener(
        "click",
        function(){

            forgotModal.classList.add(
                "show"
            );


            document
                .getElementById(
                    "resetEmail"
                )
                .focus();

        }
    );


/* CANCEL */

document
    .getElementById("cancelForgot")
    .addEventListener(
        "click",
        function(){

            forgotModal.classList.remove(
                "show"
            );

        }
    );


/* Outside click */

forgotModal.addEventListener(
    "click",
    function(event){

        if(event.target === forgotModal){

            forgotModal.classList.remove(
                "show"
            );

        }

    }
);


/* Reset Form */

document
    .getElementById("resetForm")
    .addEventListener(
        "submit",
        function(event){

            event.preventDefault();


            const email =
                document
                    .getElementById(
                        "resetEmail"
                    )
                    .value
                    .trim()
                    .toLowerCase();


            let users = [];

            try{

                users =
                    JSON.parse(
                        localStorage.getItem(
                            "fastTrackUsers"
                        )
                    ) || [];

            }
            catch(error){

                users = [];

            }


            const user =
                users.find(
                    function(item){

                        return item.email === email;

                    }
                );


            if(!user){

                showToast(
                    "Email address is not registered."
                );

                return;

            }


            forgotModal.classList.remove(
                "show"
            );


            showToast(
                "Password reset link sent 📧"
            );

        }
    );



/* =====================================================
   TOAST
===================================================== */

let toastTimer;


function showToast(message){

    const toast =
        document.getElementById(
            "toast"
        );


    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(
            function(){

                toast.classList.remove(
                    "show"
                );

            },
            3000
        );

}



/* =====================================================
   ESC KEY
===================================================== */

document.addEventListener(
    "keydown",
    function(event){

        if(event.key === "Escape"){

            forgotModal.classList.remove(
                "show"
            );

        }

    }
);


/* =====================================================
   LOGO FALLBACK
===================================================== */

const logoImage =
    document.getElementById(
        "logoImage"
    );

const logoText =
    document.getElementById(
        "logoText"
    );


logoText.style.display = "none";


logoImage.addEventListener(
    "error",
    function(){

        logoImage.style.display =
            "none";

        logoText.style.display =
            "block";

    }
);

