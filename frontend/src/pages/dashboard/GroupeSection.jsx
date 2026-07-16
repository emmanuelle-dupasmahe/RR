function GroupeSection({ SectionTitle, groupTexts, setGroupTexts, handleUpdateGroupText, inputClass }) {
    return (
        <section id="groupe" className="animate-in fade-in duration-500">
            <SectionTitle subtitle="Band Identity">Le Groupe</SectionTitle>

            <div className="bg-white dark:bg-[#0a0a0a] border border-black/5 dark:border-white/5 p-8 rounded-2xl space-y-8 shadow-xl dark:shadow-2xl transition-colors">
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-primary block">Annonce (Tribute...)</label>
                        <input
                            type="text"
                            className={inputClass}
                            value={groupTexts.group_announce || ''}
                            onChange={(e) => setGroupTexts({ ...groupTexts, group_announce: e.target.value })}
                            onBlur={() => handleUpdateGroupText('group_announce', groupTexts.group_announce)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-primary block">Slogan de la page</label>
                        <input
                            type="text"
                            className={inputClass}
                            value={groupTexts.group_slogan || ''}
                            onChange={(e) => setGroupTexts({ ...groupTexts, group_slogan: e.target.value })}
                            onBlur={() => handleUpdateGroupText('group_slogan', groupTexts.group_slogan)}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-primary block">Titre de la section Histoire (ex: \"Our Story\")</label>
                    <input
                        type="text"
                        className={inputClass}
                        value={groupTexts.group_title_history || ''}
                        onChange={(e) => setGroupTexts({ ...groupTexts, group_title_history: e.target.value })}
                        onBlur={() => handleUpdateGroupText('group_title_history', groupTexts.group_title_history)}
                        placeholder="L'histoire du groupe..."
                    />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-primary block">Histoire (Colonne Gauche)</label>
                        <textarea
                            className={`${inputClass} min-h-[180px] leading-relaxed py-4`}
                            value={groupTexts.group_history_1 || ''}
                            onChange={(e) => setGroupTexts({ ...groupTexts, group_history_1: e.target.value })}
                            onBlur={() => handleUpdateGroupText('group_history_1', groupTexts.group_history_1)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-primary block">Histoire (Colonne Droite)</label>
                        <textarea
                            className={`${inputClass} min-h-[180px] leading-relaxed py-4`}
                            value={groupTexts.group_history_2 || ''}
                            onChange={(e) => setGroupTexts({ ...groupTexts, group_history_2: e.target.value })}
                            onBlur={() => handleUpdateGroupText('group_history_2', groupTexts.group_history_2)}
                        />
                    </div>
                </div>

                <div className="pt-6 border-t border-black/5 dark:border-white/5">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-primary block">
                            Répertoire / Artistes (Séparés par des \" • \" ou \",")
                        </label>
                        <textarea
                            className={`${inputClass} min-h-[100px] leading-relaxed py-4 text-xs uppercase tracking-widest`}
                            value={groupTexts.group_repertoire || ''}
                            onChange={(e) => setGroupTexts({ ...groupTexts, group_repertoire: e.target.value })}
                            onBlur={() => handleUpdateGroupText('group_repertoire', groupTexts.group_repertoire)}
                            placeholder="U2 • Muse • Téléphone..."
                        />
                        <p className="text-[9px] text-black/30 dark:text-white/20 uppercase tracking-[2px] mt-2">
                            La liste des artistes s'affiche en bas de la page \"Le Groupe\".
                        </p>
                    </div>
                </div>

                <div className="pt-6 border-t border-black/5 dark:border-white/5">
                    <div className="max-w-md space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-primary block">
                            Crédits Photographiques (Footer)
                        </label>
                        <input
                            type="text"
                            className={inputClass}
                            value={groupTexts.photo_credits || ''}
                            onChange={(e) => setGroupTexts({ ...groupTexts, photo_credits: e.target.value })}
                            onBlur={() => handleUpdateGroupText('photo_credits', groupTexts.photo_credits)}
                            placeholder="Mika / Reservoir Rock..."
                        />
                        <p className="text-[9px] text-black/30 dark:text-white/20 uppercase tracking-[2px] mt-2">
                            Visible globalement en pied de page.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default GroupeSection;
