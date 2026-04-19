import ENV from '../config.js';

class ApiClient {
    constructor() {
        this.baseURL = ENV.API_BASE_URL;
        this.timeout = ENV.REQUEST_TIMEOUT;
        this.maxRetries = ENV.MAX_RETRIES;
        this.retryDelay = 1000; // ms
    }

   
    buildUrl(endpoint) {
        const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
        const cleanBase = this.baseURL.endsWith('/') ? this.baseURL.slice(0, -1) : this.baseURL;
        return `${cleanBase}/${cleanEndpoint}`;
    }

    async request(endpoint, options = {}, retryCount = 0) {
        const url = this.buildUrl(endpoint);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        const defaultHeaders = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Origin': window.location.origin
        };

        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    ...defaultHeaders,
                    ...options.headers
                },
                signal: controller.signal,
                credentials: 'omit' 
            });

            clearTimeout(timeoutId);

            // Handle HTTP errors
            if (!response.ok) {
                await this.handleHttpError(response);
            }

            // Parse JSON response
            const data = await response.json();
            return data;

        } catch (error) {
            clearTimeout(timeoutId);

            // Retry logic for network errors
            if (retryCount < this.maxRetries && this.isRetryableError(error)) {
                console.warn(`Request failed, retrying... (${retryCount + 1}/${this.maxRetries})`);
                await this.delay(this.retryDelay * (retryCount + 1));
                return this.request(endpoint, options, retryCount + 1);
            }

            throw this.formatError(error);
        }
    }

    async handleHttpError(response) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        let errorDetails = {};

        try {
            
            const errorData = await response.json();
            errorDetails = errorData;

            if (errorData.detail) {
                if (Array.isArray(errorData.detail)) {
                    errorMessage = errorData.detail.map(e =>
                        `${e.loc?.join('.')}: ${e.msg}`
                    ).join(', ');
                } else {
                    errorMessage = errorData.detail;
                }
            }
        } catch (e) {
            errorMessage = await response.text() || errorMessage;
        }

        switch (response.status) {
            case 429:
                throw new Error('Rate limit exceeded. Please wait a moment before trying again.');
            case 422:
                throw new Error(`Validation error: ${errorMessage}`);
            case 500:
                throw new Error('Server error. Please try again later.');
            case 503:
                throw new Error('Service unavailable. The ML model may be loading.');
            default:
                throw new Error(errorMessage);
        }
    }

    isRetryableError(error) {
        return error.name === 'TypeError' || // Network errors
            error.name === 'AbortError' || // Timeout
            error.message.includes('Failed to fetch');
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    formatError(error) {
        if (error.name === 'AbortError') {
            return new Error('Request timed out. Please check your connection.');
        }
        return error;
    }

    get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    }

    post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }
}

export const apiClient = new ApiClient();
export default apiClient;