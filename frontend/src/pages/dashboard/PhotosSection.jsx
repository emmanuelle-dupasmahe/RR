// pages/dashboard/PhotosSection.jsx
import { useState } from 'react';

function PhotosSection({ SectionTitle, photos, fetchPhotos, photoService, inputClass, btnClass, BASE_URL }) {
    const [file, setFile] = useState(null);
    const [description, setDescription] = useState('');
    const [ordre, setOrdre] = useState(0);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            alert('Veuillez sélectionner une image.');
            return;
        }

        const formData = new FormData();
        formData.append('image', file);
        formData.append('description', description);
        formData.append('ordre', ordre);

        try {
            await photoService.create(formData);
            alert('Photo ajoutée avec succès !');
            setFile(null);
            setDescription('');
            setOrdre(0);
            document.getElementById('photo-upload').value = '';
            fetchPhotos();
        } catch (error) {
            alert(`Erreur : ${error.message}`);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Supprimer cette photo ?")) return;
        try {
            await photoService.delete(id);
            fetchPhotos();
        } catch (error) {
            alert('Erreur lors de la suppression');
        }
    };

    return (
        <section className="bg-gray-50 dark:bg-[#111] p-6 md:p-8 rounded-2xl border border-gray-200 dark:border-white/5">
            <SectionTitle subtitle="Gérer le carrousel d'images">Galerie Photos</SectionTitle>

            {/* FORMULAIRE D'AJOUT */}
            <form onSubmit={handleSubmit} className="mb-12 bg-white dark:bg-[#0a0a0a] p-6 rounded-xl border border-gray-100 dark:border-white/5 shadow-sm space-y-4">
                <h3 className="text-xl font-bold uppercase tracking-wider mb-4 border-b pb-2">Ajouter une photo</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Image</label>
                        <input
                            id="photo-upload"
                            type="file"
                            accept="image/*"
                            onChange={(e) => setFile(e.target.files[0])}
                            className={inputClass}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Description (Optionnel)</label>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Légende de l'image"
                            className={inputClass}
                        />
                    </div>
                </div>
                <button type="submit" className={btnClass}>Ajouter à la galerie</button>
            </form>

            {/* GALERIE (GRILLE) */}
            <div>
                <h3 className="text-xl font-bold uppercase tracking-wider mb-6">Photos en ligne ({photos.length})</h3>

                {photos.length === 0 ? (
                    <p className="text-gray-500 italic">Aucune photo dans la galerie.</p>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {photos.map((photo) => (
                            <div key={photo.id} className="relative group bg-black rounded-lg overflow-hidden border border-gray-200 dark:border-white/10 aspect-square">
                                <img
                                    src={`${BASE_URL}${photo.url_photo}`}
                                    alt={photo.description || 'Photo'}
                                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                                />

                                {/* Overlay au survol */}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center p-2 text-center">
                                    {photo.description && (
                                        <p className="text-white text-xs font-bold mb-4 px-2 line-clamp-2">{photo.description}</p>
                                    )}
                                    <button
                                        onClick={() => handleDelete(photo.id)}
                                        className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 hover:scale-110 transition-transform"
                                        title="Supprimer la photo"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

export default PhotosSection;