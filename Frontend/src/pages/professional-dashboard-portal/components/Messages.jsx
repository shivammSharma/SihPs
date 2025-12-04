import React, { useState } from 'react';

const Messages = () => {
  const doctors = [
    { id: 'd1', name: 'Dr. Rajesh Ayengar', specialty: 'Panchakarma' },
    { id: 'd2', name: 'Dr. Meera Nair', specialty: 'Women Health' },
    { id: 'd3', name: 'Dr. Amit Gupta', specialty: 'Dermatology' },
  ];

  const [active, setActive] = useState('d1');
  const [convos, setConvos] = useState({
    d1: [
      { from: 'doc', text: 'Hello Arjun! How are you feeling after the new diet plan?', time: '02:30 PM' },
      { from: 'me', text: "Morning Doctor! I'm feeling better. Digestion has improved.", time: '02:45 PM' },
      { from: 'doc', text: 'Great! Continue the diet and let me know if needed.', time: '02:50 PM' }
    ],
    d2: [],
    d3: []
  });
  const [text, setText] = useState('');

  const send = () => {
    if (!text.trim()) return;
    setConvos(prev => {
      const c = { ...prev };
      c[active] = [...(c[active]||[]), { from: 'me', text: text.trim(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }];
      return c;
    });
    setText('');
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <aside className="lg:col-span-1">
          <div className="bg-beige p-4 rounded-lg mb-4">
            <h4 className="font-semibold">Your Doctors</h4>
            <p className="text-xs text-text-secondary">You can message your providers</p>
          </div>
          <div className="space-y-4">
            {doctors.map(d => (
              <div key={d.id}
                onClick={() => setActive(d.id)}
                className={`p-4 rounded-lg cursor-pointer ${active === d.id ? 'border-emerald-500 bg-emerald-50' : 'bg-white border'}`}>
                <div className="font-semibold">{d.name}</div>
                <div className="text-xs text-text-secondary">{d.specialty}</div>
              </div>
            ))}
          </div>
        </aside>

        <div className="lg:col-span-2 bg-beige p-6 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="font-semibold">{doctors.find(d => d.id === active).name}</div>
              <div className="text-xs text-text-secondary">{doctors.find(d => d.id === active).specialty} • Bangalore</div>
            </div>

            <div className="space-x-2">
              <button className="px-3 py-1 border rounded">Call</button>
              <button className="px-3 py-1 border rounded">Video</button>
            </div>
          </div>

          <div className="h-96 bg-white border rounded p-4 overflow-auto mb-4">
            {(convos[active] || []).map((m, i) => (
              <div key={i} className={`mb-4 ${m.from === 'me' ? 'text-right' : ''}`}>
                <div className={`inline-block p-3 rounded ${m.from === 'me' ? 'bg-emerald-700 text-white' : 'bg-gray-100 text-gray-800'}`}>
                  {m.text}
                </div>
                <div className="text-xs text-text-secondary mt-1">{m.time}</div>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <input value={text} onChange={(e) => setText(e.target.value)} className="flex-1 border rounded px-3 py-2" placeholder="Type a message..." />
            <button onClick={send} className="px-4 py-2 bg-emerald-700 text-white rounded">Send</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Messages;
