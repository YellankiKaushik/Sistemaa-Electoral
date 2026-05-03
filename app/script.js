const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const chatMessages = document.getElementById('chatMessages');
const persistentSuggestions = document.getElementById('persistentSuggestions');
const progressIndicator = document.getElementById('progressIndicator');
const restartButton = document.getElementById('restartButton');
const scrollToBottomBtn = document.getElementById('scrollToBottomBtn');

let currentStep = 1;
let isProcessing = false;
let currentLanguage = localStorage.getItem('user_language') || 'en';

const landingSelector = document.getElementById('languageSelectorLanding');
const chatSelector = document.getElementById('languageSelector');

if (landingSelector && localStorage.getItem('user_language')) {
  landingSelector.value = currentLanguage;
} else if (landingSelector) {
  currentLanguage = landingSelector.value;
}
if (chatSelector) chatSelector.value = currentLanguage;

document.addEventListener('change', (e) => {
  if (e.target.id === 'languageSelectorLanding' || e.target.id === 'languageSelector') {
    currentLanguage = e.target.value;
    localStorage.setItem('user_language', currentLanguage);
    if (landingSelector) landingSelector.value = currentLanguage;
    if (chatSelector) chatSelector.value = currentLanguage;
  }
});

/** Send without clearing persistent suggestion rail */
async function handleSendMessage(overrideText = null) {
  if (isProcessing === true) return;

  const text = String(overrideText != null ? overrideText : messageInput.value).trim();
  if (document.getElementById('typing-indicator')) return;

  addMessage(text || '...', 'user');
  if (overrideText == null) {
    messageInput.value = '';
  }

  // Loading Indicator UX
  addMessage('<div class="spinner"></div><span>Processing...</span>', 'bot', true);
  chatMessages.lastElementChild.id = 'typing-indicator';
  messageInput.placeholder = "Processing...";

  try {
    isProcessing = true;
    messageInput.disabled = true;

    const response = await fetch('/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: text,
        user_profile: {
          level: 'beginner',
          type: 'first_time',
          mode: 'guided',
          confusionLevel: typeof window.__lastConfusionLevel === 'number' ? window.__lastConfusionLevel : 0,
          confusionVariant: typeof window.__lastConfusionVariant === 'number' ? window.__lastConfusionVariant : 0,
          lastConfusionExplanation: window.__lastConfusionExplanation || '',
          last_message: window.__lastMessage || ''
        },
        current_step: currentStep,
        user_language: currentLanguage
      })
    });

    if (!response.ok) throw new Error('Network response was not ok');

    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) typingIndicator.remove();

    const data = await response.json();
    syncClientState(data);
    window.__lastMessage = text;

    const formattedResponse = formatBotResponse(data);
    addMessage(formattedResponse, 'bot', true);

    updatePersistentSuggestions(data);
    updateProgressIndicator(currentStep);

    chatMessages.scrollTop = chatMessages.scrollHeight;

    isProcessing = false;
    messageInput.disabled = false;
    messageInput.placeholder = "Type your message...";
  } catch (error) {
    isProcessing = false;
    messageInput.disabled = false;
    messageInput.placeholder = "Type your message...";

    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) typingIndicator.remove();
    console.error('Error:', error);
    addMessage('Sorry, something went wrong. Please try again.', 'bot');
    updatePersistentSuggestions({ intent: 'error', mode: 'guided' });
  }
}

function syncClientState(data) {
  window.__lastConfusionLevel =
    typeof data.confusionLevel === 'number' ? data.confusionLevel : 0;
  window.__lastConfusionVariant =
    typeof data.confusionVariant === 'number' ? data.confusionVariant : 0;
  window.__lastConfusionExplanation =
    typeof data.lastConfusionExplanation === 'string'
      ? data.lastConfusionExplanation
      : '';

  if (Number.isFinite(Number(data.current_step))) {
    currentStep = Number(data.current_step);
  } else if (Number.isFinite(Number(data.next_step))) {
    currentStep = Number(data.next_step);
  }
}

function updateProgressIndicator(step) {
  if (progressIndicator) {
    progressIndicator.textContent = `Step ${step} of 5`;
  }
}

function inferSuggestionContext(data) {
  if (data && data._starter) return 'starter';
  if (data && (data.is_complete === true ||
    (typeof data.title === 'string' && data.title.includes("You've Completed")))) {
    return 'completion';
  }
  if (
    data &&
    (data.intent === 'unknown' ||
      String(data.title || '').includes('AI Assistant Response') ||
      String(data.title || '').includes('Temporary Issue'))
  ) {
    return 'ai';
  }
  if (data && data.intent === 'help') return 'ai';
  if (data && data.mode === 'guided') return 'guided';
  return 'guided';
}

function clearRailClickFlash(btn) {
  btn.classList.remove('suggestion-btn--flash');
}

function flashButton(btn) {
  btn.classList.remove('suggestion-btn--flash');
  void btn.offsetWidth;
  btn.classList.add('suggestion-btn--flash');
}

function attachPersistentButton(rail, { label, onClick }) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'suggestion-btn suggestion-btn-persistent';
  btn.textContent = label;
  btn.addEventListener('click', async (ev) => {
    ev.preventDefault();
    if (isProcessing) return;
    flashButton(btn);
    setTimeout(() => clearRailClickFlash(btn), 280);
    await onClick(btn);
  });
  rail.appendChild(btn);
}

function focusInputPlaceholder(placeholder) {
  messageInput.placeholder = placeholder;
  messageInput.focus();
  messageInput.classList.add('input-nudge');
  setTimeout(() => messageInput.classList.remove('input-nudge'), 400);
}

