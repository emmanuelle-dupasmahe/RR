const members = [
    { name: "ERIC", role: "BATTERIE", img: "/images/eric.png" },
    { name: "JEAN-MARC", role: "CHANT & GUITARE", img: "/images/JM.png" },
    { name: "ROMAIN", role: "GUITARE", img: "/images/romain.png" },
    { name: "MARTIAL", role: "BASSE", img: "/images/martiou.png" },
];

export default function Groupe() {
    return (
        <div className="mt-[80px] max-w-[80rem] mx-auto px-[20px] pb-[80px] text-center">
            <h1 className="text-[4rem] md:text-[5rem] font-[900] uppercase mb-[64px] text-white tracking-[-2px]">
                Le Groupe
            </h1>

            <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-[40px]">
                {members.map((member) => (
                    <div key={member.name} className="group cursor-pointer transition-transform duration-300 hover:-translate-y-[5px] flex flex-col">
                        <div className="aspect-[3/4] overflow-hidden border border-[#333] bg-[#1f2937] mb-[8px] transition-all duration-500 relative order-1">
                            <img
                                src={member.img}
                                alt={member.name}
                                className="w-full h-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:scale-105"
                            />
                            <h3 className="absolute top-[16px] left-1/2 -translate-x-1/2 text-[2rem] font-[900] text-white uppercase opacity-0 transition-opacity duration-500 group-hover:opacity-100 m-0 z-10 whitespace-nowrap">
                                {member.name}
                            </h3>
                        </div>

                        <h3 className="text-[1.25rem] font-900 tracking-[2px] mb-[4px] text-white order-3">{member.name}</h3>
                        <p className="text-primary text-[1rem] font-bold tracking-[3px] uppercase order-2 mb-[12px]">{member.role}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}