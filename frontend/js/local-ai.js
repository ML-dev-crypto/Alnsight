/**
 * Local AI Module using Transformers.js
 * Runs LLM models entirely in the browser (offline after initial setup)
 * No internet required after models are cached
 */

import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.1';

// Configure environment
env.allowLocalModels = true;
env.allowRemoteModels = true;

class LocalAIEngine {
    constructor() {
        this.models = {
            summarizer: null,
            textGenerator: null,
            sentimentAnalyzer: null,
            questionAnswerer: null,
            codeGenerator: null
        };
        this.isInitialized = false;
        this.loadingProgress = {};
    }

    /**
     * Initialize AI models (downloads and caches them for offline use)
     * @param {Array} modelsToLoad - Array of model types to load
     */
    async initialize(modelsToLoad = ['summarizer', 'textGenerator']) {
        console.log('🧠 Initializing Local AI Engine...');
        
        try {
            const loadPromises = [];

            if (modelsToLoad.includes('summarizer')) {
                loadPromises.push(this.loadSummarizer());
            }
            
            if (modelsToLoad.includes('textGenerator')) {
                loadPromises.push(this.loadTextGenerator());
            }
            
            if (modelsToLoad.includes('sentiment')) {
                loadPromises.push(this.loadSentimentAnalyzer());
            }
            
            if (modelsToLoad.includes('qa')) {
                loadPromises.push(this.loadQuestionAnswerer());
            }
            
            if (modelsToLoad.includes('code')) {
                loadPromises.push(this.loadCodeGenerator());
            }

            await Promise.all(loadPromises);
            
            this.isInitialized = true;
            console.log('✅ All AI models loaded and ready for offline use!');
            return true;
        } catch (error) {
            console.error('❌ Failed to initialize AI models:', error);
            throw error;
        }
    }

    async loadSummarizer() {
        console.log('📚 Loading summarization model...');
        this.models.summarizer = await pipeline(
            'summarization',
            'Xenova/distilbart-cnn-6-6',
            {
                progress_callback: (progress) => {
                    this.updateProgress('summarizer', progress);
                }
            }
        );
        console.log('✓ Summarizer ready');
    }

    async loadTextGenerator() {
        console.log('✍️ Loading text generation model...');
        this.models.textGenerator = await pipeline(
            'text-generation',
            'Xenova/gpt2',
            {
                progress_callback: (progress) => {
                    this.updateProgress('textGenerator', progress);
                }
            }
        );
        console.log('✓ Text generator ready');
    }

    async loadSentimentAnalyzer() {
        console.log('😊 Loading sentiment analysis model...');
        this.models.sentimentAnalyzer = await pipeline(
            'sentiment-analysis',
            'Xenova/distilbert-base-uncased-finetuned-sst-2-english',
            {
                progress_callback: (progress) => {
                    this.updateProgress('sentiment', progress);
                }
            }
        );
        console.log('✓ Sentiment analyzer ready');
    }

    async loadQuestionAnswerer() {
        console.log('❓ Loading Q&A model...');
        this.models.questionAnswerer = await pipeline(
            'question-answering',
            'Xenova/distilbert-base-cased-distilled-squad',
            {
                progress_callback: (progress) => {
                    this.updateProgress('qa', progress);
                }
            }
        );
        console.log('✓ Q&A model ready');
    }

    async loadCodeGenerator() {
        console.log('💻 Loading code generation model...');
        this.models.codeGenerator = await pipeline(
            'text-generation',
            'Xenova/codegen-350M-mono',
            {
                progress_callback: (progress) => {
                    this.updateProgress('code', progress);
                }
            }
        );
        console.log('✓ Code generator ready');
    }

    updateProgress(modelName, progress) {
        this.loadingProgress[modelName] = progress;
        // Dispatch custom event for UI updates
        window.dispatchEvent(new CustomEvent('ai-model-progress', {
            detail: { model: modelName, progress }
        }));
    }

