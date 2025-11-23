import React, { useState, useEffect } from 'react';

const STORAGE = 'pw_hub_food_scans_v1';

const simulateAnalysis = (name) => {
  const base = name.length || Math.floor(Math.random()*10);
  const calories = Math.round(200 + ((base * 37) % 400));
  const v = Math.round(20 + ((base * 13) % 60));
  const p = Math.round(20 + ((base * 19) % (80 - v)));
  const k = 100 - v - p;
  return { calories, dosha: { vata: v, pitta: p, kapha: k } };
};

const FoodScan = () => {
  const [preview, setPreview] = useState(null);
  const [name, setName] = useState('');
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    const s = localStorage.getItem(STORAGE);
    if (s) setRecent(JSON.parse(s));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE, JSON.stringify(recent));
  }, [recent]);

  const onFile = (file) => {
    if (!file) return;
    setName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
      const analysis = simulateAnalysis(file.name);
      const item = { name: file.name, date: new Date().toISOString(), preview: e.target.result, ...analysis };
      setRecent(prev => [item, ...prev].slice(0,6));
    };
    reader.readAsDataURL(file);
  };

  const onInput = (e) => {
    const f = e.target.files && e.target.files[0];
    onFile(f);
    e.target.value = '';
  };

  return (
    <section className="max-w-4xl mx-auto px-6 py-8">
      <div className="bg-beige p-8 rounded-xl">
        <h2 className="text-2xl font-semibold mb-2">Scan Your Food</h2>
        <p className="text-text-secondary mb-6">Take a photo or upload an image to analyze its Ayurvedic properties</p>

        <div className="border-dashed border-2 border-gray-300 rounded-md p-6 text-center bg-white">
          {preview ? (
            <>
              <img src={preview} alt={name} className="mx-auto max-h-56 object-cover rounded mb-4" />
              <div className="text-sm text-text-secondary mb-4">{name}</div>
              <div className="flex justify-center gap-3">
                <label className="bg-emerald-700 text-white px-4 py-2 rounded cursor-pointer">
                  Replace Image
                  <input type="file" accept="image/*" onChange={onInput} className="hidden" />
                </label>
                <button onClick={() => { setPreview(null); setName(''); }} className="px-4 py-2 border rounded">Clear</button>
              </div>
            </>
          ) : (
            <>
              <div className="mb-4">
                <svg width="64" height="64" viewBox="0 0 24 24" className="mx-auto text-gray-300">
                  <path d="M7 7h10l1 1v8a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8l1-1z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="13" r="2.5" stroke="currentColor" strokeWidth="1.2"/>
                </svg>
              </div>
              <div className="mb-2 text-sm text-text-secondary">Ready to scan</div>
              <div className="flex justify-center gap-3">
                <label className="bg-emerald-700 text-white px-6 py-3 rounded cursor-pointer">
                  Take Photo / Upload
                  <input type="file" accept="image/*" onChange={onInput} className="hidden" />
                </label>
                <label className="px-6 py-3 border rounded cursor-pointer">
                  Upload Image
                  <input type="file" accept="image/*" onChange={onInput} className="hidden" />
                </label>
              </div>
            </>
          )}
        </div>

        {/* bottom two panels */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold">Recent Food Scans</h4>
              <a className="text-emerald-700 text-sm cursor-pointer" onClick={() => setRecent([])}>Clear All</a>
            </div>

            {recent.length === 0 ? (
              <div className="text-text-secondary">No scans yet — upload an image to begin.</div>
            ) : (
              <div className="space-y-3">
                {recent.map((r,i) => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                        <img src={r.preview} className="object-cover w-full h-full" alt={r.name} />
                      </div>
                      <div>
                        <div className="font-medium">{r.name}</div>
                        <div className="text-xs text-text-secondary">{new Date(r.date).toLocaleString()}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-semibold">{r.calories} cal</div>
                      <div className="text-xs text-text-secondary">V:{r.dosha.vata}% P:{r.dosha.pitta}% K:{r.dosha.kapha}%</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white p-4 rounded shadow-sm">
            <h4 className="font-semibold mb-3">Analysis Summary</h4>
            {preview ? (
              <div>
                <div className="mb-3"><div className="font-medium">File</div><div className="text-sm text-text-secondary">{name}</div></div>
                <div className="mb-3"><div className="font-medium">Estimated Calories</div><div className="text-lg">calculated after upload</div></div>
                <div className="mb-3"><div className="font-medium">Dosha Balance (simulated)</div><div className="text-sm text-text-secondary">Demo analysis — integrate ML here.</div></div>
              </div>
            ) : (
              <div className="text-text-secondary">Upload a meal photo to see a brief analysis and add it to Recent Scans.</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FoodScan;
