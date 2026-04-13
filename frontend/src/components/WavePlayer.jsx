import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';

// 1. IMPORTANT : Il faut ajouter startTime et endTime dans les props ici
const WavePlayer = ({ url, startTime, endTime }) => {
    const containerRef = useRef(null);
    const wavesurferRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        // Initialisation de WaveSurfer
        wavesurferRef.current = WaveSurfer.create({
            container: containerRef.current,
            waveColor: '#444',
            progressColor: '#dc2626',
            cursorColor: '#ffffff',
            barWidth: 2,
            barRadius: 3,
            responsive: true,
            height: 60,
            normalize: true,
            partialRender: true
        });

        // Chargement du son
        wavesurferRef.current.load(url);

        // Quand le fichier est chargé
        wavesurferRef.current.on('ready', () => {
            if (startTime) {
                // On positionne le curseur au début du segment 
                wavesurferRef.current.setTime(Number(startTime));
            }
        });


        wavesurferRef.current.on('audioprocess', () => {
            if (endTime && wavesurferRef.current.getCurrentTime() >= Number(endTime)) {
                wavesurferRef.current.pause();

                wavesurferRef.current.setTime(Number(startTime || 0));
            }
        });

        wavesurferRef.current.on('play', () => setIsPlaying(true));
        wavesurferRef.current.on('pause', () => setIsPlaying(false));

        // Nettoyage
        return () => wavesurferRef.current.destroy();


    }, [url, startTime, endTime]);

    const handlePlayPause = () => {

        const currentTime = wavesurferRef.current.getCurrentTime();
        if (endTime && currentTime >= Number(endTime)) {
            wavesurferRef.current.setTime(Number(startTime || 0));
        }
        wavesurferRef.current.playPause();
    };

    return (
        <div className="w-full flex items-center gap-4 bg-white/5 p-3 rounded-lg border border-white/5">
            <button
                onClick={handlePlayPause}
                className="w-12 h-12 flex items-center justify-center bg-red-600 rounded-full hover:scale-105 transition-transform shrink-0 shadow-lg shadow-red-600/20"
            >
                {isPlaying ? (
                    <span className="text-white text-[10px] font-black">PAUSE</span>
                ) : (
                    <span className="text-white text-[10px] font-black ml-1">PLAY</span>
                )}
            </button>

            <div ref={containerRef} className="flex-1 opacity-80 hover:opacity-100 transition-opacity" />
        </div>
    );
};

export default WavePlayer;