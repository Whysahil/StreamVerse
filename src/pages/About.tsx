import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Github, Twitter, Linkedin, Heart, Code2, Mail } from 'lucide-react';

export function About() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-24 min-h-screen px-4 md:px-12 bg-[#050505] overflow-hidden relative">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/4 w-[30rem] h-[30rem] bg-[#E50914] rounded-full mix-blend-screen filter blur-[150px] opacity-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-[#4A0E12] rounded-full mix-blend-screen filter blur-[150px] opacity-10" />

      <div className="max-w-4xl mx-auto space-y-16 pb-20 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6 drop-shadow-2xl">
            Meet <span className="text-[#E50914]">Verse</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 font-light max-w-2xl mx-auto leading-relaxed">
            A modern streaming discovery platform focused on personalized recommendations, immersive UI, and premium user experience.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <div className="bg-[#141414]/80 backdrop-blur-md p-8 rounded-3xl border border-white/5 shadow-2xl">
            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6">
              <Code2 className="w-7 h-7 text-[#E50914]" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">The Architecture</h3>
            <p className="text-gray-400 leading-relaxed">
              Built with cutting-edge React 19, Vite, and Framer Motion. Featuring a robust Firebase backend for secure authentication and high-performance NoSQL data persistence. Designed to scale seamlessly across all devices.
            </p>
          </div>

          <div className="bg-[#141414]/80 backdrop-blur-md p-8 rounded-3xl border border-white/5 shadow-2xl">
            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6">
              <Heart className="w-7 h-7 text-[#E50914]" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">The Vision</h3>
            <p className="text-gray-400 leading-relaxed">
              We believe finding what to watch shouldn't be a chore. Verse leverages smart mood discovery and intelligent analytics to bring the perfect story straight to your screen, wrapped in a beautiful cinematic interface.
            </p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-[#141414]/80 backdrop-blur-md p-10 md:p-14 rounded-3xl border border-white/5 shadow-2xl text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50" />
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#E50914] to-[#4A0E12] p-[2px] mb-8">
              <div className="w-full h-full bg-[#050505] rounded-full flex flex-col items-center justify-center shadow-inner">
                <Code2 className="w-10 h-10 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Built by Sahil Singh</h2>
            <p className="text-gray-400 text-sm tracking-widest uppercase mb-6 font-medium tracking-[0.2em] bg-clip-text text-transparent bg-gradient-to-r from-gray-400 to-gray-500">
              Computer Science Student • Full Stack Developer
            </p>
            <p className="text-gray-400 text-lg mb-10 max-w-lg mx-auto leading-relaxed">
              Passionate about building scalable web applications, exploring modern technologies, and creating user-focused digital experiences.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              <SocialLink icon={<Mail className="w-5 h-5" />} href="mailto:sahilkumar854327@gmail.com" label="Email" />
              <SocialLink icon={<Github className="w-5 h-5" />} href="https://github.com/Whysahil" label="GitHub" />
              <SocialLink icon={<Linkedin className="w-5 h-5" />} href="https://www.linkedin.com/in/sahil-kumar-297a40323" label="LinkedIn" />
              <SocialLink icon={<Twitter className="w-5 h-5" />} href="https://x.com/imSahilpvt" label="Twitter" />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function SocialLink({ icon, href, label }: { icon: React.ReactNode, href: string, label: string }) {
  return (
    <a 
      href={href}
      target={href.startsWith('mailto:') ? undefined : "_blank"}
      rel={href.startsWith('mailto:') ? undefined : "noopener noreferrer"}
      className="flex items-center gap-3 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-full text-white transition-all duration-300 shadow-lg border border-white/5 hover:border-white/20 hover:scale-105"
      aria-label={label}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </a>
  );
}
