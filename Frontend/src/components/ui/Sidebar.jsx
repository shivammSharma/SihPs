// import React, { useState, useEffect } from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import Icon from '../AppIcon';
// import Button from './Button';

// const Sidebar = ({ isCollapsed = false, onToggle, className = '' }) => {
//   const [isMobileOpen, setIsMobileOpen] = useState(false);
//   const location = useLocation();

//   const navigationItems = [
//     { 
//       name: 'Platform Home', 
//       path: '/homepage-ayur-nutri-platform', 
//       icon: 'Home',
//       description: 'Main dashboard and overview'
//     },
//     { 
//       name: 'Intelligence Center', 
//       path: '/ayurvedic-intelligence-center', 
//       icon: 'Brain',
//       description: 'AI-powered insights and analysis'
//     },
//     { 
//       name: 'Professional Portal', 
//       path: '/professional-dashboard-portal', 
//       icon: 'Stethoscope',
//       description: 'Healthcare provider tools'
//     },
//     { 
//       name: 'Wellness Hub', 
//       path: '/personal-wellness-hub', 
//       icon: 'Heart',
//       description: 'Personal health management'
//     },
//     { 
//       name: 'Research Library', 
//       path: '/clinical-research-library', 
//       icon: 'BookOpen',
//       description: 'Clinical studies and evidence'
//     },
//     { 
//       name: 'Success Stories', 
//       path: '/patient-success-stories', 
//       icon: 'Users',
//       description: 'Patient testimonials and outcomes'
//     }
//   ];

//   const secondaryItems = [
//     { name: 'Settings', path: '/settings', icon: 'Settings' },
//     { name: 'Help Center', path: '/help', icon: 'HelpCircle' },
//     { name: 'Contact Support', path: '/contact', icon: 'Mail' }
//   ];

//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth >= 1024) {
//         setIsMobileOpen(false);
//       }
//     };

//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   const isActivePath = (path) => {
//     return location?.pathname === path;
//   };

//   const toggleMobile = () => {
//     setIsMobileOpen(!isMobileOpen);
//   };

//   const closeMobile = () => {
//     setIsMobileOpen(false);
//   };

//   const Logo = () => (
//     <Link 
//       to="/homepage-ayur-nutri-platform" 
//       className="flex items-center space-x-3 organic-transition hover:opacity-80 p-4"
//       onClick={closeMobile}
//     >
//       <div className="relative flex-shrink-0">
//         <svg width="32" height="32" viewBox="0 0 40 40" className="text-primary">
//           <circle cx="20" cy="20" r="18" fill="currentColor" className="opacity-10" />
//           <path
//             d="M20 8c-1.5 0-3 .5-4 1.5L12 14l4 4 4-4-4-4c1-.5 2.5-1 4-1s3 .5 4 1l-4 4 4 4 4-4.5c1-1 1.5-2.5 1.5-4s-.5-3-1.5-4S21.5 8 20 8z"
//             fill="currentColor"
//           />
//           <circle cx="20" cy="26" r="6" fill="var(--color-secondary)" className="opacity-80" />
//           <circle cx="20" cy="26" r="3" fill="currentColor" />
//         </svg>
//       </div>
//       {!isCollapsed && (
//         <div className="flex flex-col min-w-0">
//           <span className="text-lg font-display font-semibold text-primary leading-tight truncate">
//             AyurNutri
//           </span>
//           <span className="text-xs font-accent text-text-secondary leading-none truncate">
//             Ancient Wisdom • Modern Precision
//           </span>
//         </div>
//       )}
//     </Link>
//   );

//   const SidebarContent = () => (
//     <div className="flex flex-col h-full">
//       {/* Logo */}
//       <div className="flex-shrink-0 border-b border-border">
//         <Logo />
//       </div>

