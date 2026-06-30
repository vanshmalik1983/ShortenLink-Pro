import { Link } from 'react-router-dom'
import { useDashboard } from '@/hooks/useDashboard'
import StatCard from '@/components/dashboard/StatCard'
import RecentLinksTable from '@/components/dashboard/RecentLinksTable'
import { SkeletonStatsGrid, SkeletonTable } from '@/components/ui/Skeleton'
import { Icon } from '@/components/ui/Icon'
import { useAuth } from '@/context/AuthContext'
import { formatNumber } from '@/utils/helpers'

const DashboardPage = () => {
  const { stats, loading } = useDashboard()
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Welcome back, {user?.name?.split(' ')[0]} 👋</h2>
          <p className="text-sm text-slate-500 mt-0.5">Here's what's happening with your links today.</p>
        </div>
        <Link to="/create" className="btn-primary shrink-0">
          <Icon.Plus /> Create Short URL
        </Link>
      </div>

      {loading ? (
        <SkeletonStatsGrid count={4} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Icon.Link} label="Total Links" value={stats?.totalLinks ?? 0} color="indigo" />
          <StatCard icon={Icon.Click} label="Total Clicks" value={stats?.totalClicks ?? 0} color="emerald" />
          <StatCard icon={Icon.Active} label="Active Links" value={stats?.activeLinks ?? 0} color="slate" />
          <StatCard icon={Icon.Expired} label="Expired Links" value={stats?.expiredLinks ?? 0} color="amber" />
        </div>
      )}

      {loading ? (
        <SkeletonStatsGrid count={3} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="card flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Today's Clicks</p>
              <p className="text-xl font-bold text-slate-900 mt-1">{formatNumber(stats?.todayClicks ?? 0)}</p>
            </div>
            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-indigo-50 text-indigo-500">
              <Icon.Trending />
            </div>
          </div>
          <div className="card flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">This Week</p>
              <p className="text-xl font-bold text-slate-900 mt-1">{formatNumber(stats?.weekClicks ?? 0)}</p>
            </div>
            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-emerald-50 text-emerald-500">
              <Icon.BarChart />
            </div>
          </div>
          <div className="card flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">This Month</p>
              <p className="text-xl font-bold text-slate-900 mt-1">{formatNumber(stats?.monthClicks ?? 0)}</p>
            </div>
            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-amber-50 text-amber-500">
              <Icon.Calendar />
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading ? <SkeletonTable rows={5} /> : <RecentLinksTable links={stats?.recentLinks} title="Recent Links" />}
        {loading ? <SkeletonTable rows={5} /> : <RecentLinksTable links={stats?.topLinks} title="Top Performing Links" />}
      </div>
    </div>
  )
}

export default DashboardPage
