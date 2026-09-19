// NEXORA Global Chatbot functionality

'use strict';

(function() {
    // Check if chatbot is already injected
    if (document.getElementById('nexoraChatbotWrapper')) return;

    // Build the chatbot DOM
    const wrapper = document.createElement('div');
    wrapper.className = 'nexora-chatbot-wrapper';
    wrapper.id = 'nexoraChatbotWrapper';
    
    wrapper.innerHTML = `
        <button class="chatbot-toggle-btn" id="chatbotToggleBtn" aria-label="Toggle Chatbot">
            <i class="fa-solid fa-robot"></i>
        </button>

        <div class="chatbot-window" id="chatbotWindow">
            <div class="chatbot-header">
                <div class="chatbot-title">
                    <div class="chatbot-status-dot"></div>
                    NEXORA AI Assistant
                </div>
                <button class="chatbot-close-btn" id="chatbotCloseBtn">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
            
            <div class="chatbot-messages" id="chatbotMessages">
                <div class="chat-msg bot">
                    Hello! I'm your Nexora AI Assistant. How can I help you validate, analyze, or architect your idea today?
                </div>
            </div>
            
            <div class="chatbot-input-area">
                <input type="text" class="chatbot-input" id="chatbotInput" placeholder="Ask me anything...">
                <button class="chatbot-send-btn" id="chatbotSendBtn">
                    <i class="fa-solid fa-paper-plane"></i>
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(wrapper);

    // References
    const toggleBtn = document.getElementById('chatbotToggleBtn');
    const closeBtn = document.getElementById('chatbotCloseBtn');
    const chatWindow = document.getElementById('chatbotWindow');
    const input = document.getElementById('chatbotInput');
    const sendBtn = document.getElementById('chatbotSendBtn');
    const messagesContainer = document.getElementById('chatbotMessages');

    // Toggle logic
    function toggleChat() {
        const isActive = chatWindow.classList.contains('active');
        if (isActive) {
            chatWindow.classList.remove('active');
            toggleBtn.innerHTML = '<i class="fa-solid fa-robot"></i>';
        } else {
            chatWindow.classList.add('active');
            toggleBtn.innerHTML = '<i class="fa-solid fa-chevron-down"></i>';
            input.focus();
        }
    }

    toggleBtn.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', toggleChat);

    // Messaging logic
    function addMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-msg ${sender}`;
        msgDiv.textContent = text;
        messagesContainer.appendChild(msgDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function showTyping() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.id = 'typingIndicator';
        typingDiv.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function removeTyping() {
        const typingDiv = document.getElementById('typingIndicator');
        if (typingDiv) typingDiv.remove();
    }

    function handleSend() {
        const text = input.value.trim();
        if (!text) return;

        addMessage(text, 'user');
        input.value = '';
        
        showTyping();

        // Get user's idea from session storage
        const ideaContext = sessionStorage.getItem('nexora_idea') || '';

        // Call AI Mentor Backend
        fetch('https://nexora-bc4j.onrender.com/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text, ideaContext })
        })
        .then(res => res.json())
        .then(data => {
            removeTyping();
            if (data.error) {
                console.error("Chat API Error:", data.error);
                // Fallback locally if rate-limited or error
                fallbackResponse(text);
            } else {
                addMessage(data.reply, 'bot');
            }
        })
        .catch(err => {
            console.error("Chat Network Error:", err);
            removeTyping();
            fallbackResponse(text);
        });
        
        function fallbackResponse(text) {
            const lowerText = text.toLowerCase();
            let response = "";

            if (lowerText.match(/\b(hi|hello|hey|greetings)\b/)) {
                response = "Hello! I'm your Nexora AI Assistant. How can I help you validate or build your idea today?";
            } 
            else if (lowerText.match(/\b(idea|analyze|evaluate|good|bad)\b/)) {
                response = "If you want to evaluate an idea, head over to the **Idea Analyzer**. It scores innovation, feasibility, and market demand to give you a clear baseline.";
            }
            else if (lowerText.match(/\b(innovate|similar|different|unique|competitor|competition)\b/)) {
                response = "To see how your idea stacks up against existing solutions, check out the **Innovation Detector**. It will find similar market products and highlight your unique differentiators.";
            }
            else if (lowerText.match(/\b(architecture|build|tech stack|database|backend|frontend|code|system)\b/)) {
                response = "Building it requires the right technical foundation. The **Algorithm Architect** can automatically generate a complete system architecture and recommend the best tech stack for your specific idea.";
            }
            else if (lowerText.match(/\b(future|simulate|growth|risk|predict|success|scale|users)\b/)) {
                response = "Want to know what happens next? The **Future Impact Simulator** predicts your adoption rate, scaling challenges, and potential market risks over the next 3-5 years.";
            }
            else if (lowerText.match(/\b(who are you|what is nexora|help)\b/)) {
                response = "I am the Nexora AI Assistant. Nexora is an AI-powered innovation platform designed to turn your raw ideas into execution-ready plans across four stages: Analyzer, Detector, Architect, and Simulator.";
            }
            else if (lowerText.match(/\b(login|account|sign in)\b/)) {
                response = "You can manage your session from the Home page. Remember, Nexora saves your progress locally for a seamless experience.";
            }
            else {
                const fallbacks = [
                    "That's an interesting perspective! Could you provide a bit more detail?",
                    "I see. How does that fit into your overall vision for the product?",
                    "Based on that, I'd recommend running your idea through our Analyzer to get concrete metrics.",
                    "Fascinating. If you need technical guidance on that, the Architecture Builder is your best bet."
                ];
                response = fallbacks[Math.floor(Math.random() * fallbacks.length)];
            }
            addMessage(response, 'bot');
        }
    }

    sendBtn.addEventListener('click', handleSend);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
    });
})();
