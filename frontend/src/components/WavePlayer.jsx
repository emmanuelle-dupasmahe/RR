import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';

const WavePlayer = ({ url, startTime, endTime, id }) => {
    const containerRef = useRef(null);
    const wavesurferRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [zoomLevel, setZoomLevel] = useState(10);

    const formatTime = (seconds) => {
        if (!seconds || isNaN(seconds)) return "00:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
        wavesurferRef.current = WaveSurfer.create({
            container: containerRef.current,
            waveColor: '#a1a1aa',
            progressColor: '#e3181f', // Rouge Primaire
            cursorColor: '#e3181f',
            barWidth: 2,
            barRadius: 3,
            responsive: true,
            height: 60,
            normalize: true,
            partialRender: true,
            minPxPerSec: zoomLevel,
            
            hideScrollbar: false, 
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
            if (ws) ws.play(Number(e.detail));
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
        <div className="w-full bg-black/5 dark:bg-white/5 p-3 rounded-lg border border-black/5 dark:border-white/5 space-y-2">
            <div className="flex justify-between items-center px-1">
                <div className="flex gap-4 items-center">
                    <span className="text-[10px] font-mono text-primary font-bold">
                        {formatTime(currentTime)}
                    </span>
                    <span className="text-[10px] font-mono text-black/40 dark:text-white/40">
                        {formatTime(duration)}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-[9px] text-black/30 dark:text-white/30 font-bold uppercase">Zoom</span>
                    <input
                        type="range"
                        min="10"
                        max="200"
                        value={zoomLevel}
                        onChange={handleZoom}
                        className="w-20 h-1 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button
                    type="button"
                    onClick={handlePlayPause}
                    className="w-12 h-12 flex items-center justify-center bg-primary rounded-full hover:scale-105 transition-transform shrink-0 shadow-lg"
                >
                    {isPlaying ? (
                        <span className="text-white text-[10px] font-black uppercase">Pause</span>
                    ) : (
                        <span className="text-white text-[10px] font-black uppercase ml-1">Play</span>
                    )}
                </button>

                {/* CONTENEUR*/}
                <div 
                    ref={containerRef} 
                    className="flex-1 overflow-x-auto overflow-y-hidden
                               scrollbar-thin 
                               scrollbar-track-transparent 
                               scrollbar-thumb-primary/20
                               hover:scrollbar-thumb-primary/50
                               dark:scrollbar-thumb-white/10
                               dark:hover:scrollbar-thumb-primary/60
                               transition-colors"
                    style={{
                        scrollbarWidth: 'thin', /* Pour Firefox */
                        scrollbarColor: '#e3181f33 transparent' /* Pour Firefox */
                    }}
                />
            </div>
        </div>
    );
};

export default WavePlayer;