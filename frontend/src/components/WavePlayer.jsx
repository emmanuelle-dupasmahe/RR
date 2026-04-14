import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';

const WavePlayer = ({ url, startTime, endTime, id }) => {
    const containerRef = useRef(null);
    const wavesurferRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    
    // États pour le temps et le zoom
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [zoomLevel, setZoomLevel] = useState(10); // Niveau de zoom initial

    const formatTime = (seconds) => {
        if (!seconds || isNaN(seconds)) return "00:00";
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
            partialRender: true,
            minPxPerSec: zoomLevel // On lie le zoom à l'initialisation
        });

        const ws = wavesurferRef.current;
        ws.load(url);

        ws.on('ready', () => {
            setDuration(ws.getDuration());
            if (startTime) ws.setTime(Number(startTime));
        });

        ws.on('audioprocess', () => {
            const current = ws.getCurrentTime();
            setCurrentTime(current);
            if (endTime && current >= Number(endTime)) {
                ws.pause();
                ws.setTime(Number(startTime || 0));
            }
        });

        ws.on('interaction', () => {
            setCurrentTime(ws.getCurrentTime());
        });

        ws.on('play', () => setIsPlaying(true));
        ws.on('pause', () => setIsPlaying(false));

        const handleJump = (e) => {
            if (ws) {
                ws.setTime(Number(e.detail));
                ws.play();
            }
        };
        
        const eventName = `jump-to-${id.replace('wave-', '')}`;
        window.addEventListener(eventName, handleJump);

        return () => {
            window.removeEventListener(eventName, handleJump);
            if (ws) {
                ws.unAll();
                ws.destroy();
            }
        }
    }, [url, startTime, endTime, id]);

    // Fonction pour gérer le changement de zoom
    const handleZoom = (e) => {
        const level = Number(e.target.value);
        setZoomLevel(level);
        if (wavesurferRef.current) {
            wavesurferRef.current.zoom(level);
        }
    };

    const handlePlayPause = () => {
        if (wavesurferRef.current) wavesurferRef.current.playPause();
    };

    return (
        <div className="w-full bg-white/5 p-3 rounded-lg border border-white/5 space-y-2">
            <div className="flex justify-between items-center px-1">
                <div className="flex gap-4 items-center">
                    <span className="text-[10px] font-mono text-red-500 font-bold">
                        {formatTime(currentTime)}
                    </span>
                    <span className="text-[10px] font-mono text-white/40">
                        {formatTime(duration)}
                    </span>
                </div>

                {/* Contrôle de Zoom */}
                <div className="flex items-center gap-2">
                    <span className="text-[9px] text-white/30 font-bold uppercase">Zoom</span>
                    <input 
                        type="range" 
                        min="10" 
                        max="200" 
                        value={zoomLevel}
                        onChange={handleZoom}
                        className="w-20 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-red-600"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button 
                    type="button"
                    onClick={handlePlayPause}
                    className="w-12 h-12 flex items-center justify-center bg-red-600 rounded-full hover:scale-105 transition-transform shrink-0"
                >
                    {isPlaying ? (
                        <span className="text-white text-[10px] font-black">PAUSE</span>
                    ) : (
                        <span className="text-white text-[10px] font-black ml-1">PLAY</span>
                    )}
                </button>
                {/* Conteneur de la waveform avec scrollbar automatique si zoomé */}
                <div ref={containerRef} className="flex-1 overflow-x-auto overflow-y-hidden" />
            </div>
        </div>
    );
};

export default WavePlayer;