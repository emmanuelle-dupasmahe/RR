import WavePlayer from '../../components/WavePlayer';

function RepetitionsSection({
    SectionTitle,
    Pagination,
    repetitions,
    repPages,
    repFormData,
    setRepFormData,
    repFile,
    setRepFile,
    editingRep,
    setEditingRep,
    setRepetitions,
    markers,
    newMarker,
    setNewMarker,
    setMarkers,
    updateFile,
    setUpdateFile,
    addMarker,
    removeMarker,
    jumpToTime,
    handleRepSubmit,
    handleRepUpdate,
    handleRepDelete,
    fetchRepetitions,
    inputClass,
    btnClass,
    BASE_URL
}) {
    return (
        <section id="repetitions" className="animate-in fade-in duration-500">
            <SectionTitle subtitle="Audio Archives">Studio & Backstage</SectionTitle>

            <div className="grid lg:grid-cols-2 gap-8 md:gap-12">

                <div className="bg-white dark:bg-[#0a0a0a] border border-black/5 dark:border-white/5 p-4 md:p-8 rounded-2xl shadow-xl dark:shadow-2xl h-fit md:sticky md:top-8">
                    <h3 className="text-sm font-black uppercase tracking-widest mb-6 opacity-40 text-black dark:text-white">Nouveau morceau</h3>
                    <form onSubmit={handleRepSubmit} className="space-y-4">
                        <input
                            type="text"
                            placeholder="TITRE (ex: ATOMIC CITY)"
                            className={`${inputClass} bg-gray-50 dark:bg-black border-black/10 dark:border-white/20`}
                            value={repFormData.titre}
                            onChange={(e) => setRepFormData({ ...repFormData, titre: e.target.value.toUpperCase() })}
                            required
                        />

                        <textarea
                            placeholder="NOTES TECHNIQUES"
                            className={`${inputClass} h-24 resize-none py-3 bg-gray-50 dark:bg-black border-black/10 dark:border-white/20`}
                            value={repFormData.detail}
                            onChange={(e) => setRepFormData({ ...repFormData, detail: e.target.value })}
                        />

                        <div className="bg-black/5 dark:bg-white/5 p-4 rounded-lg border border-black/5 dark:border-white/10 space-y-3">
                            <label className="block text-[10px] font-black uppercase text-primary/60 ml-1">Markers</label>
                            <div className="flex flex-col sm:flex-row gap-2">
                                <input
                                    type="number"
                                    placeholder="Sec"
                                    value={newMarker.time}
                                    onChange={(e) => setNewMarker({ ...newMarker, time: e.target.value })}
                                    className="w-full sm:w-20 bg-white dark:bg-black border border-black/10 dark:border-white/20 p-2 rounded text-sm text-black dark:text-white focus:border-primary/50 outline-none"
                                />
                                <input
                                    type="text"
                                    placeholder="Label (ex: Solo)"
                                    value={newMarker.label}
                                    onChange={(e) => setNewMarker({ ...newMarker, label: e.target.value })}
                                    className="flex-1 bg-white dark:bg-black border border-black/10 dark:border-white/20 p-2 rounded text-sm text-black dark:text-white focus:border-primary/50 outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={addMarker}
                                    className="bg-primary hover:bg-primary/80 px-4 rounded font-bold text-[10px] text-white transition-colors whitespace-nowrap"
                                >
                                    AJOUTER
                                </button>
                            </div>

                            <div className="flex flex-wrap gap-2 pt-2">
                                {markers.map((m, i) => (
                                    <div key={i} className="flex items-center gap-2 bg-white dark:bg-black px-2 py-1 rounded border border-primary/30 text-[10px] animate-in zoom-in duration-200">
                                        <span className="text-primary font-bold">{m.time}s</span>
                                        <span className="text-gray-500 dark:text-gray-400">{m.label}</span>
                                        <button type="button" onClick={() => removeMarker(i)} className="text-black/40 dark:text-white/40 hover:text-primary transition-colors">✕</button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-primary/60 uppercase ml-1">Début (sec)</label>
                                <input
                                    type="number"
                                    className={`${inputClass} bg-gray-50 dark:bg-black`}
                                    value={repFormData.start_time}
                                    onChange={(e) => setRepFormData({ ...repFormData, start_time: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-primary/60 uppercase ml-1">Fin (sec)</label>
                                <input
                                    type="number"
                                    className={`${inputClass} bg-gray-50 dark:bg-black`}
                                    value={repFormData.end_time}
                                    onChange={(e) => setRepFormData({ ...repFormData, end_time: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-primary/60 uppercase ml-1">Visibilité</label>
                                <select
                                    className={`${inputClass} bg-gray-50 dark:bg-black`}
                                    value={repFormData.status}
                                    onChange={(e) => setRepFormData({ ...repFormData, status: e.target.value })}
                                >
                                    <option value="private">Privé</option>
                                    <option value="public">Public</option>
                                </select>
                            </div>
                        </div>

                        <input
                            type="text"
                            placeholder="URL AUDIO DIRECTE (Optionnel)"
                            className={`${inputClass} bg-gray-50 dark:bg-black`}
                            value={repFormData.url}
                            onChange={(e) => setRepFormData({ ...repFormData, url: e.target.value })}
                        />

                        <div className="text-center text-[10px] font-black uppercase opacity-20 py-2 text-black dark:text-white">- OU -</div>

                        <div className="p-4 border-2 border-dashed border-black/10 dark:border-white/5 rounded-lg text-center hover:border-primary/30 transition-all bg-black/5 dark:bg-white/5">
                            <input
                                type="file"
                                accept=".mp3,.wav,.m4a,audio/mpeg,audio/wav,audio/mp4,audio/x-m4a"
                                className="hidden"
                                id="audio-upload"
                                onChange={(e) => {
                                    const file = e.target.files[0];

                                    if (file) {
                                        // Vérification sécurisée
                                        const allowedTypes = [
                                            "audio/mpeg",
                                            "audio/mp3",
                                            "audio/wav",
                                            "audio/x-wav",
                                            "audio/mp4",
                                            "audio/x-m4a"
                                        ];

                                        if (!allowedTypes.includes(file.type)) {
                                            alert("Format non supporté. Utilise MP3, WAV ou M4A.");
                                            return;
                                        }

                                        setRepFile(file);

                                        // Auto titre
                                        if (!repFormData.titre) {
                                            const fileName = file.name.split('.').slice(0, -1).join('.');
                                            setRepFormData(prev => ({
                                                ...prev,
                                                titre: fileName.toUpperCase()
                                            }));
                                        }
                                    }
                                }}
                            />
                            <label htmlFor="audio-upload" className="cursor-pointer text-[10px] font-black uppercase tracking-[2px] text-gray-500 dark:text-[#666] hover:text-primary dark:hover:text-white block">
                                {repFile ? <span className="text-primary animate-pulse">🎵 {repFile.name}</span> : 'Cliquez pour uploader un MP3'}
                            </label>
                        </div>

                        <button type="submit" className={btnClass}>Envoyer au studio</button>
                    </form>
                </div>

                <div className="space-y-4">
                    {repetitions.length > 0 ? (
                        repetitions.map(r => (
                            <div key={r.id} className="p-5 bg-white dark:bg-[#0a0a0a] border border-black/5 dark:border-white/5 rounded-xl hover:border-black/10 dark:hover:border-white/10 shadow-sm dark:shadow-none transition-all group overflow-hidden">

                                {editingRep === r.id ? (
                                    <div className="space-y-4">
                                        <input
                                            className={`${inputClass} bg-gray-50 dark:bg-black`}
                                            value={r.titre}
                                            onChange={(e) => setRepetitions(repetitions.map(item => item.id === r.id ? { ...item, titre: e.target.value } : item))}
                                        />

                                        <textarea
                                            placeholder="NOTES TECHNIQUES"
                                            className={`${inputClass} h-24 resize-none py-3 bg-gray-50 dark:bg-black`}
                                            value={r.detail || ''}
                                            onChange={(e) => setRepetitions(repetitions.map(item => item.id === r.id ? { ...item, detail: e.target.value } : item))}
                                        />

                                        <div className="bg-black/5 dark:bg-white/5 p-3 rounded border border-black/10 dark:border-white/10">
                                            <label className="block text-[9px] font-black uppercase text-primary/60 mb-2">Modifier les Markers</label>
                                            <div className="flex gap-2 mb-2">
                                                <input
                                                    type="number"
                                                    placeholder="Sec"
                                                    value={newMarker.time}
                                                    onChange={(e) => setNewMarker({ ...newMarker, time: e.target.value })}
                                                    className="w-16 bg-white dark:bg-black border border-black/10 dark:border-white/20 p-1 text-xs text-black dark:text-white"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Label"
                                                    value={newMarker.label}
                                                    onChange={(e) => setNewMarker({ ...newMarker, label: e.target.value })}
                                                    className="flex-1 bg-white dark:bg-black border border-black/10 dark:border-white/20 p-1 text-xs text-black dark:text-white"
                                                />
                                                <button type="button" onClick={addMarker} className="bg-primary px-2 rounded text-[9px] font-bold text-white">OK</button>
                                            </div>
                                            <div className="flex flex-wrap gap-1">
                                                {markers.map((m, i) => (
                                                    <div key={i} className="flex items-center gap-1 bg-white dark:bg-black px-2 py-0.5 rounded text-[9px] border border-black/10 dark:border-white/10">
                                                        <span className="text-primary font-bold">{m.time}s</span>
                                                        <span className="text-black dark:text-white">{m.label}</span>
                                                        <button type="button" onClick={() => removeMarker(i)} className="hover:text-red-500 ml-1">✕</button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-black text-primary/60 uppercase ml-1">Début (sec)</label>
                                                <input
                                                    type="number"
                                                    className={`${inputClass} bg-gray-50 dark:bg-black`}
                                                    value={r.start_time || 0}
                                                    onChange={(e) => setRepetitions(repetitions.map(item =>
                                                        item.id === r.id ? { ...item, start_time: parseFloat(e.target.value) } : item
                                                    ))}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-black text-primary/60 uppercase ml-1">Fin (sec)</label>
                                                <input
                                                    type="number"
                                                    className={`${inputClass} bg-gray-50 dark:bg-black`}
                                                    value={r.end_time || 0}
                                                    onChange={(e) => setRepetitions(repetitions.map(item =>
                                                        item.id === r.id ? { ...item, end_time: parseFloat(e.target.value) } : item
                                                    ))}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-black text-primary/60 uppercase ml-1">Visibilité</label>
                                                <select
                                                    className={`${inputClass} bg-gray-50 dark:bg-black`}
                                                    value={r.status || 'private'}
                                                    onChange={(e) => setRepetitions(repetitions.map(item =>
                                                        item.id === r.id ? { ...item, status: e.target.value } : item
                                                    ))}
                                                >
                                                    <option value="private">Privé</option>
                                                    <option value="public">Public</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="p-4 border-2 border-dashed border-black/10 dark:border-white/5 rounded-lg text-center hover:border-primary/30 transition-all bg-black/5 dark:bg-white/5">
                                            <input
                                                type="file"
                                                accept="audio/*"
                                                className="hidden"
                                                id={`audio-update-${r.id}`}
                                                onChange={(e) => setUpdateFile(e.target.files[0])}
                                            />
                                            <label htmlFor={`audio-update-${r.id}`} className="cursor-pointer text-[10px] font-black uppercase tracking-[2px] text-gray-500 dark:text-[#666] hover:text-primary dark:hover:text-white block">
                                                {updateFile ? <span className="text-primary animate-pulse">🎵 {updateFile.name}</span> : 'Changer le fichier audio (MP3)'}
                                            </label>
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleRepUpdate(r, updateFile)}
                                                className="flex-1 bg-primary text-white text-[10px] font-black py-2 rounded hover:bg-primary/80 transition-colors"
                                            >
                                                SAUVEGARDER
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setEditingRep(null);
                                                    setMarkers([]);
                                                    setUpdateFile(null);
                                                }}
                                                className="flex-1 bg-black/10 dark:bg-white/10 text-black dark:text-white text-[10px] font-black py-2 rounded hover:bg-black/20 dark:hover:bg-white/20 transition-colors"
                                            >
                                                ANNULER
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-black dark:text-white font-bold block uppercase tracking-tight text-base leading-none">{r.titre}</span>
                                                    <span className={`text-[8px] px-1.5 py-0.5 rounded font-black uppercase ${r.status === 'public' ? 'bg-green-500/20 text-green-500' : 'bg-primary/20 text-primary'}`}>
                                                        {r.status === 'public' ? 'Public' : 'Privé'}
                                                    </span>
                                                </div>
                                                <p className="text-[11px] text-primary font-bold uppercase tracking-widest leading-tight">{r.detail}</p>

                                                {r.markers && (
                                                    <div className="mt-3 flex flex-wrap gap-1">
                                                        {(typeof r.markers === 'string' ? JSON.parse(r.markers) : r.markers).map((m, idx) => (
                                                            <button
                                                                key={idx}
                                                                onClick={() => jumpToTime(r.id, m.time)}
                                                                className="text-[8px] border border-primary/30 bg-primary/5 hover:bg-primary/20 px-2 py-0.5 rounded text-black/70 dark:text-white/80 transition-all active:scale-95 flex items-center gap-1"
                                                            >
                                                                <strong className="text-primary">{m.time}s</strong> {m.label} ⚡
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex gap-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity ml-4">
                                                <button onClick={() => {
                                                    setEditingRep(r.id);
                                                    setMarkers(typeof r.markers === 'string' ? JSON.parse(r.markers || '[]') : (r.markers || []));
                                                    setUpdateFile(null);
                                                }} className="text-black/30 dark:text-white/30 hover:text-primary dark:hover:text-white text-[10px] font-black uppercase">Edit</button>
                                                <button onClick={() => handleRepDelete(r.id)} className="text-gray-400 dark:text-[#444] hover:text-red-500 dark:hover:text-primary text-[10px] font-black uppercase">Delete</button>
                                            </div>
                                        </div>

                                        <WavePlayer
                                            id={`wave-${r.id}`}
                                            url={r.url.startsWith('/uploads') ? `${BASE_URL}${r.url}` : r.url}
                                            startTime={r.start_time}
                                            endTime={r.end_time}
                                        />
                                    </>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 border border-dashed border-black/10 dark:border-white/5 rounded-2xl opacity-40 dark:opacity-20">
                            <p className="text-xs font-black uppercase tracking-widest text-black dark:text-white">Aucun enregistrement disponible</p>
                        </div>
                    )}

                    {repPages.total > 1 && (
                        <Pagination pages={repPages} onPageChange={fetchRepetitions} />
                    )}
                </div>
            </div>
        </section>
    );
}

export default RepetitionsSection;
