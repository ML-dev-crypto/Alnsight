/**
 * AI Assistant Integration for Dashboard
 * Handles WebLLM initialization and interactions
 */

// Wait for WebLLM to be loaded
function initAIAssistant() {
    const initButton = document.getElementById('initAIButton');
    const aiModelSelect = document.getElementById('aiModelSelect');
    const aiInitSection = document.getElementById('aiInitSection');
    const aiMainContent = document.getElementById('aiMainContent');
    const aiLoadingProgress = document.getElementById('aiLoadingProgress');
    const aiProgressBar = document.getElementById('aiProgressBar');
    const aiProgressText = document.getElementById('aiProgressText');
    const aiStatus = document.getElementById('aiStatus');

    // Initialize AI Engine
    initButton.addEventListener('click', async function() {
        const selectedModel = aiModelSelect.value;
        
        initButton.disabled = true;
        aiLoadingProgress.style.display = 'block';

        try {
            const result = await window.webLLM.initialize(selectedModel, (progress) => {
                if (progress.progress !== undefined) {
                    const percent = Math.round(progress.progress * 100);
                    aiProgressBar.style.width = percent + '%';
                    aiProgressBar.textContent = percent + '%';
                }
                aiProgressText.textContent = progress.text || 'Loading...';
            });

            if (result.success) {
                aiInitSection.style.display = 'none';
                aiMainContent.style.display = 'block';
                updateAIStatus('online');
                showToast('AI Engine initialized successfully! 🎉', 'success');
            } else {
                throw new Error(result.error || 'Failed to initialize');
            }
        } catch (error) {
            console.error('AI initialization error:', error);
            showToast('Failed to initialize AI: ' + error.message, 'error');
            initButton.disabled = false;
            aiLoadingProgress.style.display = 'none';
        }
    });

    // Update AI status badge
    function updateAIStatus(status) {
        const statusMap = {
            'online': { text: '🟢 AI Ready', color: '#10b981' },
            'offline': { text: '📴 Offline', color: '#f59e0b' },
            'loading': { text: '⏳ Loading', color: '#3b82f6' },
            'error': { text: '❌ Error', color: '#ef4444' }
        };

        const statusInfo = statusMap[status] || statusMap['offline'];
        aiStatus.innerHTML = `<span class="badge" style="background: ${statusInfo.color};">${statusInfo.text}</span>`;
    }

    // Chat functionality
    const aiChatInput = document.getElementById('aiChatInput');
    const aiSendButton = document.getElementById('aiSendButton');
    const aiClearButton = document.getElementById('aiClearButton');
    const aiChatMessages = document.getElementById('aiChatMessages');

    function addChatMessage(content, role) {
        const messageDiv = document.createElement('div');
        const styles = {
            'user': 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; margin-left: auto; max-width: 85%;',
            'assistant': 'background: white; border: 2px solid #e5e7eb; margin-right: auto; max-width: 85%;',
            'system': 'background: #fef3c7; border: 2px solid #fbbf24; text-align: center; margin: 10px auto;'
        };

        messageDiv.style.cssText = `
            padding: 12px; 
            border-radius: 8px; 
            margin-bottom: 15px; 
            word-wrap: break-word;
            ${styles[role] || styles['system']}
        `;
        messageDiv.textContent = content;
        aiChatMessages.appendChild(messageDiv);
        aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
    }

    aiSendButton.addEventListener('click', async function() {
        const message = aiChatInput.value.trim();
        if (!message) return;

        addChatMessage(message, 'user');
        aiChatInput.value = '';
        aiSendButton.disabled = true;

        addChatMessage('💭 AI is thinking...', 'system');

        try {
            const response = await window.webLLM.chat(message);

            // Remove thinking message
            aiChatMessages.removeChild(aiChatMessages.lastChild);

            if (response.success) {
                addChatMessage(response.message, 'assistant');
            } else {
                addChatMessage('❌ Error: ' + response.error, 'system');
            }
        } catch (error) {
            aiChatMessages.removeChild(aiChatMessages.lastChild);
            addChatMessage('❌ Error: ' + error.message, 'system');
        }

        aiSendButton.disabled = false;
    });

    // Handle Enter key in chat
    aiChatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            aiSendButton.click();
        }
    });

    aiClearButton.addEventListener('click', function() {
        window.webLLM.clearHistory();
        aiChatMessages.innerHTML = `
            <div style="background: #fef3c7; border: 2px solid #fbbf24; padding: 12px; border-radius: 8px; text-align: center; margin: 10px 0;">
                Chat cleared! Start a new conversation.
            </div>
        `;
    });

    // Summarize functionality
    const aiSummarizeInput = document.getElementById('aiSummarizeInput');
    const aiSummarizeButton = document.getElementById('aiSummarizeButton');
    const aiSummarizeOutput = document.getElementById('aiSummarizeOutput');

    aiSummarizeButton.addEventListener('click', async function() {
        const text = aiSummarizeInput.value.trim();
        if (!text) {
            showToast('Please enter text to summarize', 'warning');
            return;
        }

        aiSummarizeButton.disabled = true;
        aiSummarizeOutput.style.display = 'block';
        aiSummarizeOutput.textContent = '⏳ Summarizing...';
        aiSummarizeOutput.style.background = '#f9fafb';
        aiSummarizeOutput.style.borderColor = '#e5e7eb';

        try {
            const result = await window.webLLM.summarizeDocument(text);

            if (result.success) {
                aiSummarizeOutput.textContent = result.text;
                aiSummarizeOutput.style.background = '#ecfdf5';
                aiSummarizeOutput.style.borderColor = '#10b981';
            } else {
                aiSummarizeOutput.textContent = 'Error: ' + result.error;
                aiSummarizeOutput.style.background = '#fef2f2';
                aiSummarizeOutput.style.borderColor = '#ef4444';
            }
        } catch (error) {
            aiSummarizeOutput.textContent = 'Error: ' + error.message;
            aiSummarizeOutput.style.background = '#fef2f2';
            aiSummarizeOutput.style.borderColor = '#ef4444';
        }

        aiSummarizeButton.disabled = false;
    });

    // Email draft functionality
    const aiEmailInput = document.getElementById('aiEmailInput');
    const aiEmailButton = document.getElementById('aiEmailButton');
    const aiEmailOutput = document.getElementById('aiEmailOutput');

    aiEmailButton.addEventListener('click', async function() {
        const context = aiEmailInput.value.trim();
        if (!context) {
            showToast('Please describe what you want to write', 'warning');
            return;
        }

        aiEmailButton.disabled = true;
        aiEmailOutput.style.display = 'block';
        aiEmailOutput.textContent = '⏳ Drafting email...';
        aiEmailOutput.style.background = '#f9fafb';
        aiEmailOutput.style.borderColor = '#e5e7eb';

        try {
            const result = await window.webLLM.draftEmail(context);

            if (result.success) {
                aiEmailOutput.textContent = result.text;
                aiEmailOutput.style.background = '#ecfdf5';
                aiEmailOutput.style.borderColor = '#10b981';
            } else {
                aiEmailOutput.textContent = 'Error: ' + result.error;
                aiEmailOutput.style.background = '#fef2f2';
                aiEmailOutput.style.borderColor = '#ef4444';
            }
        } catch (error) {
            aiEmailOutput.textContent = 'Error: ' + error.message;
            aiEmailOutput.style.background = '#fef2f2';
            aiEmailOutput.style.borderColor = '#ef4444';
        }

        aiEmailButton.disabled = false;
    });

    // Monitor online/offline status
    window.addEventListener('online', () => updateAIStatus('online'));
    window.addEventListener('offline', () => {
        if (window.webLLM && window.webLLM.isInitialized) {
            updateAIStatus('offline');
            showToast('You\'re offline, but AI still works! 🎉', 'info');
        }
    });

    console.log('AI Assistant module loaded');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAIAssistant);
} else {
    initAIAssistant();
}
