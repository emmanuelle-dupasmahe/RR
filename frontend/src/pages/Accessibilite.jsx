// pages/Accessibilite.jsx
function Accessibilite() {
    return (
        <div className="mt-[80px] min-h-[calc(100vh-82px)] bg-white dark:bg-black transition-colors duration-300 px-6 py-12">
            <div className="max-w-4xl mx-auto text-black dark:text-white">
                <h1 className="text-[2rem] md:text-[3rem] font-[300] uppercase mb-12 text-center tracking-[0.1em]">
                    Déclaration d'Accessibilité
                </h1>

                <div className="space-y-8 text-sm md:text-base leading-relaxed text-gray-700 dark:text-gray-300">
                    <section>
                        <h2 className="text-xl font-bold mb-4 text-primary uppercase tracking-wide">Engagement d'accessibilité</h2>
                        <p>Réservoir Rock s'engage à rendre son site internet accessible conformément à l'article 47 de la loi n°2005-102 du 11 février 2005. Nous accordons une attention particulière à l'expérience de tous nos utilisateurs, y compris ceux en situation de handicap.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-4 text-primary uppercase tracking-wide">État de conformité</h2>
                        <p>Le site Réservoir Rock est en cours d'évaluation concernant sa conformité avec le Référentiel Général d'Amélioration de l'Accessibilité (RGAA). Des efforts constants sont déployés pour améliorer l'accessibilité des contenus, notamment :</p>
                        <ul className="list-disc pl-6 space-y-1 mt-2">
                            <li><strong>Images :</strong> Utilisation de textes alternatifs (attributs <code>alt</code>) pertinents pour les affiches de concerts et photographies porteuses d'information.</li>
                            <li><strong>Médias :</strong> Mise en place progressive d'alternatives textuelles ou de descriptions pour les contenus vidéo.</li>
                            <li><strong>Contrastes et Navigation :</strong> Implémentation d'un mode sombre (Dark Mode) adaptatif et structuration sémantique des balises HTML pour faciliter la lecture par les outils d'assistance.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-4 text-primary uppercase tracking-wide">Retour d'information et contact</h2>
                        <p>Si vous n'arrivez pas à accéder à un contenu ou à un service de ce site, vous pouvez nous contacter pour être orienté vers une alternative accessible ou obtenir le contenu sous une autre forme :</p>
                        <ul className="list-disc pl-6 space-y-1 mt-2">
                            <li>Par e-mail : [Email]</li>
                        </ul>
                    </section>
                </div>
            </div>
        </div>
    );
}

export default Accessibilite;