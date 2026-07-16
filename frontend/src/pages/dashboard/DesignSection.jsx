function DesignSection({ SectionTitle, handleHeroUpload, inputClass }) {
    return (
        <section className="animate-in fade-in duration-500">
            <SectionTitle subtitle="Visuals">Design du Site</SectionTitle>

            <div className="bg-white dark:bg-[#0a0a0a] border border-black/5 dark:border-white/5 p-8 rounded-2xl shadow-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary">Photo Accueil (Desktop)</p>
                        <input type="file" className={inputClass} onChange={(e) => handleHeroUpload(e, 'hero_desktop')} />
                    </div>
                    <div className="space-y-4">
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary">Photo Accueil (Mobile)</p>
                        <input type="file" className={inputClass} onChange={(e) => handleHeroUpload(e, 'hero_mobile')} />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default DesignSection;
