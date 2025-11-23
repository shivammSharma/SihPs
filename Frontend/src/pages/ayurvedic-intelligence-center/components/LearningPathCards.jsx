// import React, { useState } from 'react';

// import Icon from '../../../components/AppIcon';
// import Button from '../../../components/ui/Button';

// const LearningPathCards = () => {
//   const [selectedPath, setSelectedPath] = useState(null);

// const learningPaths = [
//   {
//     id: 'fundamentals',
//     title: 'Ayurveda Fundamentals',
//     subtitle: 'Perfect for newcomers to Ayurvedic principles',
//     description:
//       'Start your journey with the foundational concepts of Ayurveda, including the three doshas, five elements, and basic constitutional theory.',
//     duration: '2-3 hours',
//     modules: 8,
//     level: 'Beginner',
//     icon: 'BookOpen',
//     color: '#87A96B',
//     syllabusUrl: '/syllabi/ayurveda-fundamentals.pdf', // 👈 added syllabus link
//     topics: [
//       'Introduction to Ayurveda',
//       'The Three Doshas Explained',
//       'Five Elements Theory',
//       'Constitutional Assessment',
//       'Basic Food Guidelines',
//       'Seasonal Living',
//       'Daily Routines (Dinacharya)',
//       'Mind-Body Connection'
//     ],
//     benefits: [
//       'Understand your unique constitution',
//       'Learn basic food compatibility',
//       'Establish healthy daily routines',
//       'Recognize imbalance signs'
//     ]
//   },
//   {
//     id: 'clinical',
//     title: 'Clinical Integration',
//     subtitle: 'For healthcare professionals',
//     description:
//       'Bridge ancient wisdom with modern practice. Learn evidence-based approaches to integrating Ayurvedic principles in clinical settings.',
//     duration: '4-5 hours',
//     modules: 12,
//     level: 'Professional',
//     icon: 'Stethoscope',
//     color: '#D4AF37',
//     syllabusUrl: '/syllabi/clinical-integration.pdf', // 👈 added syllabus link
//     topics: [
//       'Evidence-Based Ayurveda',
//       'Patient Assessment Protocols',
//       'Integrative Treatment Plans',
//       'Herb-Drug Interactions',
//       'Clinical Case Studies',
//       'Documentation Standards',
//       'Patient Communication',
//       'Regulatory Considerations',
//       'Research Methodologies',
//       'Outcome Measurement',
//       'Continuing Education',
//       'Professional Ethics'
//     ],
//     benefits: [
//       'Enhance patient care quality',
//       'Reduce treatment side effects',
//       'Improve patient compliance',
//       'Differentiate your practice'
//     ]
//   },
//   {
//     id: 'advanced',
//     title: 'Advanced Concepts',
//     subtitle: 'Deep dive into Rasa, Virya, Guna & Vipaka',
//     description:
//       'Master the sophisticated principles that govern food energetics and their therapeutic applications in personalized nutrition.',
//     duration: '6-8 hours',
//     modules: 16,
//     level: 'Advanced',
//     icon: 'Brain',
//     color: '#2D5016',
//     syllabusUrl: '/syllabi/advanced-concepts.pdf', // 👈 added syllabus link
//     topics: [
//       'Rasa (Six Tastes) Mastery',
//       'Virya (Potency) Applications',
//       'Guna (Qualities) Analysis',
//       'Vipaka (Post-Digestive Effect)',
//       'Prabhava (Special Effects)',
//       'Food Combining Principles',
//       'Therapeutic Cooking',
//       'Seasonal Adjustments',
//       'Constitutional Variations',
//       'Disease-Specific Protocols',
//       'Advanced Assessment Tools',
//       'Research Applications',
//       'Teaching Methodologies',
//       'Case Study Analysis',
//       'Integration Strategies',
//       'Future Developments'
//     ],
//     benefits: [
//       'Master food energetics',
//       'Create precise meal plans',
//       'Understand subtle effects',
//       'Teach others effectively'
//     ]
//   }
// ];

//   const togglePath = (pathId) => {
//     setSelectedPath(selectedPath === pathId ? null : pathId);
//   };

