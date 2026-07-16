import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import AlternateEmailOutlinedIcon from '@mui/icons-material/AlternateEmailOutlined';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import AutorenewOutlinedIcon from '@mui/icons-material/AutorenewOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

function UsersSection({ SectionTitle, allUsers, handleToggleRole, handleDeleteUser }) {
    const initials = (firstname, lastname) => {
        const first = String(firstname || '').trim()[0] || '';
        const last = String(lastname || '').trim()[0] || '';
        return `${first}${last}`.toUpperCase() || '?';
    };

    const roleBadgeClass = (role) => {
        if (role === 'admin') return 'bg-primary text-white border-primary/40';
        if (role === 'member') return 'bg-blue-500/15 text-blue-500 border-blue-500/30';
        return 'bg-gray-500/15 text-gray-600 dark:text-gray-300 border-gray-500/30';
    };

    return (
        <section id="users" className="animate-fadeIn">
            <SectionTitle subtitle="Access Control">Gestion des Utilisateurs</SectionTitle>

            <div className="bg-white dark:bg-[#0a0a0a] border border-black/5 dark:border-white/5 rounded-2xl p-4 md:p-6 shadow-xl">
                {Array.isArray(allUsers) && allUsers.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {allUsers.map((user) => (
                            <article
                                key={user.id}
                                className="group bg-black/[0.02] dark:bg-black border border-black/5 dark:border-white/10 rounded-xl p-4 md:p-5 hover:border-primary/35 hover:shadow-[0_0_22px_rgba(227,24,31,0.1)] transition-all"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="w-11 h-11 shrink-0 rounded-full bg-primary/15 text-primary border border-primary/25 flex items-center justify-center text-xs font-black tracking-wider">
                                        {initials(user.firstname, user.lastname)}
                                    </div>

                                    <div className="min-w-0 flex-1 space-y-2">
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <h3 className="text-sm md:text-base font-black uppercase tracking-tight text-black dark:text-white truncate">
                                                {user.firstname} {user.lastname}
                                            </h3>
                                            <span className={`inline-flex items-center gap-1 text-[9px] font-black uppercase px-2.5 py-1 rounded-full border tracking-wider ${roleBadgeClass(user.role)}`}>
                                                <VerifiedUserOutlinedIcon sx={{ fontSize: 12 }} />
                                                {user.role}
                                            </span>
                                        </div>

                                        <div className="inline-flex items-center gap-1.5 text-[11px] text-black/55 dark:text-white/55 font-bold max-w-full">
                                            <AlternateEmailOutlinedIcon sx={{ fontSize: 13 }} />
                                            <span className="truncate">{user.email}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 pt-3 border-t border-black/5 dark:border-white/10 flex items-center justify-between gap-2">
                                    {user.role !== 'admin' ? (
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleToggleRole(user.id, user.role)}
                                                className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-wide cursor-pointer"
                                            >
                                                <AutorenewOutlinedIcon sx={{ fontSize: 13 }} />
                                                {user.role === 'user' ? 'Promouvoir' : 'Retrograder'}
                                            </button>
                                            <button
                                                onClick={() => handleDeleteUser(user.id)}
                                                className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-primary/30 bg-primary/15 text-primary hover:bg-primary hover:text-white transition-colors text-[10px] font-black uppercase tracking-wide cursor-pointer"
                                            >
                                                <DeleteOutlineIcon sx={{ fontSize: 13 }} />
                                                Supprimer
                                            </button>
                                        </div>
                                    ) : (
                                        <span className="text-[10px] font-black uppercase tracking-wider text-primary/80">Admin protege</span>
                                    )}
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="px-6 py-10 text-center text-sm text-gray-500 italic border border-dashed border-black/10 dark:border-white/10 rounded-xl">
                        Chargement des utilisateurs ou liste vide...
                    </div>
                )}
            </div>
        </section>
    );
}

export default UsersSection;
