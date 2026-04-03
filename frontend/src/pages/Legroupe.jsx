const members = [
    { name: "ERIC", role: "BATTERIE", img: "/images/eric.png" },
    { name: "JEAN-MARC", role: "CHANT & GUITARE", img: "/images/JM.png" },
    { name: "ROMAIN", role: "GUITARE", img: "/images/romain.png" },
    { name: "MARTIAL", role: "BASSE", img: "/images/martiou.png" },
];

export default function Groupe() {
    return (
        <div className="groupe-page">
            <h1>Le Groupe</h1>

            <div className="members-grid">
                {members.map((member) => (
                    <div key={member.name} className="member-card">
                        <div className="member-image">
                            <img
                                src={member.img}
                                alt={member.name}
                            />
                            <h3 className="member-overlay-name">{member.name}</h3>
                        </div>

                        <h3 className="member-name">{member.name}</h3>
                        <p className="member-role">{member.role}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}