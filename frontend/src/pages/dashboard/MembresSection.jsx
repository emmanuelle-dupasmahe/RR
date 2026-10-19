import { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

function MembresSection({
    SectionTitle,
    groupMembers,
    editingMember,
    setEditingMember,
    setGroupMembers,
    newMember,
    setNewMember,
    newMemberPhotoFile,
    setNewMemberPhotoFile,
    updateMemberPhotoFile,
    setUpdateMemberPhotoFile,
    handleAddMember,
    handleUpdateMember,
    handleDeleteMember,
    BASE_URL
}) {
    const [newInstrumentDraft, setNewInstrumentDraft] = useState('');
    const [editingInstrumentDrafts, setEditingInstrumentDrafts] = useState({});

    const splitInstruments = (value) =>
        String(value || '').split(',').map(i => i.trim()).filter(Boolean);

    const joinInstruments = (items) => items.join(', ');

    const addNewTag = () => {
        const tag = newInstrumentDraft.trim();
        if (!tag) return;
        const current = splitInstruments(newMember.instrument);
        if (current.some(i => i.toLowerCase() === tag.toLowerCase())) { setNewInstrumentDraft(''); return; }
        setNewMember({ ...newMember, instrument: joinInstruments([...current, tag]) });
        setNewInstrumentDraft('');
    };
    const removeNewTag = (t) =>
        setNewMember({ ...newMember, instrument: joinInstruments(splitInstruments(newMember.instrument).filter(i => i !== t)) });

    const getDraft = (id) => editingInstrumentDrafts[id] || '';
    const setDraft = (id, v) => setEditingInstrumentDrafts(p => ({ ...p, [id]: v }));

    const addEditTag = (m) => {
        const tag = getDraft(m.id).trim();
        if (!tag) return;
        const current = splitInstruments(m.instrument);
        if (current.some(i => i.toLowerCase() === tag.toLowerCase())) { setDraft(m.id, ''); return; }
        setGroupMembers(groupMembers.map(item => item.id === m.id ? { ...item, instrument: joinInstruments([...current, tag]) } : item));
        setDraft(m.id, '');
    };
    const removeEditTag = (m, t) =>
        setGroupMembers(groupMembers.map(item =>
            item.id === m.id ? { ...item, instrument: joinInstruments(splitInstruments(m.instrument).filter(i => i !== t)) } : item
        ));

    const initials = (name) => (name || '?').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    const editingTarget = groupMembers.find((member) => member.id === editingMember) || null;

    const closeEditModal = () => {
        setEditingMember(null);
        setUpdateMemberPhotoFile(null);
    };

    useEffect(() => {
        const onEsc = (e) => {
            if (e.key === 'Escape') closeEditModal();
        };

        if (editingTarget) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', onEsc);
        }

        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', onEsc);
        };
    }, [editingTarget]);

    return (
        <section id="membres" className="animate-in fade-in duration-500">
            <SectionTitle subtitle="Band Members">Gestion des Musiciens</SectionTitle>

            <div className="bg-white dark:bg-[#0a0a0a] border border-black/5 dark:border-white/5 p-5 md:p-8 rounded-2xl shadow-xl dark:shadow-2xl transition-colors">

                {/* ── Add form ── */}
                <div className="mb-10 p-5 md:p-6 bg-black/[0.02] rounded-xl border border-black/5 dark:border-white/10 shadow-inner">
                    <span className="block text-[10px] font-black uppercase tracking-[4px] mb-6 opacity-50 dark:opacity-40 text-center text-black dark:text-white">
                        Ajouter un membre
                    </span>

                    <form onSubmit={handleAddMember}>
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-start">

                            {/* Name */}
                            <input
                                className="w-full h-[52px] px-4 bg-white dark:bg-black/80 border border-gray-300 dark:border-white/10 text-black dark:text-white focus:outline-none focus:border-[#e3181f]/50 placeholder:text-gray-400 dark:placeholder:text-white/20 transition-all rounded-lg text-sm font-medium md:col-span-3"
                                type="text"
                                placeholder="Nom du musicien"
                                value={newMember.nom || ''}
                                onChange={(e) => setNewMember({ ...newMember, nom: e.target.value })}
                                required
                            />

                            {/* Instruments */}
                            <div className="md:col-span-4 space-y-2">
                                <div className="flex gap-2">
                                    <input
                                        className="w-full h-[52px] px-4 bg-white dark:bg-black/80 border border-gray-300 dark:border-white/10 text-black dark:text-white focus:outline-none focus:border-[#e3181f]/50 placeholder:text-gray-400 dark:placeholder:text-white/20 transition-all rounded-lg text-sm font-medium"
                                        type="text"
                                        placeholder="Instrument puis Entree"
                                        value={newInstrumentDraft}
                                        onChange={(e) => setNewInstrumentDraft(e.target.value)}
                                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addNewTag(); } }}
                                    />
                                    <button
                                        type="button"
                                        className="h-[52px] inline-flex items-center gap-1 px-4 rounded-lg bg-black/80 dark:bg-white/15 border border-black/10 dark:border-white/10 text-white text-[10px] font-black uppercase tracking-wider hover:bg-[#e3181f] transition-colors whitespace-nowrap"
                                        onClick={addNewTag}
                                    >
                                        <AddIcon sx={{ fontSize: 14 }} />
                                        Tag
                                    </button>
                                </div>

                                <div className="min-h-[42px] flex flex-wrap gap-2 p-2 rounded-lg border border-dashed border-black/10 dark:border-white/10 bg-white/60 dark:bg-black/30">
                                    {splitInstruments(newMember.instrument).length > 0
                                        ? splitInstruments(newMember.instrument).map(tag => (
                                            <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                                                {tag}
                                                <button
                                                    type="button"
                                                    className="leading-none hover:text-black dark:hover:text-white"
                                                    onClick={() => removeNewTag(tag)}
                                                >
                                                    <CloseIcon sx={{ fontSize: 12 }} />
                                                </button>
                                            </span>
                                        ))
                                        : <span className="text-[10px] uppercase tracking-widest text-black/35 dark:text-white/30">Aucun instrument ajoute</span>
                                    }
                                </div>
                                <input type="hidden" value={newMember.instrument || ''} readOnly required />
                            </div>

                            {/* Photo */}
                            <div className="md:col-span-3">
                                <label className="h-[52px] w-full inline-flex items-center cursor-pointer px-3 rounded-lg border border-dashed border-black/10 dark:border-white/10 bg-white dark:bg-black/80 hover:border-[#e3181f]/40 transition-colors">
                                    <input
                                        className="hidden"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setNewMemberPhotoFile(e.target.files?.[0] || null)}
                                    />
                                    <div className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-300 text-xs font-bold uppercase tracking-wider w-full">
                                        <PhotoCameraOutlinedIcon sx={{ fontSize: 16 }} />
                                        <span className="truncate w-full">
                                            {newMemberPhotoFile ? newMemberPhotoFile.name : 'Choisir une photo'}
                                        </span>
                                    </div>
                                </label>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                className="md:col-span-2 h-[52px] bg-[#e3181f] text-white border-none px-4 font-black uppercase tracking-widest cursor-pointer w-full transition-all hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black rounded-lg shadow-lg active:scale-[0.98]"
                            >
                                Ajouter
                            </button>
                        </div>
                    </form>
                </div>

                {/* ── Members grid ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {groupMembers.length > 0 ? groupMembers.map(m => (
                        <div key={m.id} className="relative p-5 bg-black/[0.02] dark:bg-black border border-black/5 dark:border-white/10 rounded-xl hover:border-primary/30 hover:shadow-[0_0_20px_rgba(227,24,31,0.12)] transition-all group min-h-[120px] flex items-center">
                            <>
                                <div className="absolute top-2 right-2 z-10 flex gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                    <button type="button" className="inline-flex items-center gap-1 px-2 py-1 rounded bg-black/10 dark:bg-white/10 text-black/60 dark:text-white/70 hover:text-primary text-[9px] font-black uppercase" onClick={() => { setEditingMember(m.id); setUpdateMemberPhotoFile(null); }}>
                                        <EditOutlinedIcon sx={{ fontSize: 12 }} />
                                        Edit
                                    </button>
                                    <button type="button" className="inline-flex items-center gap-1 px-2 py-1 rounded bg-black/10 dark:bg-white/10 text-black/60 dark:text-white/70 hover:text-red-500 text-[9px] font-black uppercase" onClick={() => handleDeleteMember(m.id)}>
                                        <DeleteOutlineIcon sx={{ fontSize: 12 }} />
                                        Suppr.
                                    </button>
                                </div>

                                <div className="flex items-center gap-4 min-w-0">
                                    <div className="relative flex-shrink-0 w-12 h-12 rounded-full border-2 border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5 overflow-hidden flex items-center justify-center text-[10px] font-black opacity-70 text-black dark:text-white">
                                        {m.photo_url
                                            ? <img src={m.photo_url.startsWith('/uploads') ? `${BASE_URL}${m.photo_url}` : m.photo_url} alt={m.nom} />
                                            : initials(m.nom)
                                        }
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="text-black dark:text-white font-bold uppercase tracking-tight leading-none mb-2 truncate">{m.nom}</p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {splitInstruments(m.instrument).map(tag => (
                                                <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wide bg-primary/10 text-primary border border-primary/20">{tag}</span>
                                            ))}
                                            {splitInstruments(m.instrument).length === 0 &&
                                                <span className="text-[10px] uppercase tracking-widest text-black/35 dark:text-white/25">Aucun instrument</span>}
                                        </div>
                                    </div>
                                </div>
                            </>
                        </div>
                    )) : (
                        <div className="col-span-full py-12 text-center opacity-30 dark:opacity-20 border border-dashed border-black/10 dark:border-white/10 rounded-xl">
                            <p className="text-[10px] font-black uppercase tracking-widest text-black dark:text-white">Aucun membre enregistré</p>
                        </div>
                    )}
                </div>

                {editingTarget && (
                    <div className="fixed inset-0 z-[110] bg-black/75 backdrop-blur-sm p-3 md:p-6 overflow-y-auto" onClick={closeEditModal}>
                        <div className="min-h-full w-full flex items-center justify-center">
                            <div className="relative w-full max-w-xl bg-white dark:bg-[#0a0a0a] border border-black/10 dark:border-white/10 rounded-2xl shadow-2xl p-4 md:p-6" onClick={(e) => e.stopPropagation()}>
                                <button
                                    type="button"
                                    onClick={closeEditModal}
                                    className="absolute top-3 right-3 inline-flex items-center justify-center h-9 w-9 rounded-full bg-black/10 dark:bg-white/10 text-black/70 dark:text-white/80 hover:text-primary transition-colors"
                                    aria-label="Fermer la modale"
                                >
                                    <CloseIcon sx={{ fontSize: 18 }} />
                                </button>

                                <h3 className="text-sm font-black uppercase tracking-[3px] text-black dark:text-white opacity-70 mb-5">
                                    Modifier le membre
                                </h3>

                                <div className="space-y-3">
                                    <input
                                        className="w-full bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 p-3 text-sm rounded text-black dark:text-white font-bold"
                                        value={editingTarget.nom || ''}
                                        placeholder="Nom"
                                        onChange={(e) => setGroupMembers(groupMembers.map(item => item.id === editingTarget.id ? { ...item, nom: e.target.value } : item))}
                                    />

                                    <div className="flex gap-2">
                                        <input
                                            className="w-full bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 p-3 text-sm rounded text-primary font-bold"
                                            placeholder="Ajouter instrument"
                                            value={getDraft(editingTarget.id)}
                                            onChange={(e) => setDraft(editingTarget.id, e.target.value)}
                                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addEditTag(editingTarget); } }}
                                        />
                                        <button
                                            type="button"
                                            className="px-3 rounded bg-black/80 dark:bg-white/10 text-white text-[10px] font-black uppercase"
                                            onClick={() => addEditTag(editingTarget)}
                                        >
                                            <AddIcon sx={{ fontSize: 14 }} />
                                        </button>
                                    </div>

                                    <div className="min-h-[40px] flex flex-wrap gap-2 p-2 rounded-lg border border-dashed border-black/10 dark:border-white/10 bg-white/60 dark:bg-black/20">
                                        {splitInstruments(editingTarget.instrument).map(tag => (
                                            <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                                                {tag}
                                                <button
                                                    type="button"
                                                    className="leading-none hover:text-black dark:hover:text-white"
                                                    onClick={() => removeEditTag(editingTarget, tag)}
                                                >
                                                    <CloseIcon sx={{ fontSize: 12 }} />
                                                </button>
                                            </span>
                                        ))}
                                        {splitInstruments(editingTarget.instrument).length === 0 && <span className="text-[10px] uppercase tracking-widest text-black/35 dark:text-white/25">Aucun instrument</span>}
                                    </div>

                                    <label className="block cursor-pointer p-3 rounded-lg border border-dashed border-black/10 dark:border-white/10 bg-white dark:bg-[#0a0a0a] hover:border-[#e3181f]/40 transition-colors">
                                        <input
                                            className="hidden"
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => setUpdateMemberPhotoFile(e.target.files?.[0] || null)}
                                        />
                                        <div className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider">
                                            <PhotoCameraOutlinedIcon sx={{ fontSize: 16 }} />
                                            <span className="truncate max-w-[220px]">
                                                {updateMemberPhotoFile ? updateMemberPhotoFile.name : 'Nouvelle photo…'}
                                            </span>
                                        </div>
                                    </label>

                                    <div className="flex gap-2 pt-1">
                                        <button type="button" className="bg-primary/20 text-primary px-3 py-2 rounded text-[10px] font-black uppercase hover:bg-primary hover:text-black transition-colors flex-1" onClick={() => handleUpdateMember(editingTarget, updateMemberPhotoFile)}>Sauvegarder</button>
                                        <button type="button" className="text-black/40 dark:text-white/30 text-[10px] font-black uppercase underline flex-1 hover:text-black dark:hover:text-white" onClick={closeEditModal}>Annuler</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}

export default MembresSection;
