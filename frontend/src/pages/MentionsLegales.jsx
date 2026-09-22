// pages/MentionsLegales.jsx
function MentionsLegales() {
    return (
        <div className="mt-[80px] min-h-[calc(100vh-82px)] bg-white dark:bg-black transition-colors duration-300 px-6 py-12">
            <div className="max-w-4xl mx-auto text-black dark:text-white">
                <h1 className="text-[2rem] md:text-[3rem] font-[300] uppercase mb-12 text-center tracking-[0.1em]">
                    Mentions Légales
                </h1>
                
                <div className="space-y-8 text-sm md:text-base leading-relaxed text-gray-700 dark:text-gray-300">
                    <section>
                        <h2 className="text-xl font-bold mb-4 text-primary uppercase tracking-wide">1. Édition du site</h2>
                        <p className="mb-2">Conformément aux dispositions de l'article 6 de la Loi n° 2004-575 du 21 juin 2004 pour la Confiance dans l'Économie Numérique (LCEN), il est porté à la connaissance des utilisateurs du site web Réservoir Rock l'identité des différents intervenants dans le cadre de sa réalisation et de son suivi :[cite: 2]</p>
                        <ul className="list-disc pl-6 space-y-1">
                            <li><strong>Propriétaire du site :</strong> [Réservoir Rock]</li>
                            <li><strong>Adresse :</strong> []</li>
                            <li><strong>Contact :</strong> [] — Téléphone : []</li>
                            <li><strong>Directeur de la publication :</strong> []</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-4 text-primary uppercase tracking-wide">2. Hébergement</h2>
                        <p className="mb-2">Le site est hébergé par :</p>
                        <ul className="list-disc pl-6 space-y-1">
                            <li><strong>Nom de l'hébergeur :</strong> [Zeigadis]</li>
                            <li><strong>Adresse :</strong> [83140 Six-Fours]</li>
                            <li><strong>Site web / Contact :</strong> [Site web ou téléphone de l'hébergeur]</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-4 text-primary uppercase tracking-wide">3. Propriété intellectuelle</h2>
                        <p>L'ensemble des contenus présents sur ce site (textes, photographies, vidéos, musiques, logos) est protégé par les droits de propriété intellectuelle. Toute reproduction, représentation, modification, publication ou adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite, sauf autorisation écrite préalable de Réservoir Rock.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-4 text-primary uppercase tracking-wide">4. Limitation de responsabilité</h2>
                        <p>Le groupe Réservoir Rock ne pourra être tenu responsable des dommages directs et indirects causés au matériel de l'utilisateur, lors de l'accès au site, et résultant soit de l'utilisation d'un matériel ne répondant pas aux spécifications indiquées, soit de l'apparition d'un bug ou d'une incompatibilité.</p>
                    </section>
                </div>
            </div>
        </div>
    );
}

export default MentionsLegales;