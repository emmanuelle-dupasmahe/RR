// pages/Videos.jsx
function Videos() {
    return (
        <div className="mt-[80px] min-h-[calc(100vh-82px)] bg-dark-bg">
            <div className="text-center py-[48px] border-b border-[#1f2937]">
                <h1 className="text-[3rem] font-[900] uppercase mb-[12px] text-white leading-tight">Vidéos Live</h1>
                <p className="text-[#9ca3af] text-[1.125rem]">L'expérience Réservoir Rock en images</p>
            </div>

            <div className="mt-[96px] grid grid-cols-[repeat(auto-fit,minmax(400px,1fr))] gap-[32px] max-w-[80rem] mx-auto px-[20px] pb-[40px]">
                <VideoCard
                    url="https://www.youtube.com/embed/UrrtAPj9Nzw?si=0VHBpFre6Rg5T6U4"
                    title="Réservoir Rock"
                    subtitle="Le Rayolet à Six-Fours"
                />
                <VideoCard
                    url="https://www.youtube.com/embed/ac_1MdSA9u0?si=1S2ZS-nhFQCEnijG"
                    title="Réservoir Rock"
                    subtitle="Bormes les Mimosas"
                />
                <VideoCard
                    url="https://www.youtube.com/embed/gJ5ZjBaVQOs"
                    title="Réservoir Rock"
                    subtitle="Restaurant Domaine Coudoulière Six-Fours"
                />
            </div>
        </div>
    );
}

function VideoCard({ url, title, subtitle }) {
    return (
        <div className="bg-[#1f2937] rounded-[0.5rem] overflow-hidden transition-shadow duration-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            <div className="w-full aspect-video overflow-hidden relative z-[1]">
                <iframe
                    src={url}
                    title={title}
                    className="w-full h-full block"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen>
                </iframe>
            </div>
            <div className="p-[16px]">
                <h3 className="text-white font-bold mb-[4px]">{title}</h3>
                <p className="text-[#9ca3af] text-[0.875rem]">{subtitle}</p>
            </div>
        </div>
    );
}

export default Videos;