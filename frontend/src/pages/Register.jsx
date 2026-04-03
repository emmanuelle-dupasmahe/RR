//pages / Register.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
function Register() {
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();
    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        // Vérifications
        if (formData.password !== formData.confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
            return;
        }
        if (formData.password.length < 6) {
            setError('Le mot de passe doit contenir au moins 6 caractères');
            return;
        }
        setLoading(true);
        try {
            await register({
                firstname: formData.firstname,
                lastname: formData.lastname,
                email: formData.email,
                password: formData.password
            });
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Erreur lors de l\'inscription');
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#121212] px-4">
            <div className="w-full max-w-md bg-slate-900 rounded-lg p-8">
                <h1 className="text-3xl font-black text-white mb-6 text-center">Créer un compte</h1>
                {error && <p className="bg-red-600 text-white p-3 rounded mb-4 text-center">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-slate-300 font-bold mb-2">Prénom</label>
                        <input
                            type="text"
                            name="firstname"
                            value={formData.firstname}
                            onChange={handleChange}
                            required
                            disabled={loading}
                            className="w-full px-4 py-2 bg-slate-800 text-white border border-slate-700 rounded focus:outline-none focus:border-red-600 disabled:opacity-50"
                        />
                    </div>
                    <div>
                        <label className="block text-slate-300 font-bold mb-2">Nom</label>
                        <input
                            type="text"
                            name="lastname"
                            value={formData.lastname}
                            onChange={handleChange}
                            required
                            disabled={loading}
                            className="w-full px-4 py-2 bg-slate-800 text-white border border-slate-700 rounded focus:outline-none focus:border-red-600 disabled:opacity-50"
                        />
                    </div>
                    <div>
                        <label className="block text-slate-300 font-bold mb-2">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            disabled={loading}
                            className="w-full px-4 py-2 bg-slate-800 text-white border border-slate-700 rounded focus:outline-none focus:border-red-600 disabled:opacity-50"
                        />
                    </div>
                    <div>
                        <label className="block text-slate-300 font-bold mb-2">Mot de passe</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            disabled={loading}
                            className="w-full px-4 py-2 bg-slate-800 text-white border border-slate-700 rounded focus:outline-none focus:border-red-600 disabled:opacity-50"
                        />
                    </div>
                    <div>
                        <label className="block text-slate-300 font-bold mb-2">Confirmer le mot de passe</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            disabled={loading}
                            className="w-full px-4 py-2 bg-slate-800 text-white border border-slate-700 rounded focus:outline-none focus:border-red-600 disabled:opacity-50"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-red-600 text-white font-black uppercase py-2 rounded hover:bg-red-700 disabled:opacity-50 transition-colors mt-6"
                    >
                        {loading ? 'Inscription...' : 'S\'inscrire'}
                    </button>
                </form>
                <p className="text-slate-400 text-center mt-6">
                    Déjà un compte ? <Link to="/login" className="text-red-600 font-bold hover:underline">Se connecter</Link>
                </p>
            </div>
        </div>
    );
}
export default Register;