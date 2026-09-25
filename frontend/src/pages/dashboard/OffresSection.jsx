// pages/dashboard/OffresSection.jsx
import { useState, useEffect } from 'react';

function OffresSection({ SectionTitle, offres, fetchOffres, offreService, inputClass, btnClass, BASE_URL }) {
    const [editingId, setEditingId] = useState(null);
    const [titre, setTitre] = useState('');
    const [description, setDescription] = useState('');
    const [prix, setPrix] = useState('');
    const [file, setFile] = useState(null);
    const [isActive, setIsActive] = useState(true);
    const [existingImage, setExistingImage] = useState(null); // NOUVEAU : On stocke l'image existante

    const resetForm = () => {
        setEditingId(null);
        setTitre('');
        setDescription('');
        setPrix('');
        setFile(null);
        setIsActive(true);
        setExistingImage(null); // NOUVEAU : On réinitialise l'image existante
        const fileInput = document.getElementById('offre-image-upload');
        if (fileInput) fileInput.value = '';
    };

    const handleEditClick = (offre) => {
        setEditingId(offre.id);
        setTitre(offre.titre);
        setDescription(offre.description);
        setPrix(offre.prix || '');
        setIsActive(offre.is_active === 1);
        setFile(null);
        setExistingImage(offre.image_url); // NOUVEAU : On sauvegarde l'URL de l'image actuelle
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('titre', titre);
        formData.append('description', description);
        formData.append('prix', prix);
        formData.append('is_active', isActive ? '1' : '0');

        // NOUVEAU : La logique d'envoi de l'image
        if (file) {
            // Si on a sélectionné un nouveau fichier, on l'envoie
            formData.append('image', file);
        } else if (existingImage) {
            // Sinon, si une image existait déjà, on renvoie son URL au backend pour qu'il la conserve
            formData.append('existing_image', existingImage);
        }

        try {
            if (editingId) {
                await offreService.update(editingId, formData);
                alert('Offre modifiée avec succès !');
            } else {
                await offreService.create(formData);
                alert('Offre ajoutée avec succès !');
            }
            resetForm();
            fetchOffres();
        } catch (error) {
            alert(`Erreur : ${error.message}`);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Supprimer définitivement cette offre ?")) return;
        try {
            await offreService.delete(id);
            fetchOffres();
        } catch (error) {
            alert('Erreur lors de la suppression');
        }
    };

    return (
        <section className="bg-gray-50 dark:bg-[#111] p-6 md:p-8 rounded-2xl border border-gray-200 dark:border-white/5">
            <SectionTitle subtitle="Gérer les prestations du groupe">Nos Offres</SectionTitle>

            {/* FORMULAIRE */}
            <form onSubmit={handleSubmit} className="mb-12 bg-white dark:bg-[#0a0a0a] p-6 rounded-xl border border-gray-100 dark:border-white/5 shadow-sm space-y-4">
                <div className="flex justify-between items-center mb-4 border-b pb-2">
                    <h3 className="text-xl font-bold uppercase tracking-wider">
                        {editingId ? 'Modifier l\'offre' : 'Créer une offre'}
                    </h3>
                    {editingId && (
                        <button type="button" onClick={resetForm} className="text-xs text-gray-500 hover:text-red-500 uppercase tracking-widest font-bold">
                            Annuler la modification
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Titre de l'offre</label>
                        <input
                            type="text"
                            value={titre}
                            onChange={(e) => setTitre(e.target.value)}
                            placeholder="Ex: Concert Classique"
                            className={inputClass}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Prix / Tarif</label>
                        <input
                            type="text"
                            value={prix}
                            onChange={(e) => setPrix(e.target.value)}
                            placeholder="Ex: À partir de 500€ (ou Sur devis)"
                            className={inputClass}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Détaillez la prestation (durée, matériel, ambiance...)"
                        className={`${inputClass} min-h-[120px] resize-y`}
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                            Image illustrative {editingId && '(Laisser vide pour conserver l\'actuelle)'}
                        </label>
                        <input
                            id="offre-image-upload"
                            type="file"
                            accept="image/*"
                            onChange={(e) => setFile(e.target.files[0])}
                            className={inputClass}
                        />
                        {/* Petit rappel visuel de l'image existante */}
                        {editingId && existingImage && !file && (
                            <span className="text-[10px] text-green-600 dark:text-green-400 font-bold uppercase mt-1 block">
                                ✓ Image actuelle conservée
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-3 md:mt-6">
                        <input
                            type="checkbox"
                            id="isActive"
                            checked={isActive}
                            onChange={(e) => setIsActive(e.target.checked)}
                            className="w-5 h-5 accent-[#e3181f] cursor-pointer"
                        />
                        <label htmlFor="isActive" className="text-sm font-bold uppercase tracking-wide cursor-pointer select-none">
                            Activer cette offre sur le site
                        </label>
                    </div>
                </div>

                <button type="submit" className={btnClass}>
                    {editingId ? 'Mettre à jour l\'offre' : 'Ajouter l\'offre'}
                </button>
            </form>

            {/* LISTE DES OFFRES */}
            <div>
                <h3 className="text-xl font-bold uppercase tracking-wider mb-6">Offres existantes ({offres.length})</h3>

                {offres.length === 0 ? (
                    <p className="text-gray-500 italic">Aucune offre enregistrée.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {offres.map((offre) => (
                            <div key={offre.id} className={`flex flex-col bg-white dark:bg-[#0a0a0a] border ${offre.is_active ? 'border-gray-200 dark:border-white/10' : 'border-red-500/30 opacity-75'} rounded-xl overflow-hidden shadow-sm`}>
                                {offre.image_url ? (
                                    <div className="h-48 w-full bg-black relative">
                                        <img
                                            src={`${BASE_URL}${offre.image_url}`}
                                            alt={offre.titre}
                                            className="w-full h-full object-cover opacity-80"
                                        />
                                        {!offre.is_active && (
                                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                                <span className="bg-red-600 text-white px-3 py-1 font-black uppercase text-xs tracking-widest">Désactivée</span>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="h-48 w-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                                        <span className="text-gray-400 text-xs uppercase tracking-widest">Sans image</span>
                                    </div>
                                )}

                                <div className="p-5 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-lg">{offre.titre}</h4>
                                        <span className="bg-[#e3181f]/10 text-[#e3181f] px-2 py-1 text-xs font-black rounded-md">{offre.prix || 'Sur devis'}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 flex-1 line-clamp-3">
                                        {offre.description}
                                    </p>

                                    <div className="flex gap-2 mt-auto">
                                        <button
                                            onClick={() => handleEditClick(offre)}
                                            className="flex-1 bg-black dark:bg-white text-white dark:text-black py-2 text-xs font-black uppercase tracking-widest rounded transition-colors hover:bg-gray-800 dark:hover:bg-gray-200"
                                        >
                                            Modifier
                                        </button>
                                        <button
                                            onClick={() => handleDelete(offre.id)}
                                            className="bg-red-600 text-white px-4 py-2 rounded transition-colors hover:bg-red-700"
                                            title="Supprimer l'offre"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

export default OffresSection;