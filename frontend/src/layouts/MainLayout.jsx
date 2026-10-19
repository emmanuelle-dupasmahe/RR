// layouts/MainLayout.jsx
import { Outlet } from 'react-router-dom';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
function MainLayout() {
    return (
        <>
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className="grow">
                    <Outlet />
                </main>
                <Footer />
            </div>
            <script
                data-goatcounter="https://reservoirrock.goatcounter.com/count"
                async
                src="//gc.zgo.at/count.js"
            />
        </>
    );
}
export default MainLayout;
