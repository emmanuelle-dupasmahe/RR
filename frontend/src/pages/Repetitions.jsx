// pages/Repetitions.jsx
function Repetitions() {
    const morceaux = [
        { id: 1, titre: "Atomic City - U2", detail: "Répète du 12 Février 2026", url: "/audio/Atomic_city.mp3" },
        { id: 2, titre: "Beautiful Day - U2", detail: "Répète du 6 mars 2026", url: "/audio/Beautiful_day.mp3" },
        { id: 3, titre: "With Or Whithout You - U2", detail: "Répète du 15 décembre 2025", url: "/audio/With_or.mp3" },
        { id: 4, titre: "Undisclosed Desires - Muse", detail: "Répète du 12 Février 2026", url: "/audio/Undisclosed_desire.mp3" },
        { id: 5, titre: "Cake By The Ocean - DNCE", detail: "Répète du 22 avril 2024", url: "/audio/Cake_ocean.mp3" },
        { id: 6, titre: "Locked Out Of Heaven - Bruno Mars", detail: "Répète du 22 avril 2024", url: "/audio/Locked_out.mp3" },
    ];

    return (
        <div className="mt-[80px] min-h-[calc(100vh-82px)] bg-dark-bg">
            <div className="text-center py-[48px] border-b border-[#1f2937]">
                <h1 className="text-[3rem] font-[900] uppercase mb-[12px] text-white leading-tight">Studio Répétitions</h1>
                <p className="text-[#9ca3af] text-[1.125rem]">Enregistrements bruts - Réservoir Rock</p>
            </div>

            <div className="max-w-[56rem] mx-auto px-[20px] py-[40px] flex flex-col gap-[16px]">
                {morceaux.map((m) => (
                    <div key={m.id} className="flex items-center gap-[24px] bg-[#1f2937] p-[16px] rounded-[0.5rem] transition-colors duration-200 hover:bg-[#111827]">
                        <div className="flex items-center gap-[16px] flex-1">
                            <span className="text-[1.5rem] font-[900] text-primary min-w-[40px]">{m.id.toString().padStart(2, '0')}</span>
                            <div className="flex flex-col">
                                <span className="text-white font-bold">{m.titre}</span>
                                <small className="text-[#9ca3af] text-[0.75rem]">{m.detail}</small>
                            </div>
                        </div>
                        <div className="w-full max-w-[320px]">
                            <audio controls src={m.url} className="w-full h-[32px]">
                                Votre navigateur ne supporte pas l'élément audio.
                            </audio>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Repetitions;