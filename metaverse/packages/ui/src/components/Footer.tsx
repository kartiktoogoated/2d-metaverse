import { Sparkles, Github, Twitter, Disc as Discord } from "lucide-react";

export default function Footer() {
  return (<footer className="bg-black/80 border-t border-cyan-900/30 py-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
        <div className="flex items-center space-x-2 group">
          <Sparkles className="w-6 h-6 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
          <span className="text-cyan-200 text-xl group-hover:text-cyan-100 transition-colors">METAVERSE_2D</span>
        </div>
        <div className="flex gap-8">
          {["DOCS", "SUPPORT", "COMMUNITY"].map((item) => (
            <a 
              key={item} 
              href="#" 
              className="text-cyan-400 hover:text-cyan-300 transition-all duration-300 hover:scale-110 transform"
            >
              {item}
            </a>
          ))}
        </div>
        <div className="flex gap-6">
          {[
            { icon: Github, url: "https://github.com/kartiktoogoated" },
            { icon: Twitter, url: "https://twitter.com/kartikkkxdd" },
            { icon: Discord, url: "https://discord.gg/yourinvite" }
          ].map((social, i) => (
            <a 
              key={i}
              href={social.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-cyan-400 hover:text-cyan-300 transition-all duration-300 hover:scale-125 transform"
            >
              <social.icon className="w-6 h-6" />
            </a>
          ))}
        </div>
      </div>
      <div className="text-center text-cyan-400 text-xl hover:text-cyan-300 transition-colors">© 2025 ALL_RIGHTS_RESERVED</div>
    </div>
  </footer>

   
  );
}