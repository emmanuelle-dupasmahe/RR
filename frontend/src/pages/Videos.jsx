// pages/Videos.jsx
import { useState, useEffect } from 'react';
import { videoService } from '../services/api';
import VideosSkeleton from '../components/VideosSkeleton';

function Videos() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchVideos = async () => {
        setLoading(true);
        try {
            const data = await videoService.getAll(page, 6);
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
        <div className="mt-[80px] min-h-[calc(100vh-82px)] bg-white dark:bg-black transition-colors duration-300 font-sans">

            {/* EN-TÊTE ADAPTATIF */}
            <div className="text-center py-[48px] bg-gray-50 dark:bg-gradient-to-b dark:from-[#111] dark:to-black border-b border-gray-100 dark:border-none">
                <h1 className="text-[3rem] md:text-[3.5rem] font-[300] uppercase m-0 leading-[1.2] tracking-[0.1em] text-black dark:text-white inline-block">
                    Vidéos Live
                </h1>
                <p className="text-primary font-black tracking-[5px] uppercase text-sm">
                    L'expérience Réservoir Rock en images
                </p>
            </div>

            <div className="mt-[60px] max-w-[80rem] mx-auto px-[20px] pb-[40px]">
                {loading ? (
                    <VideosSkeleton />
                ) : videos.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-[32px]">
                            {videos.map((v) => (
                                <VideoCard key={v.id} video={v} />
                            ))}
                        </div>

                        {/* PAGINATION */}
                        {totalPages > 1 && (
                            <div className="mt-20 flex justify-center items-center gap-6">
                                <button
                                    disabled={page === 1}
                                    onClick={() => {
                                        setPage(prev => prev - 1);
                                        window.scrollTo(0, 300);
                                    }}
                                    className="px-8 py-3 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 text-black dark:text-white hover:border-primary dark:hover:border-primary disabled:opacity-20 transition-all uppercase font-black text-xs tracking-widest cursor-pointer shadow-lg"
                                >
                                    Précédent
                                </button>

                                <div className="flex flex-col items-center">
                                    <span className="text-[0.6rem] text-gray-400 dark:text-[#444] font-bold uppercase tracking-tighter">Navigation</span>
                                    <span className="font-black text-primary uppercase text-lg leading-none">{page} / {totalPages}</span>
                                </div>

                                <button
                                    disabled={page === totalPages}
                                    onClick={() => {
                                        setPage(prev => prev + 1);
                                        window.scrollTo(0, 300);
                                    }}
                                    className="px-8 py-3 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 text-black dark:text-white hover:border-primary dark:hover:border-primary disabled:opacity-20 transition-all uppercase font-black text-xs tracking-widest cursor-pointer shadow-lg"
                                >
                                    Suivant
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-20 border border-dashed border-gray-200 dark:border-white/10 rounded-2xl">
                        <p className="text-gray-400 dark:text-[#666] font-bold uppercase tracking-[3px]">
                            Aucune vidéo disponible pour le moment.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}


function VideoCard({ video }) {
    const isYoutube = !!video.url_youtube;

    // Ajout de playsinline=1 pour forcer la lecture dans le site sur mobile
    const url = isYoutube
        ? `https://www.youtube.com/embed/${video.url_youtube}?playsinline=1&rel=0`
        : video.file_path?.startsWith('/uploads')
            ? `${BASE_URL}${video.file_path}`
            : video.file_path;
    return (
        <div className="group relative rounded-[1.2rem] transition-all duration-500 shadow-2xl
            bg-gray-50 border border-gray-200
            dark:bg-[#0a0a0a] dark:border-white/5 dark:hover:border-primary dark:hover:shadow-[0_0_30px_rgba(185,28,28,0.3)]"
        >
            <div className="overflow-hidden rounded-[1.1rem]">
                <div className="p-[3px] transition-all duration-500
                    bg-gray-200 group-hover:bg-black
                    dark:bg-gradient-to-r dark:from-primary dark:to-black"
                >
                    <div className="w-full aspect-video overflow-hidden rounded-[0.8rem] relative z-[1] bg-black shadow-inner">
                        {isYoutube ? (
                            <iframe
                                src={url}
                                title={video.titre}
                                className="w-full h-full block"
                                // allow="presentation" aide parfois sur certains navigateurs mobiles
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                                // sandbox peut aider à restreindre les redirections automatiques
                                sandbox="allow-forms allow-scripts allow-pointer-lock allow-same-origin allow-top-navigation-by-user-activation allow-presentation"
                            ></iframe>
                        ) : (
                            <video
                                src={url}
                                controls
                                playsInline // IMPORTANT pour les fichiers locaux également
                                className="w-full h-full block object-cover"
                            />
                        )}
                    </div>
                </div>

                <div className="p-[20px] transition-colors duration-500">
                    <h3 className="font-black mb-[6px] uppercase tracking-wider text-lg transition-colors
                        text-black group-hover:text-primary
                        dark:text-white dark:group-hover:text-primary"
                    >
                        {video.titre}
                    </h3>
                    <p className="text-[0.9rem] font-medium leading-relaxed transition-colors
                        text-gray-600
                        dark:text-[#888] dark:group-hover:text-gray-200"
                    >
                        {video.description}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Videos;