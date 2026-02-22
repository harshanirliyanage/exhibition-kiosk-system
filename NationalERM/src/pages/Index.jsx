import React from "react";
import { useNavigate } from "react-router-dom";
import heroBg from "../assets/hero-bg.jpg";
import logo from "../assets/national-logo.png";
import kryptonLogo from "../assets/Krypton Logo (1).PNG";
import qrImage from "../assets/QR-PRODUCT CATALOG.jpeg";
import WaterDrops from "../Components/WaterDrops";

const Index = () => {
    const navigate = useNavigate();

    return (
        <div style={{
            position: "relative",
            width: "100vw",
            height: "100vh",
            overflow: "hidden",
            background: "linear-gradient(180deg, hsl(235 85% 58%) 0%, hsl(220 80% 25%) 100%)",
        }}>
            <style>{`
                @keyframes pulse-glow {
                    0%, 100% { box-shadow: 0 0 50px hsla(45,100%,52%,0.65), 0 10px 40px rgba(0,0,0,0.45); }
                    50%       { box-shadow: 0 0 100px hsla(45,100%,52%,1),   0 10px 50px rgba(0,0,0,0.55); }
                }
                @keyframes game-bounce {
                    0%, 100% { transform: translateY(0) scale(1); }
                    30%      { transform: translateY(-8px) scale(1.06); }
                    60%      { transform: translateY(-3px) scale(1.02); }
                }
                @keyframes game-ping {
                    0%   { transform: scale(1);   opacity: 1; }
                    100% { transform: scale(2.2); opacity: 0; }
                }
                @keyframes qr-ping {
                    0%   { transform: scale(1); opacity: 0.8; }
                    100% { transform: scale(1.9); opacity: 0; }
                }
                @keyframes qr-scan {
                    0%   { top: 4px; opacity: 1; }
                    49%  { opacity: 1; }
                    50%  { top: calc(100% - 4px); opacity: 0.4; }
                    51%  { opacity: 1; }
                    100% { top: 4px; opacity: 1; }
                }
                @keyframes qr-label-pulse {
                    0%, 100% { opacity: 0.85; transform: scale(1); }
                    50%      { opacity: 1; transform: scale(1.04); }
                }
                @keyframes corner-blink {
                    0%, 100% { opacity: 0.5; }
                    50%      { opacity: 1; }
                }
                .kiosk-register-btn:active { transform: scale(0.97) !important; }
                .game-attract-btn {
                    animation: game-bounce 2.2s ease-in-out infinite;
                    transition: transform 0.15s;
                }
                .game-attract-btn:active { transform: scale(0.93) !important; }
                .qr-scan-line {
                    position: absolute;
                    left: 5px; right: 5px;
                    height: 2px;
                    background: linear-gradient(90deg, transparent, hsl(45 100% 55%) 40%, hsl(45 100% 70%) 50%, hsl(45 100% 55%) 60%, transparent);
                    border-radius: 2px;
                    animation: qr-scan 2.2s ease-in-out infinite;
                    z-index: 3;
                    pointer-events: none;
                }
                .qr-corner-tl { top: -3px; left: -3px; border-top: 2.5px solid hsl(45 100% 60%); border-left: 2.5px solid hsl(45 100% 60%); border-radius: 3px 0 0 0; animation: corner-blink 2s ease-in-out infinite; }
                .qr-corner-tr { top: -3px; right: -3px; border-top: 2.5px solid hsl(45 100% 60%); border-right: 2.5px solid hsl(45 100% 60%); border-radius: 0 3px 0 0; animation: corner-blink 2s ease-in-out infinite 0.5s; }
                .qr-corner-bl { bottom: -3px; left: -3px; border-bottom: 2.5px solid hsl(45 100% 60%); border-left: 2.5px solid hsl(45 100% 60%); border-radius: 0 0 0 3px; animation: corner-blink 2s ease-in-out infinite 1s; }
                .qr-corner-br { bottom: -3px; right: -3px; border-bottom: 2.5px solid hsl(45 100% 60%); border-right: 2.5px solid hsl(45 100% 60%); border-radius: 0 0 3px 0; animation: corner-blink 2s ease-in-out infinite 1.5s; }
                .qr-label-anim { animation: qr-label-pulse 2s ease-in-out infinite; }
            `}</style>

            {/* Layer 1 — Background photo */}
            <div style={{
                position: "absolute", inset: 0, zIndex: 1,
                backgroundImage: `url(${heroBg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                opacity: 0.45,
            }} />

            {/* Layer 2 — Water drops */}
            <div style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none" }}>
                <WaterDrops count={25} />
            </div>

            {/* Layer 3 — Page content */}
            <div style={{
                position: "relative",
                zIndex: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                height: "100vh",
                width: "100%",
                boxSizing: "border-box",
                padding: "4vh 6vw 2vh",
            }}>

                {/* SECTION 1 — Two Logos side by side */}
                <div className="animate-float" style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: "4vw" }}>
                    <img src={logo} alt="National" style={{
                        width: "22vw", height: "22vw",
                        maxWidth: "220px", maxHeight: "220px",
                        objectFit: "contain", borderRadius: "1.5rem",
                        background: "rgba(255,255,255,0.93)", padding: "1.2rem",
                    }} />
                    <img src={kryptonLogo} alt="Krypton" style={{
                        width: "22vw", height: "22vw",
                        maxWidth: "220px", maxHeight: "220px",
                        objectFit: "contain", borderRadius: "1.5rem",
                        background: "rgba(255,255,255,0.93)", padding: "1.2rem",
                    }} />
                </div>

                <div style={{ flex: "0 0 4vh" }} />

                {/* SECTION 2 — Highlighted description */}
                <div style={{
                    background: "linear-gradient(135deg, hsla(45,100%,52%,0.18) 0%, hsla(190,100%,60%,0.18) 100%)",
                    border: "1.5px solid hsla(45,100%,55%,0.5)",
                    borderRadius: "1.2rem",
                    padding: "1.2vh 5vw", textAlign: "center",
                    width: "88vw", maxWidth: "700px", boxSizing: "border-box",
                }}>
                    <p style={{
                        fontSize: "clamp(1.1rem, 2.8vw, 1.8rem)",
                        color: "rgba(255,255,255,0.85)", lineHeight: 1.7, margin: 0,
                    }}>
                        Register today &amp; visit our showroom to claim your{" "}
                        <span style={{ fontWeight: 800, color: "hsl(45 100% 55%)", textShadow: "0 0 18px hsla(45,100%,55%,0.7)" }}>
                            exclusive discount
                        </span>
                    </p>
                </div>

                <div style={{ flex: "0 0 4vh" }} />

                {/* SECTION 3 — Main headline */}
                <div style={{ textAlign: "center" }}>
                    <h1 style={{ fontSize: "clamp(2.8rem, 8vw, 5.5rem)", fontWeight: 900, color: "#ffffff", margin: 0, lineHeight: 1.15 }}>
                        Welcome to
                    </h1>
                    <h1 style={{ fontSize: "clamp(2rem, 5.8vw, 4.2rem)", fontWeight: 900, color: "hsl(190 100% 60%)", margin: "0.5rem 0 0 0", lineHeight: 1.15 }}>
                        CENTRAL INDUSTRIES PLC
                    </h1>
                </div>

                <div style={{ flex: "0 0 4vh" }} />

                {/* SECTION 4 — Glass card */}
                <div className="kiosk-glass" style={{ padding: "2.5vh 6vw", textAlign: "center", width: "88vw", maxWidth: "700px", boxSizing: "border-box" }}>
                    <p style={{ fontSize: "clamp(1rem, 2.5vw, 1.5rem)", color: "rgba(255,255,255,0.75)", margin: 0 }}>
                        Four Decades of Manufacturing Excellence
                    </p>
                    <p style={{ fontSize: "clamp(1rem, 2.5vw, 1.5rem)", fontWeight: 700, color: "hsl(190 100% 60%)", marginTop: "0.6rem", marginBottom: 0 }}>
                        Central Industries PLC — Since 1985
                    </p>
                </div>

                <div style={{ flex: "0 0 4vh" }} />

                {/* SECTION 5 — CTA Button */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2vh" }}>
                    <button
                        className="kiosk-register-btn"
                        onClick={() => navigate("/register")}
                        style={{
                            fontSize: "clamp(1.4rem, 3vw, 2rem)",
                            fontWeight: 900, whiteSpace: "nowrap",
                            padding: "2.8vh 6vw", borderRadius: "1.5rem",
                            border: "none", cursor: "pointer",
                            letterSpacing: "0.07em", textTransform: "uppercase",
                            background: "linear-gradient(135deg, hsl(45 100% 52%) 0%, hsl(35 100% 46%) 100%)",
                            color: "#1a1000",
                            animation: "pulse-glow 2s ease-in-out infinite",
                            transition: "transform 0.15s ease",
                            width: "88vw", maxWidth: "700px",
                        }}
                        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.03)"}
                        onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                    >
                        👆 Start Registration
                    </button>

                    <p style={{ fontSize: "clamp(0.95rem, 2.2vw, 1.4rem)", color: "rgba(255,255,255,0.6)", margin: 0, textAlign: "center" }}>
                        Tap to begin your visitor registration
                    </p>

                    {/* Promo badge */}
{/* Promo badge */}
<div className="promo-badge animate-float" style={{
    animationDelay: "0.5s",
    fontSize: "clamp(1.1rem, 3vw, 1.8rem)",
    padding: "1rem 2.5rem",
    textAlign: "center",
}}>
    🎉 UPTO 35% OFF Today!
    <div style={{
        fontSize: "clamp(0.45rem, 1.1vw, 0.65rem)",
        fontWeight: 600,
        color: "#000000",
        letterSpacing: "0.04em",
        marginTop: "0.25rem",
        textTransform: "none",
        textAlign: "center",
    }}>
        on selected items
    </div>
</div>
                </div>

                <div style={{ flex: "0 0 3vh" }} />

                {/* SECTION 6 — Bottom bar: Game | QR Code | Info + contact below */}
                <div style={{
                    width: "88vw", maxWidth: "700px",
                    borderTop: "1px solid rgba(255,255,255,0.12)",
                    paddingTop: "1.5vh",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "1.2vh",
                }}>

                    {/* Three icons row */}
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-end",
                        width: "100%",
                        gap: "2vw",
                    }}>

                        {/* ── Game Button ── */}
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", flex: 1 }}>
                            <div style={{ position: "relative", display: "inline-flex" }}>
                                <div style={{
                                    position: "absolute", inset: 0, borderRadius: "50%",
                                    background: "hsla(280,90%,65%,0.45)",
                                    animation: "game-ping 1.4s cubic-bezier(0,0,0.2,1) infinite",
                                }} />
                                <button
                                    className="game-attract-btn"
                                    onClick={() => navigate("/game")}
                                    title="Play Memory Match Game"
                                    style={{
                                        position: "relative",
                                        width: "clamp(68px, 10vw, 90px)",
                                        height: "clamp(68px, 10vw, 90px)",
                                        borderRadius: "50%",
                                        border: "2.5px solid hsla(280,80%,75%,0.6)",
                                        background: "linear-gradient(135deg, hsl(270 80% 40%), hsl(300 80% 35%))",
                                        backdropFilter: "blur(12px)",
                                        cursor: "pointer",
                                        display: "flex", flexDirection: "column",
                                        alignItems: "center", justifyContent: "center",
                                        gap: "0.1rem",
                                        boxShadow: "0 4px 24px hsla(280,80%,50%,0.55)",
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.12)"; }}
                                    onMouseLeave={e => { e.currentTarget.style.transform = ""; }}
                                >
                                    <span style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", lineHeight: 1 }}>🎮</span>
                                    <span style={{
                                        fontSize: "clamp(0.4rem, 0.8vw, 0.56rem)",
                                        color: "rgba(255,255,255,0.85)",
                                        fontWeight: 800, letterSpacing: "0.06em",
                                        textTransform: "uppercase",
                                    }}>PLAY</span>
                                </button>
                            </div>
                            <span style={{
                                fontSize: "clamp(0.55rem, 1vw, 0.7rem)",
                                color: "rgba(255,255,255,0.55)", fontWeight: 700,
                                letterSpacing: "0.05em", textTransform: "uppercase",
                                textAlign: "center",
                            }}>🧠 Memory Game</span>
                        </div>

                        {/* ── QR Code ── */}
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", flex: 1 }}>
                            <div className="qr-label-anim" style={{
                                background: "linear-gradient(90deg, hsla(45,100%,52%,0.25), hsla(45,100%,52%,0.1))",
                                border: "1px solid hsla(45,100%,55%,0.5)",
                                borderRadius: "2rem",
                                padding: "0.2rem 0.7rem",
                                display: "flex", alignItems: "center", gap: "0.35rem",
                                marginBottom: "0.3rem",
                            }}>
                                <span style={{ fontSize: "clamp(0.55rem, 1vw, 0.7rem)" }}>📋</span>
                                <span style={{
                                    fontSize: "clamp(0.48rem, 0.9vw, 0.62rem)",
                                    fontWeight: 800, color: "hsl(45 100% 70%)",
                                    letterSpacing: "0.07em", textTransform: "uppercase",
                                    whiteSpace: "nowrap",
                                }}>Scan · Price Lists</span>
                            </div>

                            <div style={{ position: "relative" }}>
                                {/* Outer glow ring */}
                                <div style={{
                                    position: "absolute", inset: -6, borderRadius: "14px",
                                    background: "hsla(45,100%,55%,0.15)",
                                    animation: "qr-ping 2s ease-out infinite",
                                }} />
                                {/* Animated corners */}
                                {["qr-corner-tl","qr-corner-tr","qr-corner-bl","qr-corner-br"].map(cls => (
                                    <div key={cls} className={`qr-corner ${cls}`} style={{ position: "absolute", width: 12, height: 12 }} />
                                ))}
                                {/* QR image */}
                                <div style={{
                                    background: "white", borderRadius: "10px", padding: "5px",
                                    boxShadow: "0 4px 20px rgba(0,0,0,0.45)",
                                    position: "relative", overflow: "hidden",
                                }}>
                                    <div className="qr-scan-line" />
                                    <img
                                        src={qrImage}
                                        alt="Scan for Price Lists"
                                        style={{
                                            width: "clamp(78px, 12vw, 100px)",
                                            height: "clamp(78px, 12vw, 100px)",
                                            display: "block", objectFit: "contain",
                                        }}
                                    />
                                </div>
                            </div>
                            <span style={{
                                fontSize: "clamp(0.45rem, 0.85vw, 0.58rem)",
                                color: "rgba(255,255,255,0.5)", fontWeight: 700,
                                letterSpacing: "0.1em", textTransform: "uppercase",
                            }}>📱 Scan Me</span>
                        </div>

                        {/* ── Info Button ── */}
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", flex: 1 }}>
                            <button
                                onClick={() => navigate("/info")}
                                title="Company Information"
                                style={{
                                    width: "clamp(68px, 10vw, 90px)",
                                    height: "clamp(68px, 10vw, 90px)",
                                    borderRadius: "50%",
                                    border: "2px solid rgba(255,255,255,0.25)",
                                    background: "rgba(255,255,255,0.12)",
                                    backdropFilter: "blur(12px)",
                                    cursor: "pointer",
                                    display: "flex", flexDirection: "column",
                                    alignItems: "center", justifyContent: "center",
                                    gap: "0.15rem",
                                    boxShadow: "0 4px 20px rgba(0,0,0,0.35)",
                                    transition: "all 0.2s",
                                }}
                                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.22)"; e.currentTarget.style.transform = "scale(1.1)"; }}
                                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.12)"; e.currentTarget.style.transform = "scale(1)"; }}
                            >
                                <span style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", lineHeight: 1 }}>ℹ️</span>
                                <span style={{ fontSize: "clamp(0.42rem, 0.9vw, 0.58rem)", color: "rgba(255,255,255,0.7)", fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase" }}>INFO</span>
                            </button>
                            <span style={{
                                fontSize: "clamp(0.55rem, 1vw, 0.7rem)",
                                color: "rgba(255,255,255,0.55)", fontWeight: 700,
                                letterSpacing: "0.05em", textTransform: "uppercase",
                                textAlign: "center",
                            }}>Company Info</span>
                        </div>

                    </div>

                    {/* Contact strip — phone & location only */}
                    <div style={{
                        display: "flex", justifyContent: "center", alignItems: "center",
                        gap: "6vw",
                        paddingTop: "1vh",
                        borderTop: "1px solid rgba(255,255,255,0.07)",
                        width: "100%",
                    }}>
                        {[
                            { icon: "📞", top: "+94 11 742 1421", bottom: "Call Us" },
                            { icon: "📍", top: "No: 312 B470, Sri Jayawardenepura Kotte", bottom: "Head Office" },
                        ].map(({ icon, top, bottom }) => (
                            <div key={bottom} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.2vh", textAlign: "center" }}>
                                <span style={{ fontSize: "clamp(1.1rem, 2.2vw, 1.5rem)" }}>{icon}</span>
                                <span style={{ fontSize: "clamp(0.6rem, 1.3vw, 0.82rem)", color: "rgba(255,255,255,0.72)", fontWeight: 600 }}>{top}</span>
                                <span style={{ fontSize: "clamp(0.5rem, 1vw, 0.65rem)", color: "rgba(255,255,255,0.32)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{bottom}</span>
                            </div>
                        ))}
                    </div>

                    <p style={{ fontSize: "clamp(0.7rem, 1.3vw, 0.85rem)", color: "rgba(255,255,255,0.25)", margin: 0 }}>
                        nationalpvc.com
                    </p>

                </div>

            </div>
        </div>
    );
};

export default Index;