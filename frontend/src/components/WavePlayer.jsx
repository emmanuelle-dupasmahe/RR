import React, { useEffect, useMemo, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';

const WavePlayer = ({ url, startTime, endTime, id, markers = [] }) => {
    const containerRef = useRef(null);
    const scrollContainerRef = useRef(null);
    const wavesurferRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [zoomLevel, setZoomLevel] = useState(10);
    const [minPxPerSec, setMinPxPerSec] = useState(10);

    const formatTime = (seconds) => {
        if (!seconds || isNaN(seconds)) return "00:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
        // Réduire drastiquement minPxPerSec en mobile pour eviter le débordement
        const isMobile = window.innerWidth < 768;
        const minPxSec = isMobile ? 0.5 : zoomLevel;
        setMinPxPerSec(minPxSec);

        wavesurferRef.current = WaveSurfer.create({
            container: containerRef.current,
            waveColor: '#a1a1aa',
            progressColor: '#e3181f', // Rouge Primaire
            cursorColor: '#e3181f',
            barWidth: 2,
            barRadius: 3,
            responsive: true,
            height: 30,
            normalize: true,
            partialRender: true,
            minPxPerSec: minPxSec,
            hideScrollbar: true,
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
            if (!ws) return;
            const targetTime = Number(e.detail);
            ws.play(targetTime);

            const scroller = scrollContainerRef.current;
            const wave = containerRef.current;
            const totalDuration = Number(ws.getDuration());

            if (!scroller || !wave || !totalDuration || Number.isNaN(totalDuration)) return;

            const safeTime = Math.max(0, Math.min(targetTime || 0, totalDuration));
            const progress = safeTime / totalDuration;
            const contentWidth = wave.scrollWidth || wave.clientWidth;

            if (!contentWidth) return;

            const targetPx = progress * contentWidth;
            const centeredLeft = Math.max(0, targetPx - scroller.clientWidth / 2);
            scroller.scrollTo({ left: centeredLeft, behavior: 'smooth' });
        };

        const safeId = typeof id === 'string' ? id : '';
        const eventName = `jump-to-${safeId.replace('wave-', '')}`;
        if (safeId) {
            window.addEventListener(eventName, handleJump);
        }

        return () => {
            if (safeId) {
                window.removeEventListener(eventName, handleJump);
            }
            if (ws) {
                ws.unAll();
                ws.destroy();
            }
        };
    }, [url, startTime, endTime, id]);

    const handleZoom = (e) => {
        const level = Number(e.target.value);
        setZoomLevel(level);
        setMinPxPerSec(level);
        if (wavesurferRef.current) {
            wavesurferRef.current.zoom(level);
        }
    };

    const handlePlayPause = () => {
        if (wavesurferRef.current) wavesurferRef.current.playPause();
    };

    const scrollToTime = (time, durationOverride) => {
        const scroller = scrollContainerRef.current;
        const wave = containerRef.current;
        const totalDuration = Number(durationOverride || duration);

        if (!scroller || !wave || !totalDuration || Number.isNaN(totalDuration)) return;

        const safeTime = Math.max(0, Math.min(Number(time) || 0, totalDuration));
        const progress = safeTime / totalDuration;
        const contentWidth = wave.scrollWidth || wave.clientWidth;

        if (!contentWidth) return;

        const targetPx = progress * contentWidth;
        const centeredLeft = Math.max(0, targetPx - scroller.clientWidth / 2);
        scroller.scrollTo({ left: centeredLeft, behavior: 'smooth' });
    };

    const normalizedMarkers = Array.isArray(markers)
        ? markers
            .map((m) => ({
                time: Number(m?.time),
                label: String(m?.label || '').trim(),
            }))
            .filter((m) => !Number.isNaN(m.time) && m.time >= 0 && m.label)
        : [];

    const timelineMarkers = useMemo(
        () => [...normalizedMarkers].sort((a, b) => a.time - b.time),
        [normalizedMarkers]
    );

    const markerColors = useMemo(() => {
        const getStableColor = (seed) => {
            let hash = 0;
            for (let i = 0; i < seed.length; i += 1) {
                hash = (hash << 5) - hash + seed.charCodeAt(i);
                hash |= 0;
            }
            const hue = Math.abs(hash) % 360;
            return `hsl(${hue} 85% 58%)`;
        };

        return timelineMarkers.map((marker, idx) =>
            getStableColor(`${marker.time}-${marker.label}-${idx}`)
        );
    }, [timelineMarkers]);

    const activePlaybackMarkerIndex = useMemo(() => {
        const visibleWindowSec = 2.5;
        for (let i = timelineMarkers.length - 1; i >= 0; i -= 1) {
            const markerTime = timelineMarkers[i].time;
            if (currentTime >= markerTime && currentTime <= markerTime + visibleWindowSec) {
                return i;
            }
        }
        return -1;
    }, [currentTime, timelineMarkers]);

    const handleMarkerClick = (time) => {
        if (!wavesurferRef.current) return;
        wavesurferRef.current.play(time);
        scrollToTime(time);
    };

    const waveContentWidth = duration > 0 ? Math.max(duration * minPxPerSec, 1) : 0;

    return (
        <div className="w-full box-border bg-black/5 dark:bg-white/5 p-2 rounded-lg border border-black/5 dark:border-white/5 space-y-1">
            <div className="flex justify-between items-center px-1 gap-2">
                <div className="flex gap-2 items-center min-w-0">
                    <span className="text-[8px] font-mono text-primary font-bold">
                        {formatTime(currentTime)}
                    </span>
                    <span className="text-[8px] font-mono text-black/40 dark:text-white/40">
                        {formatTime(duration)}
                    </span>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                    <span className="text-[7px] text-black/30 dark:text-white/30 font-bold uppercase">Zoom</span>
                    <input
                        type="range"
                        min="10"
                        max="200"
                        value={zoomLevel}
                        onChange={handleZoom}
                        className="w-16 h-0.5 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                </div>
            </div>

            <div className="flex items-center gap-2 min-w-0">
                <button
                    type="button"
                    onClick={handlePlayPause}
                    className="w-8 h-8 flex items-center justify-center bg-primary rounded-full hover:scale-105 transition-transform shrink-0 shadow-lg cursor-pointer"
                >
                    {isPlaying ? (
                        <span className="text-white text-[7px] font-black uppercase">Pause</span>
                    ) : (
                        <span className="text-white text-[7px] font-black uppercase ml-0.5">Play</span>
                    )}
                </button>

                {/* CONTENEUR*/}
                <div
                    ref={scrollContainerRef}
                    className="relative isolate flex-1 min-w-0 pt-8 pb-1 overflow-x-auto overflow-y-hidden
                               scrollbar-thin
                               scrollbar-track-transparent
                               scrollbar-thumb-primary/20
                               hover:scrollbar-thumb-primary/50
                               dark:scrollbar-thumb-white/10
                               dark:hover:scrollbar-thumb-primary/60
                               transition-colors"
                    style={{
                        scrollbarWidth: 'thin',
                        scrollbarColor: '#e3181f33 transparent',
                    }}
                >
                    <div
                        ref={containerRef}
                        className="relative z-10 h-[30px] min-w-full cursor-pointer"
                        style={waveContentWidth > 0 ? { width: `${waveContentWidth}px` } : undefined}
                    />

                    {duration > 0 && timelineMarkers.length > 0 && (
                        <div
                            className="absolute left-0 top-8 z-30 h-[30px] min-w-full pointer-events-none"
                            style={waveContentWidth > 0 ? { width: `${waveContentWidth}px` } : undefined}
                        >
                            {timelineMarkers.map((marker, idx) => {
                                const left = Math.min(100, Math.max(0, (marker.time / duration) * 100));
                                const color = markerColors[idx] || 'hsl(190 85% 58%)';
                                const isPlaybackActive = idx === activePlaybackMarkerIndex;
                                return (
                                    <button
                                        key={`${marker.time}-${marker.label}-${idx}`}
                                        type="button"
                                        onClick={() => handleMarkerClick(marker.time)}
                                        className="group absolute top-0 z-40 h-full w-[3px] hover:w-[5px] transition-all pointer-events-auto cursor-pointer"
                                        style={{ left: `${left}%`, transform: 'translateX(-50%)' }}
                                        aria-label={`Aller au marqueur ${marker.label}`}
                                    >
                                        <span
                                            className="absolute inset-0"
                                            style={{ backgroundColor: color, opacity: 0.95 }}
                                        />
                                        <span
                                            className={`absolute top-0 left-1/2 z-50 -translate-x-1/2 -translate-y-[115%] whitespace-nowrap px-2 py-1 rounded text-white text-[9px] font-bold transition-all shadow-lg ${isPlaybackActive ? 'opacity-100 scale-105' : 'opacity-100 scale-100'}`}
                                            style={{ backgroundColor: color }}
                                        >
                                            {marker.label}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WavePlayer;
