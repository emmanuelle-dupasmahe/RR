import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';

const WavePlayer = ({ url, startTime, endTime, id }) => {
    const containerRef = useRef(null);
    const wavesurferRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    
    // États pour le temps
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    // Fonction utilitaire pour formater les secondes en MM:SS
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
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

        wavesurferRef.current.load(url);

        wavesurferRef.current.on('ready', () => {
            setDuration(wavesurferRef.current.getDuration());
            if (startTime) wavesurferRef.current.setTime(Number(startTime));
        });

        // Mise à jour du temps pendant la lecture
        wavesurferRef.current.on('audioprocess', () => {
            const current = wavesurferRef.current.getCurrentTime();
            setCurrentTime(current);

            if (endTime && current >= Number(endTime)) {
                wavesurferRef.current.pause();
                wavesurferRef.current.setTime(Number(startTime || 0));
            }
        });

        // Mise à jour du temps si on clique sur la waveform
        wavesurferRef.current.on('interaction', () => {
            setCurrentTime(wavesurferRef.current.getCurrentTime());
        });

        const handleJump = (e) => {
            if (wavesurferRef.current) {
                wavesurferRef.current.setTime(Number(e.detail));
                wavesurferRef.current.play();
            }
        };
        
        window.addEventListener(`jump-to-${id.replace('wave-', '')}`, handleJump);

        wavesurferRef.current.on('play', () => setIsPlaying(true));
        wavesurferRef.current.on('pause', () => setIsPlaying(false));

        return () => {
            window.removeEventListener(`jump-to-${id.replace('wave-', '')}`, handleJump);
            wavesurferRef.current.destroy();
        }
    }, [url, startTime, endTime, id]);

    const handlePlayPause = () => {
        wavesurferRef.current.playPause();
    };

    return (
        <div className="w-full bg-white/5 p-3 rounded-lg border border-white/5 space-y-2">
            {/* Barre d'infos temps */}
            <div className="flex justify-between px-1">
                <span className="text-[10px] font-mono text-red-500 font-bold">
                    {formatTime(currentTime)}
                </span>
                <span className="text-[10px] font-mono text-white/40">
                    {formatTime(duration)}
                </span>
            </div>

            <div className="flex items-center gap-4">
                <button 
                    onClick={handlePlayPause}
                    className="w-12 h-12 flex items-center justify-center bg-red-600 rounded-full hover:scale-105 transition-transform shrink-0"
                >
                    {isPlaying ? (
                        <span className="text-white text-[10px] font-black">PAUSE</span>
                    ) : (
                        <span className="text-white text-[10px] font-black ml-1">PLAY</span>
                    )}
                </button>
                <div ref={containerRef} className="flex-1" />
            </div>
        </div>
    );
};

export default WavePlayer;