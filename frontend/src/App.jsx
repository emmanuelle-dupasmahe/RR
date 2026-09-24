import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth.js';
import MainLayout from './layouts/MainLayout.jsx';
import AuthLayout from './layouts/AuthLayout.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Concerts from './pages/Concerts.jsx';
import Repetitions from './pages/Repetitions.jsx';
import Medias from './pages/Medias.jsx';
import Legroupe from './pages/Legroupe.jsx';
import Livredor from './pages/Livredor.jsx';
import Backstage from './pages/Backstage';
import Contact from './pages/Contact.jsx';
import Agenda from './pages/Agenda.jsx';
import MentionsLegales from './pages/MentionsLegales.jsx';
import PolitiqueConfidentialite from './pages/PolitiqueConfidentialite.jsx';
import Accessibilite from './pages/Accessibilite.jsx';
import Offres from './pages/Offres.jsx';

function App() {
  const { loading } = useAuth();
  if (loading) return <div><p>Chargement...</p></div>;
  return (
    <Routes>
      {/* Routes AVEC Header + Footer */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/legroupe" element={<Legroupe />} />
        <Route path="/repetition" element={<Repetitions />} />
        <Route path="/medias" element={<Medias />} />
        <Route path="/offres" element={<Offres />} />
        <Route path="/backstage" element={
          <PrivateRoute><Backstage /></PrivateRoute>
        } />
        <Route path="/concerts" element={
          <PrivateRoute><Concerts /></PrivateRoute>
        } />
        <Route path="/livredor" element={<Livredor />} />
        <Route path="/contact" element={<Contact />} />


        <Route path="/agenda" element={
          <PrivateRoute><Agenda /></PrivateRoute>
        } />

        {/* Déclaration des nouvelles routes légales */}
        <Route path="/mentions-legales" element={<MentionsLegales />} />
        <Route path="/confidentialite" element={<PolitiqueConfidentialite />} />
        <Route path="/accessibilite" element={<Accessibilite />} />

        <Route path="/dashboard" element={
          <PrivateRoute adminOnly={true}><Dashboard /></PrivateRoute>
        } />
      </Route>

      {/* Routes SANS Header (plein écran) */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
export default App;