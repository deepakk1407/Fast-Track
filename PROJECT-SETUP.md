# FAST-TRACK — expanded prototype

## Included
- Existing candidate pages: dashboard, jobs, skills, courses, resume, progress, profile and certificates.
- AI Career Assistant (`chatbot.html`) with `/api/chat` server endpoint.
- AI Resume Coach (`resume-ai.html`) with `/api/resume` server endpoint.
- Application tracker (`applications.html`) with status updates.
- Interview planner (`interviews.html`).
- Notifications inbox (`notifications.html`).
- Recruiter workspace (`recruiter.html`) for demo job posting and sample candidate pipeline.
- Admin moderation console (`admin.html`) with a demo job review queue.

## Run/deploy
1. Extract this project and import the folder/repository into Vercel.
2. In Vercel project Settings → Environment Variables, set `OPENAI_API_KEY` to your secret API key. Optionally set `OPENAI_MODEL` (default: `gpt-4o-mini`). Never place the key in browser JavaScript or commit it to Git.
3. Redeploy after changing environment variables.
4. Test `/api/chat` and submit a sample resume through `resume-ai.html`.
5. Existing static pages can be opened locally; API-powered AI features require a serverless deployment and configured key.

## Important limitations — do before real public launch
This delivery expands the UI and provides working browser-local prototypes, not a complete multi-user production backend. Application/interview/notification/recruiter/admin demo data is stored in `localStorage` and is not shared across devices or users. Recruiter and admin screens are not access-controlled; **do not use them for real candidate data** yet. The AI endpoints currently do not verify Firebase ID tokens or implement robust per-user/IP rate limits. Add Firebase Admin token verification, role claims, Firestore security rules, server-side validation, rate limiting/quotas, abuse monitoring, privacy/retention controls, and audit logs before exposing privileged actions publicly. UI navigation or hiding pages is not security.

## Recommended integration sequence
1. Verify Firebase Authentication tokens in serverless endpoints and establish roles (`candidate`, `recruiter`, `admin`) server-side.
2. Define Firestore collections and rules for users, companies, jobs, applications, interviews, notifications and audit logs.
3. Connect job applications and status transitions to Firestore; scope recruiter access to their own verified company/jobs.
4. Connect AI matching/skill-gap suggestions to only the signed-in user's authorized profile and job data, with transparent explanations and user control.
5. Add email/push notifications, interview calendar links, company verification workflow, reporting/appeals, tests and monitoring.

AI feedback is advisory. Validate its output, don't fabricate resume details, and don't make hiring decisions solely from AI scores.
