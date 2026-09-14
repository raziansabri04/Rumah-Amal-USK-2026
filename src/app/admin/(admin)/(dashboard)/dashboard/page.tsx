import { getDashboardStats } from '@/lib/dashboard-stats';
import DashboardClient from './DashboardClient';

export default async function AdminDashboardPage() {
    const stats = await getDashboardStats();

    return <DashboardClient initialStats={stats as any} />;
}