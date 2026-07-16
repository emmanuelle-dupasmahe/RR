function ConcertsSection({
    SectionTitle,
    Pagination,
    concerts,
    concertPages,
    formData,
    setFormData,
    concertFlyerFile,
    setConcertFlyerFile,
    editingConcert,
    setEditingConcert,
    updateConcertFlyerFile,
    setUpdateConcertFlyerFile,
    setConcerts,
    handleSubmit,
    handleUpdateConcert,
    handleDelete,
    fetchConcerts,
    inputClass,
    btnClass
}) {
    return (
        <section id="concerts" className="animate-fadeIn">
            <SectionTitle subtitle="Live Dates Management">Calendrier Concerts</SectionTitle>
            <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
                <div className="bg-gray-100 dark:bg-[#0a0a0a] border border-gray-300 dark:border-white/5 p-4 md:p-8 rounded-2xl shadow-inner">
                    <h3 className="text-sm font-black uppercase tracking-widest mb-6 text-gray-400 dark:text-white/40">
                        Ajouter une date
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input type="text" placeholder="VILLE" className={inputClass} value={formData.titre} onChange={(e) => setFormData({ ...formData, titre: e.target.value.toUpperCase() })} required />
                        <div className="grid grid-cols-2 gap-4">
                            <input type="date" className={inputClass} value={formData.date_concert} onChange={(e) => setFormData({ ...formData, date_concert: e.target.value })} required />
                            <input type="time" className={inputClass} value={formData.heure} onChange={(e) => setFormData({ ...formData, heure: e.target.value })} required />
                        </div>
                        <input type="text" placeholder="LIEU (NOM DE LA SALLE)" className={inputClass} value={formData.lieu} onChange={(e) => setFormData({ ...formData, lieu: e.target.value.toUpperCase() })} required />
                        <input type="text" placeholder="ADRESSE" className={inputClass} value={formData.adresse || ''} onChange={(e) => setFormData({ ...formData, adresse: e.target.value })} />
                        <input type="text" placeholder="TÉLÉPHONE" className={inputClass} value={formData.telephone || ''} onChange={(e) => setFormData({ ...formData, telephone: e.target.value })} />
                        <select className={inputClass} value={formData.statut} onChange={(e) => setFormData({ ...formData, statut: e.target.value })}>
                            <option value="Entrée libre">Entrée libre</option>
                            <option value="Entrée payante">Entrée payante</option>
                            <option value="PAF">PAF</option>
                            <option value="Privé">Privé</option>
                        </select>
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">
                                Flyer (optionnel)
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                className={inputClass}
                                onChange={(e) => setConcertFlyerFile(e.target.files?.[0] || null)}
                            />
                            {concertFlyerFile && (
                                <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Fichier sélectionné: {concertFlyerFile.name}
                                </p>
                            )}
                        </div>
                        <button type="submit" className={btnClass}>Publier la date</button>
                    </form>
                </div>

                <div className="space-y-4">
                    {concerts.map(c => (
                        <div key={c.id} className="p-5 bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/5 rounded-xl transition-colors shadow-sm">
                            {editingConcert === c.id ? (
                                <div className="space-y-3">
                                    <input className={inputClass} value={c.titre} onChange={(e) => setConcerts(concerts.map(con => con.id === c.id ? { ...con, titre: e.target.value.toUpperCase() } : con))} />
                                    <div className="grid grid-cols-2 gap-2">
                                        <input type="date" className={inputClass} value={c.date_concert.split('T')[0]} onChange={(e) => setConcerts(concerts.map(con => con.id === c.id ? { ...con, date_concert: e.target.value } : con))} />
                                        <input type="time" className={inputClass} value={c.heure ? c.heure.substring(0, 5) : ''} onChange={(e) => setConcerts(concerts.map(con => con.id === c.id ? { ...con, heure: e.target.value } : con))} />
                                    </div>
                                    <input className={inputClass} value={c.lieu} onChange={(e) => setConcerts(concerts.map(con => con.id === c.id ? { ...con, lieu: e.target.value } : con))} />
                                    <input className={inputClass} placeholder="ADRESSE" value={c.adresse || ''} onChange={(e) => setConcerts(concerts.map(con => con.id === c.id ? { ...con, adresse: e.target.value } : con))} />
                                    <input className={inputClass} placeholder="TÉLÉPHONE" value={c.telephone || ''} onChange={(e) => setConcerts(concerts.map(con => con.id === c.id ? { ...con, telephone: e.target.value } : con))} />
                                    <select className={inputClass} value={c.statut || 'Entrée libre'} onChange={(e) => setConcerts(concerts.map(con => con.id === c.id ? { ...con, statut: e.target.value } : con))}>
                                        <option value="Entrée libre">Entrée libre</option>
                                        <option value="Entrée payante">Entrée payante</option>
                                        <option value="PAF">PAF</option>
                                        <option value="Privé">Privé</option>
                                    </select>
                                    <div className="space-y-2">
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">
                                            Flyer (optionnel)
                                        </label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className={inputClass}
                                            onChange={(e) => setUpdateConcertFlyerFile(e.target.files?.[0] || null)}
                                        />
                                        {updateConcertFlyerFile && (
                                            <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Nouveau flyer: {updateConcertFlyerFile.name}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex gap-2 pt-2">
                                        <button onClick={() => handleUpdateConcert(c, updateConcertFlyerFile)} className="bg-green-600 hover:bg-green-700 text-white text-[10px] font-black p-3 rounded uppercase flex-1 transition-colors">Sauvegarder</button>
                                        <button onClick={() => {
                                            setEditingConcert(null);
                                            setUpdateConcertFlyerFile(null);
                                        }} className="bg-gray-200 dark:bg-white/10 text-black dark:text-white text-[10px] font-black p-3 rounded uppercase flex-1 transition-colors">Annuler</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="group flex justify-between items-center">
                                    <div>
                                        <span className="text-[#e3181f] font-black text-xs tracking-tighter uppercase block mb-1">
                                            {new Date(c.date_concert).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </span>
                                        <span className="text-lg font-bold uppercase tracking-tight text-black dark:text-white">{c.titre}</span>
                                        <p className="text-[11px] text-gray-500 dark:text-gray-400 uppercase font-bold tracking-widest mt-1">{c.lieu}</p>
                                    </div>
                                    <div className="flex gap-4">
                                        <button onClick={() => setEditingConcert(c.id)} className="text-gray-400 hover:text-black dark:hover:text-white transition-all text-[10px] font-black uppercase">Edit</button>
                                        <button onClick={() => handleDelete(c.id)} className="text-gray-300 hover:text-[#e3181f] transition-all text-[10px] font-black uppercase">Delete</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}

                    <Pagination pages={concertPages} onPageChange={fetchConcerts} />
                </div>
            </div>
        </section>
    );
}

export default ConcertsSection;
