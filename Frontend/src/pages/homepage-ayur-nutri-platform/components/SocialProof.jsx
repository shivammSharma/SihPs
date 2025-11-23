// import React, { useState, useEffect } from 'react';
// import Icon from '../../../components/AppIcon';
// import Image from '../../../components/AppImage';

// const SocialProof = () => {
//   const [currentTestimonial, setCurrentTestimonial] = useState(0);

//   const doctorTestimonials = [
//     {
//       id: 1,
//       name: "Dr. Priya Sharma",
//       title: "Integrative Medicine Specialist",
//       hospital: "Wellness Medical Center",
//       avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
//       quote: `AyurNutri has revolutionized how I approach patient care. The platform's ability to seamlessly integrate Ayurvedic constitutional analysis with modern nutritional science has improved my treatment outcomes by 40%. My patients love the personalized approach.`,
//       metrics: {
//         patients: "500+",
//         improvement: "40%",
//         satisfaction: "98%"
//       },
//       specialization: "Digestive Health & Metabolic Disorders"
//     },
//     {
//       id: 2,
//       name: "Dr. Michael Chen",
//       title: "Clinical Nutritionist",
//       hospital: "Progressive Health Institute",
//       avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face",
//       quote: `The time-saving aspect is incredible. What used to take me 2 hours of consultation and planning now takes 30 minutes, with better results. The AI recommendations are spot-on, and patients are more engaged with their treatment plans.`,
//       metrics: {
//         time_saved: "3hrs/day",
//         accuracy: "94%",
//         engagement: "85%"
//       },
//       specialization: "Sports Nutrition & Performance"
//     },
//     {
//       id: 3,
//       name: "Dr. Sarah Williams",
//       title: "Family Medicine Physician",
//       hospital: "Community Health Network",
//       avatar: "https://images.unsplash.com/photo-1594824475317-1c0b0b0b0b0b?w=150&h=150&fit=crop&crop=face",
//       quote: `My patients appreciate the cultural sensitivity and holistic approach. The platform respects traditional wisdom while providing evidence-based recommendations. It's bridged the gap between ancient knowledge and modern medicine beautifully.`,
//       metrics: {
//         retention: "92%",
//         referrals: "150%",
//         outcomes: "35%"
//       },
//       specialization: "Preventive Care & Chronic Disease Management"
//     }
//   ];

//   const patientStories = [
//     {
//       id: 1,
//       name: "Sarah M.",
//       age: 34,
//       condition: "Digestive Issues & Low Energy",
//       constitution: "Vata-Pitta",
//       avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
//       story: `After years of trying different diets, AyurNutri finally helped me understand my body's unique needs. The personalized meal plan based on my Vata-Pitta constitution transformed my digestion and energy levels within 8 weeks.`,
//       results: {
//         energy: "+65%",
//         digestion: "+80%",
//         weight: "-12 lbs",
//         timeline: "8 weeks"
//       },
//       beforeAfter: {
//         before: "Chronic fatigue, bloating after meals, irregular digestion",
//         after: "Sustained energy, comfortable digestion, balanced weight"
//       }
//     },
//     {
//       id: 2,
//       name: "James R.",
//       age: 42,
//       condition: "Metabolic Syndrome",
//       constitution: "Kapha-Pitta",
//       avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
//       story: `The platform's approach to my Kapha constitution was eye-opening. Instead of generic weight loss advice, I received specific guidance on foods and timing that worked with my body's natural rhythms. The results speak for themselves.`,
//       results: {
//         weight: "-28 lbs",
//         bp: "Normal",
//         cholesterol: "-40mg/dL",
//         timeline: "16 weeks"
//       },
//       beforeAfter: {
//         before: "Pre-diabetic, high BP, 30 lbs overweight",
//         after: "Normal glucose, healthy BP, ideal weight range"
//       }
//     },
//     {
//       id: 3,
//       name: "Maya P.",
//       age: 29,
//       condition: "Stress & Anxiety",
//       constitution: "Vata-Dominant",
//       avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
//       story: `Understanding my Vata constitution helped me realize why certain foods made my anxiety worse. The grounding foods and eating schedule recommended by AyurNutri have significantly improved my mental clarity and emotional balance.`,
//       results: {
//         anxiety: "-70%",
//         sleep: "+85%",
//         focus: "+60%",
//         timeline: "12 weeks"
//       },
//       beforeAfter: {
//         before: "Daily anxiety, poor sleep, scattered thoughts",
//         after: "Calm mind, restful sleep, sharp focus"
//       }
//     }
//   ];

