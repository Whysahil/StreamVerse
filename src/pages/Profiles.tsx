import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfileStore, AVATAR_REGISTRY } from '@/store/useProfileStore';
import { useAuthStore } from '@/store/useAuthStore';
import { auth, signOut, signInWithPopup, GoogleAuthProvider } from '@/lib/firebase';
import { PlusCircle, Pencil, Trash2, Settings, LogOut, UserPlus, ArrowRight, Baby } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

export function Profiles() {
  const { profiles, setCurrentProfile, addProfile, updateProfile, deleteProfile, loadProfiles, clearProfiles } = useProfileStore();
  const { user, loading } = useAuthStore();
  const navigate = useNavigate();
  const [isManaging, setIsManaging] = useState(false);
  const [editingProfile, setEditingProfile] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [name, setName] = useState('');
  const [avatarIndex, setAvatarIndex] = useState(0);
  const [isKids, setIsKids] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    // If not logged in and auth state has loaded, redirect to login
    if (!loading && !user) {
      clearProfiles();
      navigate('/login');
    } else if (user) {
      loadProfiles(user.uid);
    }
  }, [user, loading, navigate, loadProfiles, clearProfiles]);

  const handleProfileClick = (profile: any) => {
    if (isManaging) {
      setEditingProfile(profile);
      setName(profile.name);
      setIsKids(profile.isKids || false);
      const index = AVATAR_REGISTRY.indexOf(profile.avatarUrl);
      setAvatarIndex(index >= 0 ? index : 0);
    } else {
      setCurrentProfile(profile);
      navigate('/');
    }
  };

  const handleSave = async () => {
    if (!name.trim() || !user) return;
    setIsSaving(true);
    
    try {
      if (isCreating) {
        await addProfile(user.uid, {
          name,
          avatarUrl: AVATAR_REGISTRY[avatarIndex],
          isKids
        });
      } else if (editingProfile) {
        await updateProfile(user.uid, editingProfile.id, {
          name,
          avatarUrl: AVATAR_REGISTRY[avatarIndex],
          isKids
        });
      }
      setEditingProfile(null);
      setIsCreating(false);
    } catch (e) {
      console.error(e);
      alert("Failed to save profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleDelete = async () => {
    if (editingProfile && user) {
      setIsSaving(true);
      try {
        await deleteProfile(user.uid, editingProfile.id);
        setEditingProfile(null);
      } catch (e) {
         console.error(e);
         alert("Failed to delete profile.");
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleSignOut = async () => {
    try {
      if (auth) {
        await signOut(auth);
      }
      setCurrentProfile(null);
      navigate('/login');
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  const handleSwitchAccount = async () => {
    try {
      if (auth) {
        await signOut(auth);
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });
        await signInWithPopup(auth, provider);
        // After successful sign in, the auth state listener will update user
      }
    } catch (error: any) {
      console.error("Error switching account", error);
      if (error.code === 'auth/unauthorized-domain') {
        alert("This domain is not authorized for OAuth. Please add it to your Firebase Console under Authentication > Settings > Authorized domains. If you are in development preview, try opening the app in a new tab.");
      }
    }
  };

  const handleContinue = () => {
    if (profiles.length > 0) {
      handleProfileClick(profiles[0]);
    }
  };

  const BackgroundElements = () => (
    <div className="absolute inset-0 z-0 overflow-hidden bg-[#050505]">
      <motion.div 
        animate={{ 
          x: [0, 100, -100, 0], 
          y: [0, -100, 100, 0] 
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/4 left-1/4 w-[30rem] h-[30rem] bg-[#E50914] rounded-full mix-blend-screen filter blur-[150px] opacity-20"
      />
      <motion.div 
        animate={{ 
          x: [0, -150, 100, 0], 
          y: [0, 50, -100, 0] 
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-1/4 right-1/4 w-[25rem] h-[25rem] bg-[#4A0E12] rounded-full mix-blend-screen filter blur-[120px] opacity-30"
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-[#8B0A1A] rounded-full mix-blend-screen filter blur-[200px]"
      />
      <div className="absolute inset-0 bg-[#050505]/60 backdrop-blur-[100px]" />
    </div>
  );

  if (editingProfile || isCreating) {
    return (
      <div className="relative min-h-screen bg-[#050505] text-white flex flex-col p-4 overflow-hidden">
        <BackgroundElements />
        
        {/* NAVBAR */}
        <div className="relative z-20 w-full flex justify-between items-center px-4 md:px-12 py-6 mb-8 md:mb-16 shrink-0">
          <h1 className="text-[#E50914] text-3xl md:text-5xl font-extrabold tracking-tighter cursor-pointer">Verse</h1>
        </div>

        {/* HERO SECTION */}
        <div className="relative z-10 flex flex-col flex-1 items-center justify-center w-full max-w-5xl mx-auto pb-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col md:flex-row gap-8 items-start bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-3xl shadow-2xl shrink-0 max-w-3xl w-full"
          >
            <div className="w-full text-center md:hidden mb-6">
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                {isCreating ? 'Create Profile' : 'Edit Profile'}
              </h1>
            </div>
            
            <div className="flex flex-col items-center w-full md:w-auto shrink-0">
              <div className="relative mb-6">
                <img 
                  src={AVATAR_REGISTRY[avatarIndex]} 
                  alt="Avatar" 
                  className="w-32 h-32 md:w-40 md:h-40 rounded-2xl object-cover border border-white/20 shadow-[-10px_-10px_30px_4px_rgba(0,0,0,0.1),_10px_10px_30px_4px_rgba(45,78,255,0.15)]"
                  onError={(e) => { e.currentTarget.src = AVATAR_REGISTRY[0]; }}
                />
              </div>
              <div className="flex flex-wrap gap-3 justify-center w-full max-w-[300px]">
                {AVATAR_REGISTRY.map((avatar, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setAvatarIndex(idx)}
                    className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition-all duration-300 ${avatarIndex === idx ? 'border-white scale-110 shadow-[0_0_15px_rgba(255,255,255,0.4)]' : 'border-transparent opacity-60 hover:opacity-100 hover:scale-105'}`}
                  >
                    <img src={avatar} alt="Avatar option" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex-1 w-full space-y-8 pt-4 md:pt-0">
              <div className="hidden md:block mb-8">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                  {isCreating ? 'Create Profile' : 'Edit Profile'}
                </h1>
              </div>
              
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-gray-400 mb-2 ml-1">Profile Name</p>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter a name..."
                    className="w-full bg-black/40 text-white text-lg px-6 py-4 rounded-xl border border-white/10 outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40 transition-all placeholder:text-gray-600"
                    autoFocus
                  />
                </div>

                <div 
                  className="flex items-center justify-between bg-black/20 border border-white/5 p-4 rounded-xl cursor-pointer hover:bg-white/5 transition-colors"
                  onClick={() => setIsKids(!isKids)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${isKids ? 'bg-cyan-500/20 text-cyan-400' : 'bg-gray-800 text-gray-400'}`}>
                      <Baby className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium">Kids Profile</h4>
                      <p className="text-sm text-gray-400">Only show family-friendly content</p>
                    </div>
                  </div>
                  <div className={`w-12 h-6 rounded-full transition-colors relative ${isKids ? 'bg-cyan-500' : 'bg-gray-700'}`}>
                    <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${isKids ? 'translate-x-6' : 'translate-x-0'}`} />
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4 pt-6 border-t border-white/10">
                <button 
                  onClick={handleSave}
                  className="bg-white text-black font-semibold px-8 py-3 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Save Profile
                </button>
                <button 
                  onClick={() => { setEditingProfile(null); setIsCreating(false); }}
                  className="border border-white/20 text-white font-semibold px-8 py-3 rounded-lg hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                {editingProfile && profiles.length > 1 && (
                  <button 
                    onClick={handleDelete}
                    className="ml-auto flex items-center gap-2 text-red-500 font-medium px-4 py-3 rounded-lg hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" /> Delete
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#050505] flex flex-col p-4 overflow-hidden">
      <BackgroundElements />
      
      {/* NAVBAR */}
      <div className="relative z-20 w-full flex justify-between items-center px-4 md:px-12 py-6 mb-8 md:mb-16">
        <h1 className="text-[#E50914] text-3xl md:text-5xl font-extrabold tracking-tighter cursor-pointer">Verse</h1>
        {user && (
          <div className="relative" onMouseEnter={() => setShowDropdown(true)} onMouseLeave={() => setShowDropdown(false)}>
            <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 cursor-pointer">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <img src={user.photoURL || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&h=200&fit=crop"} alt="User" className="w-8 h-8 rounded-full object-cover" onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&h=200&fit=crop"; }} />
            </div>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {showDropdown && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 top-full mt-2 w-64 bg-[#141414] border border-white/10 rounded-xl overflow-hidden flex flex-col shadow-2xl z-50 pt-1"
                >
                  <div className="px-4 py-3 border-b border-white/10 mb-1">
                    <p className="text-sm font-bold text-white truncate">{user.displayName || "User"}</p>
                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                  </div>
                  <button 
                    onClick={handleSwitchAccount}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors text-left"
                  >
                    <UserPlus className="w-4 h-4" /> Switch Account
                  </button>
                  <button 
                    onClick={handleSignOut}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 hover:text-red-400 hover:bg-red-500/10 transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
      
      {/* HERO SECTION */}
      <div className="relative z-10 flex flex-col items-center flex-1 w-full max-w-5xl mx-auto">
        <motion.div
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6 }}
           className="text-center mb-10 md:mb-16"
        >
          <h1 className="text-white text-4xl md:text-6xl font-black mb-4 tracking-tight drop-shadow-2xl">
            {isManaging ? 'Manage Profiles' : "Choose Your Universe"}
          </h1>
          {!isManaging && (
            <p className="text-gray-400 text-lg md:text-xl">Continue your personalized streaming experience.</p>
          )}
        </motion.div>
        
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } }
          }}
          className="flex flex-wrap justify-center gap-6 md:gap-10 mb-16"
        >
          <AnimatePresence>
            {profiles.map((profile, i) => (
              <motion.div 
                key={profile.id} 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ y: -10 }}
                className="flex flex-col items-center group cursor-pointer"
                onClick={() => handleProfileClick(profile)}
              >
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative mb-4"
                >
                  <div className="w-28 h-28 md:w-40 md:h-40 rounded-2xl overflow-hidden border border-white/10 group-hover:border-white/50 transition-all duration-300 shadow-xl group-hover:shadow-[0_0_30px_rgba(229,9,20,0.4)] group-hover:ring-2 ring-transparent group-hover:ring-[#E50914]/50">
                    <img 
                      src={profile.avatarUrl} 
                      alt={profile.name} 
                      className="w-full h-full object-cover select-none"
                      onError={(e) => { e.currentTarget.src = AVATAR_REGISTRY[0]; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  {isManaging && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center rounded-2xl transition-all duration-300">
                      <Pencil className="w-10 h-10 text-white transition-transform duration-300 transform group-hover:scale-110 group-hover:text-[#E50914]" />
                    </div>
                  )}
                </motion.div>
                <span className={`text-gray-400 group-hover:text-white transition-colors text-sm md:text-xl font-medium tracking-wide ${isManaging ? 'font-bold text-white' : ''}`}>
                  {profile.name}
                </span>
              </motion.div>
            ))}
            
            {profiles.length < 5 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -10 }}
                className="flex flex-col items-center group cursor-pointer" 
                onClick={() => {
                  setName('');
                  const usedAvatars = profiles.map(p => p.avatarUrl);
                  const firstUnusedIndex = AVATAR_REGISTRY.findIndex(avatar => !usedAvatars.includes(avatar));
                  setAvatarIndex(firstUnusedIndex !== -1 ? firstUnusedIndex : 0);
                  setIsCreating(true);
                }}
              >
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-28 h-28 md:w-40 md:h-40 mb-4 rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-white/50 transition-all duration-300 bg-black/40 backdrop-blur-md shadow-xl group-hover:bg-white/10 group-hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                >
                  <PlusCircle className="w-12 h-12 md:w-16 md:h-16 text-gray-500 group-hover:text-white transition-colors duration-300" />
                </motion.div>
                <span className="text-gray-500 group-hover:text-white transition-colors text-sm md:text-xl font-medium tracking-wide">
                  Add Profile
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        
        <motion.div 
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 0.3, duration: 0.8 }}
           className="flex flex-col items-center w-full mt-10"
        >
           {/* Action Buttons for Logged In User */}
           <div className="flex justify-center w-full">
             <button 
               onClick={() => setIsManaging(!isManaging)}
               className={`flex items-center justify-center gap-2 px-8 py-3 rounded-full border transition-all text-sm md:text-base font-semibold tracking-wide ${isManaging ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.4)] hover:bg-gray-200' : 'bg-transparent border-gray-500 text-gray-400 hover:border-white hover:text-white'}`}
             >
               {isManaging ? 'Done Editing' : 'Manage Profiles'}
             </button>
           </div>
        </motion.div>
      </div>
    </div>
  );
}

