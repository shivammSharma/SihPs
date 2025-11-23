import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import Icon from '../../../components/AppIcon';

const DashboardOverview = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Vite: baseURL from env or '' so dev proxy handles /api
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '',
    headers: { 'Content-Type': 'application/json' },
  });

  // fetch patients on mount
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const res = await api.get('/api/patients');
        setPatients(res.data || []);
      } catch (err) {
        console.error('Failed to load patients', err);
        setError('Failed to load patients');
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  // Helper: compare dates ignoring time
  const isSameDay = (dateA, dateB) => {
    if (!dateA || !dateB) return false;
    const a = new Date(dateA);
    const b = new Date(dateB);
    return a.getFullYear() === b.getFullYear()
      && a.getMonth() === b.getMonth()
      && a.getDate() === b.getDate();
  };

  // Derived dashboard data
  const { todayStats, todaysAppointments, recentActivities } = useMemo(() => {
    const now = new Date();
    const stats = {
      appointments: 0,
      pendingReviews: 0,
      progressAlerts: 0,
      newPatients: 0,
    };

    const todays = [];
    const activities = [];

    patients.forEach((p) => {
      // last/created/updated
      const createdAt = p.createdAt ? new Date(p.createdAt) : null;
      const updatedAt = p.updatedAt ? new Date(p.updatedAt) : null;

      // Count appointments happening today
      if (p.nextAppointment && isSameDay(p.nextAppointment, now)) {
        stats.appointments += 1;

        // push to today's appointments list
        const nextDate = new Date(p.nextAppointment);
        todays.push({
          id: p._id || p.id,
          patient: p.name,
          timeISO: p.nextAppointment,
          timeLabel: nextDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: p.type || 'Follow-up',
          dosha: p.dosha || '',
          condition: p.condition || '',
          nextAppointmentDate: nextDate,
        });
      }

      // pending reviews heuristic
      if (String(p.status).toLowerCase() === 'followup') stats.pendingReviews += 1;

      // progress alert heuristic
      if (typeof p.progress === 'number' && p.progress < 30) stats.progressAlerts += 1;

      // new patients: status 'new' or created within 7 days
      const daysSinceCreated = createdAt ? ((now - createdAt) / (1000 * 60 * 60 * 24)) : 999;
      if (String(p.status).toLowerCase() === 'new' || daysSinceCreated <= 7) stats.newPatients += 1;

      // recent activity inference
      if (createdAt && (now - createdAt) <= 1000 * 60 * 60 * 24 * 7) {
        activities.push({
          id: `new-${p._id || p.id}`,
          type: 'new',
          patient: p.name,
          action: 'New patient registered',
          timeLabel: createdAt.toLocaleString(),
          dosha: p.dosha || '',
          when: createdAt,
        });
      } else if (updatedAt && ((now - updatedAt) / (1000 * 60 * 60 * 24)) <= 7) {
        activities.push({
          id: `upd-${p._id || p.id}`,
          type: 'update',
          patient: p.name,
          action: 'Profile updated',
          timeLabel: updatedAt.toLocaleString(),
          dosha: p.dosha || '',
          when: updatedAt,
        });
      }
    });

    // sort today's appointments by time ascending
    todays.sort((a, b) => a.nextAppointmentDate - b.nextAppointmentDate);

    // sort activities by time desc and take recent 5
    activities.sort((a, b) => b.when - a.when);
    const recentTop = activities.slice(0, 5);

    return {
      todayStats: stats,
      todaysAppointments: todays,
      recentActivities: recentTop,
    };
  }, [patients]);

  // Quick stats for UI
  const quickStats = [
    { id: 1, title: "Today's Appointments", value: todayStats.appointments, icon: "Calendar", color: "text-primary", bgColor: "bg-primary/10" },
    { id: 2, title: 'Pending Plan Reviews', value: todayStats.pendingReviews, icon: 'FileText', color: 'text-warning', bgColor: 'bg-warning/10' },
    { id: 3, title: 'Progress Alerts', value: todayStats.progressAlerts, icon: 'TrendingUp', color: 'text-success', bgColor: 'bg-success/10' },
    { id: 4, title: 'New Patients', value: todayStats.newPatients, icon: 'UserPlus', color: 'text-secondary', bgColor: 'bg-secondary/10' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-6 border border-border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-display font-semibold text-primary mb-2">Welcome back, Dr. Patel</h2>
            <h2 className="text-black"><b>{loading ? 'Loading...' : todayStats.appointments}</b> appointments scheduled.</h2>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        {quickStats.map((s) => (
          <div key={s.id} className="p-4 rounded-lg border border-border bg-card">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-text-secondary">{s.title}</div>
                <div className="text-2xl font-semibold">{s.value ?? 0}</div>
              </div>
              <div className={`rounded-full p-2 ${s.bgColor}`}>
                <Icon name={s.icon} size={20} className={s.color} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Today's Appointments */}
      <div className="bg-card rounded-lg border border-border organic-shadow">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-text-primary">Today's Appointments</h3>
            <Icon name="Calendar" size={20} className="text-text-secondary" />
          </div>
        </div>

        <div className="p-4 space-y-3">
          {loading && <div className="p-3 text-text-secondary">Loading appointments…</div>}

          {!loading && todaysAppointments.length === 0 && <div className="p-3 text-text-secondary">No appointments for today</div>}

          {todaysAppointments.map((appointment) => (
            <div key={appointment.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border hover:border-green-700">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-medium text-text-primary">{appointment.patient}</h4>
                  <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">{appointment.dosha}</span>
                </div>
                <p className="text-sm text-text-secondary">{appointment.condition}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-text-primary">{appointment.timeLabel}</p>
                <p className="text-xs text-text-secondary">{appointment.type}</p>
              </div>
            </div>
          ))}

          <button
            className="w-full mt-3 p-2 text-sm text-primary hover:bg-primary/5 rounded-lg organic-transition"
            onClick={() => console.log('View all appointments clicked')}
          >
            View All Appointments
          </button>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-card rounded-lg border border-border organic-shadow">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-text-primary">Recent Activities</h3>
            <Icon name="Clock" size={20} className="text-text-secondary" />
          </div>
        </div>

        <div className="p-4 space-y-3">
          {recentActivities.length === 0 && <div className="text-text-secondary">No recent activities</div>}
          {recentActivities.map((act) => (
            <div key={act.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-medium text-text-primary">{act.patient}</h4>
                  <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">{act.dosha}</span>
                </div>
                <p className="text-sm text-text-secondary">{act.action}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-text-secondary">{act.timeLabel}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {error && <div className="text-sm text-red-500">{error}</div>}
    </div>
  );
};

export default DashboardOverview;
