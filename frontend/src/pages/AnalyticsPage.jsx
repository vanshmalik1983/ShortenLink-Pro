import { Link } from 'react-router-dom'
import { useAnalytics } from '@/hooks/useAnalytics'
import PeriodSelector from '@/components/analytics/PeriodSelector'
import ClickTimelineChart from '@/components/analytics/ClickTimelineChart'
import DeviceBreakdownChart from '@/components/analytics/DeviceBreakdownChart'
import { SkeletonChart, SkeletonTable } from '@/components/ui/Skeleton'
import EmptyState from '@/components/ui/EmptyState'
import { Icon } from '@/components/ui/Icon'
import { formatNumber, truncateUrl } from '@/utils/helpers'

const AnalyticsPage = () => {
  const { data, loading, period, setPeriod } = useAnalytics(null, '30d')

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Analytics Overview</h2>
          <p className="text-sm text-slate-500 mt-0.5">Performance across all your links</p>
        </div>
        <PeriodSelector value={period} onChange={setPeriod} />
      </div>

      {loading ? (
        <SkeletonChart />
      ) : !data?.clickTimeline?.length ? (
        <div className="card !p-0">
          <EmptyState
            icon={<Icon.BarChart width="28" height="28" />}
            title="No analytics data yet"
            description="Create and share some links to start seeing click data here."
            action={<Link to="/create" className="btn-primary"><Icon.Plus /> Create a link</Link>}
          />
        </div>
      ) : (
        <ClickTimelineChart data={data.clickTimeline} />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          {loading ? <SkeletonChart /> : <DeviceBreakdownChart data={data?.deviceBreakdown || []} />}
        </div>

        <div className="lg:col-span-2">
          {loading ? (
            <SkeletonTable rows={5} />
          ) : (
            <div className="card !p-0 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <h3 className="text-sm font-semibold text-slate-800">Top Performing Links</h3>
              </div>
              {!data?.topUrls?.length ? (
                <div className="px-6 py-10 text-center text-sm text-slate-400">No links yet</div>
              ) : (
                <div className="divide-y divide-slate-50">
                  {data.topUrls.map((url) => (
                    <Link
                      key={url._id}
                      to={`/analytics/${url._id}`}
                      className="flex items-center gap-4 px-6 py-3.5 hover:bg-slate-50/50 transition-colors"
                    >
                      <div className="w-9 h-9 shrink-0 flex items-center justify-center rounded-lg bg-indigo-50 text-indigo-500">
                        <Icon.Link width="16" height="16" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-indigo-600 truncate-url">{url.shortUrl?.replace(/^https?:\/\//, '')}</p>
                        <p className="text-xs text-slate-400 truncate-url">{url.title || truncateUrl(url.originalUrl, 45)}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-semibold text-slate-700">{formatNumber(url.totalClicks)}</p>
                        <p className="text-xs text-slate-400">clicks</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AnalyticsPage
