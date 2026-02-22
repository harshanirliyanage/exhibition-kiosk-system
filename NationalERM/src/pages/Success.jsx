import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "@/assets/national-logo.png";

const TOTAL = 15;

/* ── tiny confetti particle ── */
const Confetti = () => {
    const pieces = useRef(
        Array.from({ length: 60 }, (_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            delay: `${Math.random() * 2}s`,
            duration: `${2.5 + Math.random() * 2.5}s`,
            color: ["#FFD700", "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#98FB98"][i % 8],
            size: 6 + Math.random() * 8,
            rotate: Math.random() * 360,
        }))
    ).current;

    return (
        <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
            <style>{`
                @keyframes confetti-fall {
                    0%   { transform: translateY(-20px) rotate(0deg);   opacity: 1; }
                    100% { transform: translateY(105vh) rotate(720deg); opacity: 0.3; }
                }
            `}</style>
            {pieces.map(p => (
                <div key={p.id} style={{
                    position: "absolute",
                    top: 0,
                    left: p.left,
                    width: p.size,
                    height: p.size * 0.5,
                    background: p.color,
                    borderRadius: "2px",
                    animation: `confetti-fall ${p.duration} ${p.delay} ease-in infinite`,
                    transform: `rotate(${p.rotate}deg)`,
                }} />
            ))}
        </div>
    );
};

