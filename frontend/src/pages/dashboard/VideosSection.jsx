function VideosSection({
    SectionTitle,
    Pagination,
    videos,
    videoPages,
    videoFormData,
    setVideoFormData,
    // On garde ces props dans la signature au cas où ton composant parent 
    // les envoie encore, pour éviter de faire planter React.
    videoFile, 
    setVideoFile,
    editingVideo,
    setEditingVideo,
    setVideos,
    handleVideoSubmit,
    handleUpdateVideo,
    handleVideoDelete,
    fetchVideos,
    inputClass,
    btnClass
}) {
    return (
        <section id="videos" className="animate-in fade-in duration-500">
            <SectionTitle subtitle="Visual Content">Vidéos</SectionTitle>
            <div className="grid lg:grid-cols-2 gap-12">
                <div className="bg-white dark:bg-[#0a0a0a] border border-black/5 dark:border-white/5 p-8 rounded-2xl shadow-xl">
                    <h3 className="text-sm font-black uppercase tracking-widest mb-6 opacity-40 text-black dark:text-white">Nouvelle Vidéo</h3>
                    
                    <form onSubmit={handleVideoSubmit} className="space-y-4">
                        <input
                            type="text"
                            placeholder="TITRE"
                            className={inputClass}
                            value={videoFormData.titre}
                            onChange={(e) => setVideoFormData({ ...videoFormData, titre: e.target.value })}
                            required
                        />
                        <input
                            type="text"
                            placeholder="DESCRIPTION / LIEU (ex : SIX-FOURS)"
                            className={inputClass}
                            value={videoFormData.description}
                            onChange={(e) => setVideoFormData({ ...videoFormData, description: e.target.value })}
                        />

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest opacity-30 ml-1 text-black dark:text-white">
                                Lien YouTube
                            </label>
                            <input
                                type="text"
                                placeholder="ID YOUTUBE (ex: UrrtAPj9Nzw)"
                                className={inputClass}
                                value={videoFormData.url_youtube}
                                onChange={(e) => setVideoFormData({ ...videoFormData, url_youtube: e.target.value })}
                                required // Le lien YouTube est maintenant obligatoire
                            />
                        </div>

                        <button type="submit" className={btnClass}>Publier la vidéo</button>
                    </form>
                </div>

                <div className="space-y-4">
                    {videos.length > 0 ? (
                        videos.map(v => (
                            <div key={v.id} className="p-5 bg-white dark:bg-[#0a0a0a] border border-black/5 dark:border-white/5 rounded-xl hover:border-primary/20 dark:hover:border-white/10 transition-all group shadow-sm">
                                {editingVideo === v.id ? (
                                    <div className="flex-1 flex flex-col gap-3">
                                        <input
                                            className={inputClass}
                                            value={v.titre}
                                            onChange={(e) => setVideos(videos.map(item => item.id === v.id ? { ...item, titre: e.target.value } : item))}
                                            placeholder="Titre"
                                        />
                                        <input
                                            className={inputClass}
                                            value={v.description || ''}
                                            onChange={(e) => setVideos(videos.map(item => item.id === v.id ? { ...item, description: e.target.value } : item))}
                                            placeholder="Lieu"
                                        />
                                        <input
                                            className={inputClass}
                                            value={v.url_youtube || ''}
                                            onChange={(e) => setVideos(videos.map(item => item.id === v.id ? { ...item, url_youtube: e.target.value } : item))}
                                            placeholder="ID Youtube"
                                            required // Sécurité pour l'édition aussi
                                        />
                                        <div className="flex gap-2 justify-end pt-2">
                                            <button onClick={() => handleUpdateVideo(v)} className="bg-green-600 text-white px-4 py-2 rounded font-black text-[10px] uppercase">Sauvegarder</button>
                                            <button onClick={() => setEditingVideo(null)} className="bg-black/5 dark:bg-white/10 text-black dark:text-white px-4 py-2 rounded font-black text-[10px] uppercase">Annuler</button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <span className="text-black dark:text-white font-bold block uppercase tracking-tight text-base">{v.titre}</span>
                                            <span className="text-[11px] text-primary font-bold uppercase tracking-widest">
                                                {/* Affichage simplifié sans condition de fichier local */}
                                                {v.description} {v.description ? '-' : ''} YOUTUBE
                                            </span>
                                        </div>
                                        <div className="flex shrink-0 gap-4 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => setEditingVideo(v.id)} className="text-black/30 dark:text-white/30 hover:text-primary dark:hover:text-white text-[10px] font-black uppercase tracking-widest">Edit</button>
                                            <button onClick={() => handleVideoDelete(v.id)} className="text-black/20 dark:text-[#444] hover:text-red-500 text-[10px] font-black uppercase tracking-widest">Delete</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 border border-dashed border-black/10 dark:border-white/5 rounded-2xl opacity-40">
                            <p className="text-xs font-black uppercase tracking-widest text-black dark:text-white">Aucune vidéo en ligne</p>
                        </div>
                    )}
                    <Pagination pages={videoPages} onPageChange={fetchVideos} />
                </div>
            </div>
        </section>
    );
}

export default VideosSection;