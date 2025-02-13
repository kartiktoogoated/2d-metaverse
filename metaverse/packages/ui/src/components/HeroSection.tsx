export default function Hero(){
    <div className="relative min-h-screen pt-16">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-6xl md:text-9xl text-glitch text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-teal-400 mb-6 font-bold hover:scale-105 transition-transform duration-500">
              METAVERSE 2D
            </h1>
            <p className="text-2xl md:text-3xl text-cyan-200 mb-12 max-w-3xl mx-auto leading-relaxed font-light typing-animation">
              &gt; INITIALIZING VIRTUAL WORLD_<br />
              &gt; CONNECTING PLAYERS_<br />
              &gt; LOADING EXPERIENCE_
            </p>
            <button 
              onClick={() => window.location.href = '/world'} 
              className="px-8 py-4 bg-gradient-to-r from-cyan-600 via-blue-600 to-teal-600 text-white text-2xl pixel-corners hover:from-cyan-500 hover:via-blue-500 hover:to-teal-500 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-cyan-500/25 relative group"
            >
              <span className="relative z-10">START_GAME.exe</span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-400 to-teal-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded"></div>
            </button>
          </div>
        </div>
      </div>
}

