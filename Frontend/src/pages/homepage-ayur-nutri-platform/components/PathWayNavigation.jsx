// import React, { useState, useEffect } from 'react';
// import Icon from '../../../components/AppIcon';
// import Button from '../../../components/ui/Button';
// import Input from '../../../components/ui/Input';
// import Select from '../../../components/ui/Select';

// const PathWayNavigation = () => {
//   const [currentStep, setCurrentStep] = useState(0);
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [formData, setFormData] = useState({
//     name: '',
//     age: '',
//     gender: '',
//     primaryConcern: '',
//     lifestyle: '',
//     dietaryRestrictions: ''
//   });
//   const [results, setResults] = useState(null);

//   const demoSteps = [
//     {
//       title: 'Patient Information',
//       description: 'Basic demographic and health information',
//       icon: 'User'
//     },
//     {
//       title: 'Constitutional Assessment',
//       description: 'Ayurvedic dosha analysis and lifestyle factors',
//       icon: 'Leaf'
//     },
//     {
//       title: 'AI Processing',
//       description: 'Generating personalized recommendations',
//       icon: 'Brain'
//     },
//     {
//       title: 'Personalized Plan',
//       description: 'Complete Ayurvedic-nutrition recommendations',
//       icon: 'FileText'
//     }
//   ];

//   const genderOptions = [
//     { value: 'female', label: 'Female' },
//     { value: 'male', label: 'Male' },
//     { value: 'other', label: 'Other' }
//   ];

//   const concernOptions = [
//     { value: 'digestive', label: 'Digestive Issues' },
//     { value: 'energy', label: 'Low Energy/Fatigue' },
//     { value: 'weight', label: 'Weight Management' },
//     { value: 'stress', label: 'Stress & Anxiety' },
//     { value: 'sleep', label: 'Sleep Problems' },
//     { value: 'immunity', label: 'Immune Support' }
//   ];

//   const lifestyleOptions = [
//     { value: 'sedentary', label: 'Sedentary (Office work)' },
//     { value: 'moderate', label: 'Moderately Active' },
//     { value: 'active', label: 'Very Active' },
//     { value: 'athlete', label: 'Professional Athlete' }
//   ];

//   const restrictionOptions = [
//     { value: 'none', label: 'No Restrictions' },
//     { value: 'vegetarian', label: 'Vegetarian' },
//     { value: 'vegan', label: 'Vegan' },
//     { value: 'gluten-free', label: 'Gluten-Free' },
//     { value: 'dairy-free', label: 'Dairy-Free' },
//     { value: 'keto', label: 'Ketogenic' }
//   ];

//   const sampleResults = {
//     constitution: {
//       primary: 'Vata',
//       secondary: 'Pitta',
//       balance: {
//         vata: 45,
//         pitta: 35,
//         kapha: 20
//       }
//     },
//     recommendations: {
//       dailyCalories: 1850,
//       macros: {
//         protein: 25,
//         carbs: 45,
//         fats: 30
//       },
//       mealTiming: [
//         { time: '7:00 AM', meal: 'Breakfast', description: 'Warm, grounding foods' },
//         { time: '12:30 PM', meal: 'Lunch', description: 'Largest meal, balanced' },
//         { time: '6:30 PM', meal: 'Dinner', description: 'Light, easy to digest' }
//       ],
//       keyFoods: [
//         { name: 'Warm Oatmeal', reason: 'Grounding for Vata' },
//         { name: 'Sweet Potatoes', reason: 'Nourishing and warming' },
//         { name: 'Ghee', reason: 'Healthy fats for Vata' },
//         { name: 'Ginger Tea', reason: 'Digestive support' }
//       ],
//       avoidFoods: [
//         { name: 'Raw Salads', reason: 'Too cooling for Vata' },
//         { name: 'Iced Drinks', reason: 'Disrupts digestion' },
//         { name: 'Processed Foods', reason: 'Increases Vata imbalance' }
//       ]
//     },
//     lifestyle: {
//       exercise: 'Gentle yoga, walking, swimming',
//       sleepTime: '10:00 PM - 6:00 AM',
//       stressManagement: 'Meditation, pranayama, warm oil massage'
//     }
//   };

//   const handleInputChange = (field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   const handleNext = () => {
//     if (currentStep < demoSteps?.length - 1) {
//       setCurrentStep(currentStep + 1);
      
//       if (currentStep === 1) {
//         // Start AI processing simulation
//         setIsGenerating(true);
//         setTimeout(() => {
//           setIsGenerating(false);
//           setResults(sampleResults);
//           setCurrentStep(3);
//         }, 3000);
//       }
//     }
//   };

//   const handlePrevious = () => {
//     if (currentStep > 0) {
//       setCurrentStep(currentStep - 1);
//     }
//   };

//   const resetDemo = () => {
//     setCurrentStep(0);
//     setFormData({
//       name: '',
//       age: '',
//       gender: '',
//       primaryConcern: '',
//       lifestyle: '',
//       dietaryRestrictions: ''
//     });
//     setResults(null);
//     setIsGenerating(false);
//   };

//   const renderStepContent = () => {
//     switch (currentStep) {
//       case 0:
//         return (
//           <div className="space-y-6">
//             <div className="grid md:grid-cols-2 gap-6">
//               <Input
//                 label="Patient Name"
//                 type="text"
//                 placeholder="Enter patient name"
//                 value={formData?.name}
//                 onChange={(e) => handleInputChange('name', e?.target?.value)}
//               />
//               <Input
//                 label="Age"
//                 type="number"
//                 placeholder="Enter age"
//                 value={formData?.age}
//                 onChange={(e) => handleInputChange('age', e?.target?.value)}
//               />
//             </div>
//             <Select
//               label="Gender"
//               options={genderOptions}
//               value={formData?.gender}
//               onChange={(value) => handleInputChange('gender', value)}
//               placeholder="Select gender"
//             />
//             <Select
//               label="Primary Health Concern"
//               options={concernOptions}
//               value={formData?.primaryConcern}
//               onChange={(value) => handleInputChange('primaryConcern', value)}
//               placeholder="Select primary concern"
//             />
//           </div>
//         );
      
//       case 1:
//         return (
//           <div className="space-y-6">
//             <Select
//               label="Lifestyle Activity Level"
//               options={lifestyleOptions}
//               value={formData?.lifestyle}
//               onChange={(value) => handleInputChange('lifestyle', value)}
//               placeholder="Select activity level"
//             />
//             <Select
//               label="Dietary Restrictions"
//               options={restrictionOptions}
//               value={formData?.dietaryRestrictions}
//               onChange={(value) => handleInputChange('dietaryRestrictions', value)}
//               placeholder="Select dietary restrictions"
//             />
//             <div className="bg-muted/50 rounded-lg p-6">
//               <h4 className="font-semibold text-text-primary mb-4">Constitutional Assessment Preview</h4>
//               <div className="grid grid-cols-3 gap-4">
//                 <div className="text-center p-3 bg-background rounded">
//                   <Icon name="Wind" size={20} className="text-blue-600 mx-auto mb-2" />
//                   <div className="text-sm font-medium">Vata</div>
//                   <div className="text-xs text-text-secondary">Movement</div>
//                 </div>
//                 <div className="text-center p-3 bg-background rounded">
//                   <Icon name="Flame" size={20} className="text-red-600 mx-auto mb-2" />
//                   <div className="text-sm font-medium">Pitta</div>
//                   <div className="text-xs text-text-secondary">Transformation</div>
//                 </div>
//                 <div className="text-center p-3 bg-background rounded">
//                   <Icon name="Mountain" size={20} className="text-green-600 mx-auto mb-2" />
//                   <div className="text-sm font-medium">Kapha</div>
//                   <div className="text-xs text-text-secondary">Structure</div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         );
      
//       case 2:
//         return (
//           <div className="text-center py-12">f
//             <div className="relative w-32 h-32 mx-auto mb-8">
//               <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
//               <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
//               <div className="absolute inset-0 flex items-center justify-center">
//                 <Icon name="Brain" size={32} className="text-primary" />
//               </div>
//             </div>
            
//             <h4 className="text-xl font-display font-bold text-text-primary mb-4">
//               AI Processing Your Information
//             </h4>
//             <p className="text-text-secondary mb-6">
//               Our advanced algorithms are analyzing your constitutional type and generating personalized recommendations...
//             </p>
            
//             <div className="space-y-2 max-w-md mx-auto">
//               <div className="flex items-center justify-between text-sm">
//                 <span>Dosha Analysis</span>
//                 <Icon name="Check" size={16} className="text-success" />
//               </div>
//               <div className="flex items-center justify-between text-sm">
//                 <span>Nutritional Mapping</span>
//                 <Icon name="Check" size={16} className="text-success" />
//               </div>
//               <div className="flex items-center justify-between text-sm">
//                 <span>Meal Plan Generation</span>
//                 <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
//               </div>
//             </div>
//           </div>
//         );
      
//       case 3:
//         return results && (
//           <div className="space-y-8">
//             {/* Constitutional Results */}
//             <div className="bg-muted/50 rounded-lg p-6">
//               <h4 className="font-semibold text-text-primary mb-4 flex items-center">
//                 <Icon name="Leaf" size={20} className="text-primary mr-2" />
//                 Constitutional Analysis
//               </h4>
//               <div className="grid md:grid-cols-2 gap-6">
//                 <div>
//                   <p className="text-sm text-text-secondary mb-3">Primary Constitution</p>
//                   <div className="flex items-center space-x-3">
//                     <span className="text-2xl font-bold text-primary">
//                       {results?.constitution?.primary}-{results?.constitution?.secondary}
//                     </span>
//                     <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
//                       Dominant
//                     </span>
//                   </div>
//                 </div>
//                 <div className="space-y-2">
//                   {Object.entries(results?.constitution?.balance)?.map(([dosha, percentage]) => (
//                     <div key={dosha}>
//                       <div className="flex justify-between text-sm mb-1">
//                         <span className="capitalize">{dosha}</span>
//                         <span>{percentage}%</span>
//                       </div>
//                       <div className="w-full bg-background rounded-full h-2">
//                         <div
//                           className={`h-2 rounded-full ${
//                             dosha === 'vata' ? 'bg-blue-500' : 
//                             dosha === 'pitta' ? 'bg-red-500' : 'bg-green-500'
//                           }`}
//                           style={{ width: `${percentage}%` }}
//                         />
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* Nutritional Recommendations */}
//             <div className="grid md:grid-cols-2 gap-6">
//               <div className="bg-card rounded-lg p-6 border border-border">
//                 <h4 className="font-semibold text-text-primary mb-4 flex items-center">
//                   <Icon name="BarChart3" size={20} className="text-secondary mr-2" />
//                   Daily Nutrition Plan
//                 </h4>
//                 <div className="space-y-4">
//                   <div className="text-center p-3 bg-muted/50 rounded">
//                     <div className="text-2xl font-bold text-secondary">{results?.recommendations?.dailyCalories}</div>
//                     <div className="text-sm text-text-secondary">Daily Calories</div>
//                   </div>
//                   <div className="space-y-2">
//                     {Object.entries(results?.recommendations?.macros)?.map(([macro, percentage]) => (
//                       <div key={macro}>
//                         <div className="flex justify-between text-sm mb-1">
//                           <span className="capitalize">{macro}</span>
//                           <span>{percentage}%</span>
//                         </div>
//                         <div className="w-full bg-muted rounded-full h-2">
//                           <div
//                             className="bg-secondary h-2 rounded-full"
//                             style={{ width: `${percentage}%` }}
//                           />
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-card rounded-lg p-6 border border-border">
//                 <h4 className="font-semibold text-text-primary mb-4 flex items-center">
//                   <Icon name="Clock" size={20} className="text-accent mr-2" />
//                   Meal Timing
//                 </h4>
//                 <div className="space-y-3">
//                   {results?.recommendations?.mealTiming?.map((meal, index) => (
//                     <div key={index} className="flex items-center space-x-3 p-3 bg-muted/50 rounded">
//                       <div className="text-sm font-medium text-primary">{meal?.time}</div>
//                       <div className="flex-1">
//                         <div className="text-sm font-medium text-text-primary">{meal?.meal}</div>
//                         <div className="text-xs text-text-secondary">{meal?.description}</div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* Food Recommendations */}
//             <div className="grid md:grid-cols-2 gap-6">
//               <div className="bg-card rounded-lg p-6 border border-border">
//                 <h4 className="font-semibold text-text-primary mb-4 flex items-center">
//                   <Icon name="Plus" size={20} className="text-success mr-2" />
//                   Recommended Foods
//                 </h4>
//                 <div className="space-y-3">
//                   {results?.recommendations?.keyFoods?.map((food, index) => (
//                     <div key={index} className="flex items-start space-x-3">
//                       <Icon name="Check" size={16} className="text-success mt-0.5 flex-shrink-0" />
//                       <div>
//                         <div className="text-sm font-medium text-text-primary">{food?.name}</div>
//                         <div className="text-xs text-text-secondary">{food?.reason}</div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               <div className="bg-card rounded-lg p-6 border border-border">
//                 <h4 className="font-semibold text-text-primary mb-4 flex items-center">
//                   <Icon name="Minus" size={20} className="text-error mr-2" />
//                   Foods to Minimize
//                 </h4>
//                 <div className="space-y-3">
//                   {results?.recommendations?.avoidFoods?.map((food, index) => (
//                     <div key={index} className="flex items-start space-x-3">
//                       <Icon name="X" size={16} className="text-error mt-0.5 flex-shrink-0" />
//                       <div>
//                         <div className="text-sm font-medium text-text-primary">{food?.name}</div>
//                         <div className="text-xs text-text-secondary">{food?.reason}</div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         );
      
//       default:
//         return null;
//     }
//   };

//   return (
//     <section className="py-20 bg-gradient-to-br from-card to-background">
//       <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="text-center mb-16">
//           <div className="inline-flex items-center space-x-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-6">
//             <Icon name="Play" size={16} />
//             <span>Interactive Demo</span>
//           </div>
          
//           <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-text-primary mb-6">
//             Experience AyurNutri
//             <span className="block text-primary">In Action</span>
//           </h2>
          
//           <p className="text-lg text-text-secondary max-w-3xl mx-auto">
//             See how our platform generates personalized Ayurvedic-nutrition recommendations in real-time. 
//             Input sample patient data and watch the AI create a comprehensive wellness plan.
//           </p>
//         </div>

//         <div className="bg-card rounded-2xl organic-shadow border border-border overflow-hidden">
//           {/* Progress Steps */}
//           <div className="bg-muted/30 px-8 py-6 border-b border-border">
//             <div className="flex items-center justify-between">
//               {demoSteps?.map((step, index) => (
//                 <div key={index} className="flex items-center">
//                   <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 organic-transition ${
//                     index <= currentStep 
//                       ? 'bg-primary border-primary text-white' :'bg-background border-border text-text-secondary'
//                   }`}>
//                     {index < currentStep ? (
//                       <Icon name="Check" size={16} />
//                     ) : (
//                       <Icon name={step?.icon} size={16} />
//                     )}
//                   </div>
//                   {index < demoSteps?.length - 1 && (
//                     <div className={`w-16 h-0.5 mx-4 organic-transition ${
//                       index < currentStep ? 'bg-primary' : 'bg-border'
//                     }`} />
//                   )}
//                 </div>
//               ))}
//             </div>
//             <div className="mt-4">
//               <h3 className="text-lg font-display font-bold text-text-primary">
//                 {demoSteps?.[currentStep]?.title}
//               </h3>
//               <p className="text-text-secondary text-sm">
//                 {demoSteps?.[currentStep]?.description}
//               </p>
//             </div>
//           </div>

//           {/* Step Content */}
//           <div className="p-8">
//             {renderStepContent()}
//           </div>

//           {/* Navigation */}
//           <div className="bg-muted/30 px-8 py-6 border-t border-border flex items-center justify-between">
//             <div>
//               {currentStep === 3 && (
//                 <Button
//                   variant="outline"
//                   onClick={resetDemo}
//                   iconName="RotateCcw"
//                   iconPosition="left"
//                 >
//                   Try Another Demo
//                 </Button>
//               )}
//             </div>
            
//             <div className="flex space-x-4">
//               {currentStep > 0 && currentStep !== 2 && currentStep !== 3 && (
//                 <Button
//                   variant="outline"
//                   onClick={handlePrevious}
//                   iconName="ChevronLeft"
//                   iconPosition="left"
//                 >
//                   Previous
//                 </Button>
//               )}
              
//               {currentStep < 2 && (
//                 <Button
//                   variant="default"
//                   onClick={handleNext}
//                   disabled={
//                     (currentStep === 0 && (!formData?.name || !formData?.age || !formData?.gender || !formData?.primaryConcern)) ||
//                     (currentStep === 1 && (!formData?.lifestyle || !formData?.dietaryRestrictions))
//                   }
//                   iconName="ChevronRight"
//                   iconPosition="right"
//                   className="bg-primary hover:bg-primary/90"
//                 >
//                   {currentStep === 1 ? 'Generate Plan' : 'Next'}
//                 </Button>
//               )}
              
//               {currentStep === 3 && (
//                 <Button
//                   variant="default"
//                   className="bg-secondary hover:bg-secondary/90"
//                   iconName="Calendar"
//                   iconPosition="left"
//                 >
//                   Schedule Full Assessment
//                 </Button>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Demo CTA */}
//         <div className="text-center mt-12">
//           <p className="text-text-secondary mb-6">
//             Ready to see the full platform in action?
//           </p>
//           <div className="flex flex-col sm:flex-row gap-4 justify-center">
//             <Button
//               variant="default"
//               size="lg"
//               className="bg-primary hover:bg-primary/90"
//               iconName="Calendar"
//               iconPosition="left"
//             >
//               Request Professional Demo
//             </Button>
//             <Button
//               variant="outline"
//               size="lg"
//               iconName="Play"
//               iconPosition="left"
//             >
//               Watch Video Overview
//             </Button>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default PathWayNavigation;




import React from 'react';
import Icon from '../../../components/AppIcon';

const PathWayNavigation = () => {
  return (
    <section className="py-12 bg-transparent">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-card rounded-2xl p-6 border border-border flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex-1 min-w-0">
            <h3 className="text-2xl font-display font-bold text-text-primary">
              Choose a Pathway
            </h3>
            <p className="text-text-secondary mt-2 max-w-xl">
              Start with a guided pathway tailored to your role — whether you're a practitioner,
              a patient, or exploring Ayurvedic nutrition for wellbeing.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <a
              href="/doctors"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-white text-sm font-medium shadow-sm"
              aria-label="For doctors"
            >
              <Icon name="User" size={16} />
              <span>For Practitioners</span>
            </a>

            <a
              href="/patients"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-border bg-background text-sm font-medium"
              aria-label="For patients"
            >
              <Icon name="Heart" size={16} />
              <span>For Patients</span>
            </a>

            <a
              href="#live-demo"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-accent/10 text-accent text-sm font-medium"
              aria-label="Try demo"
              onClick={(e) => {
                // smooth-scroll to LiveDemo section if present on page
                const el = document.querySelector('section#live-demo') || document.querySelector('.bg-card');
                if (el) {
                  e.preventDefault();
                  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
            >
              <Icon name="Play" size={16} />
              <span>Try Demo</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PathWayNavigation;