    /**
     * Summarize a document or text
     * @param {string} text - Text to summarize
     * @param {Object} options - Summarization options
     */
    async summarizeDocument(text, options = {}) {
        if (!this.models.summarizer) {
            throw new Error('Summarizer model not loaded. Call initialize() first.');
        }

        const defaults = {
            max_length: 130,
            min_length: 30,
            do_sample: false
        };

        const settings = { ...defaults, ...options };

        try {
            const result = await this.models.summarizer(text, settings);
            return {
                success: true,
                summary: result[0].summary_text,
                originalLength: text.length,
                summaryLength: result[0].summary_text.length,
                compressionRatio: (result[0].summary_text.length / text.length * 100).toFixed(1) + '%'
            };
        } catch (error) {
            console.error('Summarization error:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Generate text continuation (email drafts, responses, etc.)
     * @param {string} prompt - Starting text/prompt
     * @param {Object} options - Generation options
     */
    async generateText(prompt, options = {}) {
        if (!this.models.textGenerator) {
            throw new Error('Text generator model not loaded. Call initialize() first.');
        }

        const defaults = {
            max_length: 100,
            temperature: 0.7,
            top_k: 50,
            top_p: 0.95,
            do_sample: true,
            num_return_sequences: 1
        };

        const settings = { ...defaults, ...options };

        try {
            const result = await this.models.textGenerator(prompt, settings);
            return {
                success: true,
                text: result[0].generated_text,
                prompt: prompt
            };
        } catch (error) {
            console.error('Text generation error:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Draft a professional email
     * @param {string} context - Context or key points for the email
     * @param {string} tone - Email tone (formal, casual, friendly)
     */
    async draftEmail(context, tone = 'professional') {
        const tonePrompts = {
            professional: 'Dear Sir/Madam,\n\n',
            casual: 'Hi there,\n\n',
            friendly: 'Hello!\n\n',
            formal: 'To whom it may concern,\n\n'
        };

        const prompt = tonePrompts[tone] + context;
        
        return await this.generateText(prompt, {
            max_length: 200,
            temperature: 0.7
        });
    }

    /**
     * Analyze sentiment of text
     * @param {string} text - Text to analyze
     */
    async analyzeSentiment(text) {
        if (!this.models.sentimentAnalyzer) {
            throw new Error('Sentiment analyzer not loaded. Call initialize() first.');
        }

        try {
            const result = await this.models.sentimentAnalyzer(text);
            return {
                success: true,
                sentiment: result[0].label,
                confidence: (result[0].score * 100).toFixed(1) + '%',
                score: result[0].score
            };
        } catch (error) {
            console.error('Sentiment analysis error:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Answer questions based on context
     * @param {string} question - Question to answer
     * @param {string} context - Context containing the answer
     */
    async answerQuestion(question, context) {
        if (!this.models.questionAnswerer) {
            throw new Error('Q&A model not loaded. Call initialize() first.');
        }

        try {
            const result = await this.models.questionAnswerer(question, context);
            return {
                success: true,
                answer: result.answer,
                confidence: (result.score * 100).toFixed(1) + '%',
                score: result.score
            };
        } catch (error) {
            console.error('Question answering error:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Generate code snippet
     * @param {string} prompt - Code description or starting code
     * @param {Object} options - Generation options
     */
    async generateCode(prompt, options = {}) {
        if (!this.models.codeGenerator) {
            throw new Error('Code generator not loaded. Call initialize() first.');
        }

        const defaults = {
            max_length: 150,
            temperature: 0.3, // Lower temperature for more deterministic code
            top_k: 50,
            do_sample: true
        };

        const settings = { ...defaults, ...options };

        try {
            const result = await this.models.codeGenerator(prompt, settings);
            return {
                success: true,
                code: result[0].generated_text,
                prompt: prompt
            };
        } catch (error) {
            console.error('Code generation error:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Extract action items from meeting notes
     * @param {string} notes - Meeting notes text
     */
    async extractTasks(notes) {
        // Use text generation to extract tasks
        const prompt = `Extract action items and tasks from these notes:\n\n${notes}\n\nAction items:\n1.`;
        
        const result = await this.generateText(prompt, {
            max_length: 200,
            temperature: 0.5
        });

        if (result.success) {
            // Parse the generated text to extract tasks
            const text = result.text;
            const lines = text.split('\n').filter(line => 
                line.trim().match(/^\d+\./) || line.includes('TODO') || line.includes('Action:')
            );
            
            return {
                success: true,
                tasks: lines.map(line => line.trim()),
                rawOutput: text
            };
        }

        return result;
    }

    /**
     * Smart note summarization with key points
     * @param {string} notes - Notes to process
     */
    async processNotes(notes) {
        const summary = await this.summarizeDocument(notes, {
            max_length: 100,
            min_length: 20
        });

        const sentiment = await this.analyzeSentiment(notes);
        
        const tasks = await this.extractTasks(notes);

        return {
            success: true,
            summary: summary.summary,
            sentiment: sentiment.sentiment,
            tasks: tasks.tasks || [],
            metadata: {
                originalLength: notes.length,
                processedAt: new Date().toISOString(),
                offline: !navigator.onLine
            }
        };
    }

    /**
     * Check if models are ready for offline use
     */
    isOfflineReady() {
        return this.isInitialized && !navigator.onLine;
    }

    /**
     * Get model status
     */
    getStatus() {
        return {
            initialized: this.isInitialized,
            online: navigator.onLine,
            offlineReady: this.isOfflineReady(),
            loadedModels: Object.keys(this.models).filter(key => this.models[key] !== null),
            progress: this.loadingProgress
        };
    }
}

// Create singleton instance
const localAI = new LocalAIEngine();

// Export for use in other modules
export default localAI;

// Also make available globally
window.LocalAI = localAI;
