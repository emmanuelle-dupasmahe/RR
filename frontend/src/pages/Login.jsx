// pages/Login.jsx
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/dashboard';
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            navigate(from, { replace: true });
        } catch (err) {
            setError(err.message || 'Erreur de connexion');
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#121212] px-4">
            <div className="w-full max-w-md bg-slate-900 rounded-lg p-8">
                <h1 className="text-3xl font-black text-white mb-6 text-center">Connexion</h1>
                {error && <p className="bg-red-600 text-white p-3 rounded mb-4 text-center">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-slate-300 font-bold mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-2 bg-slate-800 text-white border border-slate-700 rounded focus:outline-none focus:border-red-600"
                        />
                    </div>
                    <div>
                        <label className="block text-slate-300 font-bold mb-2">Mot de passe</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 bg-slate-800 text-white border border-slate-700 rounded focus:outline-none focus:border-red-600"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-red-600 text-white font-black uppercase py-2 rounded hover:bg-red-700 disabled:opacity-50 transition-colors mt-6"
                    >
                        {loading ? 'Connexion...' : 'Se connecter'}
                    </button>
                </form>
                <p className="text-slate-400 text-center mt-6">
                    Pas de compte ? <Link to="/register" className="text-red-600 font-bold hover:underline">S'inscrire</Link>
                </p>
            </div>
        </div>
    );
}
export default Login;