//   const trustIndicators = [
//     {
//       icon: "Shield",
//       label: "HIPAA Compliant",
//       description: "Enterprise-grade security"
//     },
//     {
//       icon: "Award",
//       label: "Clinically Validated",
//       description: "Evidence-based outcomes"
//     },
//     {
//       icon: "Users",
//       label: "500+ Practitioners",
//       description: "Trusted by professionals"
//     },
//     {
//       icon: "Star",
//       label: "4.9/5 Rating",
//       description: "Exceptional user satisfaction"
//     },
//     {
//       icon: "Building2",
//       label: "50+ Hospitals",
//       description: "Institutional partnerships"
//     },
//     {
//       icon: "TrendingUp",
//       label: "300% ROI",
//       description: "Proven business value"
//     }
//   ];

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentTestimonial((prev) => (prev + 1) % doctorTestimonials?.length);
//     }, 8000);
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <section className="py-20 bg-gradient-to-br from-background to-muted/30">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Trust Indicators */}
//         <div className="text-center mb-16">
//           <div className="inline-flex items-center space-x-2 bg-success/10 text-success px-4 py-2 rounded-full text-sm font-medium mb-6">
//             <Icon name="Shield" size={16} />
//             <span>Trusted by Healthcare Leaders</span>
//           </div>

//           <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-text-primary mb-6">
//             Proven Results Across
//             <span className="block text-primary">Healthcare & Wellness</span>
//           </h2>

//           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mt-12">
//             {trustIndicators?.map((indicator, index) => (
//               <div key={index} className="text-center group">
//                 <div className="inline-flex p-4 rounded-2xl bg-card border border-border organic-shadow group-hover:elevated-shadow organic-transition mb-3">
//                   <Icon name={indicator?.icon} size={24} className="text-primary" />
//                 </div>
//                 <div className="text-sm font-semibold text-text-primary">{indicator?.label}</div>
//                 <div className="text-xs text-text-secondary">{indicator?.description}</div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Doctor Testimonials */}
//         <div className="mb-20">
//           <div className="text-center mb-12">
//             <h3 className="text-2xl sm:text-3xl font-display font-bold text-text-primary mb-4">
//               What Healthcare Professionals Say
//             </h3>
//             <p className="text-lg text-text-secondary max-w-2xl mx-auto">
//               Leading practitioners share their experience with AyurNutri's innovative approach to patient care.
//             </p>
//           </div>

//           <div className="relative">
//             <div className="bg-card rounded-2xl p-8 lg:p-12 organic-shadow border border-border">
//               <div className="grid lg:grid-cols-3 gap-8 items-center">
//                 {/* Doctor Info */}
//                 <div className="text-center lg:text-left">
//                   <div className="relative inline-block mb-6">
//                     <Image
//                       src={doctorTestimonials?.[currentTestimonial]?.avatar}
//                       alt={doctorTestimonials?.[currentTestimonial]?.name}
//                       className="w-24 h-24 rounded-full object-cover mx-auto lg:mx-0"
//                     />
//                     <div className="absolute -bottom-2 -right-2 bg-primary text-white rounded-full p-2">
//                       <Icon name="Stethoscope" size={16} />
//                     </div>
//                   </div>

//                   <h4 className="text-xl font-display font-bold text-text-primary mb-2">
//                     {doctorTestimonials?.[currentTestimonial]?.name}
//                   </h4>
//                   <p className="text-primary font-medium mb-1">
//                     {doctorTestimonials?.[currentTestimonial]?.title}
//                   </p>
//                   <p className="text-text-secondary text-sm mb-2">
//                     {doctorTestimonials?.[currentTestimonial]?.hospital}
//                   </p>
//                   <p className="text-text-secondary text-xs">
//                     {doctorTestimonials?.[currentTestimonial]?.specialization}
//                   </p>
//                 </div>

