import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.js';

function Livredor() {
    const { isAuthenticated, user, token } = useAuth();
    const [messages, setMessages] = useState([]);
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchMessages = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/livredor?page=${page}&limit=5`);
            const data = await res.json();
            setMessages(Array.isArray(data.messages) ? data.messages : []);
            setTotalPages(data.totalPages || 1);
        } catch (err) {
            console.error("Erreur lors de la récupération des messages:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchMessages(); }, [page]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;

        console.log("État Auth au clic:", { isAuthenticated, hasToken: !!token });
        if (!token) {
            alert("Votre session a expiré ou vous n'êtes pas connecté.");
            return;
        }

        try {
            const res = await fetch('http://localhost:5000/api/livredor', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ content })
            });

            if (res.ok) {
                setContent('');
                if (page === 1) {
                    fetchMessages();
                } else {
                    setPage(1); // Revenir à la page 1 pour voir son nouveau message
                }
            } else {
                const errorData = await res.json();
                alert(`Erreur: ${errorData.error || 'Impossible d\'envoyer le message'}`);
            }
        } catch (err) {
            console.error("Erreur lors de l'envoi du message:", err);
            alert("Une erreur de connexion au serveur est survenue.");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Voulez-vous supprimer ce message ?")) return;

        try {
            const res = await fetch(`http://localhost:5000/api/livredor/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.ok) {
                fetchMessages();
            } else {
                const errorData = await res.json();
                alert(`Erreur: ${errorData.error}`);
            }
        } catch (err) {
            console.error("Erreur lors de la suppression:", err);
        }
    };

    return (
        <div className="mt-[80px] min-h-[calc(100vh-82px)] bg-dark-bg text-white">
            <div className="text-center py-[48px] border-b border-[#1f2937]">
                <h1 className="text-[3rem] font-[900] uppercase mb-[12px] text-white leading-tight">Livre d'or</h1>
                <p className="text-[#9ca3af] text-[1.125rem]">Laissez-nous un message !</p>
            </div>

            <div className="max-w-[800px] mx-auto px-[20px] py-[40px]">
                {isAuthenticated ? (
                    <form onSubmit={handleSubmit} className="mb-12 bg-[#111] p-6 border border-[#333] rounded-md">
                        <h2 className="text-primary font-bold uppercase mb-4">Votre message :</h2>
                        <textarea
                            className="w-full p-4 bg-[#222] border border-[#444] text-white focus:outline-none focus:border-primary min-h-[120px]"
                            placeholder={`Écrivez quelque chose, ${user.firstname}...`}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                        />
                        <button type="submit" className="mt-4 bg-primary px-8 py-3 font-bold uppercase hover:bg-[#b8151b] transition-colors">
                            Envoyer
                        </button>
                    </form>
                ) : (
                    <p className="text-center bg-[#111] p-6 border border-[#333] mb-12 italic text-[#9ca3af]">
                        Connectez-vous pour laisser un message.
                    </p>
                )}

                <div className="space-y-8">
                    {loading ? (
                        <p className="text-center text-[#666]">Chargement des messages...</p>
                    ) : messages.length > 0 ? (
                        messages.map((msg) => (
                            <div key={msg.id} className="border-l-4 border-primary bg-[#111] p-6">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-bold text-white uppercase text-lg">{msg.firstname}</span>
                                    <span className="text-[#666] text-sm">
                                        {new Date(msg.created_at).toLocaleDateString('fr-FR')}
                                    </span>
                                </div>
                                <p className="text-gray-300 italic">"{msg.content}"</p>
                                {isAuthenticated && user?.role === 'admin' && (
                                    <div className="mt-4 flex justify-end">
                                        <button
                                            onClick={() => handleDelete(msg.id)}
                                            className="text-[10px] text-[#666] border border-[#444] px-2 py-1 hover:text-primary transition-colors uppercase font-bold cursor-pointer"
                                        >
                                            Supprimer
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-[#666]">Aucun message pour le moment.</p>
                    )}
                </div>

                {/* PAGINATION */}
                {totalPages > 1 && (
                    <div className="mt-12 flex justify-center items-center gap-4">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(prev => prev - 1)}
                            className="px-4 py-2 bg-[#111] border border-[#333] hover:border-primary disabled:opacity-30 disabled:hover:border-[#333] transition-colors uppercase font-bold text-sm"
                        >
                            Précédent
                        </button>
                        <span className="text-[#666] font-bold">Page {page} sur {totalPages}</span>
                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage(prev => prev + 1)}
                            className="px-4 py-2 bg-[#111] border border-[#333] hover:border-primary disabled:opacity-30 disabled:hover:border-[#333] transition-colors uppercase font-bold text-sm"
                        >
                            Suivant
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Livredor;