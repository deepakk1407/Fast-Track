(() => {
  const form = document.getElementById('chatForm');
  const input = document.getElementById('messageInput');
  const messagesEl = document.getElementById('chatMessages');
  const sendButton = document.getElementById('sendButton');
  const charCount = document.getElementById('charCount');
  const status = document.getElementById('connectionStatus');
  const suggestions = document.getElementById('suggestions');
  const historyKey = 'fastTrackCareerChat_v1';
  let conversation = [];

  function escapeHtml(value) { return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  function renderText(text) {
    // Deliberately render plain text only; do not allow model output to inject HTML.
    return escapeHtml(text).replace(/\n/g, '<br>');
  }
  function addMessage(role, text, save = true) {
    const row = document.createElement('div');
    row.className = `message-row ${role === 'user' ? 'user-row' : 'bot-row'}`;
    row.innerHTML = `${role === 'assistant' ? '<div class="mini-avatar">✦</div>' : ''}<div class="bubble-wrap"><div class="sender">${role === 'user' ? 'YOU' : 'FAST-TRACK AI'} <span>· now</span></div><div class="bubble">${renderText(text)}</div></div>`;
    messagesEl.appendChild(row);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    if (save) {
      conversation.push({ role, content: text });
      conversation = conversation.slice(-24);
      try { localStorage.setItem(historyKey, JSON.stringify(conversation)); } catch (_) {}
    }
    return row;
  }
  function showTyping() {
    const row = document.createElement('div'); row.className = 'message-row bot-row'; row.id = 'typingRow';
    row.innerHTML = '<div class="mini-avatar">✦</div><div class="bubble-wrap"><div class="sender">FAST-TRACK AI <span>· thinking</span></div><div class="bubble"><div class="typing"><span></span><span></span><span></span></div></div></div>';
    messagesEl.appendChild(row); messagesEl.scrollTop = messagesEl.scrollHeight;
  }
  function removeTyping() { document.getElementById('typingRow')?.remove(); }
  function localGuidance(prompt) {
    const q = prompt.toLowerCase();
    if (/resume|cv|curriculum/.test(q)) return 'I can help strengthen your resume. Start with these steps:\n1. Keep your summary specific to the role you want.\n2. Describe projects using the problem, your actions, and the result.\n3. List skills you can honestly demonstrate.\n4. Check dates, spelling, links, and formatting before exporting.\n\nIf you tell me your target role and paste a non-sensitive resume section, I can suggest a clearer version.';
    if (/interview|mock interview|question/.test(q)) return 'Let’s practise! 🎤\n\nQuestion 1: Tell me about a project you worked on, what your role was, and one challenge you solved.\n\nReply with your answer and I’ll give constructive feedback. Avoid sharing confidential company information.';
    if (/skill|learn|gap|data analyst|developer|career/.test(q)) return 'Let’s turn your goal into a plan.\n\n1. Pick one target role (for example, Data Analyst or Frontend Developer).\n2. Compare your current skills with requirements from real job posts.\n3. Choose one missing skill to practise through a small project.\n4. Add the project and evidence of your work to your resume.\n\nTell me your target role, current skills, and whether you’re a fresher or experienced, and I’ll tailor the next steps.';
    if (/job|role|fresher|apply|opening/.test(q)) return 'I can help you narrow down roles. For a useful recommendation, tell me your current skills, education or experience level, preferred location, and the kind of work you enjoy. You can also open the Jobs page to search current listings. I won’t invent job openings or claim a role is available unless the live job data is connected.';
    if (/application|status|applied|shortlist/.test(q)) return 'To check an application status, open the Applications or Progress area in FAST-TRACK (if available in your account). This chat is not yet connected to your private application records, so I can’t reliably look up live statuses here.';
    return 'I’m your FAST-TRACK career assistant. I can help with job-search planning, skill development, resume wording, and interview practice. To get started, tell me your target role, current skills, and experience level.\n\nNote: live job listings and your private profile/application data are not connected to this chat yet.';
  }
  async function getReply(userText) {
    const recent = conversation.filter(m => ['user','assistant'].includes(m.role)).slice(-12).map(m => ({role:m.role, content:m.content}));
    try {
      const response = await fetch('/api/chat', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({message:userText, history:recent}) });
      if (response.ok) {
        const data = await response.json();
        if (data && typeof data.reply === 'string' && data.reply.trim()) { status.textContent = 'AI service connected'; return data.reply.trim(); }
      }
      if (response.status === 429) return 'You’ve sent messages a little too quickly. Please wait a moment and try again.';
      if (response.status === 503 || response.status === 500) status.textContent = 'Guidance mode · AI setup needed';
    } catch (_) { /* Local guidance keeps the interface useful when the API is not configured. */ }
    status.textContent = 'Guidance mode · AI setup needed';
    return localGuidance(userText);
  }
  async function send(text) {
    const clean = text.trim(); if (!clean || sendButton.disabled) return;
    addMessage('user', clean); input.value = ''; updateCount(); suggestions.hidden = true;
    sendButton.disabled = true; showTyping();
    try { const reply = await getReply(clean); removeTyping(); addMessage('assistant', reply); }
    catch (_) { removeTyping(); addMessage('assistant', 'Sorry, I couldn’t process that just now. Please try again.'); }
    finally { sendButton.disabled = false; input.focus(); }
  }
  function updateCount() { charCount.textContent = `${input.value.length} / 2000`; input.style.height = 'auto'; input.style.height = Math.min(input.scrollHeight, 130) + 'px'; }
  form.addEventListener('submit', e => { e.preventDefault(); send(input.value); });
  input.addEventListener('input', updateCount);
  input.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); form.requestSubmit(); } });
  suggestions.addEventListener('click', e => { const btn = e.target.closest('[data-prompt]'); if (btn) send(btn.dataset.prompt); });
  document.getElementById('clearChat').addEventListener('click', () => {
    conversation = []; try { localStorage.removeItem(historyKey); } catch (_) {}
    messagesEl.innerHTML = ''; suggestions.hidden = false;
    addMessage('assistant', 'New conversation started! 👋 What career goal can I help you with today?', false);
  });
  try {
    const saved = JSON.parse(localStorage.getItem(historyKey) || '[]');
    if (Array.isArray(saved) && saved.length) { conversation = saved.filter(m => m && ['user','assistant'].includes(m.role) && typeof m.content === 'string').slice(-24); messagesEl.innerHTML = ''; conversation.forEach(m => addMessage(m.role, m.content, false)); suggestions.hidden = true; }
  } catch (_) {}
  fetch('/api/chat', {method:'GET'}).then(r => { status.textContent = r.ok ? 'AI service ready' : 'Guidance mode · AI setup needed'; }).catch(() => { status.textContent = 'Guidance mode · AI setup needed'; });
  updateCount();
})();
