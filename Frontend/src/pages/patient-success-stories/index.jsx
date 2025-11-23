import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import StoryCard from './components/StoryCard';
import FilterSidebar from './components/FilterSidebar';
import StoryModal from './components/StoryModal';
import VideoTestimonial from './components/VideoTestimonial';
import CommunityPreview from './components/CommunityPreview';

const PatientSuccessStories = () => {
  const [selectedStory, setSelectedStory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [filters, setFilters] = useState({
    conditions: [],
    doshas: [],
    ageRanges: [],
    durations: []
  });

  // Mock patient success stories data
  const successStories = [
    {
      id: 1,
      name: "Sarah Johnson",
      age: 34,
      location: "San Francisco, CA",
      condition: "Diabetes Management",
      dosha: "Vata",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=300&fit=crop",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      journeyDuration: "8-month",
      rating: 5,
      keyMetrics: [
        { metric: "HbA1c Reduction", improvement: "2.1%" },
        { metric: "Weight Loss", improvement: "18 lbs" }
      ],
      storyPreview: "After struggling with diabetes for years, Sarah discovered how Vata-balancing nutrition could transform her blood sugar management. Her personalized plan focused on warm, grounding foods and regular meal timing...",
      fullStory: `When I was first diagnosed with Type 2 diabetes three years ago, I felt overwhelmed by all the conflicting dietary advice. My doctor recommended the standard diabetic diet, but I struggled to maintain my blood sugar levels and felt constantly fatigued.\n\nDiscovering AyurNutri through my integrative medicine practitioner was a turning point. The initial assessment revealed I had a strong Vata constitution, which explained my irregular eating patterns and tendency toward anxiety around food choices.\n\nMy personalized nutrition plan focused on warm, cooked foods with natural sweetness from dates and sweet potatoes. The timing recommendations were crucial - eating my largest meal at midday when my digestive fire was strongest made an enormous difference.\n\nWithin three months, my HbA1c dropped from 8.2% to 6.8%. More importantly, I felt energized and in control of my health for the first time in years. The seasonal adjustments helped me maintain these improvements year-round.`,
      transformations: [
        { aspect: "Blood Sugar Control", improvement: "HbA1c reduced from 8.2% to 6.1%" },
        { aspect: "Energy Levels", improvement: "Sustained energy throughout the day" },
        { aspect: "Weight Management", improvement: "Lost 18 lbs naturally" },
        { aspect: "Sleep Quality", improvement: "Deeper, more restful sleep" }
      ],
      progressData: [
        {
          title: "HbA1c Levels Over Time",
          metric: "HbA1c (%)",
          color: "#2D5016",
          data: [
            { month: "Month 1", value: 8.2 },
            { month: "Month 2", value: 7.9 },
            { month: "Month 3", value: 7.4 },
            { month: "Month 4", value: 7.0 },
            { month: "Month 5", value: 6.8 },
            { month: "Month 6", value: 6.5 },
            { month: "Month 7", value: 6.3 },
            { month: "Month 8", value: 6.1 }
          ]
        }
      ],
      doshaBalance: { primary: 65, secondary: 25, tertiary: 10 },
      nutritionPlan: [
        { category: "Morning Routine", description: "Warm water with ginger, followed by cooked oats with cinnamon and dates" },
        { category: "Lunch Focus", description: "Largest meal with quinoa, steamed vegetables, and warming spices" },
        { category: "Evening Meals", description: "Light, warm soups with mung beans and digestive spices" }
      ],
      lifestyleChanges: {
        daily: [
          { time: "6:00 AM", activity: "Warm water with ginger and lemon" },
          { time: "7:00 AM", activity: "Gentle yoga and breathing exercises" },
          { time: "12:00 PM", activity: "Main meal with warm, cooked foods" },
          { time: "6:00 PM", activity: "Light dinner before sunset" }
        ],
        seasonal: [
          { season: "Fall/Winter", adjustment: "Increased warming spices and root vegetables" },
          { season: "Spring/Summer", adjustment: "Lighter cooking methods while maintaining warmth" }
        ]
      }
    },
    {
      id: 2,
      name: "Michael Chen",
      age: 42,
      location: "Austin, TX",
      condition: "Digestive Health",
      dosha: "Pitta",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      journeyDuration: "6-month",
      rating: 5,
      keyMetrics: [
        { metric: "Acid Reflux Episodes", improvement: "90% reduction" },
        { metric: "Digestive Comfort", improvement: "95% improvement" }
      ],
      storyPreview: "Michael's chronic acid reflux and digestive issues were resolved through a Pitta-pacifying approach that emphasized cooling foods and mindful eating practices...",
      fullStory: `For over five years, I suffered from chronic acid reflux and digestive discomfort that significantly impacted my quality of life. Despite trying various medications and elimination diets, nothing provided lasting relief.\n\nThe AyurNutri assessment revealed my strong Pitta constitution and how my high-stress lifestyle and spicy food preferences were aggravating my digestive fire. This insight was revolutionary - I finally understood why certain foods triggered my symptoms.\n\nMy personalized plan focused on cooling, alkaline foods and specific eating practices. Avoiding spicy and acidic foods while incorporating cooling herbs like fennel and coriander made an immediate difference.\n\nWithin two months, my acid reflux episodes decreased by 70%. By month six, I rarely experienced any digestive discomfort. The mindful eating practices became a form of meditation that also helped manage my work stress.`,
      transformations: [
        { aspect: "Acid Reflux", improvement: "90% reduction in episodes" },
        { aspect: "Digestive Comfort", improvement: "Complete elimination of bloating" },
        { aspect: "Sleep Quality", improvement: "No more nighttime reflux" },
        { aspect: "Stress Management", improvement: "Improved work-life balance" }
      ],
      progressData: [
        {
          title: "Digestive Comfort Score",
          metric: "Comfort Level (1-10)",
          color: "#87A96B",
          data: [
            { month: "Month 1", value: 3 },
            { month: "Month 2", value: 5 },
            { month: "Month 3", value: 7 },
            { month: "Month 4", value: 8 },
            { month: "Month 5", value: 9 },
            { month: "Month 6", value: 9.5 }
          ]
        }
      ],
      doshaBalance: { primary: 70, secondary: 20, tertiary: 10 },
      nutritionPlan: [
        { category: "Cooling Foods", description: "Cucumber, coconut water, sweet fruits, and leafy greens" },
        { category: "Gentle Spices", description: "Fennel, coriander, and cardamom instead of hot spices" },
        { category: "Meal Timing", description: "Regular meals with largest meal at midday" }
      ],
      lifestyleChanges: {
        daily: [
          { time: "Morning", activity: "Cool water with lime and mint" },
          { time: "Lunch", activity: "Cooling foods in a peaceful environment" },
          { time: "Evening", activity: "Herbal tea with fennel and chamomile" }
        ],
        seasonal: [
          { season: "Summer", adjustment: "Increased cooling foods and avoiding heat" },
          { season: "Winter", adjustment: "Warm foods while maintaining cooling qualities" }
        ]
      }
    },
    {
      id: 3,
      name: "Priya Patel",
      age: 28,
      location: "New York, NY",
      condition: "Weight Optimization",
      dosha: "Kapha",
      image: "https://images.unsplash.com/photo-1594824804732-ca8db7d1e3b8?w=400&h=300&fit=crop",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      journeyDuration: "10-month",
      rating: 5,
      keyMetrics: [
        { metric: "Weight Loss", improvement: "32 lbs" },
        { metric: "Energy Increase", improvement: "85% boost" }
      ],
      storyPreview: "Priya's weight loss journey focused on Kapha-reducing foods and lifestyle changes that naturally boosted her metabolism and energy levels...",
      fullStory: `After years of yo-yo dieting and feeling sluggish, I was frustrated with my inability to maintain a healthy weight. Traditional calorie-counting approaches left me feeling deprived and eventually led to rebound weight gain.\n\nThe constitutional assessment revealed my Kapha-dominant nature, which explained my slow metabolism and tendency to retain weight. Understanding this was liberating - I finally had a framework that made sense for my body.\n\nMy plan emphasized warming, light foods and specific spices that naturally boost metabolism. The morning routine with warm water, lemon, and ginger became a cornerstone of my transformation.\n\nThe weight came off gradually but consistently - about 3-4 pounds per month. More importantly, my energy levels soared, and I developed a sustainable relationship with food that honored my body's needs.`,
      transformations: [
        { aspect: "Weight Management", improvement: "Lost 32 lbs sustainably" },
        { aspect: "Energy Levels", improvement: "Consistent energy throughout day" },
        { aspect: "Metabolism", improvement: "Naturally increased metabolic rate" },
        { aspect: "Food Relationship", improvement: "Intuitive, mindful eating habits" }
      ],
      progressData: [
        {
          title: "Weight Loss Progress",
          metric: "Weight (lbs)",
          color: "#D4AF37",
          data: [
            { month: "Month 1", value: 165 },
            { month: "Month 2", value: 162 },
            { month: "Month 3", value: 158 },
            { month: "Month 4", value: 154 },
            { month: "Month 5", value: 150 },
            { month: "Month 6", value: 146 },
            { month: "Month 7", value: 142 },
            { month: "Month 8", value: 138 },
            { month: "Month 9", value: 135 },
            { month: "Month 10", value: 133 }
          ]
        }
      ],
      doshaBalance: { primary: 60, secondary: 25, tertiary: 15 },
      nutritionPlan: [
        { category: "Warming Spices", description: "Ginger, black pepper, turmeric, and cinnamon in daily meals" },
        { category: "Light Foods", description: "Quinoa, millet, steamed vegetables, and legumes" },
        { category: "Meal Timing", description: "Larger breakfast and lunch, lighter dinner" }
      ],
      lifestyleChanges: {
        daily: [
          { time: "6:00 AM", activity: "Warm water with ginger and lemon" },
          { time: "7:00 AM", activity: "Energizing yoga and cardio exercise" },
          { time: "8:00 AM", activity: "Substantial breakfast with warming foods" },
          { time: "5:00 PM", activity: "Light, early dinner" }
        ],
        seasonal: [
          { season: "Spring", adjustment: "Detoxifying foods and increased activity" },
          { season: "Winter", adjustment: "Warming foods while maintaining lightness" }
        ]
      }
    },
    {
      id: 4,
      name: "David Rodriguez",
      age: 45,
      location: "Denver, CO",
      condition: "Autoimmune Support",
      dosha: "Vata",
      image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=300&fit=crop",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      journeyDuration: "12-month",
      rating: 5,
      keyMetrics: [
        { metric: "Inflammation Markers", improvement: "60% reduction" },
        { metric: "Joint Pain", improvement: "80% improvement" }
      ],
      storyPreview: "David's autoimmune condition improved significantly through anti-inflammatory Vata-balancing nutrition and stress-reducing lifestyle modifications...",
      fullStory: `Living with rheumatoid arthritis for eight years had become increasingly challenging. The medications helped but came with side effects, and I was looking for complementary approaches to support my healing.\n\nThe AyurNutri assessment showed how my Vata constitution was contributing to the inflammatory process. The connection between my irregular lifestyle, stress levels, and autoimmune flares became clear.\n\nMy nutrition plan focused on anti-inflammatory, grounding foods with specific attention to gut health. The regular meal timing and stress-reduction practices were as important as the food choices themselves.\n\nWithin six months, my inflammatory markers decreased significantly, and my joint pain became much more manageable. My rheumatologist was impressed with the improvements in my lab work.`,
      transformations: [
        { aspect: "Inflammation", improvement: "60% reduction in inflammatory markers" },
        { aspect: "Joint Pain", improvement: "Significant decrease in morning stiffness" },
        { aspect: "Energy", improvement: "Sustained energy without afternoon crashes" },
        { aspect: "Sleep", improvement: "Deeper, more restorative sleep" }
      ],
      progressData: [
        {
          title: "Inflammatory Markers (CRP)",metric: "CRP (mg/L)",color: "#9B2C2C",
          data: [
            { month: "Month 1", value: 8.2 },
            { month: "Month 3", value: 6.8 },
            { month: "Month 6", value: 4.5 },
            { month: "Month 9", value: 3.8 },
            { month: "Month 12", value: 3.2 }
          ]
        }
      ],
      doshaBalance: { primary: 55, secondary: 30, tertiary: 15 },
      nutritionPlan: [
        { category: "Anti-inflammatory Foods", description: "Turmeric, ginger, omega-3 rich foods, and antioxidant-rich vegetables" },
        { category: "Gut Health", description: "Fermented foods, bone broth, and prebiotic-rich vegetables" },
        { category: "Grounding Foods", description: "Warm, cooked meals with healthy fats and proteins" }
      ],
      lifestyleChanges: {
        daily: [
          { time: "Morning", activity: "Gentle stretching and meditation" },
          { time: "Meals", activity: "Regular timing with mindful eating" },
          { time: "Evening", activity: "Relaxing herbal tea and early bedtime" }
        ],
        seasonal: [
          { season: "Fall/Winter", adjustment: "Extra warming foods and indoor activities" },
          { season: "Spring/Summer", adjustment: "Fresh anti-inflammatory foods and gentle outdoor exercise" }
        ]
      }
    },
    {
      id: 5,
      name: "Lisa Thompson",age: 38,location: "Seattle, WA",condition: "Mental Wellness",
      dosha: "Pitta",image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=300&fit=crop",avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",journeyDuration: "9-month",
      rating: 5,
      keyMetrics: [
        { metric: "Anxiety Levels", improvement: "70% reduction" },
        { metric: "Sleep Quality", improvement: "90% improvement" }
      ],
      storyPreview: "Lisa's anxiety and sleep issues were addressed through Pitta-cooling nutrition and lifestyle practices that supported her mental and emotional balance...",
      fullStory: `High-functioning anxiety had been my constant companion for years. As a marketing executive, the pressure was intense, and I relied on caffeine and irregular eating to get through demanding days.\n\nThe constitutional assessment revealed how my Pitta nature was being aggravated by my lifestyle choices. The connection between my diet, stress levels, and anxiety symptoms was eye-opening.\n\nMy plan emphasized cooling, calming foods and specific practices to support my nervous system. Reducing caffeine and incorporating cooling herbs like brahmi and shankhpushpi made a remarkable difference.\n\nWithin three months, my anxiety levels decreased significantly, and my sleep quality improved dramatically. I learned to nourish my mind through food and lifestyle choices that supported rather than stressed my system.`,
      transformations: [
        { aspect: "Anxiety Management", improvement: "70% reduction in anxiety episodes" },
        { aspect: "Sleep Quality", improvement: "Falling asleep easily and staying asleep" },
        { aspect: "Mental Clarity", improvement: "Improved focus and decision-making" },
        { aspect: "Emotional Balance", improvement: "More stable mood throughout the day" }
      ],
      progressData: [
        {
          title: "Anxiety Level (Daily Average)",metric: "Anxiety Score (1-10)",color: "#87A96B",
          data: [
            { month: "Month 1", value: 7.5 },
            { month: "Month 2", value: 6.8 },
            { month: "Month 3", value: 5.2 },
            { month: "Month 4", value: 4.5 },
            { month: "Month 5", value: 3.8 },
            { month: "Month 6", value: 3.2 },
            { month: "Month 7", value: 2.8 },
            { month: "Month 8", value: 2.5 },
            { month: "Month 9", value: 2.2 }
          ]
        }
      ],
      doshaBalance: { primary: 68, secondary: 22, tertiary: 10 },
      nutritionPlan: [
        { category: "Calming Foods", description: "Sweet fruits, coconut, almonds, and cooling herbs" },
        { category: "Nervous System Support", description: "Magnesium-rich foods, herbal teas, and omega-3 sources" },
        { category: "Meal Regularity", description: "Consistent meal times to support stable blood sugar" }
      ],
      lifestyleChanges: {
        daily: [
          { time: "Morning", activity: "Meditation and cooling pranayama" },
          { time: "Midday", activity: "Peaceful lunch break away from work" },
          { time: "Evening", activity: "Herbal tea and gentle yoga before bed" }
        ],
        seasonal: [
          { season: "Summer", adjustment: "Extra cooling practices and foods" },
          { season: "Winter", adjustment: "Warm, comforting foods while maintaining cooling qualities" }
        ]
      }
    },
    {
      id: 6,
      name: "Robert Kim",age: 52,location: "Phoenix, AZ",condition: "Cardiovascular Health",
      dosha: "Kapha",image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=300&fit=crop",avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=150&h=150&fit=crop&crop=face",journeyDuration: "14-month",
      rating: 5,
      keyMetrics: [
        { metric: "Cholesterol", improvement: "45 mg/dL reduction" },
        { metric: "Blood Pressure", improvement: "Normal range" }
      ],
      storyPreview: "Robert\'s cardiovascular health improved dramatically through Kapha-reducing nutrition that naturally supported heart health and circulation...",
      fullStory: `At my annual physical, my doctor expressed concern about my cholesterol levels and blood pressure. With a family history of heart disease, I knew I needed to make significant changes.\n\nThe AyurNutri assessment revealed how my Kapha constitution was contributing to sluggish circulation and lipid metabolism. Understanding this constitutional tendency helped me make targeted changes.\n\nMy plan focused on heart-healthy, circulation-boosting foods with specific spices known to support cardiovascular function. The emphasis on movement and lighter eating patterns was transformative.\n\nWithin a year, my cholesterol dropped significantly, and my blood pressure normalized. My cardiologist was amazed by the improvements and reduced my medication dosage.`,
      transformations: [
        { aspect: "Cholesterol", improvement: "Total cholesterol reduced by 45 mg/dL" },
        { aspect: "Blood Pressure", improvement: "Normalized without increasing medication" },
        { aspect: "Circulation", improvement: "Improved energy and reduced fatigue" },
        { aspect: "Weight", improvement: "Lost 25 lbs naturally" }
      ],
      progressData: [
        {
          title: "Total Cholesterol Levels",metric: "Cholesterol (mg/dL)",color: "#2D5016",
          data: [
            { month: "Month 1", value: 245 },
            { month: "Month 3", value: 235 },
            { month: "Month 6", value: 220 },
            { month: "Month 9", value: 210 },
            { month: "Month 12", value: 200 },
            { month: "Month 14", value: 195 }
          ]
        }
      ],
      doshaBalance: { primary: 62, secondary: 23, tertiary: 15 },
      nutritionPlan: [
        { category: "Heart-Healthy Foods", description: "Oats, flaxseeds, walnuts, and antioxidant-rich berries" },
        { category: "Circulation Spices", description: "Garlic, ginger, turmeric, and cayenne pepper" },
        { category: "Light Meals", description: "Smaller portions with emphasis on vegetables and lean proteins" }
      ],
      lifestyleChanges: {
        daily: [
          { time: "Morning", activity: "Brisk walk and heart-opening yoga poses" },
          { time: "Meals", activity: "Smaller, more frequent meals with mindful eating" },
          { time: "Evening", activity: "Gentle movement and stress-reduction practices" }
        ],
        seasonal: [
          { season: "All Seasons", adjustment: "Consistent exercise routine adapted to weather" },
          { season: "Winter", adjustment: "Indoor activities and warming, light foods" }
        ]
      }
    }
  ];

  // Mock video testimonials data
  const videoTestimonials = [
    {
      id: 1,
      patientName: "Maria Gonzalez",
      condition: "Digestive Health",
      timeframe: "6 months",
      thumbnail: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=300&fit=crop",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face",
      duration: "3:42",
      quote: "Understanding my Pitta constitution completely changed how I approach food and digestion.",
      views: "2.1K",
      likes: "89"
    },
    {
      id: 2,
      patientName: "James Wilson",
      condition: "Weight Management",
      timeframe: "8 months",
      thumbnail: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      duration: "4:15",
      quote: "The Kapha-balancing approach helped me lose weight naturally without feeling deprived.",
      views: "1.8K",
      likes: "76"
    }
  ];

  useEffect(() => {
    const savedLanguage = localStorage.getItem('currentLanguage') || 'en';
    setCurrentLanguage(savedLanguage);
  }, []);

  const handleViewDetails = (story) => {
    setSelectedStory(story);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedStory(null);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      conditions: [],
      doshas: [],
      ageRanges: [],
      durations: []
    });
  };

  const toggleFilterSidebar = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  // Filter stories based on selected filters
  const filteredStories = successStories?.filter(story => {
    const conditionMatch = filters?.conditions?.length === 0 || filters?.conditions?.includes(story?.condition);
    const doshaMatch = filters?.doshas?.length === 0 || filters?.doshas?.includes(story?.dosha);
    
    const ageMatch = filters?.ageRanges?.length === 0 || filters?.ageRanges?.some(range => {
      const [min, max] = range?.split('-')?.map(num => parseInt(num?.replace(/\D/g, '')));
      if (range?.includes('60+')) return story?.age >= 60;
      return story?.age >= min && story?.age <= max;
    });
    
    const durationMatch = filters?.durations?.length === 0 || filters?.durations?.some(duration => {
      if (duration?.includes('1+')) return story?.journeyDuration?.includes('12') || story?.journeyDuration?.includes('14');
      if (duration?.includes('6-12')) return story?.journeyDuration?.includes('8') || story?.journeyDuration?.includes('9') || story?.journeyDuration?.includes('10');
      if (duration?.includes('3-6')) return story?.journeyDuration?.includes('6');
      if (duration?.includes('1-3')) return false; // No stories in this range in our mock data
      return false;
    });
    
    return conditionMatch && doshaMatch && ageMatch && durationMatch;
  });

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Patient Success Stories - AyurNutri Platform</title>
        <meta name="description" content="Discover inspiring transformation stories from patients who achieved remarkable health improvements through personalized Ayurvedic nutrition plans." />
        <meta name="keywords" content="patient success stories, ayurvedic nutrition, health transformation, diabetes management, digestive health, weight loss" />
      </Helmet>
      <Header />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-brand-cream via-background to-brand-ivory py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="font-display font-bold text-4xl lg:text-6xl text-text-primary mb-6">
                Real Stories,{' '}
                <span className="text-primary">Real Transformations</span>
              </h1>
              <p className="text-xl text-text-secondary mb-8 leading-relaxed">
                Discover how patients achieved remarkable health improvements through personalized 
                Ayurvedic nutrition plans that honor both ancient wisdom and modern science.
              </p>
              
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">500+</div>
                  <div className="text-sm text-text-secondary">Success Stories</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent mb-2">94%</div>
                  <div className="text-sm text-text-secondary">Satisfaction Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-secondary mb-2">6.2</div>
                  <div className="text-sm text-text-secondary">Months Avg Journey</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-brand-gold mb-2">85%</div>
                  <div className="text-sm text-text-secondary">Long-term Success</div>
                </div>
              </div>

              <Button
                variant="default"
                size="lg"
                className="bg-brand-gold hover:bg-brand-gold/90"
                iconName="ArrowDown"
                iconPosition="right"
              >
                Explore Success Stories
              </Button>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar */}
              <div className="lg:w-80 flex-shrink-0">
                <FilterSidebar
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onClearFilters={handleClearFilters}
                  isOpen={isFilterOpen}
                  onToggle={toggleFilterSidebar}
                />
              </div>

              {/* Stories Grid */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="font-display font-semibold text-2xl text-text-primary">
                    Patient Success Stories
                    {filteredStories?.length !== successStories?.length && (
                      <span className="text-lg text-text-secondary ml-2">
                        ({filteredStories?.length} of {successStories?.length})
                      </span>
                    )}
                  </h2>
                  
                  <div className="flex items-center space-x-4">
                    <select className="px-3 py-2 border border-border rounded-lg text-sm bg-background">
                      <option>Most Recent</option>
                      <option>Highest Rated</option>
                      <option>Most Inspiring</option>
                    </select>
                  </div>
                </div>

                {filteredStories?.length === 0 ? (
                  <div className="text-center py-16">
                    <Icon name="Search" size={48} className="text-text-secondary mx-auto mb-4" />
                    <h3 className="font-display font-semibold text-xl text-text-primary mb-2">
                      No stories match your filters
                    </h3>
                    <p className="text-text-secondary mb-6">
                      Try adjusting your filters to see more success stories.
                    </p>
                    <Button variant="outline" onClick={handleClearFilters}>
                      Clear All Filters
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {filteredStories?.map(story => (
                      <StoryCard
                        key={story?.id}
                        story={story}
                        onViewDetails={handleViewDetails}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Video Testimonials */}
        <section className="py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-display font-semibold text-3xl text-text-primary mb-4">
                Hear From Our Patients
              </h2>
              <p className="text-text-secondary max-w-2xl mx-auto">
                Watch authentic video testimonials from patients sharing their transformation journeys 
                and how understanding their constitution changed their relationship with food and health.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {videoTestimonials?.map(testimonial => (
                <VideoTestimonial
                  key={testimonial?.id}
                  testimonial={testimonial}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Community Preview */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <CommunityPreview />
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-card">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-display font-semibold text-3xl text-text-primary mb-4">
                Common Questions About Success Stories
              </h2>
              <p className="text-text-secondary">
                Addressing concerns and questions that arise from reading patient transformation stories.
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  question: "How do you ensure these stories are authentic?",
                  answer: "All success stories are verified through medical records, progress photos, and direct patient consent. We maintain strict privacy standards while sharing inspiring transformations."
                },
                {
                  question: "Can I expect similar results to what I see in these stories?",
                  answer: "Individual results vary based on constitution, health condition, compliance, and other factors. These stories represent real outcomes but should not be considered typical or guaranteed results."
                },
                {
                  question: "How do you respect cultural food traditions in treatment plans?",
                  answer: "Our approach honors cultural dietary preferences while applying Ayurvedic principles. We work with traditional foods and cooking methods, adapting them to support constitutional balance."
                },
                {
                  question: "Do these nutrition plans work alongside conventional medical treatment?",
                  answer: "Yes, our Ayurvedic nutrition plans are designed to complement conventional medical care. We encourage patients to work with their healthcare providers and never recommend discontinuing prescribed medications."
                },
                {
                  question: "How long does it typically take to see results?",
                  answer: "Most patients notice initial improvements within 2-4 weeks, with significant changes occurring over 3-6 months. Long-term transformation typically develops over 6-12 months of consistent practice."
                }
              ]?.map((faq, index) => (
                <div key={index} className="border border-border rounded-lg p-6">
                  <h3 className="font-display font-semibold text-lg text-text-primary mb-3">
                    {faq?.question}
                  </h3>
                  <p className="text-text-secondary leading-relaxed">
                    {faq?.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-br from-primary to-primary/90 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-display font-bold text-3xl lg:text-4xl mb-6">
              Ready to Start Your Own Transformation Journey?
            </h2>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Join thousands of patients who have discovered the power of personalized 
              Ayurvedic nutrition. Begin with our comprehensive constitutional assessment.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="default"
                size="lg"
                className="bg-white text-primary hover:bg-white/90"
                iconName="Play"
                iconPosition="left"
              >
                Take Free Assessment
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-primary"
                iconName="Calendar"
                iconPosition="left"
              >
                Schedule Consultation
              </Button>
            </div>
            
            <p className="text-sm text-white/70 mt-6">
              ✓ Free constitutional assessment ✓ Personalized recommendations ✓ No commitment required
            </p>
          </div>
        </section>
      </main>
      {/* Story Modal */}
      <StoryModal
        story={selectedStory}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
      {/* Footer */}
      <footer className="bg-text-primary text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="relative">
                  <svg width="32" height="32" viewBox="0 0 40 40" className="text-white">
                    <circle cx="20" cy="20" r="18" fill="currentColor" className="opacity-10" />
                    <path
                      d="M20 8c-1.5 0-3 .5-4 1.5L12 14l4 4 4-4-4-4c1-.5 2.5-1 4-1s3 .5 4 1l-4 4 4 4 4-4.5c1-1 1.5-2.5 1.5-4s-.5-3-1.5-4S21.5 8 20 8z"
                      fill="currentColor"
                    />
                    <circle cx="20" cy="26" r="6" fill="var(--color-secondary)" className="opacity-80" />
                    <circle cx="20" cy="26" r="3" fill="currentColor" />
                  </svg>
                </div>
                <div>
                  <div className="text-xl font-display font-semibold">AyurNutri</div>
                  <div className="text-sm text-white/70">Ancient Wisdom • Modern Precision</div>
                </div>
              </div>
              <p className="text-white/80 mb-4">
                Transforming healthcare through personalized Ayurvedic nutrition that honors both 
                traditional wisdom and modern scientific understanding.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2 text-sm">
                <div><a href="/homepage-ayur-nutri-platform" className="text-white/80 hover:text-white">Platform Home</a></div>
                <div><a href="/ayurvedic-intelligence-center" className="text-white/80 hover:text-white">Intelligence Center</a></div>
                <div><a href="/professional-dashboard-portal" className="text-white/80 hover:text-white">Professional Portal</a></div>
                <div><a href="/personal-wellness-hub" className="text-white/80 hover:text-white">Wellness Hub</a></div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <div className="space-y-2 text-sm">
                <div><a href="/clinical-research-library" className="text-white/80 hover:text-white">Research Library</a></div>
                <div><a href="#" className="text-white/80 hover:text-white">Help Center</a></div>
                <div><a href="#" className="text-white/80 hover:text-white">Contact Support</a></div>
                <div><a href="#" className="text-white/80 hover:text-white">Privacy Policy</a></div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/20 mt-8 pt-8 text-center text-sm text-white/60">
            <p>&copy; {new Date()?.getFullYear()} AyurNutri Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PatientSuccessStories;