
import { useEffect, useState } from 'react';
import { supabase } from './supabase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

function MetricCard({ title, value, unit, label, loading }) {
    if (loading) {
        return (
            <div className="card">
                <h2>{title}</h2>
                <div className="skeleton" style={{ height: '32px', width: '60%', marginBottom: '4px' }}></div>
                <div className="skeleton" style={{ height: '16px', width: '40%' }}></div>
            </div>
        );
    }
    return (
        <div className="card">
            <h2>{title}</h2>
            <div className="metric">
                {value} <span className="metric-label" style={{ fontSize: '18px', fontWeight: '500' }}>{unit}</span>
            </div>
            {label && <div className="metric-label">{label}</div>}
        </div>
    );
}

function ChartCard({ title, children, loading }) {
    if (loading) {
        return (
             <div className="card" style={{ minHeight: '400px' }}>
                <h2>{title}</h2>
                <div className="skeleton" style={{ flex: 1, width: '100%', borderRadius: '4px', marginTop: '300px' }}></div>
            </div>
        )
    }
    return (
        <div className="card" style={{ minHeight: '400px' }}>
            <h2>{title}</h2>
            <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                    {children}
                </div>
            </div>
        </div>
    )
}

export function Dashboard() {
    const [metrics, setMetrics] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const { data, error } = await supabase
                .from('monthly_metrics')
                .select('*')
                .order('month_date', { ascending: true });
            
            if (error) throw error;
            setMetrics(data);
        } catch (error) {
            console.error('Error fetching metrics:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const subscription = supabase
            .channel('public:monthly_reports')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'monthly_reports' }, fetchData)
            .subscribe();

        return () => {
             subscription.unsubscribe();
        };
    }, []);

    // Last Month Data
    const latest = metrics.length > 0 ? metrics[metrics.length - 1] : {};

    return (
        <div className="dashboard-content">
            {/* KPI Cards Row */}
            <div className="data-grid" style={{ marginBottom: '64px' }}>
                <MetricCard 
                    loading={loading}
                    title="Revenue / Hectare"
                    value={latest.revenue_per_hectare ? latest.revenue_per_hectare.toLocaleString(undefined, { maximumFractionDigits: 0 }) : 0}
                    unit="$ / ha"
                    label={latest.month_date ? `Month: ${latest.month_date}` : 'No Data'}
                />
                <MetricCard 
                    loading={loading}
                    title="GHG per Box"
                    value={latest.ghg_per_box ? latest.ghg_per_box.toFixed(2) : 0}
                    unit="kg CO2e"
                />
                <MetricCard 
                    loading={loading}
                    title="Water Usage"
                    value={latest.water_usage_liters ? (latest.water_usage_liters / 1000).toFixed(0) : 0}
                    unit="m³"
                    label="Volume (Est.)"
                />
            </div>

            {/* Charts Row */}
            <div className="charts-grid" style={{ marginTop: '32px', marginBottom: '64px' }}>
                <ChartCard title="GHG Emissions vs Revenue" loading={loading}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={metrics} margin={{ top: 5, right: 40, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e6ebf1" />
                            <XAxis dataKey="month_date" axisLine={false} tickLine={false} tick={{fill: '#8898aa', fontSize: 12}} dy={10} />
                            <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fill: '#ef4444', fontSize: 12}} />
                            <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fill: '#10b981', fontSize: 12}} />
                            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 13px 27px -5px rgba(50,50,93,.25)' }} />
                            <Line yAxisId="left" type="monotone" dataKey="ghg_emissions_kg" stroke="#ef4444" strokeWidth={2} name="GHG (kg)" />
                            <Line yAxisId="right" type="monotone" dataKey="total_revenue" stroke="#10b981" strokeWidth={2} name="Revenue ($)" />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartCard>
                
                <ChartCard title="Water Productivity" loading={loading}>
                     <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={metrics}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e6ebf1" />
                            <XAxis dataKey="month_date" axisLine={false} tickLine={false} tick={{fill: '#8898aa', fontSize: 12}} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#8898aa', fontSize: 12}} />
                            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 13px 27px -5px rgba(50,50,93,.25)' }} />
                            <Bar dataKey="water_usage_liters" fill="#0ea5e9" name="Water (Liters)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>

            {/* Data Table */}
            <div className="card" style={{ padding: 0, overflow: 'hidden', marginTop: '32px' }}>
                <h2 style={{ padding: '24px 24px 0 24px' }}>Detailed History</h2>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Month</th>
                                <th>Farm Area</th>
                                <th>Boxes Prod.</th>
                                <th>Revenue</th>
                                <th>GHG (Total)</th>
                                <th>GHG / Box</th>
                            </tr>
                        </thead>
                         <tbody>
                            {loading ? (
                                // Skeleton Rows
                                Array.from({ length: 3 }).map((_, i) => (
                                    <tr key={i}>
                                        <td><div className="skeleton" style={{ height: '20px', width: '80px' }}></div></td>
                                        <td><div className="skeleton" style={{ height: '20px', width: '40px' }}></div></td>
                                        <td><div className="skeleton" style={{ height: '20px', width: '60px' }}></div></td>
                                        <td><div className="skeleton" style={{ height: '20px', width: '80px' }}></div></td>
                                        <td><div className="skeleton" style={{ height: '20px', width: '60px' }}></div></td>
                                        <td><div className="skeleton" style={{ height: '20px', width: '50px' }}></div></td>
                                    </tr>
                                ))
                            ) : (
                                metrics.map((row) => (
                                    <tr key={row.id}>
                                        <td>{row.month_date}</td>
                                        <td>{row.farm_area || '-'}</td>
                                        <td>{row.boxes_produced?.toLocaleString()}</td>
                                        <td>${(row.total_revenue || 0).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}</td>
                                        <td>{(row.ghg_emissions_kg || 0).toLocaleString(undefined, {maximumFractionDigits: 0})}</td>
                                        <td>{(row.ghg_per_box || 0).toFixed(2)}</td>
                                    </tr>
                                ))
                            )}
                            {!loading && metrics.length === 0 && (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-tertiary)', padding: '40px' }}>
                                        No data available.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