//   return (
//     <div className="space-y-6">
//       <div className="text-center mb-8">
//         <h2 className="text-3xl font-display font-semibold text-primary mb-3">
//           Progressive Learning Paths
//         </h2>
//         <p className="text-text-secondary max-w-3xl mx-auto">
//           Choose your learning journey based on your experience level and professional needs. 
//           Each path is designed to build comprehensive understanding through structured modules.
//         </p>
//       </div>
//       <div className="grid lg:grid-cols-3 gap-6">
//         {learningPaths?.map((path) => (
//           <div
//             key={path?.id}
//             className={`bg-background rounded-xl organic-shadow organic-transition cursor-pointer ${
//               selectedPath === path?.id ? 'elevated-shadow scale-105' : 'hover:elevated-shadow'
//             }`}
//             onClick={() => togglePath(path?.id)}
//           >
//             {/* Card Header */}
//             <div className="p-6 border-b border-border">
//               <div className="flex items-start justify-between mb-4">
//                 <div 
//                   className="w-12 h-12 rounded-lg flex items-center justify-center"
//                   style={{ backgroundColor: `${path?.color}20` }}
//                 >
//                   <Icon name={path?.icon} size={24} style={{ color: path?.color }} />
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                     path?.level === 'Beginner' ? 'bg-success/20 text-success' :
//                     path?.level === 'Professional'? 'bg-warning/20 text-warning' : 'bg-primary/20 text-primary'
//                   }`}>
//                     {path?.level}
//                   </span>
//                   <Icon 
//                     name={selectedPath === path?.id ? "ChevronUp" : "ChevronDown"} 
//                     size={16} 
//                     className="text-text-secondary"
//                   />
//                 </div>
//               </div>

//               <h3 className="text-xl font-display font-semibold text-primary mb-2">
//                 {path?.title}
//               </h3>
//               <p className="text-sm text-text-secondary mb-4">
//                 {path?.subtitle}
//               </p>
//               <p className="text-text-secondary mb-4">
//                 {path?.description}
//               </p>

//               <div className="flex items-center justify-between text-sm text-text-secondary">
//                 <div className="flex items-center space-x-4">
//                   <div className="flex items-center space-x-1">
//                     <Icon name="Clock" size={14} />
//                     <span>{path?.duration}</span>
//                   </div>
//                   <div className="flex items-center space-x-1">
//                     <Icon name="BookOpen" size={14} />
//                     <span>{path?.modules} modules</span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Expanded Content */}
//             {selectedPath === path?.id && (
//               <div className="p-6 space-y-6">
//                 {/* Topics */}
//                 <div>
//                   <h4 className="font-semibold text-primary mb-3 flex items-center">
//                     <Icon name="List" size={16} className="mr-2" />
//                     Course Topics
//                   </h4>
//                   <div className="grid sm:grid-cols-2 gap-2">
//                     {path?.topics?.map((topic, index) => (
//                       <div key={index} className="flex items-center space-x-2 text-sm text-text-secondary">
//                         <div className="w-1.5 h-1.5 rounded-full bg-brand-sage"></div>
//                         <span>{topic}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Benefits */}
//                 <div>
//                   <h4 className="font-semibold text-primary mb-3 flex items-center">
//                     <Icon name="Target" size={16} className="mr-2" />
//                     Learning Outcomes
//                   </h4>
//                   <div className="space-y-2">
//                     {path?.benefits?.map((benefit, index) => (
//                       <div key={index} className="flex items-center space-x-2 text-sm text-text-secondary">
//                         <Icon name="Check" size={14} className="text-success" />
//                         <span>{benefit}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="flex space-x-3 pt-4 border-t border-border">
//                   <Button 
//                     variant="default" 
//                     className="flex-1"
//                     iconName="Play"
//                     iconPosition="left"
//                   >
//                     Start Learning
//                   </Button>
//                   <Button 
//                     variant="outline" 
//                     iconName="Download"
//                     iconPosition="left"
//                   >
//                     Syllabus
//                   </Button>
//                 </div>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//       {/* Call to Action */}
//       <div className="text-center mt-12 p-8 bg-gradient-to-r from-brand-cream to-brand-ivory rounded-2xl border border-brand-gold/20">
//         <h3 className="text-2xl font-display font-semibold text-primary mb-3">
//           Ready to Begin Your Journey?
//         </h3>
//         <p className="text-text-secondary mb-6 max-w-2xl mx-auto">
//           Join thousands of healthcare professionals and wellness enthusiasts who are transforming 
//         </p>
//         <div className="flex flex-col sm:flex-row gap-4 justify-center">
//           <Button 
//             variant="default" 
//             size="lg"
//             className="bg-brand-gold hover:bg-brand-gold/90"
//             iconName="UserPlus"
//             iconPosition="left"
//           >
//             Create Free Account
//           </Button>
//           <Button 
//             variant="outline" 
//             size="lg"
//             iconName="Calendar"
//             iconPosition="left"
//           >
//             Schedule Demo
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LearningPathCards;









