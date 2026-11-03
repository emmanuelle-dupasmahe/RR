// components/PasswordInput.jsx
import { useState } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

/* Champ mot de passe avec un bouton œil pour afficher / masquer la saisie */
function PasswordInput({ className = '', disabled, ...props }) {
    const [visible, setVisible] = useState(false);

    return (
        <div className="relative">
            <input
                {...props}
                type={visible ? 'text' : 'password'}
                disabled={disabled}
                className={`${className} pr-11`}
            />
            <button
                type="button"
                onClick={() => setVisible(v => !v)}
                disabled={disabled}
                aria-label={visible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                aria-pressed={visible}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-red-600 focus:outline-none focus-visible:text-red-600 disabled:opacity-50 transition-colors"
            >
                {visible ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
            </button>
        </div>
    );
}

export default PasswordInput;
