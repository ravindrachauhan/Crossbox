// chatbot-ui.js - Frontend chatbot UI and interaction logic

class ChatbotUI {
    constructor() {
        this.apiBaseUrl = '/api';
        this.isOpen = false;
        this.isLoading = false;
        this.initializeElements();
        this.attachEventListeners();
        this.showWelcomeMessage();
    }

    initializeElements() {
        // Get DOM elements
        this.toggle = document.getElementById('chatbot-toggle');
        this.container = document.getElementById('chatbot-container');
        this.closeBtn = document.getElementById('chatbot-close');
        this.messagesDiv = document.getElementById('chatbot-messages');
        this.input = document.getElementById('chatbot-input');
        this.sendBtn = document.getElementById('chatbot-send');
    }

    attachEventListeners() {
        if (this.toggle) {
            this.toggle.addEventListener('click', () => this.toggleChat());
        }
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.closeChat());
        }
        if (this.sendBtn) {
            this.sendBtn.addEventListener('click', () => this.sendMessage());
        }
        if (this.input) {
            this.input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
        }
    }

    toggleChat() {
        if (this.isOpen) {
            this.closeChat();
        } else {
            this.openChat();
        }
    }

    openChat() {
        this.isOpen = true;
        if (this.container) {
            this.container.classList.add('active');
        }
        if (this.toggle) {
            this.toggle.classList.add('open');
        }
        if (this.input) {
            setTimeout(() => this.input.focus(), 300);
        }
    }

    closeChat() {
        this.isOpen = false;
        if (this.container) {
            this.container.classList.remove('active');
        }
        if (this.toggle) {
            this.toggle.classList.remove('open');
        }
    }

    async sendMessage() {
        const message = this.input.value.trim();

        if (!message) {
            return;
        }

        // Add user message to chat
        this.addMessage(message, 'user');

        // Clear input
        if (this.input) {
            this.input.value = '';
        }

        // Show typing indicator
        this.showTypingIndicator();

        try {
            // Send message to backend
            const response = await fetch(`${this.apiBaseUrl}/chatbot`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: message })
            });

            const data = await response.json();

            // Remove typing indicator
            this.removeTypingIndicator();

            if (data.success && data.data) {
                const botMessage = data.data.message;
                this.addMessage(botMessage, 'bot');
            } else {
                this.addMessage('Sorry, I encountered an error. Please try again.', 'bot');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            this.removeTypingIndicator();
            this.addMessage('Sorry, I could not connect to the chatbot service. Please try again later.', 'bot');
        }

        // Scroll to bottom
        this.scrollToBottom();
    }

    addMessage(content, sender) {
        if (!this.messagesDiv) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `chatbot-message ${sender}`;

        const contentDiv = document.createElement('div');
        contentDiv.className = 'chatbot-message-content';
        
        // Allow HTML for bot messages (for formatting)
        if (sender === 'bot') {
            contentDiv.innerHTML = content;
        } else {
            contentDiv.textContent = content;
        }

        messageDiv.appendChild(contentDiv);
        this.messagesDiv.appendChild(messageDiv);

        this.scrollToBottom();
    }

    showTypingIndicator() {
        if (!this.messagesDiv) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = 'chatbot-message bot';
        messageDiv.id = 'chatbot-typing-indicator';

        const typingDiv = document.createElement('div');
        typingDiv.className = 'chatbot-typing';

        for (let i = 0; i < 3; i++) {
            const span = document.createElement('span');
            typingDiv.appendChild(span);
        }

        messageDiv.appendChild(typingDiv);
        this.messagesDiv.appendChild(messageDiv);

        this.scrollToBottom();
    }

    removeTypingIndicator() {
        const indicator = document.getElementById('chatbot-typing-indicator');
        if (indicator) {
            indicator.remove();
        }
    }

    scrollToBottom() {
        if (this.messagesDiv) {
            this.messagesDiv.scrollTop = this.messagesDiv.scrollHeight;
        }
    }

    showWelcomeMessage() {
        setTimeout(() => {
            this.addMessage('👋 Hello! I\'m your CrossBox Fitness Assistant. How can I help you today? Feel free to ask about our subscription plans, workout classes, trainers, or anything else about our gym!', 'bot');
        }, 500);
    }

    clearChat() {
        if (this.messagesDiv) {
            this.messagesDiv.innerHTML = '';
        }
        this.showWelcomeMessage();
    }
}

// Initialize chatbot when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Check if chatbot HTML is already in the page
    const chatbotToggle = document.getElementById('chatbot-toggle');
    
    if (chatbotToggle) {
        window.chatbot = new ChatbotUI();
    }
});
