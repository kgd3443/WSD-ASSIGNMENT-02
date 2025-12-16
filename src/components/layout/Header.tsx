// src/components/layout/Header.tsx
import { NavLink, useNavigate } from "react-router-dom";
import { getSession, logout } from "../../utils/auth";
import "./Header.css";

const Header = () => {
    const navigate = useNavigate();
    const session = getSession(); // null이면 미로그인

    const onLogout = () => {
        logout();
        navigate("/signin", { replace: true });
    };

    return (
        <header className="app-header">
            <div className="app-header__inner">
                {/* 왼쪽 상단 제목 */}
                <NavLink to="/" className="app-header__brand">
                    🎬
                </NavLink>

                {/* 오른쪽 메뉴 */}
                <nav className="app-header__nav">
                    <NavLink to="/" end className="app-header__link">
                        홈
                    </NavLink>
                    <NavLink to="/popular" className="app-header__link">
                        요즘 뜨는 영화
                    </NavLink>
                    <NavLink to="/search" className="app-header__link">
                        검색
                    </NavLink>
                    <NavLink to="/wishlist" className="app-header__link">
                        내가 찜한 영화
                    </NavLink>

                    {/* 로그인 상태: 이메일 + 로그아웃 / 미로그인: 로그인 링크 */}
                    {session ? (
                        <div className="app-header__auth">
                            <span className="app-header__user">{session.email}</span>
                            <button
                                type="button"
                                className="app-header__logout"
                                onClick={onLogout}
                            >
                                로그아웃
                            </button>
                        </div>
                    ) : (
                        <NavLink to="/signin" className="app-header__link">
                            로그인
                        </NavLink>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;
