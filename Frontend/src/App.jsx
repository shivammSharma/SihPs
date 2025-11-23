// import React from "react";
// import Routes from "./Routes";

// function App() {
//   return (
//     <Routes />
//   );
// }

// export default App;



import React, { useEffect } from "react";
import Routes from "./Routes";

const App = () => {
  useEffect(() => {
    const labelsToRemove = ['Research Library', 'Continuing Education', 'Customization', 'Dosha Explorer'];

    const removeSidebarItems = () => {
      // look for likely sidebar containers
      const containers = document.querySelectorAll('aside, .sidebar, .left-nav, .nav-sidebar');

      containers.forEach(container => {
        // remove any matching anchors, buttons, or list items
        container.querySelectorAll('a, button, [role="link"], li').forEach(el => {
          const text = (el.textContent || '').trim();
          if (!text) return;

          // match exact or startsWith (covers icon + text combos)
          if (labelsToRemove.some(label => text === label || text.startsWith(label))) {
            const li = el.closest('li');
            if (li) li.remove();
            else el.remove();
          }
        });
      });
    };

    // run shortly after mount to let client-side rendering finish
    const t = setTimeout(removeSidebarItems, 200);

    // re-run on history navigation (basic support for client routing)
    const onPop = () => setTimeout(removeSidebarItems, 100);
    window.addEventListener('popstate', onPop);

    return () => {
      clearTimeout(t);
      window.removeEventListener('popstate', onPop);
    };
  }, []);

  return <Routes />;
};

export default App;
