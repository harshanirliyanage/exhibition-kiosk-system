import React, { useMemo } from "react";

const WaterDrops = ({ count = 15 }) => {
    // Memoized so random values don't regenerate on every parent re-render
    const drops = useMemo(
        () =>
            Array.from({ length: count }, (_, i) => ({
                id: i,
                left: `${Math.random() * 100}%`,
                delay: `${Math.random() * 5}s`,
                duration: `${3 + Math.random() * 4}s`,
                size: 3 + Math.random() * 4,
            })),
        [count]
    );

    return (
        <>
            {/* Inline keyframes — no external CSS file needed */}
            <style>{`
                @keyframes waterFall {
                    0%   { transform: translateY(-20px); opacity: 0; }
                    10%  { opacity: 0.85; }
                    90%  { opacity: 0.6; }
                    100% { transform: translateY(100vh); opacity: 0; }
                }
                .water-drop {
                    position: absolute;
                    top: 0;
                    border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
                    background: linear-gradient(
                        135deg,
                        rgba(255, 255, 255, 0.55) 0%,
                        rgba(130, 190, 255, 0.25) 100%
                    );
                    border: 1px solid rgba(255, 255, 255, 0.35);
                    backdrop-filter: blur(2px);
                    animation: waterFall linear infinite;
                    pointer-events: none;
                }
            `}</style>

            {drops.map((drop) => (
                <div
                    key={drop.id}
                    className="water-drop"
                    style={{
                        left: drop.left,
                        width: `${drop.size}px`,
                        height: `${drop.size * 1.2}px`,
                        animationDelay: drop.delay,
                        animationDuration: drop.duration,
                    }}
                />
            ))}
        </>
    );
};

export default WaterDrops;