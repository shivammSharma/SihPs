import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const DoshaVisualization = () => {
  // const [selectedDosha, setSelectedDosha] = useState('vata');

  // const doshaData = [
  //   {
  //     id: 'vata',
  //     name: 'Vata',
  //     sanskrit: 'वात',
  //     pronunciation: 'VAH-tah',
  //     element: 'Air + Space',
  //     qualities: 'Light, Dry, Cold, Rough, Subtle, Mobile',
  //     physicalTraits: 'Thin build, dry skin, cold hands/feet, variable appetite',
  //     mentalTraits: 'Creative, quick thinking, enthusiastic, anxious when imbalanced',
  //     nutritionalNeeds: 'Warm, moist, grounding foods. Regular meal times. Avoid raw, cold foods.',
  //     color: '#87A96B',
  //     icon: 'Wind',
  //     foods: ['Warm soups', 'Cooked grains', 'Sweet fruits', 'Ghee', 'Nuts', 'Warm spices'],
  //     avoidFoods: ['Raw vegetables', 'Cold drinks', 'Dry crackers', 'Beans', 'Caffeine']
  //   },
  //   {
  //     id: 'pitta',
  //     name: 'Pitta',
  //     sanskrit: 'पित्त',
  //     pronunciation: 'PIT-tah',
  //     element: 'Fire + Water',
  //     qualities: 'Hot, Sharp, Light, Liquid, Spreading, Oily',
  //     physicalTraits: 'Medium build, warm body, strong appetite, good digestion',
  //     mentalTraits: 'Focused, organized, competitive, irritable when imbalanced',
  //     nutritionalNeeds: 'Cool, sweet, bitter foods. Avoid spicy, sour, salty. Regular meals.',
  //     color: '#D4AF37',
  //     icon: 'Flame',
  //     foods: ['Sweet fruits', 'Leafy greens', 'Coconut', 'Milk', 'Cooling herbs', 'Bitter vegetables'],
  //     avoidFoods: ['Spicy foods', 'Citrus', 'Tomatoes', 'Alcohol', 'Red meat', 'Hot spices']
  //   },
  //   {
  //     id: 'kapha',
  //     name: 'Kapha',
  //     sanskrit: 'कफ',
  //     pronunciation: 'KAH-fah',
  //     element: 'Earth + Water',
  //     qualities: 'Heavy, Slow, Cool, Oily, Smooth, Dense, Soft, Stable',
  //     physicalTraits: 'Sturdy build, smooth skin, slow digestion, steady energy',
  //     mentalTraits: 'Calm, loving, patient, lethargic when imbalanced',
  //     nutritionalNeeds: 'Light, warm, spicy foods. Smaller portions. Avoid heavy, oily foods.',
  //     color: '#2D5016',
  //     icon: 'Mountain',
  //     foods: ['Light grains', 'Spicy foods', 'Bitter greens', 'Legumes', 'Warming spices', 'Honey'],
  //     avoidFoods: ['Dairy', 'Sweet foods', 'Heavy oils', 'Cold foods', 'Excessive salt', 'Wheat']
  //   }
  // ];

  // const selectedDoshaData = doshaData?.find(dosha => dosha?.id === selectedDosha);

  // return (
  //   <div className="bg-gradient-to-br from-brand-ivory to-brand-cream rounded-2xl p-8 organic-shadow">
  //     <div className="text-center mb-8">
  //       <h2 className="text-3xl font-display font-semibold text-primary mb-3">
  //         Interactive Dosha Explorer
  //       </h2>
  //       <p className="text-text-secondary max-w-2xl mx-auto">
  //         Discover the three fundamental energies that govern all biological processes. 
  //         Click on each dosha to explore their unique characteristics and nutritional needs.
  //       </p>
  //     </div>
  //     {/* Dosha Selection */}
  //     <div className="flex justify-center mb-8">
  //       <div className="flex space-x-4 bg-background/50 rounded-xl p-2">
  //         {doshaData?.map((dosha) => (
  //           <button
  //             key={dosha?.id}
  //             onClick={() => setSelectedDosha(dosha?.id)}
  //             className={`flex items-center space-x-3 px-6 py-4 rounded-lg organic-transition ${
  //               selectedDosha === dosha?.id
  //                 ? 'bg-background text-primary elevated-shadow'
  //                 : 'text-text-secondary hover:text-primary hover:bg-background/30'
  //             }`}
  //           >
  //             <Icon name={dosha?.icon} size={24} style={{ color: dosha?.color }} />
  //             <div className="text-left">
  //               <div className="font-semibold">{dosha?.name}</div>
  //               <div className="text-sm opacity-70">{dosha?.sanskrit}</div>
  //             </div>
  //           </button>
  //         ))}
  //       </div>
  //     </div>
  //     {/* Selected Dosha Details */}
  //     <div className="grid lg:grid-cols-2 gap-8">
  //       {/* Left Column - Basic Info */}
  //       <div className="space-y-6">
  //         <div className="bg-background/60 rounded-xl p-6">
  //           <div className="flex items-center space-x-4 mb-4">
  //             <div 
  //               className="w-16 h-16 rounded-full flex items-center justify-center"
  //               style={{ backgroundColor: `${selectedDoshaData?.color}20` }}
  //             >
  //               <Icon 
  //                 name={selectedDoshaData?.icon} 
  //                 size={32} 
  //                 style={{ color: selectedDoshaData?.color }} 
  //               />
  //             </div>
  //             <div>
  //               <h3 className="text-2xl font-display font-semibold text-primary">
  //                 {selectedDoshaData?.name}
  //               </h3>
  //               <div className="flex items-center space-x-2 text-text-secondary">
  //                 <span className="text-lg">{selectedDoshaData?.sanskrit}</span>
  //                 <button className="text-sm bg-muted px-2 py-1 rounded">
  //                   🔊 {selectedDoshaData?.pronunciation}
  //                 </button>
  //               </div>
  //             </div>
  //           </div>
            
  //           <div className="space-y-3">
  //             <div>
  //               <span className="font-medium text-primary">Elements: </span>
  //               <span className="text-text-secondary">{selectedDoshaData?.element}</span>
  //             </div>
  //             <div>
  //               <span className="font-medium text-primary">Qualities: </span>
  //               <span className="text-text-secondary">{selectedDoshaData?.qualities}</span>
  //             </div>
  //           </div>
  //         </div>

  //         <div className="bg-background/60 rounded-xl p-6">
  //           <h4 className="font-semibold text-primary mb-3 flex items-center">
  //             <Icon name="User" size={18} className="mr-2" />
  //             Constitutional Traits
  //           </h4>
  //           <div className="space-y-3">
  //             <div>
  //               <span className="font-medium text-primary">Physical: </span>
  //               <span className="text-text-secondary">{selectedDoshaData?.physicalTraits}</span>
  //             </div>
  //             <div>
  //               <span className="font-medium text-primary">Mental: </span>
  //               <span className="text-text-secondary">{selectedDoshaData?.mentalTraits}</span>
  //             </div>
  //           </div>
  //         </div>
  //       </div>

  //       {/* Right Column - Nutritional Guidance */}
  //       <div className="space-y-6">
  //         <div className="bg-background/60 rounded-xl p-6">
  //           <h4 className="font-semibold text-primary mb-3 flex items-center">
  //             <Icon name="Utensils" size={18} className="mr-2" />
  //             Nutritional Guidelines
  //           </h4>
  //           <p className="text-text-secondary mb-4">{selectedDoshaData?.nutritionalNeeds}</p>
            
  //           <div className="grid sm:grid-cols-2 gap-4">
  //             <div>
  //               <h5 className="font-medium text-success mb-2 flex items-center">
  //                 <Icon name="Plus" size={16} className="mr-1" />
  //                 Beneficial Foods
  //               </h5>
  //               <div className="space-y-1">
  //                 {selectedDoshaData?.foods?.map((food, index) => (
  //                   <div key={index} className="text-sm text-text-secondary bg-success/10 px-2 py-1 rounded">
  //                     {food}
  //                   </div>
  //                 ))}
  //               </div>
  //             </div>
              
  //             <div>
  //               <h5 className="font-medium text-error mb-2 flex items-center">
  //                 <Icon name="Minus" size={16} className="mr-1" />
  //                 Foods to Limit
  //               </h5>
  //               <div className="space-y-1">
  //                 {selectedDoshaData?.avoidFoods?.map((food, index) => (
  //                   <div key={index} className="text-sm text-text-secondary bg-error/10 px-2 py-1 rounded">
  //                     {food}
  //                   </div>
  //                 ))}
  //               </div>
  //             </div>
  //           </div>
  //         </div>

  //         <div className="bg-gradient-to-r from-brand-gold/10 to-brand-sage/10 rounded-xl p-6 border border-brand-gold/20">
  //           <div className="flex items-center space-x-2 mb-3">
  //             <Icon name="Lightbulb" size={18} className="text-brand-gold" />
  //             <h4 className="font-semibold text-primary">Quick Tip</h4>
  //           </div>
  //           <p className="text-text-secondary text-sm">
  //             Remember that most people have a combination of doshas (Prakriti) with one being dominant. 
  //             Your current state (Vikriti) may differ from your natural constitution due to lifestyle factors.
  //           </p>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );
};

export default DoshaVisualization;