import { initializeApp } from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged,
    signOut
} from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    getFirestore,
    doc,
    getDoc
} from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


/* ================= FIREBASE ================= */

const firebaseConfig = {
    apiKey: "AIzaSyDJ84_tSgau334V60r17bqHHubaf5Lecta",
    authDomain: "fast-track-6d262.firebaseapp.com",
    projectId: "fast-track-6d262",
    storageBucket: "fast-track-6d262.firebasestorage.app",
    messagingSenderId: "338934873510",
    appId: "1:338934873510:web:16b3211577dd2ce683a367",
    measurementId: "G-9TFBXV2PQM"
};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);


/* ================= HTML ELEMENTS ================= */

const topName =
    document.getElementById("topName");

const avatar =
    document.getElementById("avatar");

const logoutBtn =
    document.getElementById("logoutBtn");

const roleSelect =
    document.getElementById("roleSelect");

const readinessCircle =
    document.getElementById("readinessCircle");

const totalSkills =
    document.getElementById("totalSkills");

const missingSkills =
    document.getElementById("missingSkills");

const strongSkills =
    document.getElementById("strongSkills");

const coursesCount =
    document.getElementById("coursesCount");

const skillsList =
    document.getElementById("skillsList");


/* ================= AUTH ================= */

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href = "index.html";

        return;
    }


    try {

        let name = user.displayName || "User";


        /* Get Firestore profile */

        const userRef =
            doc(db, "users", user.uid);

        const userDoc =
            await getDoc(userRef);


        if (userDoc.exists()) {

            const data =
                userDoc.data();

            name =
                data.name ||
                user.displayName ||
                "User";
        }


        /* Display username */

        if (topName) {

            topName.textContent = name;
        }


        /* Display avatar */

        if (avatar) {

            avatar.textContent =
                name.charAt(0).toUpperCase();
        }


        /* Load skills */

        loadSkills();

    }
    catch (error) {

        console.error(
            "Error loading profile:",
            error
        );

    }

});


/* ================= LOAD SKILLS ================= */

function loadSkills() {

    const skillRows =
        skillsList
            ? skillsList.querySelectorAll(".skill-row")
            : [];


    const skillCount =
        skillRows.length;


    /* Total skills */

    if (totalSkills) {

        totalSkills.textContent =
            skillCount;
    }


    /* Calculate strong skills */

    let strongCount = 0;


    skillRows.forEach(row => {

        const level =
            row.querySelector(".skill-level");


        if (!level) return;


        const levelText =
            level.textContent
                .trim()
                .toLowerCase();


        if (
            levelText === "advanced" ||
            levelText === "excellent" ||
            levelText === "expert"
        ) {

            strongCount++;

        }

    });


    if (strongSkills) {

        strongSkills.textContent =
            strongCount;
    }


    /* Default missing skills */

    if (missingSkills) {

        missingSkills.textContent =
            "0";
    }


    /* Recommended learning */

    if (coursesCount) {

        coursesCount.textContent =
            "3";
    }


    /* Readiness */

    let readiness = 0;


    if (skillCount > 0) {

        readiness =
            Math.round(
                (strongCount / skillCount) * 100
            );

    }


    if (readinessCircle) {

        readinessCircle.textContent =
            readiness + "%";
    }


    /* Update circle */

    const circle =
        document.querySelector(
            ".readiness-circle"
        );


    if (circle) {

        const degree =
            readiness * 3.6;


        circle.style.background =
            `conic-gradient(
                #60a5fa ${degree}deg,
                rgba(255,255,255,.15) ${degree}deg
            )`;

    }

}


/* ================= ROLE CHANGE ================= */

if (roleSelect) {

    roleSelect.addEventListener(
        "change",
        () => {

            console.log(
                "Selected role:",
                roleSelect.value
            );

        }
    );

}


/* ================= LOGOUT ================= */

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        async () => {

            try {

                await signOut(auth);

                window.location.href =
                    "index.html";

            }
            catch (error) {

                console.error(
                    "Logout error:",
                    error
                );

                showToast(
                    "Logout failed. Please try again."
                );

            }

        }
    );

}


/* ================= NOTIFICATION ================= */

const notifyBtn =
    document.getElementById("notifyBtn");


if (notifyBtn) {

    notifyBtn.addEventListener(
        "click",
        () => {

            showToast(
                "No new notifications."
            );

        }
    );

}


/* ================= TOAST ================= */

function showToast(message) {

    let toast =
        document.querySelector(".toast");


    if (!toast) {

        toast =
            document.createElement("div");

        toast.className =
            "toast";

        document.body.appendChild(toast);
    }


    toast.textContent =
        message;


    toast.classList.add("show");


    setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);

}
