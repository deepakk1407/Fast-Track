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
    collection,
    addDoc,
    serverTimestamp
} from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


const firebaseConfig = {
    apiKey: "AIzaSyDJ84_tSgau334V60r17bqHHubaf5Lecto",
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


let currentUser = null;


/* ================= AUTH ================= */

onAuthStateChanged(auth, (user) => {

    if (!user) {

        window.location.href = "index.html";

        return;
    }

    currentUser = user;

    const topUserName =
        document.getElementById("topUserName");

    const profileAvatar =
        document.getElementById("profileAvatar");

    const name =
        user.displayName || "User";

    topUserName.textContent = name;

    profileAvatar.textContent =
        name.charAt(0).toUpperCase();

});


/* ================= MOBILE MENU ================= */

const menuBtn =
    document.getElementById("menuBtn");

const sidebar =
    document.getElementById("sidebar");

const overlay =
    document.getElementById("overlay");


function closeMenu(){

    sidebar.classList.remove("open");

    overlay.classList.remove("show");

}


menuBtn.addEventListener("click", () => {

    sidebar.classList.toggle("open");

    overlay.classList.toggle("show");

});


overlay.addEventListener("click", closeMenu);


document.querySelectorAll(".nav-item").forEach(item => {

    item.addEventListener("click", () => {

        closeMenu();

    });

});


/* ================= LOGOUT ================= */

const logoutBtn =
    document.getElementById("logoutBtn");


logoutBtn.addEventListener("click", async () => {

    try {

        await signOut(auth);

        window.location.href = "index.html";

    } catch(error){

        console.error(error);

        alert("Logout failed. Please try again.");

    }

});


/* ================= SEARCH ================= */

const searchInput =
    document.getElementById("skillSearch");

const skillCards =
    document.querySelectorAll("#skillsGrid .skill-card");

const noResult =
    document.getElementById("noResult");


searchInput.addEventListener("input", function(){

    const search =
        this.value.toLowerCase().trim();

    let visibleCount = 0;


    skillCards.forEach(card => {

        const skill =
            card.dataset.skill.toLowerCase();

        if(skill.includes(search)){

            card.style.display = "block";

            visibleCount++;

        }else{

            card.style.display = "none";

        }

    });


    noResult.style.display =
        visibleCount === 0 ? "block" : "none";

});


/* ================= ADD SKILL ================= */

const addSkillBtn =
    document.getElementById("addSkillBtn");


addSkillBtn.addEventListener("click", async () => {

    if(!currentUser){

        alert("Please login first.");

        return;

    }


    const skillName =
        prompt("Enter your skill name:");


    if(!skillName || !skillName.trim()){

        return;

    }


    const level =
        prompt(
            "Enter level:\nBeginner / Intermediate / Advanced"
        );


    if(!level || !level.trim()){

        return;

    }


    const progress =
        prompt("Enter progress percentage (0-100):");


    const progressNumber =
        Number(progress);


    if(
        isNaN(progressNumber) ||
        progressNumber < 0 ||
        progressNumber > 100
    ){

        alert("Enter a valid percentage between 0 and 100.");

        return;

    }


    try{

        await addDoc(

            collection(
                db,
                "users",
                currentUser.uid,
                "skills"
            ),

            {
                name: skillName.trim(),
                level: level.trim(),
                progress: progressNumber,
                createdAt: serverTimestamp()
            }

        );


        alert("✅ Skill saved successfully!");

    }
    catch(error){

        console.error(error);

        alert(
            "❌ Unable to save skill. Check Firebase Rules."
        );

    }

});
