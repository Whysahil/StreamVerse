import { Github, Twitter, Linkedin, Instagram } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-20 py-12 px-4 md:px-12 border-t border-white/10 text-gray-500 text-sm w-full bg-[#141414] animate-in fade-in duration-1000 fill-mode-both">
      <div className="max-w-5xl mx-auto flex flex-col items-center justify-center">
        
        <div className="mb-8 flex gap-6 justify-center">
          <a href="#" className="hover:text-white transition-colors" aria-label="Github">
            <Github className="w-6 h-6" />
          </a>
          <a href="#" className="hover:text-white transition-colors" aria-label="Instagram">
            <Instagram className="w-6 h-6" />
          </a>
          <a href="#" className="hover:text-white transition-colors" aria-label="Twitter">
            <Twitter className="w-6 h-6" />
          </a>
          <a href="#" className="hover:text-white transition-colors" aria-label="LinkedIn">
            <Linkedin className="w-6 h-6" />
          </a>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-3 mb-10 text-center w-full max-w-4xl">
          <a href="#" className="hover:underline">Audio Description</a>
          <a href="#" className="hover:underline">Help Center</a>
          <a href="#" className="hover:underline">Gift Cards</a>
          <a href="#" className="hover:underline">Media Center</a>
          <a href="#" className="hover:underline">Investor Relations</a>
          <a href="#" className="hover:underline">Jobs</a>
          <a href="#" className="hover:underline">Terms of Use</a>
          <a href="#" className="hover:underline">Privacy</a>
          <a href="#" className="hover:underline">Legal Notices</a>
          <a href="#" className="hover:underline">Cookie Preferences</a>
          <a href="#" className="hover:underline">Corporate Information</a>
          <a href="#" className="hover:underline">Contact Us</a>
        </div>
        
        <div className="flex flex-col items-center gap-4 text-center mt-2 w-full">
          <p className="text-gray-400">
            &copy; {currentYear} Verse. All Rights Reserved.
          </p>
          
          <div className="h-px w-32 bg-gradient-to-r from-transparent via-gray-600 to-transparent my-1" />

          <p className="text-gray-200 text-base md:text-lg leading-relaxed flex items-center justify-center gap-2">
            Designed & Developed by{' '}
            <span 
              className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#E50914] to-purple-500 hover:drop-shadow-[0_0_12px_rgba(229,9,20,0.8)] transition-all duration-300 inline-block transform hover:scale-110 cursor-default"
            >
              Sahil Singh
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
