import { Link } from 'react-router-dom'
import { Icon } from '@/components/ui/Icon'

const featureGroups = [
  {
    title: 'Link Management',
    desc: 'Full control over every link you create.',
    items: [
      { icon: Icon.Link, title: 'Custom aliases', desc: 'Choose memorable, branded slugs instead of random strings.' },
      { icon: Icon.Calendar, title: 'Expiration dates', desc: 'Automatically disable links after a set date.' },
      { icon: Icon.Lock, title: 'Password protection', desc: 'Require a password before visitors are redirected.' },
      { icon: Icon.Star, title: 'Favorites & tags', desc: 'Organize high-priority links for quick access.' },
    ],
  },
  {
    title: 'Analytics & Insights',
    desc: 'Understand your audience in real time.',
    items: [
      { icon: Icon.BarChart, title: 'Click tracking', desc: 'Total and unique clicks tracked down to the second.' },
      { icon: Icon.Globe, title: 'Geographic data', desc: 'See which countries your traffic is coming from.' },
      { icon: Icon.Smartphone, title: 'Device breakdown', desc: 'Desktop, mobile, and tablet usage at a glance.' },
      { icon: Icon.Trending, title: 'Trend charts', desc: 'Visualize click patterns by hour, day, and week.' },
    ],
  },
  {
    title: 'Security & Reliability',
    desc: 'Enterprise-grade infrastructure, by default.',
    items: [
      { icon: Icon.Shield, title: 'Rate limiting', desc: 'Built-in protection against abuse and bot traffic.' },
      { icon: Icon.Lock, title: 'JWT authentication', desc: 'Secure sessions with refresh token rotation.' },
      { icon: Icon.Check, title: '99.9% uptime', desc: 'Redis-backed caching keeps redirects fast and reliable.' },
      { icon: Icon.QR, title: 'QR codes', desc: 'Every link includes an auto-generated, downloadable QR code.' },
    ],
  },
]

const FeaturesPage = () => (
  <div className="max-w-7xl mx-auto px-6 py-20">
    <div className="text-center max-w-2xl mx-auto mb-20">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900">Built for serious link management</h1>
      <p className="mt-4 text-lg text-slate-500">Every feature you'd expect from a premium link platform — and a few you didn't know you needed.</p>
    </div>

    <div className="space-y-20">
      {featureGroups.map((group) => (
        <div key={group.title}>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900">{group.title}</h2>
            <p className="text-slate-500 mt-1">{group.desc}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {group.items.map(({ icon: ItemIcon, title, desc }) => (
              <div key={title} className="card-hover">
                <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 mb-4">
                  <ItemIcon />
                </div>
                <h3 className="text-sm font-semibold text-slate-800 mb-1.5">{title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>

    <div className="mt-20 text-center">
      <Link to="/register" className="btn-primary !px-7 !py-3.5 !text-base">
        Start using ShortLink Pro <Icon.ArrowRight />
      </Link>
    </div>
  </div>
)

export default FeaturesPage
