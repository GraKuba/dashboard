
import { useState, useEffect } from 'react';
import { supabase } from './supabase';
import { toast } from 'sonner';
import { validateFormData } from './utils/validation';

export function InputForm({ onSaved }) {
    const [loading, setLoading] = useState(false);
    
    const initialData = {
        month_date: new Date().toISOString().slice(0, 7) + '-01',
        farm_area: '',
        boxes_produced: '',
        boxes_banana_meal: '',
        boxes_local_market: '',
        boxes_rejected: '',
        boxes_export_customers: '',
        waste_boxes_supply_chain: '',
        irrigation_hours: '',
        diesel_consumed_liters: '',
        pump_capacity_gpm: '', 
        fertilizer_cost_ga: '',
        fertilizer_cost_gec: '',
        labor_cost: '',
        maintenance_cost: '',
        avg_selling_price: ''
    };

    const [formData, setFormData] = useState(initialData);

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('monthly_report_draft');
        if (saved) {
            try {
                setFormData({ ...initialData, ...JSON.parse(saved) });
                toast.info('Restored draft from session.');
            } catch (e) {
                console.error("Failed to load draft", e);
            }
        }
    }, []);

    // Save to localStorage on change
    const handleChange = (e) => {
        const nextData = { ...formData, [e.target.name]: e.target.value };
        setFormData(nextData);
        localStorage.setItem('monthly_report_draft', JSON.stringify(nextData));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const validation = validateFormData(formData);
        if (!validation.isValid) {
            toast.error(validation.message);
            setLoading(false);
            return;
        }
        
        if (validation.warning) {
             toast.warning(validation.warning);
             // Proceed anyway? Yes, warnings shouldn't block.
        }

        try {
            const { error } = await supabase.from('monthly_reports').insert([formData]);
            if (error) throw error;
            
            toast.success('Report saved successfully!');
            localStorage.removeItem('monthly_report_draft');
            setFormData(initialData);
            if (onSaved) onSaved();
        } catch (error) {
            toast.error('Error saving: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="input-form-container">
            <div className="form-header">
                <h2>New Monthly Data Entry</h2>
                <div style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
                    Enter production and resource metrics for the reporting period.
                </div>
            </div>
            
            <form onSubmit={handleSubmit}>
                {/* Section 1: Metadata */}
                <div className="form-section">
                    <div className="form-section-title">Report Details</div>
                    <div className="form-grid">
                        <div>
                            <label htmlFor="month_date">Month</label>
                            <input id="month_date" type="date" name="month_date" value={formData.month_date} onChange={handleChange} required />
                        </div>
                        <div>
                            <label htmlFor="farm_area">Farm Area (ha)</label>
                            <input id="farm_area" type="number" step="0.01" name="farm_area" value={formData.farm_area} onChange={handleChange} placeholder="10.88" />
                        </div>
                    </div>
                </div>

                {/* Section 2: Production */}
                <div className="form-section">
                     <div className="form-section-title">1. Production & Sales</div>
                     <div className="form-grid">
                        <div>
                            <label htmlFor="boxes_produced">Total Boxes Produced</label>
                            <input id="boxes_produced" type="number" min="0" name="boxes_produced" value={formData.boxes_produced} onChange={handleChange} placeholder="0" />
                        </div>
                         <div>
                            <label htmlFor="boxes_export_customers">Export Customers</label>
                            <input id="boxes_export_customers" type="number" min="0" name="boxes_export_customers" value={formData.boxes_export_customers} onChange={handleChange} placeholder="0" />
                        </div>
                        <div>
                            <label htmlFor="boxes_local_market">Local Market</label>
                            <input id="boxes_local_market" type="number" min="0" name="boxes_local_market" value={formData.boxes_local_market} onChange={handleChange} placeholder="0" />
                        </div>
                        <div>
                            <label htmlFor="boxes_banana_meal">Banana Meal</label>
                            <input id="boxes_banana_meal" type="number" min="0" name="boxes_banana_meal" value={formData.boxes_banana_meal} onChange={handleChange} placeholder="0" />
                        </div>
                        <div>
                            <label htmlFor="boxes_rejected">Rejected at Farm</label>
                            <input id="boxes_rejected" type="number" min="0" name="boxes_rejected" value={formData.boxes_rejected} onChange={handleChange} placeholder="0" />
                        </div>
                        <div>
                            <label htmlFor="waste_boxes_supply_chain">Supply Chain Waste</label>
                            <input id="waste_boxes_supply_chain" type="number" min="0" name="waste_boxes_supply_chain" value={formData.waste_boxes_supply_chain} onChange={handleChange} placeholder="0" />
                        </div>
                        <div>
                            <label htmlFor="avg_selling_price">Avg Price ($/box)</label>
                            <input id="avg_selling_price" type="number" min="0" step="0.01" name="avg_selling_price" value={formData.avg_selling_price} onChange={handleChange} placeholder="0.00" />
                        </div>
                     </div>
                </div>

                {/* Section 3: Resources */}
                <div className="form-section">
                    <div className="form-section-title">2. Resources & Operations</div>
                    <div className="form-grid">
                        <div>
                            <label htmlFor="irrigation_hours">Irrigation Hours</label>
                            <input id="irrigation_hours" type="number" min="0" step="0.1" name="irrigation_hours" value={formData.irrigation_hours} onChange={handleChange} placeholder="0.0" />
                        </div>
                        <div>
                            <label htmlFor="pump_capacity_gpm">Pump Capacity (GPM)</label>
                            <input id="pump_capacity_gpm" type="number" min="0" step="0.1" name="pump_capacity_gpm" value={formData.pump_capacity_gpm} onChange={handleChange} placeholder="0.0" />
                        </div>
                        <div>
                            <label htmlFor="diesel_consumed_liters">Diesel (Liters)</label>
                            <input id="diesel_consumed_liters" type="number" min="0" step="0.1" name="diesel_consumed_liters" value={formData.diesel_consumed_liters} onChange={handleChange} placeholder="0.0" />
                        </div>
                    </div>
                </div>

                {/* Section 4: Costs */}
                <div className="form-section">
                    <div className="form-section-title">3. Monthly Costs ($)</div>
                    <div className="form-grid">
                        <div>
                            <label htmlFor="fertilizer_cost_ga">Fertilizer (GA)</label>
                            <input id="fertilizer_cost_ga" type="number" min="0" step="0.01" name="fertilizer_cost_ga" value={formData.fertilizer_cost_ga} onChange={handleChange} placeholder="0.00" />
                        </div>
                        <div>
                            <label htmlFor="fertilizer_cost_gec">Fertilizer (GE.C)</label>
                            <input id="fertilizer_cost_gec" type="number" min="0" step="0.01" name="fertilizer_cost_gec" value={formData.fertilizer_cost_gec} onChange={handleChange} placeholder="0.00" />
                        </div>
                        <div>
                            <label htmlFor="labor_cost">Labor</label>
                            <input id="labor_cost" type="number" min="0" step="0.01" name="labor_cost" value={formData.labor_cost} onChange={handleChange} placeholder="0.00" />
                        </div>
                        <div>
                            <label htmlFor="maintenance_cost">Maintenance</label>
                            <input id="maintenance_cost" type="number" min="0" step="0.01" name="maintenance_cost" value={formData.maintenance_cost} onChange={handleChange} placeholder="0.00" />
                        </div>
                    </div>
                </div>

                <div className="form-actions">
                    <button type="button" className="text-btn" style={{ marginTop: 0 }} onClick={onSaved}>Cancel</button>
                    <button type="submit" className="primary-btn" style={{ width: 'auto', marginTop: 0 }} disabled={loading}>
                        {loading ? 'Saving...' : 'Save Report'}
                    </button>
                </div>
            </form>
        </div>
    );
}
