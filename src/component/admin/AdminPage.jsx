import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bar, Pie } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import ApiService from "../../service/ApiService";
import '../../style/adminPage.css';

Chart.register(...registerables);

const AdminPage = () => {
    const navigate = useNavigate();
    // Initial state with all required statuses
    const [stats, setStats] = useState({
        orderStatus: {
            PENDING: 0,
            CONFIRMED: 0,
            SHIPPED: 0,
            DELIVERED: 0,
            CANCELLED: 0,
            RETURNED: 0
        },
        monthlyProfit: 0,
        upcomingProfit: 0,
        totalClients: 0
    });
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState("month"); // month, quarter, year

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const response = await ApiService.getAdminStatistics(timeRange);
                
                // Debug: Log raw response
                console.log("Backend Response:", JSON.stringify(response, null, 2));
                
                // Transform response to match frontend expectations
                setStats({
                    orderStatus: {
                        PENDING: response.orderStatus?.PENDING ?? 0,
                        CONFIRMED: response.orderStatus?.CONFIRMED ?? 0,
                        SHIPPED: response.orderStatus?.SHIPPED ?? 0,
                        DELIVERED: response.orderStatus?.DELIVERED ?? 0,
                        CANCELLED: response.orderStatus?.CANCELLED ?? 0,
                        RETURNED: response.orderStatus?.RETURNED ?? 0
                    },
                    monthlyProfit: response.monthlyProfit ?? 0,
                    upcomingProfit: response.upcomingProfit ?? 0,
                    totalClients: response.totalClients ?? 0
                });
                
            } catch (error) {
                console.error("Fetch error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [timeRange]);

    const orderStatusData = {
        labels: Object.keys(stats.orderStatus),
        datasets: [{
            label: 'Number of Orders',
            data: Object.values(stats.orderStatus),
            backgroundColor: [
                '#FF6384', // PENDING
                '#36A2EB', // CONFIRMED
                '#FFCE56', // SHIPPED
                '#4BC0C0', // DELIVERED
                '#9966FF', // CANCELLED
                '#FF9F40'  // RETURNED
            ],
            borderWidth: 1
        }]
    };

    const profitData = {
        labels: ['Monthly Profit', 'Upcoming Profit'],
        datasets: [{
            label: 'Profit in $',
            data: [stats.monthlyProfit, stats.upcomingProfit],
            backgroundColor: [
                'rgba(75, 192, 192, 0.6)',
                'rgba(54, 162, 235, 0.6)'
            ],
            borderColor: [
                'rgba(75, 192, 192, 1)',
                'rgba(54, 162, 235, 1)'
            ],
            borderWidth: 1
        }]
    };

    const exportToPDF = () => {
        // Import jsPDF dynamically to ensure proper initialization
        import('jspdf').then(({ jsPDF }) => {
            import('jspdf-autotable').then((autoTable) => {
                const doc = new jsPDF();
                
                // Title
                doc.setFontSize(18);
                doc.text('Admin Statistics Report', 105, 20, { align: 'center' });
                
                // Date
                doc.setFontSize(12);
                doc.text(`Report generated on: ${new Date().toLocaleDateString()}`, 105, 30, { align: 'center' });
                
                // Order Status Table
                autoTable.default(doc, {
                    startY: 40,
                    head: [['Status', 'Count']],
                    body: Object.entries(stats.orderStatus).map(([status, count]) => [status, count]),
                    theme: 'grid'
                });
                
                // Profit Information
                autoTable.default(doc, {
                    startY: doc.lastAutoTable.finalY + 20,
                    head: [['Metric', 'Amount ($)']],
                    body: [
                        ['Monthly Profit', stats.monthlyProfit],
                        ['Upcoming Profit', stats.upcomingProfit],
                        ['Total Clients', stats.totalClients]
                    ],
                    theme: 'grid'
                });
                
                doc.save(`admin_report_${new Date().toISOString().slice(0,10)}.pdf`);
            });
        }).catch(error => {
            console.error("Error generating PDF:", error);
            alert("Failed to generate PDF. Please try again.");
        });
    };

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet([
            ...Object.entries(stats.orderStatus).map(([status, count]) => ({ Metric: status, Value: count })),
            { Metric: 'Monthly Profit', Value: stats.monthlyProfit },
            { Metric: 'Upcoming Profit', Value: stats.upcomingProfit },
            { Metric: 'Total Clients', Value: stats.totalClients }
        ]);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Statistics");
        XLSX.writeFile(workbook, `admin_report_${new Date().toISOString().slice(0,10)}.xlsx`);
    };

    const printStats = () => {
        window.print();
    };

    return (
    <div className="admin-page">
        <h1>Admin Dashboard</h1>
        
        <div className="time-range-selector">
            <label>Time Range: </label>
            <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
                <option value="week">Last Week</option>
                <option value="15days">Last 15 Days</option>
                <option value="month">Last Month</option>
                <option value="quarter">Last Quarter</option>
                <option value="year">Last Year</option>
            </select>
        </div>
        
        {loading ? (
            <div className="loading">Loading statistics...</div>
        ) : (
            <>
                <div className="stats-grid">
                    <div className="stat-card">
                        <h3>Order Status</h3>
                        <div className="chart-container">
                            <Pie data={orderStatusData} />
                        </div>
                        <div className="status-counts">
                            {Object.entries(stats.orderStatus).map(([status, count]) => (
                                <div key={status} className="status-item">
                                    <span className="status-label">{status}:</span>
                                    <span className="status-value">{count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="stat-card">
                        <h3>Profit Analysis</h3>
                        <div className="chart-container">
                            <Bar data={profitData} />
                        </div>
                        <div className="profit-numbers">
                            <div className="profit-item">
                                <span>Monthly Profit:</span>
                                <span>${stats.monthlyProfit.toFixed(2)}</span>
                            </div>
                            <div className="profit-item">
                                <span>Upcoming Profit:</span>
                                <span>${stats.upcomingProfit.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="stat-card clients-card">
                        <h3>Clients</h3>
                        <div className="clients-number">
                            <span>{stats.totalClients}</span>
                            <small>Total Registered Clients</small>
                        </div>
                    </div>
                </div>
                
                <div className="action-buttons">
                    <button onClick={() => navigate("/admin/categories")}>Manage Categories</button>
                    <button onClick={() => navigate("/admin/products")}>Manage Products</button>
                    <button onClick={() => navigate("/admin/orders")}>Manage Orders</button>
                    <button onClick={() => navigate("/admin/users")}>Manage Users</button>
                    <button onClick={exportToPDF}>Export to PDF</button>
                    <button onClick={exportToExcel}>Export to Excel</button>
                    <button onClick={printStats}>Print Report</button>
                </div>
            </>
        )}
    </div>
);
};

export default AdminPage;