//       {/* Main Navigation */}
//       <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
//         {navigationItems?.map((item) => (
//           <Link
//             key={item?.path}
//             to={item?.path}
//             onClick={closeMobile}
//             className={`group flex items-center px-3 py-3 rounded-lg text-sm font-medium organic-transition ${
//               isActivePath(item?.path)
//                 ? 'bg-primary/10 text-primary border border-primary/20' :'text-text-secondary hover:text-primary hover:bg-muted/50'
//             }`}
//             title={isCollapsed ? item?.name : ''}
//           >
//             <Icon 
//               name={item?.icon} 
//               size={20} 
//               className={`flex-shrink-0 ${isCollapsed ? 'mx-auto' : 'mr-3'}`}
//             />
//             {!isCollapsed && (
//               <div className="flex-1 min-w-0">
//                 <div className="truncate">{item?.name}</div>
//                 <div className="text-xs text-text-secondary/70 truncate mt-0.5">
//                   {item?.description}
//                 </div>
//               </div>
//             )}
//           </Link>
//         ))}
//       </nav>

//       {/* Secondary Navigation */}
//       <div className="flex-shrink-0 border-t border-border px-4 py-4 space-y-2">
//         {secondaryItems?.map((item) => (
//           <Link
//             key={item?.path}
//             to={item?.path}
//             onClick={closeMobile}
//             className={`group flex items-center px-3 py-2 rounded-lg text-sm font-medium organic-transition ${
//               isActivePath(item?.path)
//                 ? 'bg-primary/10 text-primary' :'text-text-secondary hover:text-primary hover:bg-muted/50'
//             }`}
//             title={isCollapsed ? item?.name : ''}
//           >
//             <Icon 
//               name={item?.icon} 
//               size={18} 
//               className={`flex-shrink-0 ${isCollapsed ? 'mx-auto' : 'mr-3'}`}
//             />
//             {!isCollapsed && (
//               <span className="truncate">{item?.name}</span>
//             )}
//           </Link>
//         ))}
//       </div>

//       {/* Collapse Toggle */}
//       {onToggle && (
//         <div className="flex-shrink-0 border-t border-border p-4">
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={onToggle}
//             className="w-full justify-center"
//             title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
//           >
//             <Icon 
//               name={isCollapsed ? "ChevronRight" : "ChevronLeft"} 
//               size={18} 
//             />
//             {!isCollapsed && (
//               <span className="ml-2">Collapse</span>
//             )}
//           </Button>
//         </div>
//       )}
//     </div>
//   );

//   return (
//     <>
//       {/* Desktop Sidebar */}
//       <aside 
//         className={`hidden lg:flex lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:flex-col bg-card border-r border-border organic-transition ${
//           isCollapsed ? 'lg:w-16' : 'lg:w-72'
//         } ${className}`}
//       >
//         <SidebarContent />
//       </aside>

//       {/* Mobile Sidebar Toggle */}
//       <div className="lg:hidden fixed top-20 left-4 z-50">
//         <Button
//           variant="outline"
//           size="sm"
//           onClick={toggleMobile}
//           className="organic-shadow"
//         >
//           <Icon name="Menu" size={18} />
//         </Button>
//       </div>

//       {/* Mobile Sidebar Overlay */}
//       {isMobileOpen && (
//         <div className="lg:hidden fixed inset-0 z-50 flex">
//           {/* Backdrop */}
//           <div 
//             className="fixed inset-0 bg-background/80 backdrop-blur-sm" 
//             onClick={closeMobile}
//           />
          
//           {/* Sidebar */}
//           <aside className="relative flex flex-col w-80 max-w-xs bg-card border-r border-border elevated-shadow">
//             <SidebarContent />
//           </aside>
//         </div>
//       )}
//     </>
//   );
// };

// export default Sidebar;