//                 {/* Testimonial */}
//                 <div className="lg:col-span-2">
//                   <div className="mb-6">
//                     <Icon name="Quote" size={32} className="text-primary/20 mb-4" />
//                     <blockquote className="text-lg text-text-primary leading-relaxed italic">
//                       "{doctorTestimonials?.[currentTestimonial]?.quote}"
//                     </blockquote>
//                   </div>

//                   {/* Metrics */}
//                   <div className="grid grid-cols-3 gap-4">
//                     {Object.entries(doctorTestimonials?.[currentTestimonial]?.metrics)?.map(([key, value]) => (
//                       <div key={key} className="text-center p-3 bg-muted/50 rounded-lg">
//                         <div className="text-xl font-bold text-primary">{value}</div>
//                         <div className="text-xs text-text-secondary capitalize">
//                           {key?.replace('_', ' ')}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Navigation */}
//             <div className="flex justify-center mt-6 space-x-2">
//               {doctorTestimonials?.map((_, index) => (
//                 <button
//                   key={index}
//                   onClick={() => setCurrentTestimonial(index)}
//                   className={`w-3 h-3 rounded-full organic-transition ${
//                     index === currentTestimonial ? 'bg-primary' : 'bg-border hover:bg-primary/50'
//                   }`}
//                 />
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Patient Success Stories */}
//         <div>
//           <div className="text-center mb-12">
//             <h3 className="text-2xl sm:text-3xl font-display font-bold text-text-primary mb-4">
//               Patient Transformation Stories
//             </h3>
//             <p className="text-lg text-text-secondary max-w-2xl mx-auto">
//               Real people, real results. Discover how personalized Ayurvedic-nutrition plans have transformed lives.
//             </p>
//           </div>

//           <div className="grid lg:grid-cols-3 gap-8">
//             {patientStories?.map((story) => (
//               <div key={story?.id} className="bg-card rounded-2xl p-6 organic-shadow border border-border hover:elevated-shadow organic-transition">
//                 Patient Header
//                 <div className="flex items-center space-x-4 mb-6">
//                   <Image
//                     src={story?.avatar}
//                     alt={story?.name}
//                     className="w-16 h-16 rounded-full object-cover"
//                   />
//                   <div>
//                     <h4 className="text-lg font-display font-bold text-text-primary">
//                       {story?.name}
//                     </h4>
//                     <p className="text-text-secondary text-sm">Age {story?.age}</p>
//                     <span className="inline-block bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium mt-1">
//                       {story?.constitution}
//                     </span>
//                   </div>
//                 </div>

//                 {/* Condition */}
//                 <div className="mb-4">
//                   <h5 className="text-sm font-semibold text-text-primary mb-2">Initial Condition</h5>
//                   <p className="text-sm text-text-secondary">{story?.condition}</p>
//                 </div>

//                 {/* Story */}
//                 <div className="mb-6">
//                   <blockquote className="text-sm text-text-primary leading-relaxed italic">
//                     "{story?.story}"
//                   </blockquote>
//                 </div>

//                 {/* Results */}
//                 <div className="space-y-4">
//                   <h5 className="text-sm font-semibold text-text-primary">Key Results</h5>
//                   <div className="grid grid-cols-2 gap-3">
//                     {Object.entries(story?.results)?.map(([key, value]) => (
//                       <div key={key} className="text-center p-2 bg-muted/50 rounded">
//                         <div className="text-sm font-bold text-primary">{value}</div>
//                         <div className="text-xs text-text-secondary capitalize">
//                           {key === 'bp' ? 'Blood Pressure' : key?.replace('_', ' ')}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Before/After */}
//                 <div className="mt-4 pt-4 border-t border-border">
//                   <div className="space-y-2">
//                     <div className="flex items-start space-x-2">
//                       <Icon name="X" size={14} className="text-error mt-0.5 flex-shrink-0" />
//                       <p className="text-xs text-text-secondary">{story?.beforeAfter?.before}</p>
//                     </div>
//                     <div className="flex items-start space-x-2">
//                       <Icon name="Check" size={14} className="text-success mt-0.5 flex-shrink-0" />
//                       <p className="text-xs text-text-secondary">{story?.beforeAfter?.after}</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default SocialProof;

