// layouts/MainLayout.jsx
import { Outlet } from 'react-router-dom';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
function MainLayout() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
                <Outlet /> {/* ← La page enfant s'affiche ici */}
            </main>
            <Footer />
        </div>
    );
}
export default MainLayout;