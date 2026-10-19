# FAST-TRACK delivery notes

## Included in this ZIP
- The latest project files supplied for this delivery.
- Login persistence fix in `script.js`: the **Remember me** checkbox selects Firebase local persistence; unchecked login uses session persistence. This applies to email/password and Google login.
- Existing AI chatbot and AI resume endpoint files and setup notes.

## Before public production use
This project still includes prototype workflows that use browser `localStorage` for applications, recruiter listings, notifications, interviews and moderation. These are not shared multi-user database records and are not a substitute for server-side authorization. Recruiter/admin demo views are not production-secured. Follow `PROJECT-SETUP.md` before using real candidate data.

## Validation
The ZIP contents and login code patch were checked locally. A live Firebase sign-in, cross-browser persistence, deployed Vercel behavior, full recruiter/candidate end-to-end flow, and PDF output were not tested from this environment.


## Role routing update
- Registration now saves the selected Job Seeker / Recruiter role for that Firebase UID in this browser and login routes to the corresponding workspace.
- Candidate dashboard redirects recruiter/admin roles to their workspace and hides privileged navigation links for other roles.
- Recruiter and Admin pages require a signed-in session and the saved role preference for front-end routing.
- **Security limitation:** role preferences stored in localStorage are only a prototype routing aid and can be changed by a user. Before production, store roles in a trusted backend and enforce access with Firebase custom claims and Firestore/Storage rules. Existing accounts without a saved role default to Job Seeker.
- Profile page JavaScript remains local browser storage based; shared multi-device profile persistence and production recruiter data still require backend integration.
