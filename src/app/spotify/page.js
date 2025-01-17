"use client";

import { useState, useEffect } from "react";
import "../../styles/music.css";

function Music() {
    return (
        <div className="music-container">
            <div className="iframe-container">
                <iframe
                    style={{ borderRadius: '5px' }} // Correct way to apply inline styles
                    src="https://open.spotify.com/embed/playlist/6nIHsZqrPu1eqkHwAH8HCT?utm_source=generator"
                    width="300"
                    height="152"
                    frameBorder="0"
                    allowFullScreen
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                />
            </div>
        </div>
    );
}

export default Music;
