import { Link } from 'react-router-dom'
import { Icon } from '@/components/ui/Icon'

const features = [
  { icon: Icon.Link, title: 'Custom short links', desc: 'Brand every link with custom aliases that match your identity.' },
  { icon: Icon.BarChart, title: 'Real-time analytics', desc: 'Track clicks, devices, locations, and referrers as they happen.' },
  { icon: Icon.Lock, title: 'Password protection', desc: 'Restrict access to sensitive links with a password.' },
  { icon: Icon.QR, title: 'QR code generation', desc: 'Every link comes with an instant, scannable QR code.' },
  { icon: Icon.Calendar, title: 'Link expiration', desc: 'Set links to automatically expire on a schedule you choose.' },
  { icon: Icon.Shield, title: 'Enterprise security', desc: 'Rate limiting, encryption, and abuse protection built in.' },
]

const stats = [
  { value: '99.9%', label: 'Uptime SLA' },
  { value: '<50ms', label: 'Redirect speed' },
  { value: '10M+', label: 'Links shortened' },
]

const LandingPage = () => {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50/60 via-white to-white">
        <div className="max-w-7xl mx-auto px-6 pt-20 pb-24 lg:pt-28 lg:pb-32">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm text-xs font-medium text-slate-600 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Trusted by 12,000+ teams worldwide
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
              Shorten links.<br />
              <span className="text-gradient">Understand everything.</span>
            </h1>
            <p className="mt-6 text-lg text-slate-500 max-w-xl mx-auto">
              ShortLink Pro turns long, messy URLs into clean branded links — and gives you the analytics
              to know exactly who's clicking, when, and from where.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/register" className="btn-primary !px-7 !py-3.5 !text-base w-full sm:w-auto">
                Start shortening for free <Icon.ArrowRight />
              </Link>
              <Link to="/features" className="btn-secondary !px-7 !py-3.5 !text-base w-full sm:w-auto">
                See how it works
              </Link>
            </div>
            <p className="mt-4 text-xs text-slate-400">No credit card required · Free forever plan</p>
          </div>

          {/* Demo input mock */}
          <div className="mt-16 max-w-2xl mx-auto">
            <div className="card !p-2 flex flex-col sm:flex-row items-center gap-2 shadow-card-hover">
              <div className="flex-1 w-full flex items-center gap-3 px-4 py-2.5">
                <Icon.Link className="text-slate-300 shrink-0" />
                <span className="text-sm text-slate-400 truncate">https://your-very-long-marketing-campaign-link.com/utm=...</span>
              </div>
              <button className="btn-primary w-full sm:w-auto shrink-0">Shorten URL</button>
            </div>
            <div className="mt-3 flex items-center justify-center gap-2 text-sm">
              <span className="text-slate-400">Becomes</span>
              <span className="font-mono font-semibold text-indigo-600">shortlink.pro/x7Bk2qL</span>
              <button className="text-slate-300 hover:text-indigo-500 transition-colors"><Icon.Copy /></button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-slate-100 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-3 gap-6 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{s.value}</div>
              <div className="text-sm text-slate-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features grid */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm font-semibold text-indigo-600">EVERYTHING YOU NEED</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-2">A complete link management platform</h2>
          <p className="mt-4 text-slate-500">Built for marketers, developers, and teams who need more than just a shortener.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: FeatureIcon, title, desc }) => (
            <div key={title} className="card-hover">
              <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 mb-4">
                <FeatureIcon />
              </div>
              <h3 className="text-base font-semibold text-slate-800 mb-1.5">{title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-indigo-800 px-8 py-16 sm:px-16 text-center">
          <div className="relative max-w-xl mx-auto">
            <h2 className="text-3xl font-bold text-white">Ready to take control of your links?</h2>
            <p className="mt-3 text-indigo-100">Join thousands of teams already using ShortLink Pro to grow smarter.</p>
            <Link to="/register" className="inline-flex items-center gap-2 mt-8 px-7 py-3.5 bg-white text-indigo-700 text-base font-semibold rounded-xl hover:bg-indigo-50 transition-colors">
              Get started — it's free <Icon.ArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default LandingPage
