// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./views/Home";
import SignIn from "./views/SignIn";
import Popular from "./views/Popular";
import Search from "./views/Search";
import Wishlist from "./views/Wishlist";

function App() {
    return (
        <BrowserRouter basename={import.meta.env.BASE_URL}>
            <Routes>

                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="signin" element={<SignIn />} />
                    <Route path="popular" element={<Popular />} />
                    <Route path="search" element={<Search />} />
                    <Route path="wishlist" element={<Wishlist />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
