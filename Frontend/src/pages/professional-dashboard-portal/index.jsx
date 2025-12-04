import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import useAuth from "../../hooks/useAuth";

import DashboardOverview from './components/DashboardOverview';
import PatientManagement from './components/PatientManagement';

import AnalyticsSuite from './components/AnalyticsSuite';
import CommunicationTools from './components/CommunicationTools';
import DoctorDietBuilderPage from './components/DoctorDietBuilderPage';


const ProfessionalDashboardPortal = () => {
  const { user, isDoctor } = useAuth();

  if (!isDoctor) {
    if (user?.role === "patient") {
      return <Navigate to="/personal-wellness-hub" replace />;
    }
    return <Navigate to="/signin/doctor" replace />;
  }

  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const navigationSections = [
    { id: 'overview', name: 'Dashboard Overview', icon: 'Home', description: "Today's summary and quick actions" },
    { id: 'patients', name: 'Patient Management', icon: 'Users', description: 'Manage patient profiles and progress' },
    { id: 'plans', name: 'Plan Generation', icon: 'FileText', description: 'Create personalized nutrition plans' },
    { id: 'analytics', name: 'Analytics Suite', icon: 'BarChart3', description: 'Practice insights and metrics' },
    { id: 'communication', name: 'Communication', icon: 'MessageSquare', description: 'Patient messaging and coordination' }
  ];

  const toggleSidebar = () => setSidebarCollapsed((v) => !v);

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'overview':
        return <DashboardOverview />;
      case 'patients':
        return <PatientManagement />;
      case 'plans':
        return <DoctorDietBuilderPage />;
      case 'analytics':
        return <AnalyticsSuite />;
      case 'communication':
        return <CommunicationTools />;
      default:
        return <DashboardOverview />;
    }
  };

  const getCurrentSectionInfo = () =>
    navigationSections.find((section) => section.id === activeSection) || navigationSections[0];

  const getDoctorDisplayName = () => {
    const baseName = user?.fullName || user?.name || 'Doctor';
    if (/^dr\.?/i.test(baseName.trim())) return baseName;
    return `Dr. ${baseName}`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header (now shows Dr name via useAuth) */}
      <Header />

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-30 flex flex-col bg-card border-r border-border pt-16 organic-transition ${
            sidebarCollapsed ? 'w-16' : 'w-72'
          } hidden lg:flex`}
        >
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            {!sidebarCollapsed && (
              <div>
                <h2 className="text-lg font-display font-semibold text-primary">
                  Professional Portal
                </h2>
                <p className="text-sm text-text-secondary">
                  {getDoctorDisplayName()}'s Workspace
                </p>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="flex-shrink-0"
            >
              <Icon name={sidebarCollapsed ? 'ChevronRight' : 'ChevronLeft'} size={18} />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navigationSections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center px-3 py-3 rounded-lg text-left organic-transition ${
                  activeSection === section.id
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'text-text-secondary hover:text-primary hover:bg-muted/50'
                }`}
                title={sidebarCollapsed ? section.name : ''}
              >
                <Icon
                  name={section.icon}
                  size={20}
                  className={`flex-shrink-0 ${sidebarCollapsed ? 'mx-auto' : 'mr-3'}`}
                />
                {!sidebarCollapsed && (
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{section.name}</div>
                    <div className="text-xs text-text-secondary/70 truncate mt-0.5">
                      {section.description}
                    </div>
                  </div>
                )}
              </button>
            ))}
          </nav>

          {/* Quick Actions */}
          {!sidebarCollapsed && (
            <div className="p-4 border-t border-border space-y-2">
              <Button variant="outline" size="sm" fullWidth iconName="Plus">
                New Patient
              </Button>
              <Button variant="default" size="sm" fullWidth iconName="Calendar">
                Schedule Appointment
              </Button>
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main
          className={`flex-1 organic-transition ${
            sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-72'
          }`}
        >
          <div className="p-6 lg:p-8">
            {/* Breadcrumb */}
            <div className="flex items-center space-x-2 text-sm text-text-secondary mb-6">
              <Link
                to="/homepage-ayur-nutri-platform"
                className="hover:text-primary organic-transition"
              >
                AyurNutri Platform
              </Link>
              <Icon name="ChevronRight" size={16} />
              <span className="text-text-primary">Professional Portal</span>
              <Icon name="ChevronRight" size={16} />
              <span className="text-text-primary">
                {getCurrentSectionInfo()?.name}
              </span>
            </div>

            <div className="max-w-7xl mx-auto">{renderActiveSection()}</div>
          </div>
        </main>
      </div>

      {/* Floating actions */}
      <div className="fixed bottom-6 right-6 flex flex-col space-y-3 z-50">
        <Button
          variant="default"
          size="icon"
          className="w-12 h-12 rounded-full organic-shadow bg-primary hover:bg-primary/90"
          title="Quick Patient Search"
        >
          <Icon name="Search" size={20} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="w-12 h-12 rounded-full organic-shadow bg-background"
          title="Emergency Contact"
        >
          <Icon name="Phone" size={20} />
        </Button>
      </div>
    </div>
  );
};

export default ProfessionalDashboardPortal;