// src/components/ui/Sidebar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Sidebar = ({ isCollapsed = false, onToggle, className = '' }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    { 
      name: 'Platform Home', 
      path: '/homepage-ayur-nutri-platform', 
      icon: 'Home',
      description: 'Main dashboard and overview'
    },
    { 
      name: 'Intelligence Center', 
      path: '/ayurvedic-intelligence-center', 
      icon: 'Brain',
      description: 'AI-powered insights and analysis'
    },
    { 
      name: 'Professional Portal', 
      path: '/professional-dashboard-portal', 
      icon: 'Stethoscope',
      description: 'Healthcare provider tools'
    },
    { 
      name: 'Wellness Hub', 
      path: '/personal-wellness-hub', 
      icon: 'Heart',
      description: 'Personal health management'
    }
    // Removed: Research Library, Success Stories
  ];

  // secondaryItems removed entirely (Settings / Help / Contact were removed)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isActivePath = (path) => {
    return location?.pathname === path;
  };

  const toggleMobile = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const closeMobile = () => {
    setIsMobileOpen(false);
  };

  const Logo = () => (
    <Link 
      to="/homepage-ayur-nutri-platform" 
      className="flex items-center space-x-3 organic-transition hover:opacity-80 p-4"
      onClick={closeMobile}
    >
      <div className="relative flex-shrink-0">
        <svg width="32" height="32" viewBox="0 0 40 40" className="text-primary">
          <circle cx="20" cy="20" r="18" fill="currentColor" className="opacity-10" />
          <path
            d="M20 8c-1.5 0-3 .5-4 1.5L12 14l4 4 4-4-4-4c1-.5 2.5-1 4-1s3 .5 4 1l-4 4 4 4 4-4.5c1-1 1.5-2.5 1.5-4s-.5-3-1.5-4S21.5 8 20 8z"
            fill="currentColor"
          />
          <circle cx="20" cy="26" r="6" fill="var(--color-secondary)" className="opacity-80" />
          <circle cx="20" cy="26" r="3" fill="currentColor" />
        </svg>
      </div>
      {!isCollapsed && (
        <div className="flex flex-col min-w-0">
          <span className="text-lg font-display font-semibold text-primary leading-tight truncate">
            AyurNutri
          </span>
          <span className="text-xs font-accent text-text-secondary leading-none truncate">
            Ancient Wisdom • Modern Precision
          </span>
        </div>
      )}
    </Link>
  );

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex-shrink-0 border-b border-border">
        <Logo />
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navigationItems?.map((item) => (
          <Link
            key={item?.path}
            to={item?.path}
            onClick={closeMobile}
            className={`group flex items-center px-3 py-3 rounded-lg text-sm font-medium organic-transition ${
              isActivePath(item?.path)
                ? 'bg-primary/10 text-primary border border-primary/20' :'text-text-secondary hover:text-primary hover:bg-muted/50'
            }`}
            title={isCollapsed ? item?.name : ''}
          >
            <Icon 
              name={item?.icon} 
              size={20} 
              className={`flex-shrink-0 ${isCollapsed ? 'mx-auto' : 'mr-3'}`}
            />
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <div className="truncate">{item?.name}</div>
                <div className="text-xs text-text-secondary/70 truncate mt-0.5">
                  {item?.description}
                </div>
              </div>
            )}
          </Link>
        ))}
      </nav>

      {/* (Secondary nav intentionally removed) */}

      {/* Collapse Toggle */}
      {onToggle && (
        <div className="flex-shrink-0 border-t border-border p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="w-full justify-center"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <Icon 
              name={isCollapsed ? "ChevronRight" : "ChevronLeft"} 
              size={18} 
            />
            {!isCollapsed && (
              <span className="ml-2">Collapse</span>
            )}
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside 
        className={`hidden lg:flex lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:flex-col bg-card border-r border-border organic-transition ${
          isCollapsed ? 'lg:w-16' : 'lg:w-72'
        } ${className}`}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden fixed top-20 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleMobile}
          className="organic-shadow"
        >
          <Icon name="Menu" size={18} />
        </Button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-background/80 backdrop-blur-sm" 
            onClick={closeMobile}
          />
          
          {/* Sidebar */}
          <aside className="relative flex flex-col w-80 max-w-xs bg-card border-r border-border elevated-shadow">
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  );
};

export default Sidebar;
