// pages/PolitiqueConfidentialite.jsx
function PolitiqueConfidentialite() {
    return (
        <div className="mt-[80px] min-h-[calc(100vh-82px)] bg-white dark:bg-black transition-colors duration-300 px-6 py-12">
            <div className="max-w-4xl mx-auto text-black dark:text-white">
                <h1 className="text-[2rem] md:text-[3rem] font-[300] uppercase mb-12 text-center tracking-[0.1em]">
                    Politique de Confidentialité
                </h1>

                <div className="space-y-8 text-sm md:text-base leading-relaxed text-gray-700 dark:text-gray-300">
                    <section>
                        <h2 className="text-xl font-bold mb-4 text-primary uppercase tracking-wide">1. Introduction</h2>
                        <p>La présente politique de confidentialité a pour but d'informer les utilisateurs du site Réservoir Rock sur la manière dont leurs données personnelles sont collectées et traitées dans le respect du Règlement Général sur la Protection des Données (RGPD).</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-4 text-primary uppercase tracking-wide">2. Collecte des données</h2>
                        <p className="mb-2">Dans le cadre du fonctionnement technique du site (architecture Node.js, MySQL et authentification JWT), nous collectons les données suivantes :</p>
                        <ul className="list-disc pl-6 space-y-1">
                            <li><strong>Données d'identification :</strong> Adresse e-mail et mot de passe (stocké sous forme de hash sécurisé via une fonction de hachage robuste).</li>
                            <li><strong>Données techniques :</strong> Jetons d'authentification (JSON Web Tokens) utilisés pour maintenir votre session active.</li>
                            <li><strong>Logs serveur :</strong> Adresse IP et informations de navigation pour assurer la sécurité et le diagnostic du système.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-4 text-primary uppercase tracking-wide">3. Finalité du traitement</h2>
                        <p className="mb-2">Le traitement des données répond aux finalités suivantes :</p>
                        <ul className="list-disc pl-6 space-y-1">
                            <li>Gestion des comptes utilisateurs et de l'accès aux espaces sécurisés.</li>
                            <li>Sécurisation des échanges via le protocole JWT.</li>
                            <li>Réponse aux demandes de contact ou d'informations.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-4 text-primary uppercase tracking-wide">4. Stockage et Sécurité</h2>
                        <p className="mb-2">Les données sont stockées dans une base de données MySQL sécurisée. Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles pour protéger vos données contre tout accès non autorisé, perte ou altération :</p>
                        <ul className="list-disc pl-6 space-y-1">
                            <li>Utilisation de bibliothèques de sécurité pour la gestion des mots de passe.</li>
                            <li>Authentification forte par jeton (JWT) transmise via des canaux sécurisés.</li>
                            <li>Hébergement des données sur des serveurs conformes aux standards de sécurité.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-4 text-primary uppercase tracking-wide">5. Vos droits</h2>
                        <p className="mb-2">Conformément à la réglementation européenne, vous disposez des droits suivants :</p>
                        <ul className="list-disc pl-6 space-y-1 mb-2">
                            <li>Droit d'accès, de rectification et de suppression de vos données.</li>
                            <li>Droit à la limitation du traitement et droit d'opposition.</li>
                        </ul>
                        <p>Pour exercer ces droits, vous pouvez contacter le responsable du traitement à l'adresse suivante : [Email].</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-4 text-primary uppercase tracking-wide">6. Gestion des Cookies</h2>
                        <p className="mb-4">Le site utilise des cookies et technologies similaires strictement nécessaires au fonctionnement de l'authentification (gestion des JWT). Ces éléments ne nécessitent pas de consentement préalable car ils ont pour finalité exclusive de permettre la communication par voie électronique et la sécurité des sessions.</p>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-300 dark:border-gray-700">
                                        <th className="py-2 pr-4">Type</th>
                                        <th className="py-2 pr-4">Finalité</th>
                                        <th className="py-2">Durée</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b border-gray-200 dark:border-gray-800">
                                        <td className="py-2 pr-4 font-semibold">Authentification (JWT)</td>
                                        <td className="py-2 pr-4">Maintien de la session utilisateur</td>
                                        <td className="py-2">Durée de la session : 7 jours</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

export default PolitiqueConfidentialite;