const Success = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [countdown, setCountdown] = useState(TOTAL);

    /* Pull user data passed from Registration via navigate state */
    const user = location.state || {
        name: "Valued Visitor",
        address: "—",
        profession: "—",
        phone: "—",
    };

    useEffect(() => {
        const iv = setInterval(() => {
            setCountdown(p => {
                if (p <= 1) {
                    clearInterval(iv);
                    return 0;
                }
                return p - 1;
            });
        }, 1000);
        return () => clearInterval(iv);
    }, []);

    useEffect(() => {
        if (countdown === 0) {
            navigate("/");
        }
    }, [countdown, navigate]);

    const progress = ((TOTAL - countdown) / TOTAL) * 100;

    return (
        <div style={{
            position: "relative",
            width: "100vw",
            height: "100vh",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            background: "linear-gradient(180deg, hsl(235 85% 20%) 0%, hsl(220 80% 10%) 100%)",
        }}>
            <style>{`
                @keyframes pop-in {
                    0%   { transform: scale(0) rotate(-15deg); opacity: 0; }
                    70%  { transform: scale(1.15) rotate(3deg); opacity: 1; }
                    100% { transform: scale(1) rotate(0deg);   opacity: 1; }
                }
                @keyframes ring-pulse {
                    0%   { transform: scale(1);   opacity: 0.6; }
                    100% { transform: scale(2.2); opacity: 0;   }
                }
                @keyframes float-slow {
                    0%,100% { transform: translateY(0); }
                    50%     { transform: translateY(-8px); }
                }
                @keyframes shimmer-gold {
                    0%   { background-position: -200% center; }
                    100% { background-position:  200% center; }
                }
                @keyframes slide-in-left {
                    from { opacity: 0; transform: translateX(-20px); }
                    to   { opacity: 1; transform: translateX(0); }
                }
                @keyframes glow-green {
                    0%,100% { box-shadow: 0 0 20px hsla(140,80%,50%,0.4); }
                    50%     { box-shadow: 0 0 50px hsla(140,80%,50%,0.9); }
                }

                .check-circle {
                    animation: pop-in 0.7s cubic-bezier(0.175,0.885,0.32,1.275) forwards,
                               glow-green 2.5s ease-in-out 0.7s infinite;
                }
                .ring1 { animation: ring-pulse 1.8s ease-out 0.3s infinite; }
                .ring2 { animation: ring-pulse 1.8s ease-out 0.8s infinite; }
                .shimmer-gold {
                    background: linear-gradient(90deg,
                        hsl(45 100% 55%) 0%, hsl(55 100% 75%) 40%,
                        hsl(45 100% 55%) 60%, hsl(35 100% 50%) 100%);
                    background-size: 200% auto;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    animation: shimmer-gold 2s linear infinite;
                }
                .info-row {
                    animation: slide-in-left 0.5s ease forwards;
                    display: flex;
                    align-items: flex-start;
                    gap: 0.8vw;
                    padding: 0.6vh 0;
                    border-bottom: 1px solid rgba(255,255,255,0.07);
                }
                .info-row:last-child { border-bottom: none; }
                .contact-card {
                    display: flex;
                    align-items: center;
                    gap: 0.8vw;
                    padding: 1vh 1.5vw;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 0.8rem;
                    transition: background 0.2s;
                    text-decoration: none;
                    cursor: pointer;
                }
                .contact-card:hover { background: rgba(255,255,255,0.1); }
            `}</style>

            <Confetti />

            {/* ═══════ Scrollable content ═══════ */}
            <div style={{
                position: "relative",
                zIndex: 1,
                width: "100%",
                height: "100vh",
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "4vh 5vw 3vh",
                boxSizing: "border-box",
                gap: "2.5vh",
            }}>

                {/* ── 1. Success icon ── */}
                <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div className="ring1" style={{
                        position: "absolute", width: "clamp(80px,16vw,120px)", height: "clamp(80px,16vw,120px)",
                        borderRadius: "50%", border: "3px solid hsl(140 80% 55%)",
                    }} />
                    <div className="ring2" style={{
                        position: "absolute", width: "clamp(80px,16vw,120px)", height: "clamp(80px,16vw,120px)",
                        borderRadius: "50%", border: "3px solid hsl(140 80% 55%)",
                    }} />
                    <div className="check-circle" style={{
                        width: "clamp(72px,14vw,108px)", height: "clamp(72px,14vw,108px)",
                        borderRadius: "50%",
                        background: "radial-gradient(circle at 35% 35%, hsl(140 80% 45%), hsl(160 70% 25%))",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "clamp(2rem,5vw,3.5rem)",
                    }}>
                        ✓
                    </div>
                </div>

                {/* ── 2. Headline ── */}
                <div style={{ textAlign: "center" }}>
                    <h1 style={{
                        fontSize: "clamp(2rem,5.5vw,3.8rem)",
                        fontWeight: 900,
                        color: "#fff",
                        margin: 0,
                        lineHeight: 1.1,
                    }}>
                        Registration
                    </h1>
                    <h1 className="shimmer-gold" style={{
                        fontSize: "clamp(2.2rem,6vw,4.2rem)",
                        fontWeight: 900,
                        margin: 0,
                        lineHeight: 1.1,
                    }}>
                        Successful! 🎉
                    </h1>
                    <p style={{
                        fontSize: "clamp(0.9rem,2vw,1.3rem)",
                        color: "rgba(255,255,255,0.65)",
                        margin: "0.8vh 0 0",
                    }}>
                        Thank you for registering with us!
                    </p>
                </div>

                {/* ── 3. Your details confirmation card ── */}
                <div style={{
                    width: "100%",
                    background: "rgba(255,255,255,0.05)",
                    border: "1.5px solid rgba(255,255,255,0.12)",
                    borderRadius: "1.2rem",
                    padding: "2vh 3vw",
                    boxSizing: "border-box",
                }}>
                    <p style={{
                        fontSize: "clamp(0.7rem,1.4vw,0.9rem)",
                        fontWeight: 800,
                        color: "hsl(190 100% 60%)",
                        textTransform: "uppercase",
                        letterSpacing: "0.12em",
                        margin: "0 0 1vh",
                    }}>
                        ✅ Your Registered Details
                    </p>
                    {[
                        { icon: "👤", label: "Name", value: user.name },
                        { icon: "🏠", label: "Address", value: user.address },
                        { icon: "💼", label: "Profession", value: user.profession },
                        { icon: "📱", label: "Phone", value: user.phone },
                    ].map(({ icon, label, value }, idx) => (
                        <div key={label} className="info-row" style={{ animationDelay: `${idx * 0.1}s` }}>
                            <span style={{ fontSize: "clamp(1rem,2vw,1.3rem)", flexShrink: 0 }}>{icon}</span>
                            <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                                <span style={{
                                    fontSize: "clamp(0.65rem,1.2vw,0.8rem)",
                                    color: "rgba(255,255,255,0.4)",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.08em",
                                    fontWeight: 700,
                                }}>{label}</span>
                                <span style={{
                                    fontSize: "clamp(0.9rem,1.8vw,1.15rem)",
                                    color: "#fff",
                                    fontWeight: 600,
                                    wordBreak: "break-word",
                                }}>{value}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── 4. SMS success notice ── */}
                <div style={{
                    width: "100%",
                    background: "linear-gradient(135deg, hsla(140,80%,40%,0.2), hsla(160,70%,30%,0.15))",
                    border: "1.5px solid hsla(140,80%,55%,0.35)",
                    borderRadius: "1rem",
                    padding: "1.8vh 3vw",
                    textAlign: "center",
                    boxSizing: "border-box",
                }}>
                    <p style={{ fontSize: "clamp(1rem,2.2vw,1.4rem)", fontWeight: 700, color: "hsl(140 80% 65%)", margin: 0 }}>
                        📩 A confirmation message has been sent to you via SMS
                    </p>
                    <p style={{ fontSize: "clamp(0.8rem,1.6vw,1rem)", color: "rgba(255,255,255,0.55)", margin: "0.4vh 0 0" }}>
                        Our team will get in touch with you shortly
                    </p>
                </div>

                {/* ── 5. Company info & contact ── */}
                <div style={{
                    width: "100%",
                    background: "rgba(255,255,255,0.04)",
                    border: "1.5px solid rgba(255,255,255,0.1)",
                    borderRadius: "1.2rem",
                    padding: "2vh 3vw",
                    boxSizing: "border-box",
                }}>
                    {/* Header row with logo */}
                    <div style={{ display: "flex", alignItems: "center", gap: "2vw", marginBottom: "1.5vh" }}>
                        <img
                            src={logo}
                            alt="National"
                            style={{
                                width: "clamp(44px,9vw,68px)",
                                height: "clamp(44px,9vw,68px)",
                                objectFit: "contain",
                                borderRadius: "0.6rem",
                                background: "rgba(255,255,255,0.92)",
                                padding: "0.3rem",
                                flexShrink: 0,
                            }}
                        />
                        <div>
                            <p style={{ fontSize: "clamp(0.9rem,2vw,1.25rem)", fontWeight: 900, color: "#fff", margin: 0 }}>
                                Central Industries PLC
                            </p>
                            <p style={{ fontSize: "clamp(0.7rem,1.3vw,0.85rem)", color: "hsl(190 100% 60%)", margin: 0, fontWeight: 600 }}>
                                National Pipes &amp; Fittings — Since 1985
                            </p>
                        </div>
                    </div>

                    {/* Contact grid */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1vh 2vw" }}>

                        <a className="contact-card" href="tel:+94112345678">
                            <span style={{ fontSize: "clamp(1.1rem,2.2vw,1.5rem)" }}>📞</span>
                            <div>
                                <p style={{ fontSize: "clamp(0.6rem,1.1vw,0.75rem)", color: "rgba(255,255,255,0.4)", margin: 0, textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 700 }}>Call Us</p>
                                <p style={{ fontSize: "clamp(0.8rem,1.6vw,1rem)", color: "#fff", margin: 0, fontWeight: 700 }}>+94 11 234 5678</p>
                            </div>
                        </a>

                        <a className="contact-card" href="https://nationalpvc.com/" target="_blank" rel="noreferrer">
                            <span style={{ fontSize: "clamp(1.1rem,2.2vw,1.5rem)" }}>🌐</span>
                            <div>
                                <p style={{ fontSize: "clamp(0.6rem,1.1vw,0.75rem)", color: "rgba(255,255,255,0.4)", margin: 0, textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 700 }}>Website</p>
                                <p style={{ fontSize: "clamp(0.8rem,1.6vw,1rem)", color: "hsl(190 100% 65%)", margin: 0, fontWeight: 700 }}>nationalpvc.com</p>
                            </div>
                        </a>

                        <div className="contact-card">
                            <span style={{ fontSize: "clamp(1.1rem,2.2vw,1.5rem)" }}>🕐</span>
                            <div>
                                <p style={{ fontSize: "clamp(0.6rem,1.1vw,0.75rem)", color: "rgba(255,255,255,0.4)", margin: 0, textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 700 }}>Working Hours</p>
                                <p style={{ fontSize: "clamp(0.75rem,1.4vw,0.9rem)", color: "#fff", margin: 0, fontWeight: 600 }}>Mon–Fri: 8am–5pm</p>
                                <p style={{ fontSize: "clamp(0.7rem,1.3vw,0.85rem)", color: "rgba(255,255,255,0.5)", margin: 0 }}>Sat: 8am–1pm</p>
                            </div>
                        </div>

                        <div className="contact-card">
                            <span style={{ fontSize: "clamp(1.1rem,2.2vw,1.5rem)" }}>📍</span>
                            <div>
                                <p style={{ fontSize: "clamp(0.6rem,1.1vw,0.75rem)", color: "rgba(255,255,255,0.4)", margin: 0, textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 700 }}>Head Office</p>
                                <p style={{ fontSize: "clamp(0.75rem,1.4vw,0.9rem)", color: "#fff", margin: 0, fontWeight: 600 }}>No: 312 B470</p>
                                <p style={{ fontSize: "clamp(0.7rem,1.3vw,0.85rem)", color: "rgba(255,255,255,0.5)", margin: 0 }}>Sri Jayawardenepura Kotte</p>
                            </div>
                        </div>

                    </div>

                    {/* Website nudge */}
                    <div style={{
                        marginTop: "1.5vh",
                        padding: "1.2vh 2vw",
                        background: "hsla(190,100%,55%,0.1)",
                        border: "1px solid hsla(190,100%,60%,0.25)",
                        borderRadius: "0.8rem",
                        textAlign: "center",
                    }}>
                        <p style={{ fontSize: "clamp(0.8rem,1.6vw,1rem)", color: "hsl(190 100% 70%)", margin: 0, fontWeight: 700 }}>
                            🛍️ Browse our full product catalogue at{" "}
                            <span style={{ textDecoration: "underline" }}>nationalpvc.com</span>
                        </p>
                        <p style={{ fontSize: "clamp(0.7rem,1.3vw,0.82rem)", color: "rgba(255,255,255,0.4)", margin: "0.3vh 0 0" }}>
                            Pipes • Fittings • Valves • Water Tanks • More
                        </p>
                    </div>
                </div>

                {/* ── 6. Countdown ── */}
                <div style={{ textAlign: "center", width: "100%" }}>
                    <p style={{
                        fontSize: "clamp(0.85rem,1.7vw,1.1rem)",
                        color: "rgba(255,255,255,0.5)",
                        margin: "0 0 0.8vh",
                    }}>
                        Returning to home in{" "}
                        <span style={{ color: "hsl(190 100% 60%)", fontWeight: 900, fontSize: "clamp(1.2rem,2.5vw,1.7rem)" }}>
                            {countdown}
                        </span>{" "}
                        seconds
                    </p>
                    <div style={{
                        width: "100%", height: "8px",
                        background: "rgba(255,255,255,0.08)",
                        borderRadius: "4px", overflow: "hidden",
                    }}>
                        <div style={{
                            height: "100%",
                            width: `${progress}%`,
                            background: "linear-gradient(90deg, hsl(190 100% 55%), hsl(140 80% 55%))",
                            borderRadius: "4px",
                            transition: "width 1s linear",
                        }} />
                    </div>
                    <button
                        onClick={() => navigate("/")}
                        style={{
                            marginTop: "1.5vh",
                            padding: "1.2vh 6vw",
                            fontSize: "clamp(0.9rem,1.8vw,1.15rem)",
                            fontWeight: 700,
                            border: "2px solid rgba(255,255,255,0.2)",
                            borderRadius: "0.8rem",
                            background: "transparent",
                            color: "rgba(255,255,255,0.6)",
                            cursor: "pointer",
                            transition: "all 0.2s",
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#fff"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
                    >
                        ← Return Home Now
                    </button>
                </div>

            </div>
        </div>
    );
};

export default Success;