// import React, { useState, useEffect } from "react";
// import Icon from "../../../components/AppIcon";
// import Image from "../../../components/AppImage";

// const SocialProof = () => {
//   const [currentTestimonial, setCurrentTestimonial] = useState(0);

//   const doctorTestimonials = [
//     {
//       id: 1,
//       name: "Dr. Priya Sharma",
//       title: "Integrative Medicine Specialist",
//       hospital: "Wellness Medical Center",
//       avatar:
//         "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
//       quote: `AyurNutri has revolutionized how I approach patient care. The platform's ability to seamlessly integrate Ayurvedic constitutional analysis with modern nutritional science has improved my treatment outcomes by 40%. My patients love the personalized approach.`,
//       metrics: {
//         patients: "500+",
//         improvement: "40%",
//         satisfaction: "98%",
//       },
//       specialization: "Digestive Health & Metabolic Disorders",
//     },
//     {
//       id: 2,
//       name: "Dr. Michael Chen",
//       title: "Clinical Nutritionist",
//       hospital: "Progressive Health Institute",
//       avatar:
//         "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face",
//       quote: `The time-saving aspect is incredible. What used to take me 2 hours of consultation and planning now takes 30 minutes, with better results. The AI recommendations are spot-on, and patients are more engaged with their treatment plans.`,
//       metrics: {
//         time_saved: "3hrs/day",
//         accuracy: "94%",
//         engagement: "85%",
//       },
//       specialization: "Sports Nutrition & Performance",
//     },
//     {
//       id: 3,
//       name: "Dr. Sarah Williams",
//       title: "Family Medicine Physician",
//       hospital: "Community Health Network",
//       avatar:
//         "https://images.unsplash.com/photo-1594824475317-1c0b0b0b0b0b?w=150&h=150&fit=crop&crop=face",
//       quote: `My patients appreciate the cultural sensitivity and holistic approach. The platform respects traditional wisdom while providing evidence-based recommendations. It's bridged the gap between ancient knowledge and modern medicine beautifully.`,
//       metrics: {
//         retention: "92%",
//         referrals: "150%",
//         outcomes: "35%",
//       },
//       specialization: "Preventive Care & Chronic Disease Management",
//     },
//   ];

//   const trustIndicators = [
//     {
//       icon: "Shield",
//       label: "HIPAA Compliant",
//       description: "Enterprise-grade security",
//     },
//     {
//       icon: "Award",
//       label: "Clinically Validated",
//       description: "Evidence-based outcomes",
//     },
//     {
//       icon: "Users",
//       label: "500+ Practitioners",
//       description: "Trusted by professionals",
//     },
//     {
//       icon: "Star",
//       label: "4.9/5 Rating",
//       description: "Exceptional user satisfaction",
//     },
//     {
//       icon: "Building2",
//       label: "50+ Hospitals",
//       description: "Institutional partnerships",
//     },
//     {
//       icon: "TrendingUp",
//       label: "300% ROI",
//       description: "Proven business value",
//     },
//   ];

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentTestimonial((prev) => (prev + 1) % doctorTestimonials?.length);
//     }, 8000);
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <section className="py-20 bg-gradient-to-br from-background to-muted/30">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Trust Indicators
//         <div className="text-center mb-16">
//           <div className="inline-flex items-center space-x-2 bg-success/10 text-success px-4 py-2 rounded-full text-sm font-medium mb-6">
//             <Icon name="Shield" size={16} />
//             <span>Trusted by Healthcare Leaders</span>
//           </div>
          
//           <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-text-primary mb-6">
//             Proven Results Across
//             <span className="block text-primary">Healthcare & Wellness</span>
//           </h2>
          
