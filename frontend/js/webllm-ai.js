/**
 * WebLLM Integration for AInSight
 * Runs powerful LLMs (Llama-2-7B, Mistral, Phi) directly in the browser
 * Uses WebGPU acceleration for fast inference
 * Works 100% offline after initial model download
 */

import * as webllm from "https://cdn.jsdelivr.net/npm/@mlc-ai/web-llm@0.2.46/+esm";

class WebLLMAIEngine {
    constructor() {
        this.engine = null;
        this.isInitialized = false;
        this.currentModel = null;
        this.chatHistory = [];
    }

    /**
     * Available models with their specs (Updated for WebLLM 0.2.46+)
     * Using q4f32 quantization for standard WebGPU support (no shader-f16 needed)
     */
    static MODELS = {
        // Smallest for quick testing
        'TinyLlama-1.1B-Chat-v1.0-q4f32_1-MLC': {
            name: 'TinyLlama 1.1B (Fastest)',
            size: '0.82 GB',
            quality: '⭐⭐',
            speed: '⚡⚡⚡⚡⚡',
            description: 'Smallest model, perfect for testing and quick responses'
        },
        // Good lightweight option
        'RedPajama-INCITE-Chat-3B-v1-q4f32_1-MLC': {
            name: 'RedPajama 3B',
            size: '3.84 GB',
            quality: '⭐⭐⭐',
            speed: '⚡⚡⚡⚡',
            description: 'Lightweight, good for general tasks'
        },
        // Recommended: Best balance
        'Phi-3-mini-4k-instruct-q4f32_1-MLC': {
            name: 'Phi-3 Mini (Recommended)',
            size: '5.35 GB',
            quality: '⭐⭐⭐⭐',
            speed: '⚡⚡⚡',
            description: 'Microsoft\'s efficient model, great for most tasks'
        },
        // Advanced models
        'Mistral-7B-Instruct-v0.3-q4f32_1-MLC': {
            name: 'Mistral 7B v0.3',
            size: '5.49 GB',
            quality: '⭐⭐⭐⭐⭐',
            speed: '⚡⚡⚡',
            description: 'Excellent reasoning and instruction following'
        },
        'Llama-3-8B-Instruct-q4f32_1-MLC': {
            name: 'Llama 3 8B',
            size: '5.96 GB',
            quality: '⭐⭐⭐⭐⭐',
            speed: '⚡⚡⚡',
            description: 'Meta\'s powerful model, best quality'
        }
    };

    /**
     * Initialize WebLLM engine with selected model
     * @param {string} modelId - Model identifier from MODELS list
     * @param {Function} progressCallback - Callback for download progress
     */
    async initialize(modelId = 'TinyLlama-1.1B-Chat-v1.0-q4f32_1-MLC', progressCallback = null) {
        console.log(`🚀 Initializing WebLLM with ${modelId}...`);
        console.log('📦 WebLLM library loaded:', typeof webllm);
        console.log('🌐 Navigator:', { onLine: navigator.onLine, gpu: !!navigator.gpu });
        
        try {
            // Check compatibility first
            const compat = await WebLLMAIEngine.checkCompatibility();
            console.log('🔍 Compatibility check:', compat);
            
            if (!compat.compatible) {
                throw new Error(compat.reason + (compat.recommendation ? '\n\n' + compat.recommendation : ''));
            }

            // Create engine with progress tracking
            console.log('🏗️ Creating MLC Engine (this may take 1-2 minutes for first download)...');
            console.log('⏰ Start time:', new Date().toLocaleTimeString());
            
            let lastProgress = Date.now();
            this.engine = await webllm.CreateMLCEngine(modelId, {
                initProgressCallback: (progress) => {
                    lastProgress = Date.now();
                    console.log('📊 Progress update:', progress);
                    this.handleProgress(progress, progressCallback);
                }
            });

            console.log('⏰ End time:', new Date().toLocaleTimeString());
            this.currentModel = modelId;
            this.isInitialized = true;
            console.log('✅ WebLLM engine ready!');
            
            return {
                success: true,
                model: modelId,
                message: 'AI engine initialized and ready for offline use!'
            };
        } catch (error) {
            console.error('❌ Failed to initialize WebLLM:', error);
            console.error('Error stack:', error.stack);
            console.error('Error details:', {
                name: error.name,
                message: error.message,
                cause: error.cause
            });
            return {
                success: false,
                error: error.message,
                suggestion: 'Check browser console for details. Ensure you have Chrome 113+ or Edge 113+ with WebGPU enabled. Try refreshing the page if the model was previously downloaded.'
            };
        }
    }

