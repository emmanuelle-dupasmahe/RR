import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import { guestbookService, memberService } from '../services/api';
import { Helmet } from 'react-helmet-async';

// Données statiques avec les vrais numéros
const contactsAdminInfo = [
    { nom: "Éric", role: "Devis / Facture", tel: "06 09 97 81 24", fallbackPhoto: "/images/eric.jpg" },
    { nom: "Martial", role: "Relation clientèle", tel: "06 80 22 94 14", fallbackPhoto: "/images/martial.jpg" },
    { nom: "Romain", role: "Relation clientèle", tel: "06 18 75 14 29", fallbackPhoto: "/images/romain.jpg" },
    { nom: "Jean-Marc", role: "Relation clientèle", tel: "06 87 13 62 00", fallbackPhoto: "/images/jeanmarc.jpg" }
];

// ── SOUS-COMPOSANT POUR MASQUER/AFFICHER LE NUMÉRO ──
function ContactCard({ contact }) {
    const [showPhone, setShowPhone] = useState(false);

    return (
        <div className="flex items-center gap-4 bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-gray-200 dark:border-white/5 hover:border-primary/50 transition-colors">
            <img 
                src={contact.photo} 
                alt={`Photo de ${contact.nom}`} 
                className="w-12 h-12 rounded-full object-cover border-2 border-primary shrink-0"
            />
            <div className="min-w-0">
                <p className="text-sm font-black uppercase tracking-widest text-black dark:text-white truncate">
                    {contact.nom}
                </p>
                <p className="text-[9px] text-primary uppercase tracking-[2px] mb-1 truncate">
                    {contact.role}
                </p>
                
                {showPhone ? (
                    <a 
                        href={`tel:${contact.tel.replace(/\s/g, '')}`} 
                        className="text-xs font-bold text-primary dark:text-primary transition-colors animate-in fade-in duration-300"
                    >
                        {contact.tel}
                    </a>
                ) : (
                    <button
                        type="button"
                        onClick={() => setShowPhone(true)}
                        className="text-[10px] font-black uppercase tracking-wider text-gray-400 hover:text-primary dark:hover:text-white transition-colors underline decoration-dotted decoration-primary/50 cursor-pointer"
                    >
                        Afficher le numéro
                    </button>
                )}
            </div>
        </div>
    );
}

// ── COMPOSANT PRINCIPAL ──
function Contact() {
    const { user, isAuthenticated } = useAuth();
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState({ type: '', text: '' });
    const [membresDB, setMembresDB] = useState([]);

    const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    useEffect(() => {
        const fetchMembres = async () => {
            try {
                const data = await memberService.getAll(); 
                setMembresDB(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Erreur lors de la récupération des membres :", error);
            }
        };
        fetchMembres();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        try {
            await guestbookService.postMessage(message, true); 
            setStatus({ type: 'success', text: 'Votre message privé a bien été envoyé au groupe !' });
            setMessage('');
            setTimeout(() => setStatus({ type: '', text: '' }), 5000);
        } catch (error) {
            console.error("L'erreur exacte est :", error);
            setStatus({ type: 'error', text: 'Erreur lors de l\'envoi du message.' });
        }
    };

    const mergedContacts = contactsAdminInfo.map(staticInfo => {
        const dbInfo = membresDB.find(m => m.nom.toLowerCase() === staticInfo.nom.toLowerCase());
        
        let finalPhoto = staticInfo.fallbackPhoto;

        if (dbInfo && dbInfo.photo_url) {
            finalPhoto = dbInfo.photo_url.startsWith('/uploads') 
                ? `${BASE_URL}${dbInfo.photo_url}` 
                : dbInfo.photo_url;
        }
        
        return {
            ...staticInfo,
            photo: finalPhoto
        };
    });

    return (
        <>
            <Helmet>
                <title>Reservoir Rock | Contact</title>
                <meta name="description" content="Reservoir Rock, page de contact pour envoyer un message privé au groupe." />
                <link rel="canonical" href="https://resrock.fr/contact" />
            </Helmet>

            <div className="mt-[80px] min-h-[calc(100vh-82px)] bg-white dark:bg-black text-black dark:text-white transition-colors duration-300 font-sans">

                <div className="text-center py-[48px] bg-gray-50 dark:bg-gradient-to-b dark:from-[#111] dark:to-black border-b border-gray-100 dark:border-none">
                    <h1 className="text-[3rem] md:text-[3.5rem] font-[300] uppercase m-0 leading-[1.2] tracking-[0.1em] text-black dark:text-white inline-block">
                        Contact
                    </h1>
                    <p className="text-primary font-black tracking-[5px] uppercase text-sm">
                        Envoyez un message privé au groupe
                    </p>
                </div>

                <div className="max-w-[1000px] mx-auto px-[20px] pt-10 pb-16">

                    {/* Rendu des cartes via le sous-composant */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                        {mergedContacts.map((contact, index) => (
                            <ContactCard key={index} contact={contact} />
                        ))}
                    </div>

                    <div className="max-w-[800px] mx-auto">
                        {!isAuthenticated ? (
                            <div className="mb-12 text-center p-8 border border-dashed border-gray-300 dark:border-white/10 bg-gray-50 dark:bg-[#111] rounded-xl">
                                <p className="text-sm font-bold uppercase tracking-widest text-black dark:text-white mb-4">
                                    Demande de Booking & Devis
                                </p>
                                <a href="tel:+33609978124" className="text-2xl font-black text-primary hover:text-black dark:hover:text-white transition-colors block mb-6">
                                    06 09 97 81 24
                                </a>
                                <p className="italic text-gray-500 dark:text-[#666] text-xs">
                                    Connectez-vous pour utiliser notre messagerie privée.
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="mb-12 p-[2px] rounded-xl bg-gray-200 dark:bg-gradient-to-r dark:from-primary dark:to-black">
                                <div className="bg-white dark:bg-[#0a0a0a] p-4 md:p-6 rounded-[10px]">
                                    {status.text && (
                                        <div className={`p-4 mb-6 rounded-lg text-sm font-bold text-center ${status.type === 'success' ? 'bg-green-100 dark:bg-green-500/10 text-green-800 dark:text-green-300' : 'bg-red-100 dark:bg-red-500/10 text-red-800 dark:text-red-300'}`}>
                                            {status.text}
                                        </div>
                                    )}

                                    <textarea
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        required
                                        rows="6"
                                        className="w-full p-4 bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 text-black dark:text-white focus:outline-none focus:border-primary min-h-[100px] rounded-lg transition-all text-sm resize-none"
                                        placeholder={`Demande de concert, question, suggestion... N'oubliez pas d'indiquer votre numéro de téléphone dans le message si vous souhaitez être rappelé(e).`}
                                    ></textarea>

                                    <div className="flex justify-end mt-4">
                                        <button
                                            type="submit"
                                            className="bg-primary text-white px-8 py-3 font-black uppercase tracking-widest hover:bg-black dark:hover:bg-white dark:hover:text-black transition-all duration-300 rounded-sm text-[10px] shadow-lg"
                                        >
                                            Envoyer
                                        </button>
                                    </div>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Contact;