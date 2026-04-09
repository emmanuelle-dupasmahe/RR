// components/Footer.jsx
function Footer() {
    return (
        <footer className="bg-black border-t-2 border-[#222] px-[40px] py-[20px] text-center text-[#888888] text-[0.875rem]">
            <div className="max-w-[80rem] mx-auto flex flex-col items-center gap-[16px]">
                <div className="space-y-1">
                    <p className="m-0 text-[#888888]">
                        Réservoir Rock - © {new Date().getFullYear()} Tous droits réservés.
                    </p>
                    {/* Mention Copyright Photographe */}
                    <p className="m-0 text-[10px] text-[#555] uppercase tracking-[2px] font-medium italic">
                        Crédits photographiques : Mika
                    </p>
                </div>

                <div className="flex gap-[24px] justify-center">
                    <a href="https://www.facebook.com/people/R%C3%A9servoir-Rock/100063633513580/" target="_blank" rel="noopener noreferrer" title="Facebook" className="group inline-flex items-center justify-center w-[40px] h-[40px] no-underline transition-transform duration-300 hover:scale-110">
                        <svg viewBox="0 0 24 24" className="w-[24px] h-[24px]">
                            <path fill="#888888" className="group-hover:fill-primary transition-colors duration-300" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                    </a>
                    <a href="https://www.youtube.com/@reservoirrock9" target="_blank" rel="noopener noreferrer" title="YouTube" className="group inline-flex items-center justify-center w-[40px] h-[40px] no-underline transition-transform duration-300 hover:scale-110">
                        <svg viewBox="0 0 24 24" className="w-[24px] h-[24px]">
                            <path fill="#888888" className="group-hover:fill-primary transition-colors duration-300" d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                        </svg>
                    </a>
                </div>
            </div>
        </footer>
    );
}
export default Footer;