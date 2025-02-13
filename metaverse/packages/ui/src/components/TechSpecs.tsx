import { Gamepad2, Wifi, Shield, Zap } from "lucide-react";

export default function TechSpecs() {
  return (<div className="relative py-32">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-4xl md:text-5xl text-center text-cyan-300 mb-24 hover:text-cyan-200 transition-colors">&gt; TECH_SPECS</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
        {[
          { icon: Gamepad2, value: "1000+", label: "Active Players" },
          { icon: Wifi, value: "50ms", label: "Average Latency" },
          { icon: Shield, value: "100%", label: "Secure Connection" },
          { icon: Zap, value: "60 FPS", label: "Smooth Performance" }
        ].map((stat, i) => (
          <div key={i} className="p-6 group hover:transform hover:scale-110 transition-all duration-300">
            <stat.icon className="w-12 h-12 mx-auto mb-4 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
            <div className="text-4xl text-cyan-200 mb-2 group-hover:text-cyan-100 transition-colors">{stat.value}</div>
            <div className="text-xl text-cyan-400 group-hover:text-cyan-300 transition-colors">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
   </div>       
   );
}
