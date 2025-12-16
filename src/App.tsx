// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Layout from "./components/layout/Layout";
import RequireAuth from "./components/RequireAuth";

import Home from "./views/Home";
import Popular from "./views/Popular";
import Search from "./views/Search";
import Wishlist from "./views/Wishlist";
import SignIn from "./views/SignIn";

const basename = import.meta.env.BASE_URL; // ex) "/WSD-ASSIGNMENT-02/"

function App() {
    return (
        <>
            {/* Toast (추가 점수 요소) */}
            <ToastContainer position="top-center" autoClose={1800} />

            {/* ✅ GitHub Pages / base 경로 대응 */}
            <BrowserRouter basename={basename}>
                <Routes>
                    {/* ✅ 로그인 페이지는 공개 */}
                    <Route path="/signin" element={<SignIn />} />

                    {/* ✅ 로그인 필요한 페이지들은 보호 */}
                    <Route element={<RequireAuth />}>
                        <Route path="/" element={<Layout />}>
                            <Route index element={<Home />} />
                            <Route path="popular" element={<Popular />} />
                            <Route path="search" element={<Search />} />
                            <Route path="wishlist" element={<Wishlist />} />
                        </Route>
                    </Route>

                    {/* (선택) 매칭 안 되면 메인으로 보내고 싶다면 아래 추가 가능
          <Route path="*" element={<Navigate to="/" replace />} />
          */}
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
