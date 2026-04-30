const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const chatMessages = document.getElementById('chatMessages');

let currentStep = 1;

function addMessage(text, sender = 'user') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    
    if (sender === 'bot') {
        messageDiv.innerHTML = `<div class="avatar">EA</div><div class="bubble">${text}</div>`;
    } else {
        messageDiv.innerHTML = `<div class="bubble">${text}</div>`;
    }
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function formatBotResponse(data) {
    const md = (t) => {
        if (!t) return '';
        return t
            .replace(/^### (.*)/gm, '<h3>$1</h3>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>');
    };

    let html = '';
    
    if (data.title) html += `<div class="bot-title">${md(data.title)}</div>`;
    if (data.explanation) html += `${md(data.explanation)}<br>`;
    
    if (data.steps && Array.isArray(data.steps)) {
        html += '<ul style="margin: 8px 0; padding-left: 20px;">';
        data.steps.forEach(step => {
            html += `<li>${md(step)}</li>`;
        });
        html += '</ul>';
    }
    
    if (data.example) html += `<br><em>Example:</em> ${md(data.example)}<br>`;
    if (data.next_suggestion) html += `<br>💡 ${md(data.next_suggestion)}`;
    if (data.confirmation) html += `<br><br>${md(data.confirmation)}`;
    
    return html;
}

async function handleSendMessage() {
    const text = messageInput.value.trim();
    if (!text || document.getElementById('typing-indicator')) return;

    addMessage(text, 'user');
    messageInput.value = '';

    // Show typing indicator
    addMessage('Typing...', 'bot');
    chatMessages.lastElementChild.id = 'typing-indicator';

    try {
        const response = await fetch('http://localhost:3000/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: text,
                user_profile: {
                    level: "beginner",
                    type: "first_time",
                    mode: "guided"
                },
                current_step: currentStep
            })
        });

        if (!response.ok) throw new Error('Network response was not ok');

        // Remove typing indicator
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) typingIndicator.remove();

        const data = await response.json();
        const formattedResponse = formatBotResponse(data);
        addMessage(formattedResponse, 'bot');

        // Update step if returned in response
        if (data.current_step) currentStep = data.current_step;
        else if (data.next_step) currentStep = data.next_step;

    } catch (error) {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) typingIndicator.remove();
        console.error('Error:', error);
        addMessage('Sorry, something went wrong. Please try again.', 'bot');
    }
}

sendButton.addEventListener('click', handleSendMessage);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSendMessage();
});

// Landing screen transition logic
const startButton = document.getElementById('startButton');
const landingScreen = document.getElementById('landingScreen');
const chatContainer = document.getElementById('chatContainer');

if (startButton) {
    startButton.addEventListener('click', () => {
        landingScreen.style.display = 'none';
        chatContainer.style.display = 'flex';
    });
}
