import { Globe2, MessageSquare, Users } from "lucide-react";

export default function Features() {
  return (<div className="relative py-32 bg-gradient-to-b from-transparent via-cyan-950/30 to-transparent">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-4xl md:text-5xl text-center text-cyan-300 mb-24 hover:text-cyan-200 transition-colors">&gt; SYSTEM_FEATURES</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {[
          { icon: Users, title: "MULTIPLAYER", desc: "Connect with friends and meet new players in our virtual spaces." },
          { icon: MessageSquare, title: "REAL-TIME CHAT", desc: "Communicate seamlessly through our integrated chat system." },
          { icon: Globe2, title: "VIRTUAL SPACES", desc: "Explore unique environments and create memorable experiences." }
        ].map((feature, i) => (
          <div 
            key={i}
            className="group text-center p-8 pixel-corners bg-black/50 backdrop-blur-sm border border-cyan-700/30 hover:border-cyan-500/50 transition-all duration-500 hover:transform hover:scale-105 hover:bg-black/70"
          >
            <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-gradient-to-br from-cyan-600/20 to-blue-600/20 flex items-center justify-center group-hover:from-cyan-500/30 group-hover:to-blue-500/30 transition-all duration-300">
              <feature.icon className="w-10 h-10 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
            </div>
            <h3 className="text-2xl text-cyan-200 mb-4 group-hover:text-cyan-100 transition-colors">{feature.title}</h3>
            <p className="text-cyan-300 text-xl group-hover:text-cyan-200 transition-colors">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
  )};



