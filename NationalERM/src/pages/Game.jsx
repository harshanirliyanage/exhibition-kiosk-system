import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";


import horseImg from "../game/horse.jpg";
import kryptonImg from "../game/krypton.jpg";
import oneSwitchImg from "../game/one switch.jpg";
import pvcBlueImg from "../game/pvc blue.jpg";
import pvcImg from "../game/pvc.jpg";
import solventImg from "../game/solvent.jpg";
import switch2Img from "../game/switch2.jpg";
import tanksImg from "../game/tanks.jpg";
const PRODUCTS = [
    { id: "horse", img: horseImg },
    { id: "krypton", img: kryptonImg },
    { id: "switch1", img: oneSwitchImg },
    { id: "pvcblue", img: pvcBlueImg },
    { id: "pvc", img: pvcImg },
    { id: "solvent", img: solventImg },
    { id: "switch2", img: switch2Img },
    { id: "tanks", img: tanksImg },
];

const CARD_COLORS = [
    "#1e3a8a", "#166534", "#6b21a8", "#9a3412",
    "#9d174d", "#155e75", "#854d0e", "#065f46",
    "#1e3a8a", "#166534", "#6b21a8", "#9a3412",
    "#9d174d", "#155e75", "#854d0e", "#065f46",
];

const PEEK_MS = 1100;
const GAME_SEC = 80;
const TOTAL_PAIRS = 8;

const shuffle = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
};

const beep = (type) => {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const p = (freq, dur, wave = "sine", vol = 0.2, t0 = 0) => {
            const o = ctx.createOscillator(), g = ctx.createGain();
            o.connect(g); g.connect(ctx.destination);
            o.type = wave; o.frequency.value = freq;
            g.gain.setValueAtTime(vol, ctx.currentTime + t0);
            g.gain.linearRampToValueAtTime(0, ctx.currentTime + t0 + dur);
            o.start(ctx.currentTime + t0);
            o.stop(ctx.currentTime + t0 + dur + 0.02);
        };
        if (type === "peek") p(540, 0.1);
        if (type === "hide") p(260, 0.13, "sine", 0.14);
        if (type === "match") { p(600, 0.14); p(900, 0.2, "sine", 0.22, 0.12); p(1200, 0.18, "sine", 0.18, 0.26); }
        if (type === "miss") p(160, 0.2, "sawtooth", 0.16);
        if (type === "tick") p(820, 0.07, "square", 0.12);
        if (type === "start") { [300, 500, 750].forEach((f, i) => p(f, 0.18, "sine", 0.22, i * 0.09)); }
        if (type === "over") { [500, 380, 250].forEach((f, i) => p(f, 0.25, "sine", 0.22, i * 0.12)); }
        if (type === "win") {
            [400, 600, 800, 1000, 1300, 1600].forEach((f, i) =>
                p(f, 0.22, "sine", 0.18, i * 0.07)
            );
        }
    } catch (e) { }
};

// ── Confetti canvas ──────────────────────────────────────────────────────────
const ConfettiCanvas = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const COLORS = [
            "#fbbf24", "#22d3ee", "#4ade80", "#f87171",
            "#a78bfa", "#fb923c", "#f472b6", "#34d399",
        ];

        const pieces = Array.from({ length: 160 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * -canvas.height,
            w: 8 + Math.random() * 10,
            h: 5 + Math.random() * 6,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            rot: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.14,
            vx: (Math.random() - 0.5) * 2.5,
            vy: 2.5 + Math.random() * 3.5,
            opacity: 0.85 + Math.random() * 0.15,
        }));

        let raf;
        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            pieces.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.rot += p.rotSpeed;
                if (p.y > canvas.height + 20) {
                    p.y = -20;
                    p.x = Math.random() * canvas.width;
                }
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rot);
                ctx.globalAlpha = p.opacity;
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
                ctx.restore();
            });
            raf = requestAnimationFrame(draw);
        };
        draw();

        const onResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener("resize", onResize);
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("resize", onResize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: "fixed", inset: 0, zIndex: 49,
                pointerEvents: "none",
            }}
        />
    );
};

