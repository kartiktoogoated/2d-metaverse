
export default function AvatarPreview(){
    <div className="mt-32 grid grid-cols-3 md:grid-cols-6 gap-8 max-w-4xl mx-auto">
            {[...Array(6)].map((_, i) => (
              <div 
                key={i} 
                className="group cursor-pointer transform transition-all duration-300 hover:scale-110"
              >
                <div 
                  className={`animate-float`} 
                  style={{ animationDelay: `${i * 0.5}s` }}
                >
                  <img
                    src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=player${i}&backgroundColor=transparent`}
                    alt={`Avatar ${i + 1}`}
                    className="w-20 h-20 mx-auto filter drop-shadow-[0_0_8px_rgba(34,211,238,0.4)] group-hover:drop-shadow-[0_0_12px_rgba(34,211,238,0.6)] transition-all duration-300"
                  />
                </div>
              </div>
            ))}
          </div>
}
