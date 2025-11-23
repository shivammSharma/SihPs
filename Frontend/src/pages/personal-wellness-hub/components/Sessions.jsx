import React, { useState } from 'react';

const SessionCard = ({ title, price, desc, selected, onClick }) => (
  <div onClick={onClick} className={`p-4 rounded-lg border ${selected ? 'border-emerald-600 bg-emerald-50' : 'border-gray-300 bg-white'} cursor-pointer`}>
    <div className="flex items-center justify-between">
      <div>
        <div className="font-semibold">{title}</div>
        <div className="text-sm text-text-secondary">{desc}</div>
      </div>
      <div className="text-emerald-700 font-semibold">{price}</div>
    </div>
  </div>
);

const Sessions = () => {
  const [selected, setSelected] = useState('Initial Consultation');

  const types = [
    { title: 'Initial Consultation', price: '₹500', desc: 'Detailed assessment for first-time patients' },
    { title: 'Follow-up Session', price: '₹300', desc: 'Review progress and update plan' },
    { title: 'Emergency Consultation', price: '₹800', desc: 'Urgent health concern (same day)' },
  ];

  return (
    <section className="max-w-6xl mx-auto px-6 py-8">
      <div className="bg-beige p-8 rounded-xl">
        <h2 className="text-2xl font-semibold">Sessions</h2>
        <p className="text-text-secondary mt-1">Book consultations and manage your appointments</p>

        <div className="mt-6 bg-white p-6 rounded-lg">
          <div className="mb-4">
            <ul className="flex gap-6 border-b pb-2">
              <li className="text-emerald-700 font-semibold">Book Session</li>
              <li className="text-text-secondary">Scheduled Sessions</li>
              <li className="text-text-secondary">Session History</li>
            </ul>
          </div>

          <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {types.map(t => (
              <SessionCard
                key={t.title}
                title={t.title}
                price={t.price}
                desc={t.desc}
                selected={selected === t.title}
                onClick={() => setSelected(t.title)}
              />
            ))}
          </div>

          <div className="bg-white p-4 rounded border">
            <h4 className="font-medium">Select Doctor</h4>
            <div className="mt-4 p-4 border rounded flex items-center justify-between">
              <div>
                <div className="font-semibold">Dr. Rajesh Ayengar</div>
                <div className="text-sm text-text-secondary">Panchakarma</div>
              </div>
              <div className="text-sm text-text-secondary">3/28/2024 • 10:00</div>
            </div>
            <div className="mt-4 flex gap-3">
              <button className="px-4 py-2 bg-emerald-700 text-white rounded">Book Now</button>
              <button className="px-4 py-2 border rounded">View Schedule</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Sessions;
