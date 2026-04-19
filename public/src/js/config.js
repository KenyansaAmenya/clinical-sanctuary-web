const ENV = {
    // API Base URL - configure via Vercel environment variables
    API_BASE_URL: import.meta?.env?.VITE_API_URL ||
        process?.env?.VITE_API_URL ||
        window?.ENV?.API_URL ||
        'https://healthcare-ml-pipeline.onrender.com',

    // Feature flags
    ENABLE_MOCK_DATA: false,
    ENABLE_DEBUG_LOGGING: import.meta?.env?.DEV || false,

    // API Endpoints
    ENDPOINTS: {
        PREDICT: '/predict',
        METRICS: '/metrics',
        TRAINING_STATUS: '/training/status',
        HEALTH: '/health'
    },

    // Request configuration
    REQUEST_TIMEOUT: 30000, // 30 seconds
    MAX_RETRIES: 3,

    // Validation
    MAX_AGE: 120,
    MIN_AGE: 0,
    MAX_BILLING_AMOUNT: 1000000
};

// Validation helper
export const validateEnvironment = () => {
    if (!ENV.API_BASE_URL) {
        console.error('CRITICAL: API_BASE_URL is not configured');
        return false;
    }

    if (ENV.ENABLE_DEBUG_LOGGING) {
        console.log('Environment configured:', {
            apiUrl: ENV.API_BASE_URL,
            endpoints: ENV.ENDPOINTS
        });
    }

    return true;
};

export default ENV;