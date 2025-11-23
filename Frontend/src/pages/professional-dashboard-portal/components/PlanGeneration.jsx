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
      // calories filter (if applicable)
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
        // search across fields
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
  // Ensure page bounds
  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
    if (page < 1) setPage(1)
  }, [page, totalPages])

  const start = (page - 1) * pageSize
  const end = start + pageSize
  const paged = filtered.slice(start, end)

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Food cards</h1>

      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center mb-6">
        <input
          className="flex-1 p-2 border rounded shadow-sm"
          placeholder="Search... (by food item, category, benefit, etc.)"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />

        <select
          className="p-2 border rounded"
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
            className="w-24 p-2 border rounded"
            placeholder="Min cal"
            value={minCalories}
            onChange={e => setMinCalories(e.target.value.replace(/[^0-9.]/g, ''))}
          />
          <input
            className="w-24 p-2 border rounded"
            placeholder="Max cal"
            value={maxCalories}
            onChange={e => setMaxCalories(e.target.value.replace(/[^0-9.]/g, ''))}
          />
        </div>

        <button
          className="p-2 bg-gray-100 rounded border hover:bg-gray-200"
          onClick={() => { setQuery(''); setField('All'); setMinCalories(''); setMaxCalories('') }}
        >
          Reset
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {paged.map((item, idx) => (
          <article key={start + idx} className="border rounded-lg p-4 shadow-sm bg-white">
            <header className="flex items-start justify-between mb-3">
              <div>
                <h2 className="text-lg font-semibold">{item['Food Item'] || item['Name'] || '—'}</h2>
                <p className="text-sm text-gray-600">{item['Category']}</p>
              </div>
              <div className="text-right text-sm">
                <div className="font-medium">{item['Calories (per 100g)'] ?? '—'} cal</div>
                <div className="text-gray-500">{item['Fat (g)'] ?? '—'} g fat</div>
              </div>
            </header>

            <div className="text-sm mb-3">
              <p><strong>Key benefit:</strong> {item['Key Benefit'] ?? '—'}</p>
              <p><strong>Dosha Effect:</strong> {item['Dosha Effect'] ?? '—'}</p>
              <p><strong>Precautions:</strong> {item['Precautions'] ?? '—'}</p>
            </div>

            <div className="text-xs text-gray-600 grid grid-cols-2 gap-2">
              {Object.entries(item).map(([k, v]) => (
                <div key={k} className="break-words">
                  <div className="font-medium text-gray-800">{k}</div>
                  <div className="text-gray-600">{String(v)}</div>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="mt-8 text-center text-gray-600">No results found.</div>
      )}

      <footer className="mt-8 text-sm text-gray-500">
        Showing {Math.min(total, end) - start} of {total} items (page {page} of {totalPages})
      </footer>

      <div className="flex justify-center mt-6 gap-4">
        <button
          disabled={page === 1}
          onClick={() => setPage(p => Math.max(1, p - 1))}
          className="px-4 py-2 border rounded disabled:opacity-40"
          aria-label="Previous page"
        >
          Previous
        </button>

        <div className="flex items-center gap-3">
          {/* Simple page indicator — replace with page number buttons if needed */}
          <span className="text-sm text-gray-700">Page</span>
          <span className="font-medium">{page}</span>
          <span className="text-sm text-gray-500"> / {totalPages}</span>
        </div>

        <button
          disabled={page >= totalPages}
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          className="px-4 py-2 border rounded disabled:opacity-40"
          aria-label="Next page"
        >
          Next
        </button>
      </div>
    </div>
  )
}
