import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '@/components/ui/Icon'

const plans = [
  {
    name: 'Free',
    price: { monthly: 0, yearly: 0 },
    desc: 'For individuals getting started',
    features: ['100 links per month', 'Basic click analytics', '7-day data retention', 'Standard support'],
    cta: 'Get started free',
    highlight: false,
  },
  {
    name: 'Pro',
    price: { monthly: 12, yearly: 9 },
    desc: 'For professionals and small teams',
    features: ['Unlimited links', 'Advanced analytics', 'Custom aliases', 'Password protection', 'QR code generation', '1-year data retention', 'Priority support'],
    cta: 'Start free trial',
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: { monthly: 49, yearly: 39 },
    desc: 'For organizations at scale',
    features: ['Everything in Pro', 'Team collaboration', 'API access', 'Custom domains', 'Unlimited retention', 'SLA & dedicated support'],
    cta: 'Contact sales',
    highlight: false,
  },
]

const PricingPage = () => {
  const [yearly, setYearly] = useState(true)

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900">Simple, transparent pricing</h1>
        <p className="mt-4 text-lg text-slate-500">Start free. Upgrade when you need more. Cancel anytime.</p>

        <div className="inline-flex items-center gap-3 mt-8 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setYearly(false)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${!yearly ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}
          >
            Monthly
          </button>
          <button
            onClick={() => setYearly(true)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${yearly ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}
          >
            Yearly <span className="badge-success !text-[10px]">Save 25%</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative rounded-2xl p-8 border ${plan.highlight ? 'border-indigo-200 bg-white shadow-card-hover scale-[1.02]' : 'border-slate-100 bg-white shadow-card'}`}
          >
            {plan.highlight && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-indigo-600 text-white text-xs font-semibold rounded-full">
                Most Popular
              </span>
            )}
            <h3 className="text-lg font-bold text-slate-900">{plan.name}</h3>
            <p className="text-sm text-slate-500 mt-1">{plan.desc}</p>

            <div className="mt-6 flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-slate-900">${yearly ? plan.price.yearly : plan.price.monthly}</span>
              <span className="text-slate-400 text-sm">/month</span>
            </div>

            <Link
              to="/register"
              className={`mt-6 w-full block text-center ${plan.highlight ? 'btn-primary' : 'btn-secondary'}`}
            >
              {plan.cta}
            </Link>

            <ul className="mt-8 space-y-3">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-slate-600">
                  <span className="mt-0.5 text-emerald-500 shrink-0"><Icon.Check /></span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PricingPage
