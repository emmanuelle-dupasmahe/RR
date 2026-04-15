import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react'; // Si tu utilises lucide-react, sinon utilise des emojis

export default function ThemeToggle() {
  // On initialise avec 'dark' car c'est ton look actuel
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-full hover:bg-white/10 transition-colors"
    >
      {theme === 'dark' ? <Sun className="text-white" /> : <Moon className="text-black" />}
    </button>
  );
}