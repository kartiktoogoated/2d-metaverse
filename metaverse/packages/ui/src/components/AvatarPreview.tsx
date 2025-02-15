
export default function AvatarPreview(){
   <div className="relative py-32 section-transition">
        <div className="mt-32 grid grid-cols-3 md:grid-cols-6 gap-8 max-w-4xl mx-auto">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="avatar-container">
              <img
                src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=player${i}&backgroundColor=transparent`}
                alt={`Avatar ${i + 1}`}
                className="w-20 h-20 mx-auto filter drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]"
              />
            </div>
          ))}
        </div>
      </div>
}
