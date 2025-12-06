// src/components/layout/Layout.tsx
import { Outlet } from "react-router-dom";
import Header from "./Header";

const Layout = () => {
    return (
        <div className="app-root">
            <Header />
            <main className="app-main">
                <Outlet />
            </main>
            {/* Footer는 선택 사항이라 나중에 필요하면 추가 */}
        </div>
    );
};

export default Layout;
