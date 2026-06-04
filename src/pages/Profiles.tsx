import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfileStore, DEFAULT_AVATARS } from '@/store/useProfileStore';
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';

export function Profiles() {
  const { profiles, setCurrentProfile, addProfile, updateProfile, deleteProfile } = useProfileStore();
  const navigate = useNavigate();
  const [isManaging, setIsManaging] = useState(false);
  const [editingProfile, setEditingProfile] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);
  
  const [name, setName] = useState('');
  const [avatarIndex, setAvatarIndex] = useState(0);

  const handleProfileClick = (profile: any) => {
    if (isManaging) {
      setEditingProfile(profile);
      setName(profile.name);
      const index = DEFAULT_AVATARS.indexOf(profile.avatarUrl);
      setAvatarIndex(index >= 0 ? index : 0);
    } else {
      setCurrentProfile(profile);
      navigate('/');
    }
  };

  const handleSave = () => {
    if (!name.trim()) return;
    
    if (isCreating) {
      addProfile({
        name,
        avatarUrl: DEFAULT_AVATARS[avatarIndex],
        isKids: false
      });
    } else if (editingProfile) {
      updateProfile(editingProfile.id, {
        name,
        avatarUrl: DEFAULT_AVATARS[avatarIndex]
      });
    }
    
    setEditingProfile(null);
    setIsCreating(false);
  };
  
  const handleDelete = () => {
    if (editingProfile) {
      deleteProfile(editingProfile.id);
      setEditingProfile(null);
    }
  };

  if (editingProfile || isCreating) {
    return (
      <div className="min-h-screen bg-[#141414] text-white flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl md:text-5xl font-medium mb-8">
          {isCreating ? 'Add Profile' : 'Edit Profile'}
        </h1>
        <div className="flex flex-col md:flex-row gap-8 items-start mb-8 bg-[#050505] p-8 rounded-lg shadow-xl shrink-0 max-w-2xl w-full">
          <div className="flex flex-col items-center w-full md:w-auto">
            <div className="relative mb-4">
              <img 
                src={DEFAULT_AVATARS[avatarIndex]} 
                alt="Avatar" 
                className="w-32 h-32 rounded-md object-cover border-[3px] border-white/20"
                onError={(e) => { e.currentTarget.src = DEFAULT_AVATARS[0]; }}
              />
            </div>
            <div className="flex gap-2 flex-wrap justify-center w-full max-w-[200px]">
              {DEFAULT_AVATARS.map((avatar, idx) => (
                <button 
                  key={idx}
                  onClick={() => setAvatarIndex(idx)}
                  className={`w-10 h-10 rounded-md overflow-hidden border-[2px] transition ${avatarIndex === idx ? 'border-white scale-110' : 'border-transparent opacity-50 hover:opacity-100'}`}
                >
                  <img src={avatar} alt="Avatar option" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex-1 w-full space-y-6">
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className="w-full bg-[#333] text-white text-lg px-4 py-3 rounded-sm outline-none focus:ring-2 ring-white/30"
              autoFocus
            />
            
            <div className="flex flex-wrap gap-4 pt-4 border-t border-white/10">
              <button 
                onClick={handleSave}
                className="bg-white text-black font-semibold px-8 py-2 rounded-sm hover:bg-white/90 transition"
              >
                Save
              </button>
              <button 
                onClick={() => { setEditingProfile(null); setIsCreating(false); }}
                className="border border-gray-500 text-white font-semibold px-8 py-2 rounded-sm hover:border-white transition"
              >
                Cancel
              </button>
              {editingProfile && profiles.length > 1 && (
                <button 
                  onClick={handleDelete}
                  className="ml-auto flex items-center gap-2 border border-red-900 text-red-500 font-semibold px-4 py-2 rounded-sm hover:bg-red-950 transition"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#141414] flex flex-col items-center justify-center p-4">
      <div className="absolute top-0 left-0 w-full p-4 md:p-8">
        <h1 className="text-[#E50914] text-3xl md:text-4xl font-extrabold tracking-tight">
          Verse
        </h1>
      </div>
      
      <div className="flex flex-col items-center w-full max-w-4xl transform transition-all duration-500 animate-in fade-in zoom-in-95">
        <h1 className="text-white text-3xl md:text-5xl font-medium mb-8 text-center">
          {isManaging ? 'Manage Profiles' : "Who's watching?"}
        </h1>
        
        <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-12">
          {profiles.map((profile) => (
            <div 
              key={profile.id} 
              className="flex flex-col items-center group cursor-pointer"
              onClick={() => handleProfileClick(profile)}
            >
              <div className="relative mb-2">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-md overflow-hidden border-[3px] border-transparent group-hover:border-white transition-all duration-300 transform group-hover:scale-105 shadow-xl">
                  <img 
                    src={profile.avatarUrl} 
                    alt={profile.name} 
                    className="w-full h-full object-cover select-none"
                    onError={(e) => { e.currentTarget.src = DEFAULT_AVATARS[0]; }}
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300" />
                </div>
                {isManaging && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-md transition-all duration-300">
                    <Pencil className="w-8 h-8 text-white transition-transform duration-300 transform group-hover:scale-110" />
                  </div>
                )}
              </div>
              <span className={`text-gray-400 group-hover:text-white transition-colors text-xs md:text-base font-medium ${isManaging ? 'font-bold text-white' : ''}`}>
                {profile.name}
              </span>
            </div>
          ))}
          
          {profiles.length < 5 && (
            <div 
              className="flex flex-col items-center group cursor-pointer" 
              onClick={() => {
                setName('');
                setAvatarIndex(0);
                setIsCreating(true);
              }}
            >
              <div className="w-24 h-24 md:w-32 md:h-32 mb-2 rounded-md flex items-center justify-center border-[3px] border-transparent group-hover:border-white transition-all duration-300 transform group-hover:scale-105 group-hover:bg-white/10 shadow-xl">
                <PlusCircle className="w-12 h-12 text-gray-400 group-hover:text-white transition-colors" />
              </div>
              <span className="text-gray-400 group-hover:text-white transition-colors text-xs md:text-base font-medium">
                Add Profile
              </span>
            </div>
          )}
        </div>
        
        <button 
          className={`border border-gray-500 text-gray-500 font-medium tracking-widest uppercase px-6 py-2 hover:border-white hover:text-white transition-all duration-300 ${
            isManaging ? 'bg-white text-black hover:bg-white/90 hover:text-black border-white scale-105 shadow-lg' : ''
          }`}
          onClick={() => setIsManaging(!isManaging)}
        >
          {isManaging ? 'Done' : 'Manage Profiles'}
        </button>
      </div>
    </div>
  );
}
