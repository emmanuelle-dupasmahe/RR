function MessagesSection({
    SectionTitle,
    messages,
    setMessages,
    handleDeleteMessage,
    handleUpdateResponse,
    inputClass
}) {
    return (
        <section id="messages" className="animate-in fade-in duration-500">
            <SectionTitle subtitle="Fan Messages">Livre d'Or</SectionTitle>

            <div className="space-y-6">
                {Array.isArray(messages) && messages.length > 0 ? (
                    messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`bg-white dark:bg-[#0a0a0a] border ${msg.is_private
                                ? 'border-primary/40 shadow-[0_0_20px_rgba(var(--primary-rgb),0.05)]'
                                : 'border-black/5 dark:border-white/5'
                                } p-6 rounded-2xl transition-all group shadow-sm dark:shadow-2xl`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="space-y-2">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <span className="text-primary text-[10px] font-black uppercase tracking-[2px]">
                                            Par {msg.firstname || `Utilisateur #${msg.user_id}`}
                                            <span className="mx-2 opacity-20">-</span>
                                            {msg.created_at ? new Date(msg.created_at).toLocaleDateString('fr-FR') : 'Date inconnue'}
                                        </span>

                                        {msg.is_private === 1 && (
                                            <div className="flex items-center gap-2">
                                                <span className="bg-primary text-black text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-tighter">
                                                    Message Privé
                                                </span>
                                                <span
                                                    className="text-black/60 dark:text-white/60 text-[10px] font-mono bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded border border-black/5 dark:border-white/10 select-all cursor-help"
                                                    title="Cliquez pour copier l'email"
                                                >
                                                    {msg.email || 'Email non trouvé'}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-black dark:text-white text-base italic leading-relaxed">"{msg.content}"</p>
                                </div>

                                <button
                                    onClick={() => handleDeleteMessage(msg.id)}
                                    className="text-black/20 dark:text-[#333] hover:text-red-500 transition-colors text-[10px] font-black uppercase md:opacity-0 group-hover:opacity-100"
                                >
                                    Supprimer
                                </button>
                            </div>

                            <div className="mt-6 pt-6 border-t border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.02] -mx-6 px-6 -mb-6 rounded-b-2xl">
                                <div className="flex flex-col gap-3">
                                    <label className="text-[9px] font-black uppercase tracking-[2px] text-black/40 dark:text-white/30">
                                        {msg.is_private ? 'Note interne (Suivi de réponse)' : 'Réponse publique (Sera visible sur le site)'}
                                    </label>

                                    <textarea
                                        className={`${inputClass} min-h-[100px] text-sm bg-white dark:bg-black/40 border-black/10 dark:border-white/5 focus:border-primary/40`}
                                        placeholder={msg.is_private ? `L'adresse est ${msg.email}. Notez ici vos échanges...` : 'Écrivez votre réponse publique...'}
                                        value={msg.reponse || ''}
                                        onChange={(e) => {
                                            const nouveauTexte = e.target.value;
                                            setMessages(messages.map(m => m.id === msg.id ? { ...m, reponse: nouveauTexte } : m));
                                        }}
                                    />

                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-[9px] text-black/30 dark:text-white/20 uppercase font-bold tracking-widest">
                                            {msg.is_private ? 'Les messages privés ne sont jamais publiés' : 'Attention : La réponse sera publiée sur le site'}
                                        </span>
                                        <button
                                            onClick={() => handleUpdateResponse(msg.id, msg.reponse)}
                                            className="bg-primary text-black dark:bg-primary/10 dark:text-primary dark:hover:bg-primary dark:hover:text-black px-6 py-2 rounded font-black text-[10px] uppercase transition-all border border-primary/20"
                                        >
                                            Enregistrer
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 border border-dashed border-black/10 dark:border-white/5 rounded-3xl opacity-40 dark:opacity-20">
                        <p className="text-xs font-black uppercase tracking-[3px] text-black dark:text-white">Le livre d'or est vide</p>
                    </div>
                )}
            </div>
        </section>
    );
}

export default MessagesSection;
