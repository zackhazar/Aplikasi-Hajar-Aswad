import { useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";

/**
 * Custom hook that synchronizes the app's `view` state with React Router URLs.
 * This allows deep linking, browser back/forward, and URL sharing
 * without rewriting the entire navigation system.
 *
 * URL pattern: /{viewName} (e.g., /dashboard, /transaksi, /keberangkatan)
 */
export function useAppRouter(view, setView, allowed) {
  const navigate = useNavigate();
  const location = useLocation();

  // Sync URL → view state (on initial load or browser back/forward)
  useEffect(() => {
    const path = location.pathname.replace(/^\//, "").split("/")[0] || "";
    if (path && allowed.includes(path) && path !== view) {
      setView(path);
    }
  }, [location.pathname, allowed, view, setView]);

  // Sync view state → URL (when view changes via app navigation)
  useEffect(() => {
    const currentPath = location.pathname.replace(/^\//, "").split("/")[0] || "";
    if (view && view !== currentPath) {
      navigate("/" + view, { replace: false });
    }
  }, [view, location.pathname, navigate]);

  // Enhanced goView that updates both state and URL
  const goView = useCallback(
    (v) => {
      if (!allowed.includes(v)) return;
      setView(v);
    },
    [allowed, setView]
  );

  return { goView };
}