import React, { useState } from 'react';

import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const LearningPathCards = () => {
  const [selectedPath, setSelectedPath] = useState(null);

  const learningPaths = [
    {
      id: 'fundamentals',
      title: 'Ayurveda Fundamentals',
      subtitle: 'Perfect for newcomers to Ayurvedic principles',
      description:
        'Start your journey with the foundational concepts of Ayurveda, including the three doshas, five elements, and basic constitutional theory.',
      duration: '2-3 hours',
      modules: 8,
      level: 'Beginner',
      icon: 'BookOpen',
      color: '#87A96B',
      syllabusUrl: '/syllabi/ayurveda-fundamentals.pdf',
      topics: [
        'Introduction to Ayurveda',
        'The Three Doshas Explained',
        'Five Elements Theory',
        'Constitutional Assessment',
        'Basic Food Guidelines',
        'Seasonal Living',
        'Daily Routines (Dinacharya)',
        'Mind-Body Connection'
      ],
      benefits: [
        'Understand your unique constitution',
        'Learn basic food compatibility',
        'Establish healthy daily routines',
        'Recognize imbalance signs'
      ]
    },
    {
      id: 'clinical',
      title: 'Clinical Integration',
      subtitle: 'For healthcare professionals',
      description:
        'Bridge ancient wisdom with modern practice. Learn evidence-based approaches to integrating Ayurvedic principles in clinical settings.',
      duration: '4-5 hours',
      modules: 12,
      level: 'Professional',
      icon: 'Stethoscope',
      color: '#D4AF37',
      syllabusUrl: '/syllabi/clinical-integration.pdf',
      topics: [
        'Evidence-Based Ayurveda',
        'Patient Assessment Protocols',
        'Integrative Treatment Plans',
        'Herb-Drug Interactions',
        'Clinical Case Studies',
        'Documentation Standards',
        'Patient Communication',
        'Regulatory Considerations',
        'Research Methodologies',
        'Outcome Measurement',
        'Continuing Education',
        'Professional Ethics'
      ],
      benefits: [
        'Enhance patient care quality',
        'Reduce treatment side effects',
        'Improve patient compliance',
        'Differentiate your practice'
      ]
    },
    {
      id: 'advanced',
      title: 'Advanced Concepts',
      subtitle: 'Deep dive into Rasa, Virya, Guna & Vipaka',
      description:
        'Master the sophisticated principles that govern food energetics and their therapeutic applications in personalized nutrition.',
      duration: '6-8 hours',
      modules: 16,
      level: 'Advanced',
      icon: 'Brain',
      color: '#2D5016',
      syllabusUrl: '/syllabi/advanced-concepts.pdf',
      topics: [
        'Rasa (Six Tastes) Mastery',
        'Virya (Potency) Applications',
        'Guna (Qualities) Analysis',
        'Vipaka (Post-Digestive Effect)',
        'Prabhava (Special Effects)',
        'Food Combining Principles',
        'Therapeutic Cooking',
        'Seasonal Adjustments',
        'Constitutional Variations',
        'Disease-Specific Protocols',
        'Advanced Assessment Tools',
        'Research Applications',
        'Teaching Methodologies',
        'Case Study Analysis',
        'Integration Strategies',
        'Future Developments'
      ],
      benefits: [
        'Master food energetics',
        'Create precise meal plans',
        'Understand subtle effects',
        'Teach others effectively'
      ]
    }
  ];

  const togglePath = (pathId) => {
    setSelectedPath(selectedPath === pathId ? null : pathId);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-display font-semibold text-primary mb-3">
          Progressive Learning Paths
        </h2>
        <p className="text-text-secondary max-w-3xl mx-auto">
          Choose your learning journey based on your experience level and professional needs. 
          Each path is designed to build comprehensive understanding through structured modules.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {learningPaths?.map((path) => (
          <div
            key={path?.id}
            className={`bg-background rounded-xl organic-shadow organic-transition cursor-pointer ${
              selectedPath === path?.id ? 'elevated-shadow scale-105' : 'hover:elevated-shadow'
            }`}
            onClick={() => togglePath(path?.id)}
          >
            {/* Card Header */}
            <div className="p-6 border-b border-border">
              <div className="flex items-start justify-between mb-4">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${path?.color}20` }}
                >
                  <Icon name={path?.icon} size={24} style={{ color: path?.color }} />
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    path?.level === 'Beginner' ? 'bg-success/20 text-success' :
                    path?.level === 'Professional' ? 'bg-warning/20 text-warning' : 'bg-primary/20 text-primary'
                  }`}>
                    {path?.level}
                  </span>
                  <Icon 
                    name={selectedPath === path?.id ? "ChevronUp" : "ChevronDown"} 
                    size={16} 
                    className="text-text-secondary"
                  />
                </div>
              </div>

              <h3 className="text-xl font-display font-semibold text-primary mb-2">
                {path?.title}
              </h3>
              <p className="text-sm text-text-secondary mb-4">
                {path?.subtitle}
              </p>
              <p className="text-text-secondary mb-4">
                {path?.description}
              </p>

              <div className="flex items-center justify-between text-sm text-text-secondary">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Icon name="Clock" size={14} />
                    <span>{path?.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="BookOpen" size={14} />
                    <span>{path?.modules} modules</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Expanded Content */}
            {selectedPath === path?.id && (
              <div className="p-6 space-y-6">
                {/* Topics */}
                <div>
                  <h4 className="font-semibold text-primary mb-3 flex items-center">
                    <Icon name="List" size={16} className="mr-2" />
                    Course Topics
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {path?.topics?.map((topic, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm text-text-secondary">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-sage"></div>
                        <span>{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Benefits */}
                <div>
                  <h4 className="font-semibold text-primary mb-3 flex items-center">
                    <Icon name="Target" size={16} className="mr-2" />
                    Learning Outcomes
                  </h4>
                  <div className="space-y-2">
                    {path?.benefits?.map((benefit, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm text-text-secondary">
                        <Icon name="Check" size={14} className="text-success" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4 border-t border-border">
                  <Button 
                    variant="default" 
                    className="flex-1"
                    iconName="Play"
                    iconPosition="left"
                  >
                    Start Learning
                  </Button>

                  {/* Download Syllabus Button */}
                  <a
                    href={path?.syllabusUrl}
                    download={`${path?.title}.pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button 
                      variant="outline" 
                      iconName="Download"
                      iconPosition="left"
                      className="w-full"
                    >
                      Syllabus
                    </Button>
                  </a>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Call to Action
      <div className="text-center mt-12 p-8 bg-gradient-to-r from-brand-cream to-brand-ivory rounded-2xl border border-brand-gold/20">
        <h3 className="text-2xl font-display font-semibold text-primary mb-3">
          Ready to Begin Your Journey?
        </h3>
        <p className="text-text-secondary mb-6 max-w-2xl mx-auto">
          Join thousands of healthcare professionals and wellness enthusiasts who are transforming 
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            variant="default" 
            size="lg"
            className="bg-brand-gold hover:bg-brand-gold/90"
            iconName="UserPlus"
            iconPosition="left"
          >
            Create Free Account
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            iconName="Calendar"
            iconPosition="left"
          >
            Schedule Demo
          </Button>
        </div>
      </div> */}
    </div>
  );
};

export default LearningPathCards;
