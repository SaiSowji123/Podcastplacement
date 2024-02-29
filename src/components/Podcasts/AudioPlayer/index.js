import React, { useEffect, useRef, useState } from 'react';
import './styles.css';
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaForward, FaBackward } from "react-icons/fa";

function AudioPlayer({ audioSrc, image }) {
    // State variables to manage player functionality and state
    const [isPlaying, setIsPlaying] = useState(true);
    const [isMute, setIsMute] = useState(false);
    const [duration, setDuration] = useState("");
    const [currentTime, setCurrentTime] = useState(0);
    const [volume, setVolume] = useState(1);
    const audioRef = useRef(); // Reference to the audio element

    // Function to handle duration change
    const handleDuration = (e) => {
        setCurrentTime(e.target.value);
        audioRef.current.currentTime = e.target.value;
    };

    // Function to toggle play/pause
    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    // Function to toggle mute/unmute
    const toggleMute = () => {
        setIsMute(!isMute);
    };

    // Function to handle volume change
    const handleVolume = (e) => {
        setVolume(e.target.value);
        audioRef.current.volume = e.target.value;
    };

    // Function to skip forward
    const handleSkipForward = () => {
        audioRef.current.currentTime += 10;
    };

    // Function to skip backward
    const handleSkipBackward = () => {
        audioRef.current.currentTime -= 10;
    };

    // Function to format time in mm:ss format
    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    // Effect to set up event listeners when component mounts
    useEffect(() => {
        const audio = audioRef.current;
        audio.addEventListener("timeupdate", handleTimeUpdate);
        audio.addEventListener("loadedmetadata", handleLoadedMetaData);
        audio.addEventListener("ended", handleEnded);
        return () => {
            audio.removeEventListener("timeupdate", handleTimeUpdate);
            audio.removeEventListener("loadedmetadata", handleLoadedMetaData);
            audio.removeEventListener("ended", handleEnded);
        };
    }, []);

    // Function to handle time update
    const handleTimeUpdate = () => {
        setCurrentTime(audioRef.current.currentTime);
    };

    // Function to handle loaded metadata
    const handleLoadedMetaData = () => {
        setDuration(audioRef.current.duration);
    };

    // Function to handle audio ended
    const handleEnded = () => {
        setCurrentTime(0);
        setIsPlaying(false);
    };

    // Effect to play/pause audio based on isPlaying state
    useEffect(() => {
        if (isPlaying) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying]);

    // Effect to mute/unmute audio based on isMute state
    useEffect(() => {
        audioRef.current.muted = isMute;
    }, [isMute]);

    // Rendering the audio player component
    return (
        <div className="custom-audio-player">
            {/* Player controls */}
            <span id="controls">
                <img src={image} alt="Album Cover" className="display-image-player" />
                <audio ref={audioRef} src={audioSrc} />
                <p className="audio-btn" onClick={handleSkipBackward}><FaBackward /></p>
                <p className="audio-btn" onClick={togglePlay}>{isPlaying ? <FaPause /> : <FaPlay />}</p>
                <p className="audio-btn" onClick={handleSkipForward}><FaForward /></p>
                <span className="volume">
                    <p className="audio-btn" onClick={toggleMute}>{isMute ? <FaVolumeMute /> : <FaVolumeUp />}</p>
                    <input
                        type="range"
                        value={volume}
                        max={1}
                        min={0}
                        step="0.01"
                        onChange={handleVolume}
                        className="volume-range"
                    />
                </span>
            </span>
            {/* Audio duration */}
            <div className="duration-flex">
                <span className="time">
                    <p>{formatTime(currentTime)}</p>
                    <input
                        type="range"
                        max={duration}
                        value={currentTime}
                        step={0.01}
                        onChange={handleDuration}
                        className="duration-range"
                    />
                    <p>{formatTime(duration - currentTime)}</p>
                </span>
            </div>
        </div>
    );
}

// Exporting the AudioPlayer component
export default AudioPlayer;
