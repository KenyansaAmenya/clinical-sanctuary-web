import apiClient from './client.js';
import ENV from '../config.js';

export async function getModelMetrics() {
    const response = await apiClient.get(ENV.ENDPOINTS.METRICS);

    return {
        modelType: response.model_type,
        accuracy: response.accuracy,
        precision: response.precision,
        recall: response.recall,
        f1Score: response.f1_score,
        confusionMatrix: response.confusion_matrix,
        trainingSamples: response.training_samples,
        trainedAt: response.trained_at ? new Date(response.trained_at) : null
    };
}

export async function getTrainingStatus() {
    const response = await apiClient.get(ENV.ENDPOINTS.TRAINING_STATUS);

    return {
        status: response.status,
        lastTraining: response.last_training ? new Date(response.last_training) : null,
        currentModel: response.current_model,
        nextScheduledTraining: response.next_scheduled_training
    };
}

export function formatMetrics(metrics) {
    return {
        accuracy: `${(metrics.accuracy * 100).toFixed(1)}%`,
        f1Score: metrics.f1Score.toFixed(3),
        precision: `${(metrics.precision * 100).toFixed(1)}%`,
        recall: `${(metrics.recall * 100).toFixed(1)}%`,
        samples: metrics.trainingSamples.toLocaleString()
    };
}