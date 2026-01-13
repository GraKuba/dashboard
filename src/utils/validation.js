import { VALIDATION } from '../constants';

// Numeric fields that must be non-negative
const NUMERIC_FIELDS = [
    'farm_area', 'boxes_produced', 'boxes_banana_meal', 'boxes_local_market',
    'boxes_rejected', 'boxes_export_customers', 'waste_boxes_supply_chain',
    'irrigation_hours', 'diesel_consumed_liters', 'pump_capacity_gpm',
    'fertilizer_cost_ga', 'fertilizer_cost_gec', 'labor_cost', 'maintenance_cost',
    'avg_selling_price'
];

/**
 * Validates form data for monthly reports
 * @param {Object} data - Form data object
 * @returns {{ isValid: boolean, message?: string, warning?: string }}
 */
export const validateFormData = (data) => {
    // 1. Check for negative numbers
    for (const field of NUMERIC_FIELDS) {
        if (data[field] && Number(data[field]) < 0) {
            const fieldLabel = field.replace(/_/g, ' ');
            return { 
                isValid: false, 
                message: `Value for ${fieldLabel} cannot be negative.` 
            };
        }
    }

    // 2. Cross-field validation (Total Boxes vs Breakdown)
    const total = Number(data.boxes_produced || 0);
    const componentSum = 
        Number(data.boxes_export_customers || 0) +
        Number(data.boxes_local_market || 0) +
        Number(data.boxes_banana_meal || 0) +
        Number(data.boxes_rejected || 0) +
        Number(data.waste_boxes_supply_chain || 0);

    const tolerance = total * VALIDATION.BOX_TOLERANCE_PERCENT;
    const discrepancy = Math.abs(total - componentSum);

    if (total > 0 && discrepancy > tolerance) {
        const percentLabel = (VALIDATION.BOX_TOLERANCE_PERCENT * 100).toFixed(0);
        return { 
            isValid: true, 
            warning: `Warning: Total boxes (${total}) varies from component sum (${componentSum}) by >${percentLabel}%.` 
        };
    }
    
    return { isValid: true };
};
