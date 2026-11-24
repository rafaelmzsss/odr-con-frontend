import { useEffect, useState } from "react";

import Home from "./Home";
import AuthModal from "./components/auth/AuthModal";
import Dashboard from "./components/dashboard/Dashboard";
import {
  createInitialProfile,
  getDisplayName,
  updateProfile,
} from "./services/profileService";
import { logout } from "./services/authService";

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
  
  const enter = ({ role, name, email = "", user }) => {
  setSession({
    role,
    name,
    email,
    anonymous: !email,
    user,
    // Sessão anônima não tem e-mail, então não tem perfil para editar.
    profile: email
      ? createInitialProfile({ email, fullName: name ?? "" })
      : null,
  });
  setAuthOpen(false);
};

  // Chamado pelo modal "Editar informações". Se lançar erro, o modal o exibe.
  const saveProfile = async (values) => {
    const saved = await updateProfile(values);

    setSession((current) => ({
      ...current,
      name: getDisplayName(saved, current.name),
      email: saved.email,
      profile: saved,
    }));
  };

  return session ? (
  
  <Dashboard
  role={session.role}
  name={session.name}
  email={session.email}
  anonymous={session.anonymous}
  profile={session.profile}
  onUpdateProfile={saveProfile}
  onExit={() => { logout(); setSession(null); }}
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
