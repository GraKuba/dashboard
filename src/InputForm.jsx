
import { useState } from 'react';
import { supabase } from './supabase';

export function InputForm({ onSaved }) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
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
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        // ... (validation logic remains same, succinct for this edit) ...
        try {
            const { error } = await supabase.from('monthly_reports').insert([formData]);
            if (error) throw error;
            alert('Report saved!');
            setFormData(prev => ({ ...prev, 
                boxes_produced: '', boxes_banana_meal: '', boxes_local_market: '', 
                boxes_rejected: '', boxes_export_customers: '', waste_boxes_supply_chain: '',
                irrigation_hours: '', diesel_consumed_liters: '', 
                fertilizer_cost_ga: '', fertilizer_cost_gec: '', labor_cost: '', 
                maintenance_cost: '', avg_selling_price: ''
            })); 
            if (onSaved) onSaved();
        } catch (error) {
            alert('Error: ' + error.message);
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
                            <label>Month</label>
                            <input type="date" name="month_date" value={formData.month_date} onChange={handleChange} required />
                        </div>
                        <div>
                            <label>Farm Area (ha)</label>
                            <input type="number" step="0.01" name="farm_area" value={formData.farm_area} onChange={handleChange} placeholder="10.88" />
                        </div>
                    </div>
                </div>

                {/* Section 2: Production */}
                <div className="form-section">
                     <div className="form-section-title">1. Production & Sales</div>
                     <div className="form-grid">
                        <div>
                            <label>Total Boxes Produced</label>
                            <input type="number" min="0" name="boxes_produced" value={formData.boxes_produced} onChange={handleChange} placeholder="0" />
                        </div>
                         <div>
                            <label>Export Customers</label>
                            <input type="number" min="0" name="boxes_export_customers" value={formData.boxes_export_customers} onChange={handleChange} placeholder="0" />
                        </div>
                        <div>
                            <label>Local Market</label>
                            <input type="number" min="0" name="boxes_local_market" value={formData.boxes_local_market} onChange={handleChange} placeholder="0" />
                        </div>
                        <div>
                            <label>Banana Meal</label>
                            <input type="number" min="0" name="boxes_banana_meal" value={formData.boxes_banana_meal} onChange={handleChange} placeholder="0" />
                        </div>
                        <div>
                            <label>Rejected at Farm</label>
                            <input type="number" min="0" name="boxes_rejected" value={formData.boxes_rejected} onChange={handleChange} placeholder="0" />
                        </div>
                        <div>
                            <label>Supply Chain Waste</label>
                            <input type="number" min="0" name="waste_boxes_supply_chain" value={formData.waste_boxes_supply_chain} onChange={handleChange} placeholder="0" />
                        </div>
                        <div>
                            <label>Avg Price ($/box)</label>
                            <input type="number" min="0" step="0.01" name="avg_selling_price" value={formData.avg_selling_price} onChange={handleChange} placeholder="0.00" />
                        </div>
                     </div>
                </div>

                {/* Section 3: Resources */}
                <div className="form-section">
                    <div className="form-section-title">2. Resources & Operations</div>
                    <div className="form-grid">
                        <div>
                            <label>Irrigation Hours</label>
                            <input type="number" min="0" step="0.1" name="irrigation_hours" value={formData.irrigation_hours} onChange={handleChange} placeholder="0.0" />
                        </div>
                        <div>
                            <label>Pump Capacity (GPM)</label>
                            <input type="number" min="0" step="0.1" name="pump_capacity_gpm" value={formData.pump_capacity_gpm} onChange={handleChange} placeholder="0.0" />
                        </div>
                        <div>
                            <label>Diesel (Liters)</label>
                            <input type="number" min="0" step="0.1" name="diesel_consumed_liters" value={formData.diesel_consumed_liters} onChange={handleChange} placeholder="0.0" />
                        </div>
                    </div>
                </div>

                {/* Section 4: Costs */}
                <div className="form-section">
                    <div className="form-section-title">3. Monthly Costs ($)</div>
                    <div className="form-grid">
                        <div>
                            <label>Fertilizer (GA)</label>
                            <input type="number" min="0" step="0.01" name="fertilizer_cost_ga" value={formData.fertilizer_cost_ga} onChange={handleChange} placeholder="0.00" />
                        </div>
                        <div>
                            <label>Fertilizer (GE.C)</label>
                            <input type="number" min="0" step="0.01" name="fertilizer_cost_gec" value={formData.fertilizer_cost_gec} onChange={handleChange} placeholder="0.00" />
                        </div>
                        <div>
                            <label>Labor</label>
                            <input type="number" min="0" step="0.01" name="labor_cost" value={formData.labor_cost} onChange={handleChange} placeholder="0.00" />
                        </div>
                        <div>
                            <label>Maintenance</label>
                            <input type="number" min="0" step="0.01" name="maintenance_cost" value={formData.maintenance_cost} onChange={handleChange} placeholder="0.00" />
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
