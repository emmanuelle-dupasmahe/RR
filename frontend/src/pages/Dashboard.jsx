import { useAuth } from '../hooks/useAuth.js';
function Dashboard() {
    const { user } = useAuth();
    return (
        <div className="media-page">
            <div className="media-header">
                <h1>Espace Membre</h1>
                <p>Votre profil</p>
            </div>
            <div className="max-w-4xl mx-auto px-5 py-10">
                <div className="bg-slate-900 rounded-lg p-8">
                    <h2 className="text-2xl font-black mb-6">Bienvenue {user?.firstname} !</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-slate-400 font-bold mb-2">Prénom :</label>
                            <p className="text-white text-lg">{user?.firstname}</p>
                        </div>
                        <div>
                            <label className="block text-slate-400 font-bold mb-2">Nom :</label>
                            <p className="text-white text-lg">{user?.lastname}</p>
                        </div>
                        <div>
                            <label className="block text-slate-400 font-bold mb-2">Email :</label>
                            <p className="text-white text-lg">{user?.email}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Dashboard;