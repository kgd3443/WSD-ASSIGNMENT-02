// src/components/layout/Header.tsx
import { NavLink } from "react-router-dom";
import "./Header.css";

const Header = () => {
    return (
        <header className="app-header">
            <div className="logo">
                <NavLink to="/">MyMovie</NavLink>
            </div>

            <nav className="nav-links">
                <NavLink to="/" end>
                    Home
                </NavLink>
                <NavLink to="/popular">
                    Popular
                </NavLink>
                <NavLink to="/search">
                    Search
                </NavLink>
                <NavLink to="/wishlist">
                    Wishlist
                </NavLink>
                <NavLink to="/signin" className="nav-auth">
                    Sign In
                </NavLink>
            </nav>
        </header>
    );
};

export default Header;
