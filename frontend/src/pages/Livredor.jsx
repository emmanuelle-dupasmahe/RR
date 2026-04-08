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
                setPage(1);
                fetchMessages();
            } else {
                const errorData = await res.json();
                alert(`Erreur: ${errorData.error || 'Impossible d\'envoyer le message'}`);
            }
        } catch (err) {
            console.error("Erreur lors de l'envoi du message:", err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Voulez-vous supprimer ce message ?")) return;
        try {
            const res = await fetch(`http://localhost:5000/api/livredor/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) fetchMessages();
        } catch (err) {
            console.error("Erreur lors de la suppression:", err);
        }
    };

    return (
        <div className="mt-[80px] min-h-[calc(100vh-82px)] bg-black text-white">
            {/* EN-TÊTE */}
            <div className="text-center py-[48px] bg-gradient-to-b from-[#111] to-black">
                <h1 className="text-[3rem] md:text-[3.5rem] font-[900] uppercase mb-[12px] text-white leading-tight tracking-tighter">
                    Livre d'or
                </h1>
                <p className="text-primary font-black tracking-[5px] uppercase text-sm">
                    Voice of the Fans
                </p>
            </div>

            <div className="max-w-[800px] mx-auto px-[20px] py-[60px]">
                
                {/* FORMULAIRE STYLE STUDIO */}
                {isAuthenticated ? (
                    <form onSubmit={handleSubmit} className="mb-20 p-[2px] rounded-xl bg-gradient-to-r from-primary/40 to-black">
                        <div className="bg-[#0a0a0a] p-6 rounded-xl">
                            <h2 className="text-white font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                                <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                                Laisser une trace
                            </h2>
                            <textarea
                                className="w-full p-4 bg-black border border-white/10 text-white focus:outline-none focus:border-primary/50 min-h-[120px] rounded-lg transition-all"
                                placeholder={`Écrivez votre message, ${user.firstname}...`}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
                            />
                            <div className="flex justify-end mt-4">
                                <button type="submit" className="bg-primary text-white px-10 py-3 font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300 rounded-sm text-sm">
                                    Publier
                                </button>
                            </div>
                        </div>
                    </form>
                ) : (
                    <div className="mb-20 text-center p-8 border border-white/5 bg-[#111] rounded-xl italic text-[#666]">
                        Connectez-vous pour rejoindre la discussion.
                    </div>
                )}

                {/* LISTE DES MESSAGES */}
                <div className="space-y-6">
                    {loading ? (
                        <p className="text-center text-[#444] animate-pulse">Récupération des transmissions...</p>
                    ) : messages.length > 0 ? (
                        messages.map((msg) => (
                            <div key={msg.id} className="group relative p-[1px] rounded-xl bg-white/5 hover:bg-gradient-to-r hover:from-primary/30 hover:to-transparent transition-all duration-500">
                                <div className="bg-black p-6 rounded-xl border border-white/5 transition-all group-hover:translate-x-1">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <span className="block font-black text-primary uppercase tracking-tighter text-xl">
                                                {msg.firstname}
                                            </span>
                                            <span className="text-[#444] text-[0.7rem] font-bold uppercase tracking-[2px]">
                                                {new Date(msg.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
                                            </span>
                                        </div>
                                        <div className="text-primary/20 group-hover:text-primary/40 transition-colors">
                                            <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 7.55228 14.017 7V4H20.017C21.1216 4 22.017 4.89543 22.017 6V15C22.017 16.6569 20.6739 18 19.017 18H17.017L14.017 21ZM2.017 21L2.017 18C2.017 16.8954 2.91243 16 4.017 16H7.017C7.56928 16 8.017 15.5523 8.017 15V9C8.017 8.44772 7.56928 8 7.017 8H3.017C2.46472 8 2.017 7.55228 2.017 7V4H8.017C9.12157 4 10.017 4.89543 10.017 6V15C10.017 16.6569 8.67386 18 7.017 18H5.017L2.017 21Z"/></svg>
                                        </div>
                                    </div>
                                    
                                    <p className="text-gray-400 leading-relaxed font-medium">
                                        {msg.content}
                                    </p>

                                    {isAuthenticated && user?.role === 'admin' && (
                                        <div className="mt-4 flex justify-end">
                                            <button
                                                onClick={() => handleDelete(msg.id)}
                                                className="text-[9px] text-[#333] hover:text-primary border border-white/5 hover:border-primary/30 px-3 py-1 transition-all uppercase font-black tracking-widest cursor-pointer"
                                            >
                                                Supprimer Transmission
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-[#333] uppercase font-bold tracking-widest">Silence radio.</p>
                    )}
                </div>

                {/* PAGINATION HARMONISÉE */}
                {totalPages > 1 && (
                    <div className="mt-16 flex justify-center items-center gap-6">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(prev => prev - 1)}
                            className="w-12 h-12 flex items-center justify-center border border-white/10 hover:border-primary disabled:opacity-20 transition-all text-white bg-black rounded-full"
                        >
                            ←
                        </button>
                        <span className="text-primary font-black text-sm uppercase tracking-[3px]">
                             {page} / {totalPages}
                        </span>
                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage(prev => prev + 1)}
                            className="w-12 h-12 flex items-center justify-center border border-white/10 hover:border-primary disabled:opacity-20 transition-all text-white bg-black rounded-full"
                        >
                            →
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Livredor;