    handleProgress(progress, callback) {
        console.log(`📥 ${progress.text}`);
        
        // Dispatch event for UI updates
        window.dispatchEvent(new CustomEvent('webllm-progress', {
            detail: progress
        }));

        if (callback) {
            callback(progress);
        }
    }

    /**
     * Check if browser supports WebLLM
     */
    static async checkCompatibility() {
        try {
            // Check for WebGPU support
            if (!navigator.gpu) {
                return {
                    compatible: false,
                    reason: 'WebGPU not supported. Please use Chrome 113+ or Edge 113+',
                    recommendation: 'Update your browser or use Chrome/Edge'
                };
            }

            // Check for sufficient memory (recommended: 8GB+)
            const memory = navigator.deviceMemory || 0;
            if (memory > 0 && memory < 6) {
                return {
                    compatible: true,
                    warning: `Low memory detected (${memory}GB). Recommend 8GB+ for best performance.`,
                    recommendation: 'Consider using a lighter model like Phi-2'
                };
            }

            return {
                compatible: true,
                message: 'Your browser fully supports WebLLM! 🎉'
            };
        } catch (error) {
            return {
                compatible: false,
                reason: error.message
            };
        }
    }

    /**
     * Chat with the AI (maintains conversation history)
     * @param {string} userMessage - User's message
     * @param {Object} options - Generation options
     */
    async chat(userMessage, options = {}) {
        if (!this.isInitialized || !this.engine) {
            return {
                success: false,
                error: 'Engine not initialized. Please reload the page and initialize again.'
            };
        }

        // Add user message to history
        this.chatHistory.push({
            role: 'user',
            content: userMessage
        });

        const defaults = {
            temperature: 0.7,
            top_p: 0.95,
            max_tokens: 2048, // Increased from 512 to 2048 for longer code snippets
            stream: false
        };

        const settings = { ...defaults, ...options };

        try {
            // Check if engine is still alive
            if (!this.engine) {
                throw new Error('Engine process stopped. Please refresh the page.');
            }

            if (settings.stream) {
                // Streaming response
                return this.streamChat(settings);
            } else {
                // Non-streaming response
                const response = await this.engine.chat.completions.create({
                    messages: this.chatHistory,
                    temperature: settings.temperature,
                    top_p: settings.top_p,
                    max_tokens: settings.max_tokens
                });

                const aiMessage = response.choices[0].message.content;

                // Add AI response to history
                this.chatHistory.push({
                    role: 'assistant',
                    content: aiMessage
                });

                return {
                    success: true,
                    message: aiMessage,
                    usage: response.usage,
                    model: this.currentModel
                };
            }
        } catch (error) {
            console.error('Chat error:', error);
            
            // Check if it's a process stopped error
            if (error.message.includes('stopped') || error.message.includes('process')) {
                this.isInitialized = false;
                this.engine = null;
                return {
                    success: false,
                    error: 'AI engine stopped. Please refresh the page and reinitialize.',
                    needsReload: true
                };
            }
            
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Stream chat responses for real-time output
     */
    async *streamChat(settings) {
        const stream = await this.engine.chat.completions.create({
            messages: this.chatHistory,
            temperature: settings.temperature,
            top_p: settings.top_p,
            max_tokens: settings.max_tokens,
            stream: true
        });

        let fullMessage = '';

        for await (const chunk of stream) {
            const delta = chunk.choices[0]?.delta?.content || '';
            fullMessage += delta;
            yield {
                success: true,
                delta: delta,
                fullMessage: fullMessage,
                done: false
            };
        }

        // Add complete message to history
        this.chatHistory.push({
            role: 'assistant',
            content: fullMessage
        });

        yield {
            success: true,
            delta: '',
            fullMessage: fullMessage,
            done: true
        };
    }

    /**
     * One-shot completion without maintaining history
     * @param {string} prompt - Prompt or task description
     * @param {Object} options - Generation options
     */
    async complete(prompt, options = {}) {
        if (!this.isInitialized) {
            throw new Error('Engine not initialized. Call initialize() first.');
        }

        const defaults = {
            temperature: 0.7,
            max_tokens: 2048 // Increased for longer responses
        };

        const settings = { ...defaults, ...options };

        try {
            const response = await this.engine.chat.completions.create({
                messages: [{ role: 'user', content: prompt }],
                temperature: settings.temperature,
                max_tokens: settings.max_tokens
            });

            return {
                success: true,
                text: response.choices[0].message.content,
                usage: response.usage
            };
        } catch (error) {
            console.error('Completion error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Summarize a document
     */
    async summarizeDocument(text, maxLength = 200) {
        const prompt = `Please provide a concise summary of the following text in no more than ${maxLength} words:\n\n${text}\n\nSummary:`;
        
        return await this.complete(prompt, {
            temperature: 0.3,
            max_tokens: Math.ceil(maxLength * 1.5)
        });
    }

    /**
     * Draft a professional email
     */
    async draftEmail(context, tone = 'professional') {
        const toneInstructions = {
            professional: 'Write a professional business email',
            casual: 'Write a casual, friendly email',
            formal: 'Write a formal, respectful email',
            friendly: 'Write a warm, friendly email'
        };

        const prompt = `${toneInstructions[tone] || toneInstructions.professional} based on this context:\n\n${context}\n\nEmail:`;
        
        return await this.complete(prompt, {
            temperature: 0.7,
            max_tokens: 800 // Increased for full emails
        });
    }

    /**
     * Extract action items and tasks from text
     */
    async extractTasks(notes) {
        const prompt = `Extract all action items, tasks, and to-dos from these notes. Format as a numbered list:\n\n${notes}\n\nAction Items:`;
        
        return await this.complete(prompt, {
            temperature: 0.3,
            max_tokens: 600 // Increased for longer task lists
        });
    }

    /**
     * Generate code based on description
     */
    async generateCode(description, language = 'javascript') {
        const prompt = `Write ${language} code for the following:\n\n${description}\n\nCode:`;
        
        return await this.complete(prompt, {
            temperature: 0.2,
            max_tokens: 1500 // Increased significantly for complete code snippets
        });
    }

    /**
     * Answer questions about a context
     */
    async answerQuestion(question, context) {
        const prompt = `Context:\n${context}\n\nQuestion: ${question}\n\nAnswer:`;
        
        return await this.complete(prompt, {
            temperature: 0.3,
            max_tokens: 200
        });
    }

    /**
     * Analyze sentiment of text
     */
    async analyzeSentiment(text) {
        const prompt = `Analyze the sentiment of this text and respond with only: POSITIVE, NEGATIVE, or NEUTRAL, followed by a confidence score (0-100%):\n\n"${text}"\n\nSentiment:`;
        
        const result = await this.complete(prompt, {
            temperature: 0.1,
            max_tokens: 50
        });

        if (result.success) {
            const response = result.text.trim();
            const sentiment = response.includes('POSITIVE') ? 'POSITIVE' : 
                            response.includes('NEGATIVE') ? 'NEGATIVE' : 'NEUTRAL';
            
            return {
                success: true,
                sentiment: sentiment,
                confidence: response.match(/(\d+)%?/)?.[1] + '%' || '85%',
                fullResponse: response
            };
        }

        return result;
    }

    /**
     * Smart note processing with summary and task extraction
     */
    async processNotes(notes) {
        const summaryResult = await this.summarizeDocument(notes, 100);
        const tasksResult = await this.extractTasks(notes);
        const sentimentResult = await this.analyzeSentiment(notes);

        return {
            success: true,
            summary: summaryResult.success ? summaryResult.text : 'N/A',
            tasks: tasksResult.success ? tasksResult.text : 'N/A',
            sentiment: sentimentResult.success ? sentimentResult.sentiment : 'N/A',
            processedAt: new Date().toISOString()
        };
    }

    /**
     * Clear chat history
     */
    clearHistory() {
        this.chatHistory = [];
        console.log('Chat history cleared');
    }

    /**
     * Reset chat with system message
     */
    resetChat(systemMessage = "You are a helpful AI assistant.") {
        this.chatHistory = [{
            role: 'system',
            content: systemMessage
        }];
    }

    /**
     * Get current chat history
     */
    getHistory() {
        return [...this.chatHistory];
    }

    /**
     * Get engine status
     */
    getStatus() {
        return {
            initialized: this.isInitialized,
            model: this.currentModel,
            modelInfo: WebLLMAIEngine.MODELS[this.currentModel] || null,
            chatHistoryLength: this.chatHistory.length,
            online: navigator.onLine,
            offlineReady: this.isInitialized
        };
    }

    /**
     * Get available models list
     */
    static getAvailableModels() {
        return Object.entries(WebLLMAIEngine.MODELS).map(([id, info]) => ({
            id,
            ...info
        }));
    }
}

// Create singleton instance
const webLLM = new WebLLMAIEngine();

// Export for use in other modules
export default webLLM;
export { WebLLMAIEngine };

// Also make available globally
window.WebLLM = webLLM;
window.WebLLMAIEngine = WebLLMAIEngine;
