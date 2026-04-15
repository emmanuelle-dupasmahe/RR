import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.js';

function Livredor() {
    const { isAuthenticated, user, token } = useAuth();
    const [messages, setMessages] = useState([]);
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isPrivate, setIsPrivate] = useState(false);

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:5000/api/guestbook?page=${page}&limit=5`);
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
            const res = await fetch('http://localhost:5000/api/guestbook', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ content, is_private: isPrivate })
            });

            if (res.ok) {
                setContent('');
                setIsPrivate(false);
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
            const res = await fetch(`http://localhost:5000/api/guestbook/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) fetchMessages();
        } catch (err) {
            console.error("Erreur lors de la suppression:", err);
        }
    };

    return (
        <div className="mt-[80px] min-h-[calc(100vh-82px)] bg-white dark:bg-black text-black dark:text-white transition-colors duration-300 font-sans">
            
            {/* EN-TÊTE */}
            <div className="text-center py-[48px] bg-gray-50 dark:bg-gradient-to-b dark:from-[#111] dark:to-black border-b border-gray-100 dark:border-none">
                <h1 className="text-[3rem] md:text-[3.5rem] font-[300] uppercase m-0 leading-[1.2] tracking-[0.1em] text-black dark:text-white inline-block">
                    Livre d'or
                </h1>
                
                <p className="text-primary font-black tracking-[5px] uppercase text-sm">
                    Voice of the Fans
                </p>
            </div>

            <div className="max-w-[800px] mx-auto px-[20px] pt-10 pb-16">
                
                {/* FORMULAIRE D'ENVOI */}
                {isAuthenticated ? (
                    
                    <form onSubmit={handleSubmit} className="mb-12 p-[2px] rounded-xl bg-gray-200 dark:bg-gradient-to-r dark:from-primary dark:to-black">
                        <div className="bg-white dark:bg-[#0a0a0a] p-6 rounded-[10px]">
                            <h2 className="text-black dark:text-white font-black uppercase tracking-widest mb-4 flex items-center gap-2 text-xs">
                                
                                <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                                Laisser une trace
                            </h2>
                            <textarea
                                
                                className="w-full p-4 bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 text-black dark:text-white focus:outline-none focus:border-primary min-h-[100px] rounded-lg transition-all text-sm"
                                placeholder={`Écrivez votre message, ${user.firstname}...`}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
                            />
                            
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4">
                                <label htmlFor="private-toggle" className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative inline-flex items-center">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={isPrivate}
                                            onChange={(e) => setIsPrivate(e.target.checked)}
                                            id="private-toggle"
                                        />
                                        
                                        <div className="w-10 h-5 bg-gray-300 dark:bg-white/10 rounded-full peer peer-checked:bg-primary/20 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-500 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5 peer-checked:after:bg-primary transition-colors"></div>
                                    </div>
                                    
                                    <span className="text-[10px] uppercase font-black tracking-widest text-gray-400 group-hover:text-primary transition-colors">
                                        {isPrivate ? "Message Privé (Contact direct)" : "Message Public"}
                                    </span>
                                </label>

                               
                                <button type="submit" className="bg-primary text-white px-8 py-3 font-black uppercase tracking-widest hover:bg-black dark:hover:bg-white dark:hover:text-black transition-all duration-300 rounded-sm text-[10px] shadow-lg self-end sm:self-auto">
                                    Publier 
                                </button>
                            </div>
                        </div>
                    </form>
                ) : (
                    <div className="mb-12 text-center p-6 border border-dashed border-gray-300 dark:border-white/10 bg-gray-50 dark:bg-[#111] rounded-xl italic text-gray-500 dark:text-[#666] text-sm">
                        Connectez-vous pour rejoindre la discussion.
                    </div>
                )}

                {/* LISTE DES MESSAGES */}
                <div className="space-y-8">
                    {loading ? (
                        <div className="flex flex-col items-center py-10">
                            
                            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                            <p className="text-center text-gray-400 dark:text-[#444] uppercase text-xs font-black tracking-widest">Récupération des transmissions...</p>
                        </div>
                    ) : messages.length > 0 ? (
                        messages.map((msg) => (
                           
                            <div key={msg.id} className="group relative p-[1px] rounded-xl transition-all duration-500 bg-gray-100 dark:bg-white/5 dark:hover:bg-gradient-to-r dark:hover:from-primary/40 dark:hover:to-transparent">
                                <div className="bg-white dark:bg-black p-6 rounded-xl border border-gray-200 dark:border-white/5 transition-all group-hover:translate-x-1 shadow-sm">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            
                                            <span className="block font-[900] text-primary uppercase tracking-[0.1em] text-xl transform scale-x-[0.9] origin-left">
                                                {msg.firstname}
                                                {msg.is_private === 1 && (
                                                    
                                                    <span className="text-[9px] bg-primary/10 text-primary px-2 py-0.5 rounded-full ml-3 tracking-widest font-black border border-primary/20">
                                                        PRIVÉ
                                                    </span>
                                                )}
                                            </span>
                                            <span className="text-gray-400 dark:text-[#444] text-[0.7rem] font-bold uppercase tracking-[2px]">
                                                {new Date(msg.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
                                            </span>
                                        </div>
                                        
                                        <div className="text-gray-200 dark:text-primary/20 group-hover:text-primary/40 transition-colors">
                                            <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 7.55228 14.017 7V4H20.017C21.1216 4 22.017 4.89543 22.017 6V15C22.017 16.6569 20.6739 18 19.017 18H17.017L14.017 21ZM2.017 21L2.017 18C2.017 16.8954 2.91243 16 4.017 16H7.017C7.56928 16 8.017 15.5523 8.017 15V9C8.017 8.44772 7.56928 8 7.017 8H3.017C2.46472 8 2.017 7.55228 2.017 7V4H8.017C9.12157 4 10.017 4.89543 10.017 6V15C10.017 16.6569 8.67386 18 7.017 18H5.017L2.017 21Z" /></svg>
                                        </div>
                                    </div>

                                    <p className="text-gray-700 dark:text-gray-400 leading-relaxed font-medium text-sm sm:text-base">
                                        {msg.content}
                                    </p>

                                    {msg.reponse && (
                                       
                                        <div className="mt-6 ml-2 sm:ml-6 p-4 bg-gray-50 dark:bg-primary/5 border-l-4 border-primary rounded-r-lg">
                                           
                                            <span className="text-primary text-[10px] font-black uppercase tracking-[2px] block mb-1">
                                                Réponse de Réservoir Rock
                                            </span>
                                            <p className="text-gray-600 dark:text-gray-300 text-sm italic">
                                                {msg.reponse}
                                            </p>
                                        </div>
                                    )}

                                    {isAuthenticated && user?.role === 'admin' && (
                                        <div className="mt-6 flex justify-end">
                                            <button
                                                onClick={() => handleDelete(msg.id)}
                                                /* CHANGÉ ICI : hover:text-primary hover:border-primary/30 */
                                                className="text-[9px] text-gray-400 hover:text-primary border border-gray-200 dark:border-white/5 hover:border-primary/30 px-4 py-2 transition-all uppercase font-black tracking-widest cursor-pointer"
                                            >
                                                Supprimer 
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-20 text-center border border-dashed border-gray-200 dark:border-white/10 rounded-xl">
                            <p className="text-gray-400 dark:text-[#333] uppercase font-black tracking-[4px]">Silence radio.</p>
                        </div>
                    )}
                </div>

                {/* PAGINATION CIRCULAIRE */}
                {totalPages > 1 && (
                    <div className="mt-20 flex justify-center items-center gap-8">
                        <button
                            disabled={page === 1}
                            onClick={() => { setPage(prev => prev - 1); window.scrollTo(0, 400); }}
                            /* CHANGÉ ICI : hover:border-primary */
                            className="w-14 h-14 flex items-center justify-center border border-gray-200 dark:border-white/10 hover:border-primary dark:hover:border-primary disabled:opacity-20 transition-all text-black dark:text-white bg-white dark:bg-black rounded-full shadow-xl"
                        >
                            <span className="text-xl">←</span>
                        </button>
                        <div className="flex flex-col items-center">
                            <span className="text-[0.6rem] text-gray-400 font-bold uppercase tracking-tighter">Page</span>
                            {/* CHANGÉ ICI : text-primary */}
                            <span className="text-primary font-black text-xl uppercase tracking-[3px]">
                                {page} <span className="text-gray-300 dark:text-[#222]">/</span> {totalPages}
                            </span>
                        </div>
                        <button
                            disabled={page === totalPages}
                            onClick={() => { setPage(prev => prev + 1); window.scrollTo(0, 400); }}
                            /* CHANGÉ ICI : hover:border-primary */
                            className="w-14 h-14 flex items-center justify-center border border-gray-200 dark:border-white/10 hover:border-primary dark:hover:border-primary disabled:opacity-20 transition-all text-black dark:text-white bg-white dark:bg-black rounded-full shadow-xl"
                        >
                            <span className="text-xl">→</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Livredor;