/**
 * Refresh one persistent suggestion rail — never removes the rail itself.
 */
function updatePersistentSuggestions(data) {
  if (!persistentSuggestions) return;

  persistentSuggestions.hidden = false;
  persistentSuggestions.innerHTML = '';

  const ctx = inferSuggestionContext(data);
  const rail = persistentSuggestions;

  if (ctx === 'completion') {
    attachPersistentButton(rail, {
      label: '👉 Restart Guide',
      onClick: async () => {
        currentStep = 1;
        await handleSendMessage('election basics');
      }
    });
    attachPersistentButton(rail, {
      label: 'Ask question',
      onClick: async () => {
        focusInputPlaceholder(
          'Ask anything about voting or elections…'
        );
      }
    });
    return;
  }

  if (ctx === 'ai') {
    attachPersistentButton(rail, {
      label: 'Continue guide',
      onClick: async () => await handleSendMessage('next')
    });
    attachPersistentButton(rail, {
      label: 'Ask another question',
      onClick: async () => {
        focusInputPlaceholder(
          'Ask another election-related question…'
        );
      }
    });
    return;
  }

  if (ctx === 'guided') {
    attachPersistentButton(rail, {
      label: '👉 Next',
      onClick: async () => await handleSendMessage('next')
    });
    attachPersistentButton(rail, {
      label: 'Ask another topic',
      onClick: async () => {
        focusInputPlaceholder(
          'Try: timeline, process, importance, registration…'
        );
      }
    });
    return;
  }

  if (ctx === 'starter') {
    const starters = [
      'What is election?',
      'Explain election timeline',
      'Why are elections conducted?'
    ];
    starters.forEach((line) =>
      attachPersistentButton(rail, {
        label: line,
        onClick: async () => await handleSendMessage(line)
      })
    );
  }
}

function addMessage(text, sender = 'user', isHtml = false) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${sender}`;

  const bubble = document.createElement('div');
  bubble.className = 'bubble';

  // Long Message Readability
  const wordCount = text.split(/\s+/).length;
  if (sender === 'bot' && wordCount > 150 && isHtml) {
    bubble.innerHTML = `
      <div class="collapsible-content">
        ${text}
      </div>
      <button class="read-more-btn">Read more</button>
    `;
    const btn = bubble.querySelector('.read-more-btn');
    const content = bubble.querySelector('.collapsible-content');
    btn.addEventListener('click', () => {
      content.classList.toggle('expanded');
      btn.textContent = content.classList.contains('expanded') ? 'Read less' : 'Read more';
    });
  } else if (isHtml) {
    bubble.innerHTML = text;
  } else {
    bubble.textContent = text;
  }

  // Timestamp
  const now = new Date();
  const timeStr = now.getHours().toString().padStart(2, '0') + ':' +
    now.getMinutes().toString().padStart(2, '0');
  const timeSpan = document.createElement('span');
  timeSpan.className = 'timestamp';
  timeSpan.textContent = timeStr;
  bubble.appendChild(timeSpan);

  if (sender === 'bot') {
    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    avatar.textContent = 'EA';
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(bubble);
  } else {
    messageDiv.appendChild(bubble);
  }

  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function formatBotResponse(data) {
  const md = (t) => {
    if (!t) return '';
    const safeText = String(t).replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return safeText
      .replace(/^### (.*)/gm, '<h3>$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>');
  };

  let html = '';

  if (data.title) html += `<div class="bot-title">${md(data.title)}</div>`;
  if (data.explanation) html += `${md(data.explanation)}<br>`;

  if (data.steps && Array.isArray(data.steps)) {
    html += '<ul style="margin: 8px 0; padding-left: 20px;">';
    data.steps.forEach((step) => {
      html += `<li>${md(step)}</li>`;
    });
    html += '</ul>';
  }

  if (data.example) html += `<br><em>Example:</em> ${md(data.example)}<br>`;
  if (data.next_suggestion) html += `<br>💡 ${md(data.next_suggestion)}`;
  if (data.confirmation) html += `<br><br>${md(data.confirmation)}`;

  return html;
}

// Scroll to bottom logic
chatMessages.addEventListener('scroll', () => {
  const isAtBottom = chatMessages.scrollHeight - chatMessages.scrollTop <= chatMessages.clientHeight + 100;
  scrollToBottomBtn.hidden = isAtBottom;
});

scrollToBottomBtn.addEventListener('click', () => {
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Restart Logic
restartButton.addEventListener('click', () => {
  if (confirm('Are you sure you want to restart the guide? This will clear your current chat.')) {
    chatMessages.innerHTML = '';
    currentStep = 1;
    updateProgressIndicator(1);
    showGreeting();
  }
});

sendButton.addEventListener('click', () => handleSendMessage());
messageInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') handleSendMessage();
});

const startButton = document.getElementById('startButton');
const landingScreen = document.getElementById('landingScreen');
const chatContainer = document.getElementById('chatContainer');

if (startButton) {
  startButton.addEventListener('click', () => {
    landingScreen.style.display = 'none';
    chatContainer.style.display = 'flex';
    showGreeting();
  });
}

function showGreeting() {
  currentStep = 1;
  addMessage(
    "Hello! I'm your Election Assistant. How can I help you navigate the voting process today?",
    'bot',
    false
  );

  const instruction = document.createElement('div');
  instruction.className = 'welcome-hint';
  instruction.textContent =
    'Pick a starter below or type your own question—these options stay available and update after each reply.';
  chatMessages.appendChild(instruction);

  updatePersistentSuggestions({ _starter: true });
  updateProgressIndicator(1);
}
