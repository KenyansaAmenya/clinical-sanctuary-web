import ENV, { validateEnvironment } from './config.js';
import { submitPrediction } from './api/predictions.js';
import { getModelMetrics, getTrainingStatus, formatMetrics } from './api/metrics.js';

class ClinicalSanctuaryApp {
    constructor() {
        this.form = null;
        this.submitBtn = null;
        this.resultContainer = null;
        this.isLoading = false;
    }

    async init() {
        console.log(' Clinical Sanctuary UI initializing...');

        // Validate environment
        if (!validateEnvironment()) {
            this.showFatalError('Environment configuration error. Please check API URL.');
            return;
        }

        // Cache DOM elements
        this.cacheElements();

        // Bind events
        this.bindEvents();

        // Load initial data
        await this.loadDashboardData();

        console.log(' Clinical Sanctuary UI ready');
    }

    cacheElements() {
        this.form = document.getElementById('prediction-form');
        this.submitBtn = document.getElementById('predict-btn');
        this.resultContainer = document.getElementById('result-container');
        this.clearBtn = this.form?.querySelector('button[type="reset"]');
    }

    bindEvents() {
        if (this.submitBtn) {
            this.submitBtn.addEventListener('click', (e) => this.handlePredict(e));
        }

        if (this.clearBtn) {
            this.clearBtn.addEventListener('click', () => this.handleClear());
        }

        // Real-time validation
        const billingInput = this.form?.querySelector('input[name="billing-amount"]');
        if (billingInput) {
            billingInput.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/[^0-9.]/g, '');
            });
        }
    }

    async handlePredict(e) {
        e.preventDefault();

        if (this.isLoading) return;

        // Validate form
        if (!this.validateForm()) return;

        // Collect data
        const formData = this.collectFormData();

        // Set loading state
        this.setLoading(true);
        this.hideResult();

        try {
            const result = await submitPrediction(formData);
            this.displayResult(result);
        } catch (error) {
            this.displayError(error.message);
            console.error('Prediction error:', error);
        } finally {
            this.setLoading(false);
        }
    }

    collectFormData() {
        const getValue = (name) => {
            const el = this.form?.querySelector(`[name="${name}"]`);
            return el?.value?.trim() || '';
        };

        return {
            age: getValue('age'),
            gender: getValue('gender'),
            blood_type: getValue('blood-type'),
            admission_type: getValue('admission-type'),
            billing_amount: getValue('billing-amount') || '0',
            insurance_provider: getValue('insurance-provider'),
            medical_condition: getValue('medical-condition'),
            medication: getValue('medication')
        };
    }

    validateForm() {
        this.clearErrors();

        const required = [
            { name: 'age', label: 'Age' },
            { name: 'gender', label: 'Gender' },
            { name: 'blood-type', label: 'Blood Type' },
            { name: 'admission-type', label: 'Admission Type' },
            { name: 'insurance-provider', label: 'Insurance Provider' },
            { name: 'medical-condition', label: 'Medical Condition' },
            { name: 'medication', label: 'Medication' }
        ];

        let isValid = true;

        for (const field of required) {
            const value = this.form?.querySelector(`[name="${field.name}"]`)?.value;
            if (!value?.trim()) {
                this.showFieldError(field.name, `${field.label} is required`);
                isValid = false;
            }
        }

        // Age validation
        const age = parseInt(this.form?.querySelector('[name="age"]')?.value);
        if (isNaN(age) || age < 0 || age > 120) {
            this.showFieldError('age', 'Age must be between 0 and 120');
            isValid = false;
        }

        return isValid;
    }

    displayResult(result) {
        const statusConfig = {
            'Normal': { color: 'bg-emerald-500', icon: 'check_circle' },
            'Abnormal': { color: 'bg-rose-500', icon: 'warning' },
            'Inconclusive': { color: 'bg-amber-500', icon: 'help' }
        };

        const config = statusConfig[result.predictedTestResult] || statusConfig.Inconclusive;
        const confidence = result.confidence ? Math.round(result.confidence * 100) : null;

        const html = `
      <div class="mt-8 p-8 bg-surface-container-lowest rounded-3xl shadow-lg border border-outline-variant/30 animate-fade-in">
        <div class="flex items-center justify-between mb-6">
          <div>
            <span class="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1 block">Prediction Result</span>
            <h3 class="text-3xl font-headline font-bold text-on-background">${result.predictedTestResult}</h3>
          </div>
          <div class="w-16 h-16 ${config.color} rounded-2xl flex items-center justify-center text-white shadow-lg">
            <span class="material-symbols-outlined text-3xl">${config.icon}</span>
          </div>
        </div>

        ${confidence !== null ? `
        <div class="mb-6">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-semibold text-on-surface-variant">Confidence Score</span>
            <span class="text-2xl font-headline font-bold text-primary">${confidence}%</span>
          </div>
          <div class="h-3 bg-surface-container-high rounded-full overflow-hidden">
            <div class="h-full bg-gradient-to-r from-primary to-primary-container transition-all duration-1000 ease-out" 
                 style="width: 0%" data-width="${confidence}%"></div>
          </div>
          <div class="flex justify-between mt-2 text-xs text-on-surface-variant">
            <span>Uncertain</span>
            <span>Highly Certain</span>
          </div>
        </div>
        ` : ''}

        <div class="flex items-center gap-4 text-xs text-on-surface-variant border-t border-outline-variant/20 pt-4">
          <span class="flex items-center gap-1">
            <span class="material-symbols-outlined text-sm">schedule</span>
            ${result.processedAt.toLocaleTimeString()}
          </span>
          ${result.modelVersion ? `
          <span class="flex items-center gap-1">
            <span class="material-symbols-outlined text-sm">model_training</span>
            ${result.modelVersion}
          </span>
          ` : ''}
        </div>
      </div>
    `;

        this.resultContainer.innerHTML = html;
        this.resultContainer.classList.remove('hidden');

        // Animate confidence bar
        setTimeout(() => {
            const bar = this.resultContainer.querySelector('[data-width]');
            if (bar) bar.style.width = bar.getAttribute('data-width');
        }, 100);
    }

    displayError(message) {
        const html = `
      <div class="mt-8 p-6 bg-error-container rounded-2xl border border-error/20 animate-fade-in">
        <div class="flex items-center gap-3">
          <span class="material-symbols-outlined text-error text-2xl">error</span>
          <div>
            <h4 class="font-headline font-bold text-on-error-container">Prediction Failed</h4>
            <p class="text-sm text-on-error-container/80">${message}</p>
          </div>
        </div>
      </div>
    `;

        this.resultContainer.innerHTML = html;
        this.resultContainer.classList.remove('hidden');
    }

    setLoading(loading) {
        this.isLoading = loading;
        this.submitBtn.disabled = loading;

        if (loading) {
            this.submitBtn.innerHTML = `
        <span class="animate-spin material-symbols-outlined">progress_activity</span>
        <span>Processing...</span>
      `;
            this.submitBtn.classList.add('opacity-70', 'cursor-not-allowed');
        } else {
            this.submitBtn.innerHTML = `
        <span>Predict Test Result</span>
        <span class="material-symbols-outlined group-hover:translate-x-1 transition-transform">bolt</span>
      `;
            this.submitBtn.classList.remove('opacity-70', 'cursor-not-allowed');
        }
    }

    handleClear() {
        this.hideResult();
        this.clearErrors();
    }

    hideResult() {
        this.resultContainer?.classList.add('hidden');
        this.resultContainer.innerHTML = '';
    }

    showFieldError(fieldName, message) {
        const field = this.form?.querySelector(`[name="${fieldName}"]`);
        if (!field) return;

        field.classList.add('ring-2', 'ring-error', 'bg-error-container/10');

        const errorDiv = document.createElement('div');
        errorDiv.className = 'text-xs text-error mt-1 animate-fade-in';
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);
    }

    clearErrors() {
        this.form?.querySelectorAll('.ring-error').forEach(el => {
            el.classList.remove('ring-2', 'ring-error', 'bg-error-container/10');
        });
        this.form?.querySelectorAll('.text-error.text-xs').forEach(el => el.remove());
    }

    async loadDashboardData() {
        try {
            const [metrics, trainingStatus] = await Promise.allSettled([
                getModelMetrics(),
                getTrainingStatus()
            ]);

            if (metrics.status === 'fulfilled') {
                this.updateMetricsDisplay(metrics.value);
            }

            if (trainingStatus.status === 'fulfilled') {
                console.log('Training status:', trainingStatus.value);
            }
        } catch (error) {
            console.warn('Failed to load dashboard data:', error);
        }
    }

    updateMetricsDisplay(metrics) {
        const formatted = formatMetrics(metrics);

        const accuracyEl = document.querySelector('[data-metric="accuracy"]');
        if (accuracyEl) accuracyEl.textContent = formatted.accuracy;

        const f1El = document.querySelector('[data-metric="f1"]');
        if (f1El) f1El.textContent = formatted.f1Score;
    }

    showFatalError(message) {
        document.body.innerHTML = `
      <div class="min-h-screen flex items-center justify-center bg-surface">
        <div class="text-center p-8">
          <span class="material-symbols-outlined text-6xl text-error mb-4">error</span>
          <h1 class="text-2xl font-headline font-bold text-on-background mb-2">Configuration Error</h1>
          <p class="text-on-surface-variant">${message}</p>
        </div>
      </div>
    `;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const app = new ClinicalSanctuaryApp();
    app.init();
});

export default ClinicalSanctuaryApp;