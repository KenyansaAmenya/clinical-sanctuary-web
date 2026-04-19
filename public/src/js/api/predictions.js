import apiClient from './client.js';
import ENV from '../config.js';


export async function submitPrediction(formData) {
    const payload = {
        Age: parseInt(formData.age),
        Gender: formData.gender,
        "Blood Type": formData.blood_type,
        "Medical Condition": formData.medical_condition,
        "Billing Amount": parseFloat(formData.billing_amount),
        "Admission Type": formData.admission_type,
        "Insurance Provider": formData.insurance_provider,
        Medication: formData.medication
    };

   
    validatePredictionPayload(payload);

    const response = await apiClient.post(ENV.ENDPOINTS.PREDICT, payload);

    return {
        predictedTestResult: response.predicted_test_result,
        confidence: response.confidence,
        modelVersion: response.model_version,
        processedAt: new Date(response.processed_at),
        raw: response 
    };
}

function validatePredictionPayload(payload) {
    const errors = [];

    if (payload.Age < 0 || payload.Age > 120) {
        errors.push('Age must be between 0 and 120');
    }

    if (!['Male', 'Female'].includes(payload.Gender)) {
        errors.push('Gender must be Male or Female');
    }

    if (!['Emergency', 'Urgent', 'Elective'].includes(payload["Admission Type"])) {
        errors.push('Admission Type must be Emergency, Urgent, or Elective');
    }

    if (payload["Billing Amount"] < 0) {
        errors.push('Billing Amount cannot be negative');
    }

    if (errors.length > 0) {
        throw new Error(errors.join(', '));
    }
}

export async function getPredictionHistory() {
    return apiClient.get('/predictions/history');
}