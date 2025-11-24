import React, { useMemo, useState, useEffect } from 'react'
import foodData from './data.json' // ensure your bundler supports JSON imports (CRA, Vite, Next do)

export default function FoodCardList({ dataSource }) {
  // dataSource: optional prop (array) — if not provided, component falls back to local import
  const data = Array.isArray(dataSource) && dataSource.length ? dataSource : (Array.isArray(foodData) ? foodData : [])

  // Pagination
  const [page, setPage] = useState(1)
  const pageSize = 10

  // Filters / search
  const [query, setQuery] = useState('')
  const [field, setField] = useState('All')
  const [minCalories, setMinCalories] = useState('')
  const [maxCalories, setMaxCalories] = useState('')

  // Automatically reset page to 1 when filters or search change
  useEffect(() => {
    setPage(1)
  }, [query, field, minCalories, maxCalories, dataSource])

  const stringFields = useMemo(() => {
    if (!data || data.length === 0) return ['Food Item']
    const sample = data[0]
    return Object.keys(sample).filter(k => typeof sample[k] === 'string')
  }, [data])

  const numericFields = useMemo(() => {
    if (!data || data.length === 0) return []
    const sample = data[0]
    return Object.keys(sample).filter(k => typeof sample[k] === 'number')
  }, [data])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return data.filter(item => {
      const caloriesKey = 'Calories (per 100g)'
      if (minCalories !== '') {
        const min = Number(minCalories)
        const itemCal = Number(item[caloriesKey] ?? NaN)
        if (Number.isFinite(itemCal) && itemCal < min) return false
      }
      if (maxCalories !== '') {
        const max = Number(maxCalories)
        const itemCal = Number(item[caloriesKey] ?? NaN)
        if (Number.isFinite(itemCal) && itemCal > max) return false
      }

      if (!q) return true

      if (field === 'All') {
        return Object.keys(item).some(k => {
          const v = item[k]
          if (v === null || v === undefined) return false
          return String(v).toLowerCase().includes(q)
        })
      }

      const val = item[field]
      return val !== undefined && String(val).toLowerCase().includes(q)
    })
  }, [data, query, field, minCalories, maxCalories])

  // Pagination calculations
  const total = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
    if (page < 1) setPage(1)
  }, [page, totalPages])

  const start = (page - 1) * pageSize
  const end = start + pageSize
  const paged = filtered.slice(start, end)

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4 text-slate-800">Select Foods</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center mb-6">
        <div className="relative flex-1">
          <input
            className="w-full pl-3 pr-3 py-2 border border-slate-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 text-sm"
            placeholder="Search by name, category, benefit, etc."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>

        <select
          className="p-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
          value={field}
          onChange={e => setField(e.target.value)}
        >
          <option value="All">All fields</option>
          {stringFields.map(f => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>

        <div className="flex gap-2 items-center">
          <input
            className="w-24 p-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
            placeholder="Min cal"
            value={minCalories}
            onChange={e => setMinCalories(e.target.value.replace(/[^0-9.]/g, ''))}
          />
          <input
            className="w-24 p-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
            placeholder="Max cal"
            value={maxCalories}
            onChange={e => setMaxCalories(e.target.value.replace(/[^0-9.]/g, ''))}
          />
        </div>

        <button
          className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm shadow-sm hover:bg-slate-50"
          onClick={() => { setQuery(''); setField('All'); setMinCalories(''); setMaxCalories('') }}
        >
          Reset
        </button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {paged.map((item, idx) => {
          const name = item['Food Item'] || item['Name'] || '—'
          const category = item['Category'] || '—'
          const calories = item['Calories (per 100g)']
          const fat = item['Fat (g)']
          const protein = item['Protein (g)']
          const carbs = item['Carbohydrate (g)']
          const fiber = item['Fiber (g)']
          const sodium = item['Sodium (mg)']
          const iron = item['Iron (mg)']
          const keyBenefit = item['Key Benefit']
          const dosha = item['Dosha Effect']
          const precautions = item['Precautions']

          // For the details grid, show all remaining fields
          const hiddenKeys = new Set([
            'Food Item',
            'Name',
            'Category',
            'Key Benefit',
            'Dosha Effect',
            'Precautions',
            'Calories (per 100g)',
            'Fat (g)',
            'Protein (g)',
            'Carbohydrate (g)',
            'Fiber (g)',
            'Sodium (mg)',
            'Iron (mg)'
          ])

          const extraDetails = Object.entries(item).filter(([k]) => !hiddenKeys.has(k))

          return (
            <article
              key={start + idx}
              className="relative rounded-2xl border border-emerald-100 bg-white shadow-sm hover:shadow-md hover:border-emerald-300 transition-all duration-200 p-5 flex flex-col gap-4"
            >
              {/* Header */}
              <header className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-slate-800 leading-snug">
                    {name}
                  </h2>
                  <p className="mt-1 inline-flex items-center text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full px-3 py-0.5">
                    {category || 'Category not set'}
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-xs text-slate-400 mb-1">Calories (per 100g)</div>
                  <div className="inline-flex flex-col items-end justify-center px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100">
                    <span className="text-lg font-semibold leading-tight">
                      {calories ?? '—'}
                    </span>
                    <span className="text-[11px] uppercase tracking-wide font-medium">
                      kcal
                    </span>
                  </div>
                  <div className="mt-1 text-[11px] text-slate-500">
                    Fat: <span className="font-medium">{fat ?? '—'} g</span>
                  </div>
                </div>
              </header>

              {/* Key info */}
              <section className="space-y-1.5 text-xs">
                {keyBenefit && (
                  <p className="text-slate-700">
                    <span className="font-semibold">Key benefit:</span>{' '}
                    {keyBenefit}
                  </p>
                )}
                {dosha && (
                  <p className="flex items-center gap-1 text-slate-700">
                    <span className="font-semibold">Dosha effect:</span>
                    <span className="inline-flex items-center rounded-full px-2 py-0.5 bg-cyan-50 border border-cyan-100 text-[11px] font-medium text-cyan-700">
                      {dosha}
                    </span>
                  </p>
                )}
                {precautions && (
                  <p className="text-xs">
                    <span className="font-semibold text-amber-700">Precautions:</span>{' '}
                    <span className="text-slate-700">{precautions}</span>
                  </p>
                )}
              </section>

              {/* Nutrient highlight row */}
              <section className="mt-1 grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl bg-slate-50 px-3 py-2 border border-slate-100">
                  <div className="text-[11px] text-slate-500 uppercase tracking-wide">
                    Protein
                  </div>
                  <div className="mt-0.5 text-sm font-semibold text-slate-800">
                    {protein ?? '—'} g
                  </div>
                </div>
                <div className="rounded-xl bg-slate-50 px-3 py-2 border border-slate-100">
                  <div className="text-[11px] text-slate-500 uppercase tracking-wide">
                    Carbs
                  </div>
                  <div className="mt-0.5 text-sm font-semibold text-slate-800">
                    {carbs ?? '—'} g
                  </div>
                </div>
                <div className="rounded-xl bg-slate-50 px-3 py-2 border border-slate-100">
                  <div className="text-[11px] text-slate-500 uppercase tracking-wide">
                    Fiber
                  </div>
                  <div className="mt-0.5 text-sm font-semibold text-slate-800">
                    {fiber ?? '—'} g
                  </div>
                </div>
                <div className="rounded-xl bg-slate-50 px-3 py-2 border border-slate-100">
                  <div className="text-[11px] text-slate-500 uppercase tracking-wide">
                    Sodium
                  </div>
                  <div className="mt-0.5 text-sm font-semibold text-slate-800">
                    {sodium ?? '—'} mg
                  </div>
                </div>
              </section>

              {/* Extra details */}
              {extraDetails.length > 0 && (
                <section className="pt-2 border-t border-slate-100 mt-1">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-2">
                    More details
                  </div>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11px] text-slate-600">
                    {extraDetails.map(([k, v]) => (
                      <div key={k} className="space-y-0.5">
                        <div className="font-medium text-slate-500">{k}</div>
                        <div className="text-slate-800">{String(v)}</div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </article>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="mt-8 text-center text-gray-500 text-sm">
          No results found.
        </div>
      )}

      <footer className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <div>
          Showing <span className="font-medium">{Math.min(total, end) - start}</span> of{' '}
          <span className="font-medium">{total}</span> items (page {page} of {totalPages})
        </div>

        <div className="flex items-center gap-4">
          <button
            disabled={page === 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
            className="px-3 py-1.5 border border-slate-200 rounded-full disabled:opacity-40 text-sm bg-white hover:bg-slate-50"
            aria-label="Previous page"
          >
            Previous
          </button>

          <div className="flex items-center gap-1 text-sm">
            <span className="text-slate-600">Page</span>
            <span className="font-semibold text-slate-800">{page}</span>
            <span className="text-slate-500">/ {totalPages}</span>
          </div>

          <button
            disabled={page >= totalPages}
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            className="px-3 py-1.5 border border-slate-200 rounded-full disabled:opacity-40 text-sm bg-white hover:bg-slate-50"
            aria-label="Next page"
          >
            Next
          </button>
        </div>
      </footer>
    </div>
  )
}
