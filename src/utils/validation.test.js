import { describe, it, expect } from 'vitest';
import { validateFormData } from './validation';

describe('validateFormData', () => {
    it('returns valid for empty data', () => {
        const result = validateFormData({});
        expect(result.isValid).toBe(true);
    });

    it('rejects negative values', () => {
        const result = validateFormData({ boxes_produced: -10 });
        expect(result.isValid).toBe(false);
        expect(result.message).toContain('cannot be negative');
    });

    it('accepts zero values', () => {
        const result = validateFormData({ boxes_produced: 0 });
        expect(result.isValid).toBe(true);
    });

    it('accepts positive values', () => {
        const result = validateFormData({ boxes_produced: 100 });
        expect(result.isValid).toBe(true);
    });

    it('warns when box totals do not match components', () => {
        const result = validateFormData({
            boxes_produced: 100,
            boxes_export_customers: 50,
            boxes_local_market: 10,
            // Sum is 60, differs from 100 by 40%
        });
        expect(result.isValid).toBe(true);
        expect(result.warning).toContain('Warning');
        expect(result.warning).toContain('varies from component sum');
    });

    it('does not warn when totals are within tolerance', () => {
        const result = validateFormData({
            boxes_produced: 100,
            boxes_export_customers: 50,
            boxes_local_market: 30,
            boxes_banana_meal: 10,
            boxes_rejected: 5,
            waste_boxes_supply_chain: 3,
            // Sum is 98, within 5% of 100
        });
        expect(result.isValid).toBe(true);
        expect(result.warning).toBeUndefined();
    });

    it('validates all numeric fields for negatives', () => {
        const fields = [
            'farm_area', 'irrigation_hours', 'diesel_consumed_liters',
            'pump_capacity_gpm', 'fertilizer_cost_ga', 'fertilizer_cost_gec',
            'labor_cost', 'maintenance_cost', 'avg_selling_price'
        ];

        for (const field of fields) {
            const result = validateFormData({ [field]: -1 });
            expect(result.isValid).toBe(false);
            expect(result.message).toContain('cannot be negative');
        }
    });
});
