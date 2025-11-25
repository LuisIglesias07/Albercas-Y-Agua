import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getSalesStatistics, getTopSellingProducts, getDailySales, getRevenueByCategory } from '../../services/analyticsService';
import type { SalesStats, ProductSales, DailySales } from '../../services/analyticsService';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Analytics.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export const Analytics = () => {
    const navigate = useNavigate();
    const { userProfile } = useAuth();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<SalesStats | null>(null);
    const [topProducts, setTopProducts] = useState<ProductSales[]>([]);
    const [dailySales, setDailySales] = useState<DailySales[]>([]);
    const [categoryRevenue, setCategoryRevenue] = useState<Array<{ category: string; revenue: number }>>([]);

    useEffect(() => {
        if (userProfile && userProfile.role !== 'admin') {
            navigate('/');
        }
    }, [userProfile, navigate]);

    useEffect(() => {
        loadAnalytics();
    }, []);

    const loadAnalytics = async () => {
        try {
            const [statsData, topProductsData, dailySalesData, categoryData] = await Promise.all([
                getSalesStatistics(),
                getTopSellingProducts(5),
                getDailySales(30),
                getRevenueByCategory()
            ]);

            setStats(statsData);
            setTopProducts(topProductsData);
            setDailySales(dailySalesData);
            setCategoryRevenue(categoryData);
        } catch (error) {
            console.error('Error loading analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount: number): string => {
        return `$${amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;
    };

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-MX', { month: 'short', day: 'numeric' });
    };

    if (userProfile?.role !== 'admin') {
        return null;
    }

    if (loading) {
        return (
            <div className="analytics-dashboard">
                <div className="container">
                    <div className="loading-spinner">
                        <div className="spinner"></div>
                        <p>Cargando estadísticas...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="analytics-dashboard">
            <div className="container">
                <div className="analytics-header">
                    <h1>📊 Dashboard de Analíticas</h1>
                    <p className="subtitle">Estadísticas y reportes de ventas</p>
                </div>

                {/* KPI Cards */}
                <div className="kpi-grid">
                    <div className="kpi-card revenue">
                        <div className="kpi-icon">💰</div>
                        <div className="kpi-content">
                            <h3>Ingresos Totales</h3>
                            <p className="kpi-value">{formatCurrency(stats?.totalRevenue || 0)}</p>
                            <span className="kpi-label">De órdenes pagadas</span>
                        </div>
                    </div>

                    <div className="kpi-card orders">
                        <div className="kpi-icon">📦</div>
                        <div className="kpi-content">
                            <h3>Total Órdenes</h3>
                            <p className="kpi-value">{stats?.totalOrders || 0}</p>
                            <span className="kpi-label">Todas las órdenes</span>
                        </div>
                    </div>

                    <div className="kpi-card pending">
                        <div className="kpi-icon">⏳</div>
                        <div className="kpi-content">
                            <h3>Órdenes Pendientes</h3>
                            <p className="kpi-value">{stats?.pendingOrders || 0}</p>
                            <span className="kpi-label">Requieren atención</span>
                        </div>
                    </div>

                    <div className="kpi-card average">
                        <div className="kpi-icon">📈</div>
                        <div className="kpi-content">
                            <h3>Ticket Promedio</h3>
                            <p className="kpi-value">{formatCurrency(stats?.averageOrderValue || 0)}</p>
                            <span className="kpi-label">Por orden</span>
                        </div>
                    </div>
                </div>

                {/* Charts Grid */}
                <div className="charts-grid">
                    {/* Daily Sales Line Chart */}
                    <div className="chart-card full-width">
                        <h3>Ventas Diarias (Últimos 30 días)</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={dailySales}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" tickFormatter={formatDate} />
                                <YAxis yAxisId="left" />
                                <YAxis yAxisId="right" orientation="right" />
                                <Tooltip
                                    labelFormatter={formatDate}
                                    formatter={(value: any, name: string) => {
                                        if (name === 'revenue') return formatCurrency(value);
                                        return value;
                                    }}
                                />
                                <Legend />
                                <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#0088FE" name="Ingresos" strokeWidth={2} />
                                <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#00C49F" name="Órdenes" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Top Selling Products Bar Chart */}
                    <div className="chart-card">
                        <h3>Top 5 Productos Más Vendidos</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={topProducts} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis type="category" dataKey="productName" width={150} />
                                <Tooltip formatter={(value: any) => `${value} unidades`} />
                                <Legend />
                                <Bar dataKey="quantitySold" fill="#8884D8" name="Cantidad Vendida" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Revenue by Category Pie Chart */}
                    <div className="chart-card">
                        <h3>Ingresos por Categoría</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={categoryRevenue}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={(props: any) => `${props.category}: ${Math.round((props.percent || 0) * 100)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="revenue"
                                >
                                    {categoryRevenue.map((_entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value: any) => formatCurrency(value)} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Products Table */}
                <div className="table-section">
                    <h3>Productos Más Vendidos - Detalle</h3>
                    <div className="products-revenue-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th>Categoría</th>
                                    <th>Unidades Vendidas</th>
                                    <th>Ingresos</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topProducts.map((product, index) => (
                                    <tr key={index}>
                                        <td><strong>{product.productName}</strong></td>
                                        <td>{product.category}</td>
                                        <td>{product.quantitySold}</td>
                                        <td className="revenue-cell">{formatCurrency(product.revenue)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};
