
// Helper validation function
export const validateFormData = (data) => {
    // 1. Negative numbers
    const numericFields = [
        'farm_area', 'boxes_produced', 'boxes_banana_meal', 'boxes_local_market',
        'boxes_rejected', 'boxes_export_customers', 'waste_boxes_supply_chain',
        'irrigation_hours', 'diesel_consumed_liters', 'pump_capacity_gpm',
        'fertilizer_cost_ga', 'fertilizer_cost_gec', 'labor_cost', 'maintenance_cost',
        'avg_selling_price'
    ];
    
    for (const field of numericFields) {
        if (data[field] && Number(data[field]) < 0) {
            return { isValid: false, message: `Value for ${field.replace(/_/g, ' ')} cannot be negative.` };
        }
    }

    // 2. Cross-field validation (Total Boxes vs Breakdown)
    const total = Number(data.boxes_produced || 0);
    const sum = Number(data.boxes_export_customers || 0) +
                Number(data.boxes_local_market || 0) +
                Number(data.boxes_banana_meal || 0) +
                Number(data.boxes_rejected || 0) +
                Number(data.waste_boxes_supply_chain || 0);

    if (total > 0 && Math.abs(total - sum) > (total * 0.05)) { // 5% tolerance
        return { isValid: true, warning: `Warning: Total boxes (${total}) varies from component sum (${sum}) by >5%.` };
    }
    
    return { isValid: true };
};
