import { Github, Twitter, Linkedin, Instagram, Mail } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-12 py-12 px-4 md:px-12 border-t border-white/5 text-gray-400 text-sm w-full bg-[#050505] animate-in fade-in duration-1000 fill-mode-both">
      <div className="max-w-5xl mx-auto flex flex-col items-center justify-center">
        <div className="mb-10 flex gap-8 justify-center">
          <a
            href="https://github.com/Whysahil"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-all transform hover:scale-110 duration-300"
            aria-label="GitHub"
          >
            <Github className="w-6 h-6" />
          </a>
          <a
            href="https://www.linkedin.com/in/sahil-kumar-297a40323"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-all transform hover:scale-110 duration-300"
            aria-label="LinkedIn"
          >
            <Linkedin className="w-6 h-6" />
          </a>
          <a
            href="https://x.com/imSahilpvt"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-all transform hover:scale-110 duration-300"
            aria-label="Twitter/X"
          >
            <Twitter className="w-6 h-6" />
          </a>
          <a
            href="#"
            className="text-gray-400 hover:text-white transition-all transform hover:scale-110 duration-300"
            aria-label="Instagram"
          >
            <Instagram className="w-6 h-6" />
          </a>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 mb-10 text-center w-full max-w-2xl">
          <Link to="/about" className="hover:text-white transition-colors font-medium text-base">
            About Verse
          </Link>
          <a href="mailto:sahilkumar854327@gmail.com" className="hover:text-white transition-colors font-medium text-base">
            Contact Us
          </a>
        </div>

        <div className="flex flex-col items-center gap-4 text-center mt-2 w-full">
          <p className="text-gray-500">
            &copy; {currentYear} Verse. All Rights Reserved.
          </p>

          <div className="h-px w-24 bg-gradient-to-r from-transparent via-white/10 to-transparent my-2" />

          <p className="text-gray-400 text-base flex items-center justify-center gap-2">
            Built by{" "}
            <Link to="/about" className="group">
              <span className="font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#E50914] group-hover:to-purple-500 transition-all duration-300">
                Sahil Singh
              </span>
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