const Bubbles = () => {
    const list = Array.from({ length: 22 }, (_, i) => ({
        id: i,
        size: 5 + Math.random() * 12,
        left: Math.random() * 100,
        delay: Math.random() * 12,
        dur: 7 + Math.random() * 10,
        op: 0.06 + Math.random() * 0.14,
    }));
    return (
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
            {list.map(b => (
                <div key={b.id} style={{
                    position: "absolute", bottom: "-25px", left: `${b.left}%`,
                    width: b.size, height: b.size, borderRadius: "50%",
                    background: "rgba(255,255,255,0.75)", opacity: b.op,
                    animation: `bubbleRise ${b.dur}s ${b.delay}s ease-in infinite`,
                }} />
            ))}
        </div>
    );
};

export default function Game() {
    const navigate = useNavigate();

    const [cards, setCards] = useState([]);
    const [phase, setPhase] = useState("idle");
    const [flipped, setFlipped] = useState([]);
    const [matched, setMatched] = useState([]);
    const [locked, setLocked] = useState(false);
    const [moves, setMoves] = useState(0);
    const [timeLeft, setTimeLeft] = useState(GAME_SEC);

    const initGame = useCallback(() => {
        setCards(shuffle([...PRODUCTS, ...PRODUCTS].map((p, i) => ({ uid: i, ...p }))));
        setPhase("idle");
        setFlipped([]);
        setMatched([]);
        setLocked(false);
        setMoves(0);
        setTimeLeft(GAME_SEC);
    }, []);

    useEffect(() => { initGame(); }, [initGame]);

    useEffect(() => {
        if (phase !== "play") return;
        if (timeLeft <= 0) {
            beep("over");
            setPhase("over");
            setLocked(true);
            return;
        }
        if (timeLeft <= 5) beep("tick");
        const t = setInterval(() => setTimeLeft(p => p - 1), 1000);
        return () => clearInterval(t);
    }, [phase, timeLeft]);

    // ── Check for win ──────────────────────────────────────────────────────
    useEffect(() => {
        if (phase === "play" && matched.length === TOTAL_PAIRS * 2) {
            // tiny delay so the last match animation finishes
            setTimeout(() => {
                beep("win");
                setPhase("win");
                setLocked(true);
            }, 500);
        }
    }, [matched, phase]);

    const handleStart = () => { beep("start"); setPhase("play"); };

    const handleFlip = (idx) => {
        if (phase !== "play" || locked) return;
        if (matched.includes(idx) || flipped.includes(idx)) return;
        beep("peek");
        const next = [...flipped, idx];
        setFlipped(next);
        if (next.length === 2) {
            setMoves(m => m + 1);
            setLocked(true);
            const [a, b] = next;
            if (cards[a].id === cards[b].id) {
                beep("match");
                const nm = [...matched, a, b];
                setTimeout(() => { setMatched(nm); setFlipped([]); setLocked(false); }, 500);
            } else {
                beep("miss");
                setTimeout(() => { beep("hide"); setFlipped([]); setLocked(false); }, PEEK_MS);
            }
        }
    };

    const isFaceUp = (idx) => matched.includes(idx) || flipped.includes(idx);
    const timerPct = (timeLeft / GAME_SEC) * 100;
    const timerColor = timeLeft <= 5 ? "#ef4444"
        : timeLeft <= 10 ? "#fb923c"
            : timeLeft <= 15 ? "#facc15"
                : "#22d3ee";

    // time used = GAME_SEC - timeLeft
    const timeUsed = GAME_SEC - timeLeft;

    return (
        <>
            <style>{`
            @keyframes bubbleRise {
                0%   { transform:translateY(0) scale(1);      opacity:0; }
                8%   { opacity:1; }
                92%  { opacity:0.5; }
                100% { transform:translateY(-102vh) scale(0.25); opacity:0; }
            }
            @keyframes glowGold {
                0%,100% { box-shadow:0 0 40px hsla(45,100%,52%,0.55); }
                50%     { box-shadow:0 0 90px hsla(45,100%,52%,1);    }
            }
            @keyframes matchGlow {
                0%,100% { box-shadow:0 0 14px rgba(74,222,128,0.45); }
                50%     { box-shadow:0 0 36px rgba(74,222,128,1);    }
            }
            @keyframes matchBump {
                0%   { transform:rotateY(180deg) scale(1);    }
                40%  { transform:rotateY(180deg) scale(1.15); }
                70%  { transform:rotateY(180deg) scale(0.96); }
                100% { transform:rotateY(180deg) scale(1);    }
            }
            @keyframes timerPulse {
                0%,100% { transform:scale(1);    }
                50%     { transform:scale(1.25); }
            }
            @keyframes idleBob {
                0%,100% { transform:translateY(0);    }
                50%     { transform:translateY(-12px); }
            }
            @keyframes shimmer {
                0%   { background-position:-200% center; }
                100% { background-position: 200% center; }
            }
            @keyframes fadeUp {
                from { opacity:0; transform:translateY(32px); }
                to   { opacity:1; transform:translateY(0);    }
            }
            @keyframes urgentFlash {
                0%,100% { background:rgba(239,68,68,0.07);  border-color:rgba(239,68,68,0.3);  }
                50%     { background:rgba(239,68,68,0.22); border-color:rgba(239,68,68,0.7);  }
            }
            @keyframes overDrop {
                0%   { opacity:0; transform:translateY(-40px) scale(0.9); }
                60%  { transform:translateY(6px) scale(1.02); }
                100% { opacity:1; transform:translateY(0) scale(1); }
            }
            @keyframes winPop {
                0%   { opacity:0; transform:scale(0.7) translateY(30px); }
                60%  { transform:scale(1.06) translateY(-4px); }
                100% { opacity:1; transform:scale(1) translateY(0); }
            }
            @keyframes starSpin {
                0%   { transform:rotate(0deg) scale(1); }
                50%  { transform:rotate(18deg) scale(1.18); }
                100% { transform:rotate(0deg) scale(1); }
            }
            @keyframes glowGreen {
                0%,100% { box-shadow:0 0 40px hsla(142,76%,46%,0.55); }
                50%     { box-shadow:0 0 100px hsla(142,76%,46%,0.95); }
            }

            /* ── Card 3D flip ── */
            .mc-wrap {
                perspective:1000px;
                width: 19vw;
                height: 19vw;
                max-width: 200px;
                max-height: 200px;
            }
            .mc-inner {
                position:relative; width:100%; height:100%;
                transform-style:preserve-3d;
                transition:transform 0.46s cubic-bezier(.4,0,.2,1);
                border-radius: 1.2vw;
                will-change:transform;
            }
            .mc-wrap.face-up  .mc-inner { transform:rotateY(180deg); }
            .mc-wrap.matched  .mc-inner { animation:matchBump 0.42s ease-out forwards; }
            .mc-front, .mc-back {
                position:absolute; inset:0;
                border-radius: 1.2vw;
                backface-visibility:hidden;
                -webkit-backface-visibility:hidden;
                overflow:hidden;
            }
            .mc-front {
                display:flex; align-items:center; justify-content:center;
                border:2.5px solid rgba(255,255,255,0.18);
                box-shadow:0 6px 26px rgba(0,0,0,0.55);
                transition:filter 0.15s, transform 0.1s;
            }
            .mc-front:hover  { filter:brightness(1.14); }
            .mc-front:active { transform:scale(0.93); }
            .mc-back {
                transform:rotateY(180deg);
                background:#fff;
                border:2.5px solid rgba(255,255,255,0.22);
                box-shadow:0 6px 26px rgba(0,0,0,0.45);
            }
            .mc-wrap.matched .mc-back {
                border:3px solid #4ade80;
                animation:matchGlow 1.5s ease-in-out infinite;
            }

            /* ── Buttons ── */
            .btn-start {
                border:none; cursor:pointer; font-weight:900;
                border-radius:1.6rem; letter-spacing:0.07em;
                text-transform:uppercase; transition:transform 0.1s;
                animation:glowGold 1.8s ease-in-out infinite;
            }
            .btn-start:active { transform:scale(0.92) !important; }
            .btn-end {
                border:none; cursor:pointer; font-weight:800;
                border-radius:1.2rem; letter-spacing:0.04em; transition:transform 0.1s;
            }
            .btn-end:active { transform:scale(0.92) !important; }

            /* ── Text effects ── */
            .shimmer {
                background:linear-gradient(90deg,#fff 0%,#fcd34d 35%,#fff 55%,#22d3ee 100%);
                background-size:200% auto;
                -webkit-background-clip:text; -webkit-text-fill-color:transparent;
                animation:shimmer 2.4s linear infinite;
            }
            .shimmer-green {
                background:linear-gradient(90deg,#4ade80 0%,#fcd34d 35%,#4ade80 55%,#22d3ee 100%);
                background-size:200% auto;
                -webkit-background-clip:text; -webkit-text-fill-color:transparent;
                animation:shimmer 2s linear infinite;
            }
            .idle-bob  { animation:idleBob 2.3s ease-in-out infinite; }
            .fade-up   { animation:fadeUp 0.45s ease-out both; }
            .over-drop { animation:overDrop 0.55s ease-out both; }
            .win-pop   { animation:winPop 0.6s cubic-bezier(.34,1.56,.64,1) both; }
            .star-spin { animation:starSpin 2.4s ease-in-out infinite; }
            .urgent    { animation:urgentFlash 0.45s ease-in-out infinite; border-radius:0.8rem; }
        `}</style>

            <div style={{
                position: "relative", width: "100vw", height: "100vh", overflow: "hidden",
                background: "linear-gradient(170deg,hsl(238 80% 22%) 0%,hsl(252 85% 11%) 55%,hsl(222 90% 16%) 100%)",
                display: "flex", flexDirection: "column", alignItems: "center",
            }}>
                <Bubbles />

                {/* ══════════ IDLE ══════════ */}
                {phase === "idle" && (
                    <div className="fade-up" style={{
                        position: "absolute", inset: 0, zIndex: 10,
                        display: "flex", flexDirection: "column",
                        alignItems: "center", justifyContent: "space-evenly",
                        padding: "6vh 8vw",
                    }}>


                        <div style={{ textAlign: "center" }}>
                            <h1 className="shimmer" style={{
                                fontSize: "clamp(3rem,9vw,6.5rem)",
                                fontWeight: 900, margin: 0, lineHeight: 1.05,
                            }}>🧠 Memory Match</h1>
                            <p style={{
                                fontSize: "clamp(1.1rem,3vw,2.2rem)",
                                color: "rgba(255,255,255,0.58)", margin: "1.5vh 0 0", fontWeight: 500,
                            }}>Flip cards · Find the matching pairs!</p>
                        </div>

                        <div style={{ display: "flex", gap: "2.5vw", justifyContent: "center" }}>
                            {[
                                { icon: "👆", title: "Tap", sub: "to peek at a card" },
                                { icon: "🧠", title: "Remember", sub: "where each product is" },
                                { icon: "✅", title: "Match", sub: "find the identical pair" },
                                { icon: "⚡", title: "Fast!", sub: "only 80 seconds!" },
                            ].map(({ icon, title, sub }) => (
                                <div key={title} style={{
                                    background: "rgba(255,255,255,0.07)",
                                    border: "1.5px solid rgba(255,255,255,0.13)",
                                    borderRadius: "1.4rem", padding: "2.5vh 2.5vw",
                                    textAlign: "center", flex: 1,
                                }}>
                                    <div style={{ fontSize: "clamp(2rem,4.5vw,3.5rem)" }}>{icon}</div>
                                    <div style={{ fontSize: "clamp(0.85rem,1.8vw,1.3rem)", fontWeight: 800, color: "#fff", marginTop: "0.7vh" }}>{title}</div>
                                    <div style={{ fontSize: "clamp(0.65rem,1.3vw,0.95rem)", color: "rgba(255,255,255,0.52)", marginTop: "0.3vh", lineHeight: 1.3 }}>{sub}</div>
                                </div>
                            ))}
                        </div>

                        <div style={{
                            background: "linear-gradient(135deg,rgba(239,68,68,0.18),rgba(251,191,36,0.15))",
                            border: "1.5px solid rgba(239,68,68,0.4)",
                            borderRadius: "1.2rem", padding: "1.8vh 5vw", textAlign: "center",
                        }}>
                            <p style={{ margin: 0, fontSize: "clamp(1rem,2.4vw,1.8rem)", fontWeight: 800, color: "#fca5a5", lineHeight: 1.4 }}>
                                ⚠️ You only have <span style={{ color: "#fbbf24", fontSize: "1.2em" }}>80 seconds</span> — match as many pairs as you can!
                            </p>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2vh" }}>
                            <button className="btn-start" onClick={handleStart} style={{
                                fontSize: "clamp(1.8rem,4.5vw,3.2rem)",
                                padding: "3vh 14vw",
                                background: "linear-gradient(135deg,hsl(45 100% 52%),hsl(30 100% 44%))",
                                color: "#1a1000",
                            }}>👆 TAP TO PLAY!</button>
                            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "clamp(0.8rem,1.6vw,1.1rem)", margin: 0 }}>
                                8 pairs · 16 cards · 80 seconds
                            </p>
                        </div>

                        <button className="btn-end" onClick={() => navigate("/")} style={{
                            fontSize: "clamp(0.85rem,1.7vw,1.15rem)", padding: "1.2vh 4vw",
                            background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.42)",
                            border: "1px solid rgba(255,255,255,0.13)",
                        }}>← Back to Home</button>
                    </div>
                )}

                {/* ══════════ PLAY ══════════ */}
                {phase === "play" && (
                    <div style={{
                        position: "relative", zIndex: 5,
                        width: "100%", height: "100%",
                        display: "flex", flexDirection: "column", alignItems: "center",
                        padding: "2.2vh 4vw 1.5vh",
                        boxSizing: "border-box",
                    }}>
                        {/* Top bar */}
                        <div style={{
                            display: "flex", alignItems: "center", justifyContent: "space-between",
                            width: "100%", maxWidth: "700px", marginBottom: "1.8vh",
                        }}>

                            <div style={{ textAlign: "center" }}>
                                <h1 style={{ fontSize: "clamp(1.4rem,3.5vw,2.5rem)", fontWeight: 900, color: "#fff", margin: 0, lineHeight: 1.1 }}>
                                    🧠 Memory <span style={{ color: "#22d3ee" }}>Match!</span>
                                </h1>
                                <p style={{ fontSize: "clamp(0.62rem,1.25vw,0.88rem)", color: "rgba(255,255,255,0.4)", margin: "0.15rem 0 0" }}>
                                    Tap · Peek · Match before time runs out!
                                </p>
                            </div>
                            <div style={{ position: "relative", width: "clamp(62px,11vw,85px)", height: "clamp(62px,11vw,85px)" }}>
                                <svg width="100%" height="100%" viewBox="0 0 68 68" style={{ transform: "rotate(-90deg)" }}>
                                    <circle cx="34" cy="34" r="29" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
                                    <circle cx="34" cy="34" r="29" fill="none"
                                        stroke={timerColor} strokeWidth="6"
                                        strokeDasharray={`${2 * Math.PI * 29}`}
                                        strokeDashoffset={`${2 * Math.PI * 29 * (1 - timerPct / 100)}`}
                                        strokeLinecap="round"
                                        style={{ transition: "stroke-dashoffset 1s linear, stroke 0.35s" }}
                                    />
                                </svg>
                                <div style={{
                                    position: "absolute", inset: 0,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: "clamp(1rem,2.2vw,1.5rem)", fontWeight: 900, color: timerColor,
                                    animation: timeLeft <= 5 ? "timerPulse 0.38s ease-in-out infinite" : "none",
                                }}>{timeLeft}</div>
                            </div>
                        </div>

                        {/* Urgency bar */}
                        {timeLeft <= 5 && (
                            <div className="urgent" style={{
                                width: "100%", maxWidth: "700px", marginBottom: "1.4vh",
                                padding: "0.8vh 0", textAlign: "center", border: "1.5px solid",
                            }}>
                                <span style={{ fontSize: "clamp(0.9rem,2vw,1.35rem)", fontWeight: 900, color: "#f87171" }}>
                                    ⚠️ HURRY! Only {timeLeft} second{timeLeft !== 1 ? "s" : ""} left!
                                </span>
                            </div>
                        )}

                        {/* Stats strip */}
                        <div style={{
                            display: "flex", gap: "6vw", marginBottom: "2vh",
                            background: "rgba(0,0,0,0.32)", borderRadius: "1rem",
                            padding: "1vh 6vw", backdropFilter: "blur(12px)",
                            border: "1px solid rgba(255,255,255,0.07)",
                        }}>
                            {[
                                { label: "Moves", val: moves, color: "#fbbf24" },
                                { label: "Matched", val: `${matched.length / 2}/8`, color: "#4ade80" },
                                { label: "Pairs left", val: 8 - matched.length / 2, color: "#a78bfa" },
                            ].map(({ label, val, color }) => (
                                <div key={label} style={{ textAlign: "center" }}>
                                    <div style={{ fontSize: "clamp(0.5rem,1vw,0.7rem)", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.1em" }}>{label}</div>
                                    <div style={{ fontSize: "clamp(1.2rem,2.8vw,2rem)", fontWeight: 900, color }}>{val}</div>
                                </div>
                            ))}
                        </div>

                        {/* ── CARD GRID — centred, fixed size, not stretched ── */}
                        <div style={{
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}>
                            <div style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(4, 18vw)",
                                gridTemplateRows: "repeat(4, 18vw)",
                                gap: "2vw",
                            }}>
                                {cards.map((card, idx) => {
                                    const faceUp = isFaceUp(idx);
                                    const isMatch = matched.includes(idx);
                                    const canTap = !locked && !isMatch && !flipped.includes(idx);
                                    return (
                                        <div
                                            key={card.uid}
                                            className={`mc-wrap ${faceUp ? "face-up" : ""} ${isMatch ? "matched" : ""}`}
                                            onClick={() => canTap && handleFlip(idx)}
                                            style={{
                                                cursor: canTap ? "pointer" : "default",
                                                width: "18vw",
                                                height: "18vw",
                                                maxWidth: "200px",
                                                maxHeight: "200px",
                                            }}
                                        >
                                            <div className="mc-inner">
                                                <div className="mc-front" style={{
                                                    background: `linear-gradient(148deg,${CARD_COLORS[idx]}f0,${CARD_COLORS[idx]}70)`,
                                                }}>
                                                    <span style={{
                                                        fontSize: "clamp(1.5rem,4vw,3rem)",
                                                        userSelect: "none",
                                                        filter: "drop-shadow(0 3px 8px rgba(0,0,0,0.7))",
                                                    }}>❓</span>
                                                </div>
                                                <div className="mc-back">
                                                    <img src={card.img} alt=""
                                                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                                                    />
                                                    {isMatch && (
                                                        <div style={{
                                                            position: "absolute", top: 6, right: 6,
                                                            background: "#22c55e", borderRadius: "50%",
                                                            width: "22%", height: "22%",
                                                            display: "flex", alignItems: "center", justifyContent: "center",
                                                            fontSize: "clamp(0.6rem,1.5vw,1rem)",
                                                            fontWeight: 900, color: "#fff",
                                                            boxShadow: "0 0 12px rgba(34,197,94,0.95)",
                                                        }}>✓</div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Home button */}
                        <button className="btn-end" onClick={() => navigate("/")} style={{
                            marginTop: "1.8vh",
                            fontSize: "clamp(0.72rem,1.3vw,0.92rem)", padding: "0.9vh 3vw",
                            background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.35)",
                            border: "1px solid rgba(255,255,255,0.1)",
                        }}>← Home</button>
                    </div>
                )}

                {/* ══════════ WIN 🎉 ══════════ */}
                {phase === "win" && (
                    <>
                        <ConfettiCanvas />
                        <div style={{
                            position: "absolute", inset: 0, zIndex: 50,
                            background: "rgba(0,0,0,0.82)", backdropFilter: "blur(14px)",
                            display: "flex", flexDirection: "column",
                            alignItems: "center", justifyContent: "space-evenly",
                            padding: "7vh 8vw",
                        }}>
                            <div className="win-pop" style={{
                                background: "linear-gradient(145deg,hsl(155 60% 10%),hsl(210 72% 14%))",
                                border: "3px solid #4ade80",
                                borderRadius: "2.6rem", padding: "5vh 8vw", textAlign: "center",
                                boxShadow: "0 0 120px rgba(74,222,128,0.5), 0 0 40px rgba(0,0,0,0.6)",
                                width: "100%", maxWidth: "680px",
                                animation: "winPop 0.6s cubic-bezier(.34,1.56,.64,1) both, glowGreen 2.2s ease-in-out 0.6s infinite",
                            }}>
                                <div className="star-spin" style={{ fontSize: "clamp(4rem,11vw,7rem)", lineHeight: 1, marginBottom: "1.5vh" }}>🏆</div>

                                <h2 className="shimmer-green" style={{
                                    fontSize: "clamp(2.5rem,8vw,5.5rem)", fontWeight: 900, margin: 0, lineHeight: 1.05,
                                }}>You Did It!</h2>

                                <p style={{
                                    fontSize: "clamp(1rem,2.4vw,1.7rem)", color: "rgba(255,255,255,0.65)",
                                    margin: "1vh 0 2.5vh", fontWeight: 600,
                                }}>All 8 pairs matched! 🎉 Amazing memory!</p>

                                <div style={{
                                    display: "flex", justifyContent: "center", gap: "6vw",
                                    margin: "0 0 3vh", flexWrap: "wrap",
                                }}>
                                    {[
                                        { label: "Pairs Matched", val: "8", suffix: "/8", color: "#4ade80" },
                                        { label: "Total Moves", val: moves, suffix: "", color: "#fbbf24" },
                                        { label: "Time Used", val: timeUsed, suffix: "s", color: "#22d3ee" },
                                    ].map(({ label, val, color, suffix }) => (
                                        <div key={label} style={{ textAlign: "center" }}>
                                            <div style={{ fontSize: "clamp(2.2rem,6vw,4.5rem)", fontWeight: 900, color, lineHeight: 1 }}>
                                                {val}<span style={{ fontSize: "0.55em", color: "rgba(255,255,255,0.4)" }}>{suffix}</span>
                                            </div>
                                            <div style={{ fontSize: "clamp(0.7rem,1.4vw,1rem)", color: "rgba(255,255,255,0.42)", marginTop: "0.4vh", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</div>
                                        </div>
                                    ))}
                                </div>

                                <div style={{
                                    background: "rgba(251,191,36,0.12)",
                                    border: "1.5px solid rgba(251,191,36,0.35)",
                                    borderRadius: "1.2rem", padding: "2vh 3vw",
                                }}>
                                    <p style={{ margin: 0, fontSize: "clamp(1rem,2.4vw,1.8rem)", color: "#fbbf24", fontWeight: 800, lineHeight: 1.4 }}>
                                        🏷️ Register now &amp; claim your<br />
                                        <span style={{ fontSize: "1.22em", color: "#fcd34d" }}>exclusive 35% discount!</span>
                                    </p>
                                </div>
                            </div>

                            <div style={{ display: "flex", gap: "4vw", justifyContent: "center", flexWrap: "wrap" }}>
                                <button className="btn-end" onClick={() => navigate("/register")} style={{
                                    fontSize: "clamp(1.3rem,3vw,2.2rem)",
                                    padding: "3vh 8vw",
                                    background: "linear-gradient(135deg,hsl(45 100% 52%),hsl(30 100% 44%))",
                                    color: "#1a1000",
                                    animation: "glowGold 2s ease-in-out infinite",
                                }}>✍️ Register Now</button>
                                <button className="btn-end" onClick={initGame} style={{
                                    fontSize: "clamp(1.3rem,3vw,2.2rem)",
                                    padding: "3vh 8vw",
                                    background: "rgba(74,222,128,0.12)", color: "#4ade80",
                                    border: "2px solid rgba(74,222,128,0.4)",
                                }}>🔄 Play Again</button>
                                <button className="btn-end" onClick={() => navigate("/")} style={{
                                    fontSize: "clamp(1.3rem,3vw,2.2rem)",
                                    padding: "3vh 8vw",
                                    background: "rgba(255,255,255,0.09)", color: "#fff",
                                    border: "2px solid rgba(255,255,255,0.28)",
                                }}>🏠 Home</button>
                            </div>
                        </div>
                    </>
                )}

                {/* ══════════ TIME OVER ══════════ */}
                {phase === "over" && (
                    <div style={{
                        position: "absolute", inset: 0, zIndex: 50,
                        background: "rgba(0,0,0,0.88)", backdropFilter: "blur(14px)",
                        display: "flex", flexDirection: "column",
                        alignItems: "center", justifyContent: "space-evenly",
                        padding: "7vh 8vw",
                    }}>
                        <div className="over-drop" style={{
                            background: "linear-gradient(145deg,hsl(222 65% 13%),hsl(240 72% 19%))",
                            border: "3px solid #ef4444",
                            borderRadius: "2.6rem", padding: "6vh 10vw", textAlign: "center",
                            boxShadow: "0 0 120px rgba(239,68,68,0.55), 0 0 40px rgba(0,0,0,0.6)",
                            width: "100%", maxWidth: "680px",
                        }}>
                            <div style={{ fontSize: "clamp(4rem,11vw,7rem)", lineHeight: 1, marginBottom: "2vh" }}>⏰</div>
                            <h2 style={{
                                fontSize: "clamp(2.5rem,8vw,5.5rem)", fontWeight: 900, color: "#f87171", margin: 0, lineHeight: 1.05,
                            }}>Time's Up!</h2>
                            <div style={{
                                display: "flex", justifyContent: "center", gap: "6vw",
                                margin: "3vh 0", flexWrap: "wrap",
                            }}>
                                {[
                                    { label: "Pairs Matched", val: matched.length / 2, color: "#4ade80", suffix: "/8" },
                                    { label: "Total Moves", val: moves, color: "#fbbf24", suffix: "" },
                                ].map(({ label, val, color, suffix }) => (
                                    <div key={label} style={{ textAlign: "center" }}>
                                        <div style={{ fontSize: "clamp(2.5rem,7vw,5rem)", fontWeight: 900, color, lineHeight: 1 }}>
                                            {val}<span style={{ fontSize: "0.55em", color: "rgba(255,255,255,0.4)" }}>{suffix}</span>
                                        </div>
                                        <div style={{ fontSize: "clamp(0.75rem,1.6vw,1.1rem)", color: "rgba(255,255,255,0.45)", marginTop: "0.4vh", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</div>
                                    </div>
                                ))}
                            </div>
                            <div style={{
                                background: "rgba(251,191,36,0.12)",
                                border: "1.5px solid rgba(251,191,36,0.35)",
                                borderRadius: "1.2rem", padding: "2vh 3vw",
                            }}>
                                <p style={{ margin: 0, fontSize: "clamp(1.1rem,2.6vw,1.9rem)", color: "#fbbf24", fontWeight: 800, lineHeight: 1.4 }}>
                                    🏷️ Register now &amp; claim your<br />
                                    <span style={{ fontSize: "1.22em", color: "#fcd34d" }}>exclusive 35% discount!</span>
                                </p>
                            </div>
                        </div>

                        <div style={{ display: "flex", gap: "4vw", justifyContent: "center", flexWrap: "wrap" }}>
                            <button className="btn-end" onClick={() => navigate("/register")} style={{
                                fontSize: "clamp(1.3rem,3vw,2.2rem)",
                                padding: "3vh 8vw",
                                background: "linear-gradient(135deg,hsl(45 100% 52%),hsl(30 100% 44%))",
                                color: "#1a1000",
                                animation: "glowGold 2s ease-in-out infinite",
                            }}>✍️ Register Now</button>
                            <button className="btn-end" onClick={() => navigate("/")} style={{
                                fontSize: "clamp(1.3rem,3vw,2.2rem)",
                                padding: "3vh 8vw",
                                background: "rgba(255,255,255,0.09)", color: "#fff",
                                border: "2px solid rgba(255,255,255,0.28)",
                            }}>🏠 Home</button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}