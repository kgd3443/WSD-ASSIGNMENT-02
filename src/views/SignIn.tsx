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

const SignIn = () => {
    const [mode, setMode] = useState<Mode>("login");

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
        setMode(next);
        setError(null);
        setPw("");
        setPw2("");
        setAgree(false);
    };

    const successMsg = (msg: string) => {
        toast.success(msg);
        alert(msg);
    };

    const failMsg = (msg: string) => {
        toast.error(msg);
        setError(msg);
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
        switchMode("login");
    };

    const isFlipped = mode === "signup";

    return (
        <section className="signin-page">
            <div className="signin-shell">
                {/* 상단 탭 */}
                <div className="signin-toggle">
                    <button
                        type="button"
                        className={mode === "login" ? "active" : ""}
                        onClick={() => switchMode("login")}
                    >
                        로그인
                    </button>
                    <button
                        type="button"
                        className={mode === "signup" ? "active" : ""}
                        onClick={() => switchMode("signup")}
                    >
                        회원가입
                    </button>
                    <span className={`signin-toggle__highlight ${mode}`} />
                </div>

                {/* 3D 카드 */}
                <div className="signin-scene">
                    <div className={`signin-card3d ${isFlipped ? "flipped" : ""}`}>
                        {/* FRONT: LOGIN */}
                        <form className="signin-face signin-front" onSubmit={onSubmit}>
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
                            >
                                아직 계정이 없나요? 회원가입 →
                            </button>
                        </form>

                        {/* BACK: SIGNUP */}
                        <form className="signin-face signin-back" onSubmit={onSubmit}>
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
