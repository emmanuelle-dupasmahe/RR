function TourneeSection({ SectionTitle, tourTitle, setTourTitle, handleUpdateTitle, inputClass, btnClass }) {
    return (
        <section id="tournee" className="animate-fadeIn">
            <SectionTitle subtitle="Global Settings">Tournée en cours</SectionTitle>

            <div className="bg-gray-100 dark:bg-[#0a0a0a] border border-gray-300 dark:border-white/5 p-4 md:p-8 rounded-2xl shadow-inner dark:shadow-2xl">
                <form onSubmit={handleUpdateTitle} className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2 ml-1">
                            Nom de la tournée
                        </label>
                        <input
                            type="text"
                            className={inputClass}
                            value={tourTitle}
                            onChange={(e) => setTourTitle(e.target.value)}
                            placeholder="ex: TOURNÉE 2026"
                            required
                        />
                    </div>
                    <div className="flex items-end">
                        <button type="submit" className={btnClass}>
                            Mettre à jour
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}

export default TourneeSection;
