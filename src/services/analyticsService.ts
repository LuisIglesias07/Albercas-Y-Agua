import { getAllOrders } from './orderService';

export interface SalesStats {
    totalRevenue: number;
    totalOrders: number;
    pendingOrders: number;
    completedOrders: number;
    averageOrderValue: number;
}

export interface ProductSales {
    productName: string;
    category: string;
    quantitySold: number;
    revenue: number;
}

export interface DailySales {
    date: string;
    revenue: number;
    orders: number;
}

// Get overall sales statistics
export const getSalesStatistics = async (): Promise<SalesStats> => {
    try {
        const orders = await getAllOrders();

        // Only count paid orders for revenue
        const paidOrders = orders.filter(o => o.paymentStatus === 'paid');

        const totalRevenue = paidOrders.reduce((sum, order) => sum + order.total, 0);
        const totalOrders = orders.length;
        const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'processing').length;
        const completedOrders = orders.filter(o => o.status === 'delivered').length;
        const averageOrderValue = paidOrders.length > 0 ? totalRevenue / paidOrders.length : 0;

        return {
            totalRevenue,
            totalOrders,
            pendingOrders,
            completedOrders,
            averageOrderValue
        };
    } catch (error: any) {
        throw new Error(`Error fetching sales statistics: ${error.message}`);
    }
};

// Get top selling products
export const getTopSellingProducts = async (limit: number = 10): Promise<ProductSales[]> => {
    try {
        const orders = await getAllOrders();
        const paidOrders = orders.filter(o => o.paymentStatus === 'paid');

        // Aggregate product sales
        const productMap = new Map<string, ProductSales>();

        paidOrders.forEach(order => {
            order.items.forEach(item => {
                const key = item.productId;
                if (productMap.has(key)) {
                    const existing = productMap.get(key)!;
                    existing.quantitySold += item.quantity;
                    existing.revenue += item.subtotal;
                } else {
                    productMap.set(key, {
                        productName: item.productName,
                        category: item.category,
                        quantitySold: item.quantity,
                        revenue: item.subtotal
                    });
                }
            });
        });

        // Convert to array and sort by quantity sold
        return Array.from(productMap.values())
            .sort((a, b) => b.quantitySold - a.quantitySold)
            .slice(0, limit);
    } catch (error: any) {
        throw new Error(`Error fetching top selling products: ${error.message}`);
    }
};

// Get daily sales for the last N days
export const getDailySales = async (days: number = 30): Promise<DailySales[]> => {
    try {
        const orders = await getAllOrders();
        const paidOrders = orders.filter(o => o.paymentStatus === 'paid');

        // Create date range
        const today = new Date();
        const startDate = new Date();
        startDate.setDate(today.getDate() - days);

        // Group by date
        const salesByDate = new Map<string, { revenue: number; count: number }>();

        paidOrders.forEach(order => {
            const orderDate = new Date(order.createdAt);
            if (orderDate >= startDate) {
                const dateKey = orderDate.toISOString().split('T')[0];
                if (salesByDate.has(dateKey)) {
                    const existing = salesByDate.get(dateKey)!;
                    existing.revenue += order.total;
                    existing.count += 1;
                } else {
                    salesByDate.set(dateKey, { revenue: order.total, count: 1 });
                }
            }
        });

        // Fill in missing dates with zeros
        const result: DailySales[] = [];
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(today.getDate() - i);
            const dateKey = date.toISOString().split('T')[0];

            const data = salesByDate.get(dateKey) || { revenue: 0, count: 0 };
            result.push({
                date: dateKey,
                revenue: data.revenue,
                orders: data.count
            });
        }

        return result;
    } catch (error: any) {
        throw new Error(`Error fetching daily sales: ${error.message}`);
    }
};

// Get revenue by category
export const getRevenueByCategory = async (): Promise<Array<{ category: string; revenue: number }>> => {
    try {
        const orders = await getAllOrders();
        const paidOrders = orders.filter(o => o.paymentStatus === 'paid');

        const categoryMap = new Map<string, number>();

        paidOrders.forEach(order => {
            order.items.forEach(item => {
                const current = categoryMap.get(item.category) || 0;
                categoryMap.set(item.category, current + item.subtotal);
            });
        });

        return Array.from(categoryMap.entries())
            .map(([category, revenue]) => ({ category, revenue }))
            .sort((a, b) => b.revenue - a.revenue);
    } catch (error: any) {
        throw new Error(`Error fetching revenue by category: ${error.message}`);
    }
};
