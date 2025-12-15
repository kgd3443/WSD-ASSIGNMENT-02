// src/views/SignIn.tsx
import type { FormEvent } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
    getRememberedEmail,
    isValidEmail,
    login,
    pingTmdb,
    register,
    saveSession,
} from "../utils/auth";
import "../styles/signin.css";

type Mode = "login" | "signup";

const TRANSITION_MS = 650;

const SignIn = () => {
    const [mode, setMode] = useState<Mode>("login");
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [shake, setShake] = useState(false);

    const [email, setEmail] = useState(() => getRememberedEmail());
    const [pw, setPw] = useState("");

    // signup only
    const [pw2, setPw2] = useState("");
    const [agree, setAgree] = useState(false);

    // login only
    const [remember, setRemember] = useState(() => !!getRememberedEmail());

    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    const switchMode = (next: Mode) => {
        if (isTransitioning) return;

        setIsTransitioning(true);
        setMode(next);

        setError(null);
        setPw("");
        setPw2("");
        setAgree(false);

        window.setTimeout(() => setIsTransitioning(false), TRANSITION_MS);
    };

    const successMsg = (msg: string) => {
        toast.success(msg);
        alert(msg); // 기본 점수용
    };

    const failMsg = (msg: string) => {
        toast.error(msg);
        setError(msg);

        // 카드 흔들림 디테일
        setShake(true);
        window.setTimeout(() => setShake(false), 420);
    };

    const validateCommon = (): boolean => {
        if (!email.trim() || !pw.trim()) {
            failMsg("아이디와 비밀번호를 입력해주세요.");
            return false;
        }
        if (!isValidEmail(email.trim())) {
            failMsg("아이디는 이메일 형식이어야 합니다.");
            return false;
        }
        return true;
    };

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!validateCommon()) return;

        if (mode === "login") {
            const res = login(email.trim(), pw);
            if (!res.ok) return failMsg(res.message);

            // ✅ TMDB API 키로 실제 API 호출 (요구사항)
            await pingTmdb();

            saveSession(email.trim(), remember);

            successMsg("로그인 성공! 메인 페이지로 이동합니다.");
            navigate("/", { replace: true });
            return;
        }

        // signup
        if (pw.length < 4) return failMsg("비밀번호는 4자 이상으로 설정해주세요.");
        if (pw !== pw2) return failMsg("비밀번호 확인이 일치하지 않습니다.");
        if (!agree) return failMsg("회원가입을 위해 필수 약관에 동의해야 합니다.");

        const res = register(email.trim(), pw);
        if (!res.ok) return failMsg(res.message);

        await pingTmdb();

        successMsg("회원가입 성공! 로그인 화면으로 이동합니다.");
        switchMode("login"); // ✅ 회원가입 성공 시 로그인 창이 보이게
    };

    const flipped = mode === "signup";

    return (
        <section className="signin-page">
            <div className="signin-shell">
                <div className="signin-toggle">
                    <button
                        type="button"
                        className={mode === "login" ? "active" : ""}
                        onClick={() => switchMode("login")}
                        disabled={isTransitioning}
                    >
                        로그인
                    </button>
                    <button
                        type="button"
                        className={mode === "signup" ? "active" : ""}
                        onClick={() => switchMode("signup")}
                        disabled={isTransitioning}
                    >
                        회원가입
                    </button>
                    <span className={`signin-toggle__highlight ${mode}`} />
                </div>

                <div className="signin-scene">
                    <div
                        className={[
                            "signin-card3d",
                            flipped ? "flipped" : "",
                            isTransitioning ? "transitioning" : "",
                            shake ? "shake" : "",
                        ].join(" ")}
                    >
                        {/* FRONT: LOGIN */}
                        <form
                            className={`signin-face signin-front ${isTransitioning ? "locked" : ""}`}
                            onSubmit={onSubmit}
                        >
                            <h1>로그인</h1>

                            <label>
                                아이디(이메일)
                                <input
                                    type="email"
                                    value={email}
                                    placeholder="your@email.com"
                                    onChange={(ev) => setEmail(ev.target.value)}
                                />
                            </label>

                            <label>
                                비밀번호
                                <input
                                    type="password"
                                    value={pw}
                                    placeholder="비밀번호"
                                    onChange={(ev) => setPw(ev.target.value)}
                                />
                            </label>

                            <div className="signin-row">
                                <label className="signin-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={remember}
                                        onChange={(ev) => setRemember(ev.target.checked)}
                                    />
                                    <span>Remember me (아이디 저장/자동 로그인)</span>
                                </label>
                            </div>

                            {error && mode === "login" && <p className="signin-error">{error}</p>}

                            <button type="submit" className="signin-submit">
                                로그인
                            </button>

                            <button
                                type="button"
                                className="signin-ghost"
                                onClick={() => switchMode("signup")}
                                disabled={isTransitioning}
                            >
                                아직 계정이 없나요? 회원가입 →
                            </button>
                        </form>

                        {/* BACK: SIGNUP */}
                        <form
                            className={`signin-face signin-back ${isTransitioning ? "locked" : ""}`}
                            onSubmit={onSubmit}
                        >
                            <h1>회원가입</h1>

                            <label>
                                아이디(이메일)
                                <input
                                    type="email"
                                    value={email}
                                    placeholder="your@email.com"
                                    onChange={(ev) => setEmail(ev.target.value)}
                                />
                            </label>

                            <label>
                                비밀번호
                                <input
                                    type="password"
                                    value={pw}
                                    placeholder="비밀번호"
                                    onChange={(ev) => setPw(ev.target.value)}
                                />
                            </label>

                            <label>
                                비밀번호 확인
                                <input
                                    type="password"
                                    value={pw2}
                                    placeholder="비밀번호 확인"
                                    onChange={(ev) => setPw2(ev.target.value)}
                                />
                            </label>

                            <div className="signin-row">
                                <label className="signin-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={agree}
                                        onChange={(ev) => setAgree(ev.target.checked)}
                                    />
                                    <span>필수 약관 동의</span>
                                </label>
                            </div>

                            {error && mode === "signup" && <p className="signin-error">{error}</p>}

                            <button type="submit" className="signin-submit">
                                회원가입
                            </button>

                            <button
                                type="button"
                                className="signin-ghost"
                                onClick={() => switchMode("login")}
                                disabled={isTransitioning}
                            >
                                ← 이미 계정이 있나요? 로그인
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SignIn;
