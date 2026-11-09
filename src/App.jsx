import { useEffect, useState } from "react";

import Home from "./Home";
import AuthModal from "./components/auth/AuthModal";
import Dashboard from "./components/dashboard/Dashboard";

import "./App.css";

export default function App() {
  const [session, setSession] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    const handle = (e) => {
      const a = e.target.closest(
        'a[href="#conflito"], a[href="#relato"], a[href="#empresas"], a[href="#contato"]'
      );

      if (a) {
        e.preventDefault();
        setAuthOpen(true);
      }
    };

    document.addEventListener("click", handle);

    return () => {
      document.removeEventListener("click", handle);
    };
  }, []);

  const enter = (role, name) => {
    setSession({ role, name });
    setAuthOpen(false);
  };

  return session ? (
    <Dashboard
      role={session.role}
      name={session.name}
      onExit={() => setSession(null)}
    />
  ) : (
    <>
      <Home />

      {authOpen && (
        <AuthModal
          onClose={() => setAuthOpen(false)}
          onEnter={enter}
        />
      )}
    </>
  );
}