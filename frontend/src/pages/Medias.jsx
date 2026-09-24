// pages/Medias.jsx
import { useState, useEffect } from 'react';
import { videoService, photoService, BASE_URL } from '../services/api';
import VideosSkeleton from '../components/VideosSkeleton';
import { Helmet } from 'react-helmet-async';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

function Medias() {
    const [videos, setVideos] = useState([]);
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // États pour gérer l'effet 3D au clic sur une image
    const [modalPhoto, setModalPhoto] = useState(null);
    const [isAnimating, setIsAnimating] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const videoData = await videoService.getAll(page, 6);
            setVideos(videoData.videos || []);
            setTotalPages(videoData.totalPages || 1);

            const photoData = await photoService.getAll();
            setPhotos(photoData.photos || []);
            setLoading(false);
        } catch (err) {
            console.error("Erreur lors du chargement des médias :", err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [page]);

    // Ouvre la photo en grand avec l'effet 3D
    const openModal = (photo) => {
        setModalPhoto(photo);
        // Laisse 10ms à React pour afficher la modale invisible avant de lancer la transition 3D
        setTimeout(() => setIsAnimating(true), 10);
    };

    // Ferme la photo avec l'effet 3D inverse
    const closeModal = () => {
        setIsAnimating(false);
        // Attend la fin de l'animation (700ms) pour retirer l'image du DOM
        setTimeout(() => setModalPhoto(null), 700);
    };

    return (
        <>
            <Helmet>
                <title>Reservoir Rock | Médias</title>
                <meta name="description" content="Découvrez les photos et les vidéos live du groupe Reservoir Rock." />
                <link rel="canonical" href="https://resrock.fr/medias" />
            </Helmet>

            <div className="mt-[80px] min-h-[calc(100vh-82px)] bg-white dark:bg-black transition-colors duration-300 font-sans relative">

                <div className="text-center py-[48px] bg-gray-50 dark:bg-gradient-to-b dark:from-[#111] dark:to-black border-b border-gray-100 dark:border-none mb-12">
                    <h1 className="text-[3rem] md:text-[3.5rem] font-[300] uppercase m-0 leading-[1.2] tracking-[0.1em] text-black dark:text-white inline-block">
                        Médias
                    </h1>
                    <p className="text-[#e3181f] font-black tracking-[5px] uppercase text-sm mt-2">
                        L'expérience Réservoir Rock en images
                    </p>
                </div>

                <div className="max-w-[80rem] mx-auto px-[20px] pb-[80px]">

                    {/* CARROUSEL PHOTOS */}
                    {photos.length > 0 && (
                        <div className="mb-24">
                            <h2 className="text-2xl font-black uppercase mb-8 text-black dark:text-white flex items-center gap-4">
                                Galerie Photos
                                <span className="h-[1px] flex-1 bg-gray-200 dark:bg-white/10"></span>
                            </h2>

                            <div className="w-full pb-12">
                                <Swiper
                                    modules={[Navigation, Pagination, Autoplay, EffectFade]}
                                    navigation
                                    pagination={{ clickable: true }}
                                    autoplay={{ delay: 3500, disableOnInteraction: false }}
                                    loop={photos.length > 1}
                                    spaceBetween={30}
                                    slidesPerView={1}
                                    centerInsufficientSlides={true}
                                    breakpoints={{
                                        640: { slidesPerView: 2 },
                                        1024: { slidesPerView: 3 }
                                    }}
                                    className="w-full"
                                    // Modification des variables CSS de Swiper pour les couleurs
                                    style={{
                                        "--swiper-navigation-color": "#e3181f",
                                        "--swiper-pagination-color": "#e3181f",
                                    }}
                                >
                                    {photos.map((photo) => (
                                        <SwiperSlide key={photo.id}>
                                            {/* Ajout du curseur pointer et du onClick */}
                                            <div
                                                className="relative aspect-square group overflow-hidden rounded-[1.2rem] shadow-xl border border-gray-200 dark:border-white/10 bg-black cursor-pointer"
                                                onClick={() => openModal(photo)}
                                            >
                                                <img
                                                    src={`${BASE_URL}${photo.url_photo}`}
                                                    alt={photo.description || 'Photo Réservoir Rock'}
                                                    className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
                                                />
                                                {photo.description && (
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                                                        <p className="text-white font-bold tracking-widest uppercase text-sm">{photo.description}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>
                        </div>
                    )}

                    {/* SECTION VIDÉOS */}
                    <div>
                        <h2 className="text-2xl font-black uppercase mb-8 text-black dark:text-white flex items-center gap-4">
                            Vidéos Live
                            <span className="h-[1px] flex-1 bg-gray-200 dark:bg-white/10"></span>
                        </h2>

                        {loading ? (
                            <VideosSkeleton />
                        ) : videos.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-[32px]">
                                    {videos.map((v) => (
                                        <VideoCard key={v.id} video={v} />
                                    ))}
                                </div>

                                {totalPages > 1 && (
                                    <div className="mt-20 flex justify-center items-center gap-2 md:gap-6">
                                        <button disabled={page === 1} onClick={() => { setPage(prev => prev - 1); window.scrollTo({ top: document.body.scrollHeight / 2, behavior: 'smooth' }); }} className="px-3 md:px-8 py-2 md:py-3 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 text-black dark:text-white hover:border-[#e3181f] dark:hover:border-[#e3181f] disabled:opacity-20 transition-all uppercase font-black text-[10px] md:text-xs tracking-widest cursor-pointer shadow-lg">
                                            <span className="hidden md:inline">Précédent</span>
                                            <span className="md:hidden">Préc</span>
                                        </button>
                                        <div className="flex flex-col items-center">
                                            <span className="text-[0.6rem] text-gray-400 dark:text-[#444] font-bold uppercase tracking-tighter">Navigation</span>
                                            <span className="font-black text-[#e3181f] uppercase text-lg leading-none">{page} / {totalPages}</span>
                                        </div>
                                        <button disabled={page === totalPages} onClick={() => { setPage(prev => prev + 1); window.scrollTo({ top: document.body.scrollHeight / 2, behavior: 'smooth' }); }} className="px-3 md:px-8 py-2 md:py-3 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 text-black dark:text-white hover:border-[#e3181f] dark:hover:border-[#e3181f] disabled:opacity-20 transition-all uppercase font-black text-[10px] md:text-xs tracking-widest cursor-pointer shadow-lg">
                                            <span className="hidden md:inline">Suivant</span>
                                            <span className="md:hidden">Suiv</span>
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-20 border border-dashed border-gray-200 dark:border-white/10 rounded-2xl">
                                <p className="text-gray-400 dark:text-[#666] font-bold uppercase tracking-[3px]">Aucune vidéo disponible pour le moment.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* OVERLAY MODAL 3D POUR LE ZOOM IMAGE */}
            <div
                className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/95 transition-opacity duration-700 ${modalPhoto ? (isAnimating ? 'opacity-100' : 'opacity-0') : 'hidden'}`}
                onClick={closeModal}
                style={{ perspective: '1200px' }} // Crée la profondeur pour l'effet 3D
            >
                {modalPhoto && (
                    <div
                        className="relative max-w-[95vw] max-h-[90vh]"
                        style={{
                            transformStyle: 'preserve-3d',
                            // État 1 (fermé) : Tourné à 180°, taille 30% / État 2 (ouvert) : Tourné à 0°, taille 100%
                            transform: isAnimating ? 'rotateY(0deg) scale(1)' : 'rotateY(-180deg) scale(0.3)',
                            // cubic-bezier permet d'avoir un léger effet de "ressort" à la fin de la rotation
                            transition: 'transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)'
                        }}
                        onClick={(e) => e.stopPropagation()} // Empêche le clic sur l'image de fermer la modale
                    >
                        <img
                            src={`${BASE_URL}${modalPhoto.url_photo}`}
                            alt={modalPhoto.description || 'Zoom'}
                            className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-[0_0_50px_rgba(227,24,31,0.2)] border border-[#e3181f]/20 select-none"
                        />

                        {/* Bouton croix pour fermer */}
                        <button
                            onClick={closeModal}
                            className="absolute -top-4 -right-4 md:-top-6 md:-right-6 bg-[#e3181f] text-white w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold text-xl md:text-2xl shadow-xl hover:scale-110 hover:bg-white hover:text-[#e3181f] transition-all"
                        >
                            ×
                        </button>

                        {/* Légende en dessous de l'image zoomée (si elle existe) */}
                        {modalPhoto.description && (
                            <div className="absolute -bottom-10 left-0 right-0 text-center">
                                <span className="text-white bg-black/80 px-4 py-2 rounded-full text-sm font-bold tracking-widest uppercase">
                                    {modalPhoto.description}
                                </span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}

function VideoCard({ video }) {
    const isYoutube = !!video.url_youtube;
    const url = isYoutube
        ? `https://www.youtube.com/embed/${video.url_youtube}?playsinline=1&rel=0`
        : video.file_path?.startsWith('/uploads')
            ? `${BASE_URL}${video.file_path}`
            : video.file_path;

    return (
        <div className="group relative rounded-[1.2rem] transition-all duration-500 shadow-2xl bg-gray-50 border border-gray-200 dark:bg-[#0a0a0a] dark:border-white/5 dark:hover:border-[#e3181f] dark:hover:shadow-[0_0_30px_rgba(227,24,31,0.3)]">
            <div className="overflow-hidden rounded-[1.1rem]">
                <div className="p-[3px] transition-all duration-500 bg-gray-200 group-hover:bg-black dark:bg-gradient-to-r dark:from-[#e3181f] dark:to-black">
                    <div className="w-full aspect-video overflow-hidden rounded-[0.8rem] relative z-[1] bg-black shadow-inner">
                        {isYoutube ? (
                            <iframe src={url} title={video.titre} className="w-full h-full block" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen sandbox="allow-forms allow-scripts allow-pointer-lock allow-same-origin allow-top-navigation-by-user-activation allow-presentation"></iframe>
                        ) : (
                            <video src={url} controls playsInline className="w-full h-full block object-cover" />
                        )}
                    </div>
                </div>
                <div className="p-[20px] transition-colors duration-500">
                    <h3 className="font-black mb-[6px] uppercase tracking-wider text-lg transition-colors text-black group-hover:text-[#e3181f] dark:text-white dark:group-hover:text-[#e3181f]">{video.titre}</h3>
                    <p className="text-[0.9rem] font-medium leading-relaxed transition-colors text-gray-600 dark:text-[#888] dark:group-hover:text-gray-200">{video.description}</p>
                </div>
            </div>
        </div>
    );
}

export default Medias;