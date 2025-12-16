// src/App.tsx
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Layout from "./components/layout/Layout";
import RequireAuth from "./components/RequireAuth";

import Home from "./views/Home";
import Popular from "./views/Popular";
import Search from "./views/Search";
import Wishlist from "./views/Wishlist";
import SignIn from "./views/SignIn";

function App() {
    return (
        <>
            <ToastContainer position="top-center" autoClose={1800} />

            {/* ✅ Router는 main.tsx에만 두고, 여기서는 Routes만 사용 */}
            <Routes>
                <Route path="/signin" element={<SignIn />} />

                <Route element={<RequireAuth />}>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Home />} />
                        <Route path="popular" element={<Popular />} />
                        <Route path="search" element={<Search />} />
                        <Route path="wishlist" element={<Wishlist />} />
                    </Route>
                </Route>
            </Routes>
        </>
    );
}

export default App;
