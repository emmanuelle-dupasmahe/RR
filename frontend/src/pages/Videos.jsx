// pages/Videos.jsx
import { useState, useEffect } from 'react';

function Videos() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchVideos = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/videos?page=${page}&limit=6`);
            const data = await res.json();
            setVideos(data.videos || []);
            setTotalPages(data.totalPages || 1);
            setLoading(false);
        } catch (err) {
            console.error("Erreur lors du chargement des vidéos :", err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVideos();
    }, [page]);

    return (
        <div className="mt-[80px] min-h-[calc(100vh-82px)] bg-black">
            {/* EN-TÊTE HARMONISÉ */}
            <div className="text-center py-[48px] border-b border-[#1f2937] bg-gradient-to-b from-[#111] to-black">
                <h1 className="text-[3rem]  md:text-[3.5rem] font-[900] uppercase mb-[12px] text-white leading-tight">Vidéos Live</h1>
                
                <p className="text-primary font-black tracking-[5px] uppercase text-sm">
                    L'expérience Réservoir Rock en images
                </p>
                
            </div>

            <div className="mt-[60px] max-w-[80rem] mx-auto px-[20px] pb-[40px]">
                {loading ? (
                    <p className="text-center text-[#9ca3af]">Chargement des vidéos...</p>
                ) : videos.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-[32px]">
                            {videos.map((v) => (
                                <VideoCard key={v.id} video={v} />
                            ))}
                        </div>

                        {/* PAGINATION STYLE DASHBOARD */}
                        {totalPages > 1 && (
                            <div className="mt-16 flex justify-center items-center gap-4 text-white">
                                <button
                                    disabled={page === 1}
                                    onClick={() => setPage(prev => prev - 1)}
                                    className="px-6 py-2 bg-[#111] border border-[#333] hover:border-primary text-white disabled:opacity-30 transition-all uppercase font-bold text-sm cursor-pointer"
                                >
                                    Précédent
                                </button>
                                <span className="font-black text-primary">PAGE {page} / {totalPages}</span>
                                <button
                                    disabled={page === totalPages}
                                    onClick={() => setPage(prev => prev + 1)}
                                    className="px-6 py-2 bg-[#111] border border-[#333] hover:border-primary text-white disabled:opacity-30 transition-all uppercase font-bold text-sm cursor-pointer"
                                >
                                    Suivant
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <p className="text-center text-[#9ca3af]">Aucune vidéo disponible pour le moment.</p>
                )}
            </div>
        </div>
    );
}

function VideoCard({ video }) {
    const isYoutube = !!video.url_youtube;
    const url = isYoutube
        ? `https://www.youtube.com/embed/${video.url_youtube}`
        : `http://localhost:5000${video.file_path}`;

    return (
        /* 1. Bloc entier avec dégradé subtil */
        <div className="p-[2px] rounded-[1.2rem] bg-gradient-to-br from-primary/20 via-black to-black border border-white/5 transition-all duration-500 hover:from-primary/40 shadow-2xl group">
            <div className="bg-[#0a0a0a] rounded-[1.1rem] overflow-hidden">
                
                {/* 2. Le "Halo" rouge autour du lecteur vidéo */}
                <div className="p-[6px] bg-gradient-to-r from-primary/60 via-black/80 to-black">
                    <div className="w-full aspect-video overflow-hidden rounded-[0.8rem] relative z-[1] bg-black">
                        {isYoutube ? (
                            <iframe
                                src={url}
                                title={video.titre}
                                className="w-full h-full block"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen>
                            </iframe>
                        ) : (
                            <video src={url} controls className="w-full h-full block object-cover" />
                        )}
                    </div>
                </div>

                {/* Infos textuelles */}
                <div className="p-[20px]">
                    <h3 className="text-white font-black mb-[6px] uppercase tracking-wider text-lg group-hover:text-primary transition-colors">
                        {video.titre}
                    </h3>
                    <p className="text-[#888] text-[0.9rem] font-medium leading-relaxed">
                        {video.description}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Videos;