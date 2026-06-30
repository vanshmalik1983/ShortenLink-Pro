import { useParams, Link } from 'react-router-dom'
import { useAnalytics } from '@/hooks/useAnalytics'
import PeriodSelector from '@/components/analytics/PeriodSelector'
import ClickTimelineChart from '@/components/analytics/ClickTimelineChart'
import DeviceBreakdownChart from '@/components/analytics/DeviceBreakdownChart'
import TopListCard from '@/components/analytics/TopListCard'
import DistributionChart from '@/components/analytics/DistributionChart'
import StatCard from '@/components/dashboard/StatCard'
import { SkeletonChart, SkeletonStatsGrid } from '@/components/ui/Skeleton'
import { Icon } from '@/components/ui/Icon'
import { copyToClipboard } from '@/utils/helpers'
import toast from 'react-hot-toast'

const UrlDetailAnalyticsPage = () => {
  const { urlId } = useParams()
  const { data, loading, period, setPeriod } = useAnalytics(urlId, '30d')

  const handleCopy = async () => {
    await copyToClipboard(data.url.shortUrl)
    toast.success('Copied to clipboard')
  }

  return (
    <div className="space-y-6">
      <Link to="/analytics" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800">
        <Icon.ChevronLeft width="16" height="16" /> Back to overview
      </Link>

      {loading ? (
        <div className="card !py-8">
          <div className="skeleton h-6 w-64 mb-2" />
          <div className="skeleton h-4 w-96" />
        </div>
      ) : (
        <div className="card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-slate-900 truncate">{data?.url?.title || 'Untitled Link'}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm font-mono text-indigo-600 truncate-url">{data?.url?.shortUrl}</span>
              <button onClick={handleCopy} className="text-slate-400 hover:text-indigo-600 shrink-0"><Icon.Copy /></button>
            </div>
            <p className="text-xs text-slate-400 mt-1 truncate-url">{data?.url?.originalUrl}</p>
          </div>
          <PeriodSelector value={period} onChange={setPeriod} />
        </div>
      )}

      {loading ? (
        <SkeletonStatsGrid count={2} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatCard icon={Icon.Click} label="Total Clicks" value={data?.totalClicks ?? 0} color="indigo" />
          <StatCard icon={Icon.Eye} label="Unique Visitors" value={data?.uniqueClicks ?? 0} color="emerald" />
        </div>
      )}

      {loading ? <SkeletonChart /> : <ClickTimelineChart data={data?.clicksByDate || []} />}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading ? <SkeletonChart /> : (
          <DistributionChart title="Clicks by Hour" data={data?.hourlyDistribution || []} xKey="hour" />
        )}
        {loading ? <SkeletonChart /> : (
          <DistributionChart title="Clicks by Day" data={data?.dailyDistribution || []} xKey="day" />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading ? <SkeletonChart /> : <DeviceBreakdownChart data={data?.topDevices?.map((d) => ({ type: d.type, count: d.count })) || []} />}
        {loading ? <SkeletonChart /> : <TopListCard title="Top Browsers" items={data?.topBrowsers || []} labelKey="name" />}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading ? <SkeletonChart /> : <TopListCard title="Top Countries" items={data?.topCountries || []} labelKey="country" emptyText="Geolocation data not yet available" />}
        {loading ? <SkeletonChart /> : <TopListCard title="Top Referrers" items={data?.topReferrers || []} labelKey="domain" emptyText="No referral traffic yet" />}
      </div>
    </div>
  )
}

export default UrlDetailAnalyticsPage
