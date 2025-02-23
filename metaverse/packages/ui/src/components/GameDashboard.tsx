
// import {  useState } from "react";
// import { useSearchParams } from "react-router-dom";
// import Game from "./Game"; 

const GameDashboard: React.FC = () => {
  // const [setSelectedWorld] = useState<string | null>(null);



  return (
    <div className="min-h-screen bg-black text-cyan-100">
      <h1 className="text-4xl font-bold text-cyan-300 mb-4">Select a World</h1>
      <div className="grid grid-cols-2 gap-4">
        {[
          { id: '1', name: 'Neo Tokyo' },
          { id: '2', name: 'Crystal Valley' },
          { id: '3', name: 'Digital Oasis' }
        ].map((world) => (
          <div 
            key={world.id} 
            className="cursor-pointer bg-gray-800 p-4 rounded-lg hover:bg-gray-700"
          >
            <h3 className="text-lg text-cyan-300">{world.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameDashboard;