//           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mt-12">
//             {trustIndicators?.map((indicator, index) => (
//               <div key={index} className="text-center group">
//                 <div className="inline-flex p-4 rounded-2xl bg-card border border-border organic-shadow group-hover:elevated-shadow organic-transition mb-3">
//                   <Icon name={indicator?.icon} size={24} className="text-primary" />
//                 </div>
//                 <div className="text-sm font-semibold text-text-primary">{indicator?.label}</div>
//                 <div className="text-xs text-text-secondary">{indicator?.description}</div>
//               </div>
//             ))}
//           </div>
//         </div> */}

//         {/* Doctor Testimonials */}
//         <div className="mb-20">
//           <div className="text-center mb-12">
//             <h3 className="text-2xl sm:text-3xl font-display font-bold text-text-primary mb-4">
//               What Healthcare Professionals Say
//             </h3>
//             <p className="text-lg text-text-secondary max-w-2xl mx-auto">
//               Leading practitioners share their experience with AyurNutri's
//               innovative approach to patient care.
//             </p>
//           </div>

//           <div className="relative">
//             <div className="bg-card rounded-2xl p-8 lg:p-12 organic-shadow border border-border">
//               <div className="grid lg:grid-cols-3 gap-8 items-center">
//                 {/* Doctor Info */}
//                 <div className="text-center lg:text-left">
//                   <div className="relative inline-block mb-6">
//                     <Image
//                       src={doctorTestimonials?.[currentTestimonial]?.avatar}
//                       alt={doctorTestimonials?.[currentTestimonial]?.name}
//                       className="w-24 h-24 rounded-full object-cover mx-auto lg:mx-0"
//                     />
//                     <div className="absolute -bottom-2 -right-2 bg-primary text-white rounded-full p-2">
//                       <Icon name="Stethoscope" size={16} />
//                     </div>
//                   </div>

//                   <h4 className="text-xl font-display font-bold text-text-primary mb-2">
//                     {doctorTestimonials?.[currentTestimonial]?.name}
//                   </h4>
//                   <p className="text-primary font-medium mb-1">
//                     {doctorTestimonials?.[currentTestimonial]?.title}
//                   </p>
//                   <p className="text-text-secondary text-sm mb-2">
//                     {doctorTestimonials?.[currentTestimonial]?.hospital}
//                   </p>
//                   <p className="text-text-secondary text-xs">
//                     {doctorTestimonials?.[currentTestimonial]?.specialization}
//                   </p>
//                 </div>

//                 {/* Testimonial */}
//                 <div className="lg:col-span-2">
//                   <div className="mb-6">
//                     <Icon
//                       name="Quote"
//                       size={32}
//                       className="text-primary/20 mb-4"
//                     />
//                     <blockquote className="text-lg text-text-primary leading-relaxed italic">
//                       "{doctorTestimonials?.[currentTestimonial]?.quote}"
//                     </blockquote>
//                   </div>

//                   {/* Metrics */}
//                   <div className="grid grid-cols-3 gap-4">
//                     {Object.entries(
//                       doctorTestimonials?.[currentTestimonial]?.metrics
//                     )?.map(([key, value]) => (
//                       <div
//                         key={key}
//                         className="text-center p-3 bg-muted/50 rounded-lg"
//                       >
//                         <div className="text-xl font-bold text-primary">
//                           {value}
//                         </div>
//                         <div className="text-xs text-text-secondary capitalize">
//                           {key?.replace("_", " ")}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Navigation */}
//             <div className="flex justify-center mt-6 space-x-2">
//               {doctorTestimonials?.map((_, index) => (
//                 <button
//                   key={index}
//                   onClick={() => setCurrentTestimonial(index)}
//                   className={`w-3 h-3 rounded-full organic-transition ${
//                     index === currentTestimonial
//                       ? "bg-primary"
//                       : "bg-border hover:bg-primary/50"
//                   }`}
//                 />
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default SocialProof;






import React from "react";
import Icon from "../../../components/AppIcon";
import Image from "../../../components/AppImage";

const SocialProof = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-background to-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Entire Testimonials Section Removed */}
      </div>
    </section>
  );
};

export default SocialProof;
