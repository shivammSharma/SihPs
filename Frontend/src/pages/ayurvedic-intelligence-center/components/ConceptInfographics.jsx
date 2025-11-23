import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ConceptInfographics = () => {
  const [selectedConcept, setSelectedConcept] = useState('rasa');

  const concepts = [
    {
      id: 'rasa',
      name: 'Rasa (Six Tastes)',
      sanskrit: 'रस',
      pronunciation: 'RAH-sah',
      description: 'The immediate taste experience that influences our physiology and psychology',
      icon: 'Zap',
      color: '#D4AF37',
      tastes: [
        {
          name: 'Sweet (Madhura)',
          sanskrit: 'मधुर',
          elements: 'Earth + Water',
          effects: 'Nourishing, building, calming',
          doshaEffect: 'Increases Kapha, decreases Vata & Pitta',
          examples: ['Rice', 'Milk', 'Dates', 'Sweet fruits'],
          therapeuticUse: 'Tissue building, strength, immunity'
        },
        {
          name: 'Sour (Amla)',
          sanskrit: 'अम्ल',
          elements: 'Earth + Fire',
          effects: 'Stimulating, warming, moistening',
          doshaEffect: 'Increases Pitta & Kapha, decreases Vata',
          examples: ['Lemon', 'Yogurt', 'Vinegar', 'Fermented foods'],
          therapeuticUse: 'Digestive stimulation, appetite enhancement'
        },
        {
          name: 'Salty (Lavana)',
          sanskrit: 'लवण',
          elements: 'Water + Fire',
          effects: 'Heating, moistening, heavy',
          doshaEffect: 'Increases Pitta & Kapha, decreases Vata',
          examples: ['Sea salt', 'Rock salt', 'Seaweed'],
          therapeuticUse: 'Electrolyte balance, digestive aid'
        },
        {
          name: 'Pungent (Katu)',
          sanskrit: 'कटु',
          elements: 'Fire + Air',
          effects: 'Heating, drying, light',
          doshaEffect: 'Increases Vata & Pitta, decreases Kapha',
          examples: ['Ginger', 'Black pepper', 'Chili', 'Garlic'],
          therapeuticUse: 'Circulation, metabolism, congestion relief'
        },
        {
          name: 'Bitter (Tikta)',
          sanskrit: 'तिक्त',
          elements: 'Air + Space',
          effects: 'Cooling, drying, light',
          doshaEffect: 'Increases Vata, decreases Pitta & Kapha',
          examples: ['Turmeric', 'Neem', 'Bitter gourd', 'Green leafy vegetables'],
          therapeuticUse: 'Detoxification, blood purification, weight management'
        },
        {
          name: 'Astringent (Kashaya)',
          sanskrit: 'कषाय',
          elements: 'Air + Earth',
          effects: 'Cooling, drying, contracting',
          doshaEffect: 'Increases Vata, decreases Pitta & Kapha',
          examples: ['Pomegranate', 'Cranberries', 'Green tea', 'Unripe banana'],
          therapeuticUse: 'Tissue toning, wound healing, diarrhea control'
        }
      ]
    },
    {
      id: 'virya',
      name: 'Virya (Potency)',
      sanskrit: 'वीर्य',
      pronunciation: 'VEER-yah',
      description: 'The heating or cooling effect of food during digestion',
      icon: 'Thermometer',
      color: '#87A96B',
      types: [
        {
          name: 'Ushna (Heating)',
          sanskrit: 'उष्ण',
          effects: 'Increases digestive fire, promotes circulation, reduces Kapha and Vata',
          examples: ['Ginger', 'Cinnamon', 'Garlic', 'Mustard', 'Alcohol'],
          indications: 'Poor digestion, cold conditions, sluggish metabolism',
          contraindications: 'High Pitta, inflammation, fever, hyperacidity'
        },
        {
          name: 'Shita (Cooling)',
          sanskrit: 'शीत',
          effects: 'Reduces body heat, calms inflammation, increases Kapha and Vata',
          examples: ['Coconut', 'Cucumber', 'Mint', 'Fennel', 'Rose water'],
          indications: 'High Pitta, inflammation, fever, hyperacidity',
          contraindications: 'Poor digestion, cold conditions, high Kapha'
        }
      ]
    },
    {
      id: 'guna',
      name: 'Guna (Qualities)',
      sanskrit: 'गुण',
      pronunciation: 'GOO-nah',
      description: 'Twenty fundamental qualities that describe the nature of substances',
      icon: 'Layers',
      color: '#2D5016',
      qualities: [
        { name: 'Heavy (Guru)', opposite: 'Light (Laghu)', effect: 'Grounding, nourishing' },
        { name: 'Slow (Manda)', opposite: 'Sharp (Tikshna)', effect: 'Calming, gradual action' },
        { name: 'Cold (Shita)', opposite: 'Hot (Ushna)', effect: 'Cooling, reducing inflammation' },
        { name: 'Oily (Snigdha)', opposite: 'Dry (Ruksha)', effect: 'Moistening, lubricating' },
        { name: 'Smooth (Shlakshna)', opposite: 'Rough (Khara)', effect: 'Soothing, healing' },
        { name: 'Dense (Sandra)', opposite: 'Liquid (Drava)', effect: 'Strengthening, building' },
        { name: 'Soft (Mridu)', opposite: 'Hard (Kathina)', effect: 'Gentle, relaxing' },
        { name: 'Static (Sthira)', opposite: 'Mobile (Chala)', effect: 'Stabilizing, grounding' },
        { name: 'Subtle (Sukshma)', opposite: 'Gross (Sthula)', effect: 'Penetrating, quick acting' },
        { name: 'Cloudy (Avila)', opposite: 'Clear (Vishada)', effect: 'Nourishing, building' }
      ]
    },
    {
      id: 'vipaka',
      name: 'Vipaka (Post-Digestive Effect)',
      sanskrit: 'विपाक',
      pronunciation: 'vi-PAH-kah',
      description: 'The final taste that emerges after complete digestion and metabolism',
      icon: 'RotateCw',
      color: '#B8860B',
      types: [
        {
          name: 'Madhura Vipaka (Sweet)',
          sanskrit: 'मधुर विपाक',
          originalTastes: ['Sweet', 'Salty'],
          effects: 'Builds tissues, increases strength, promotes longevity',
          doshaEffect: 'Increases Kapha, decreases Vata and Pitta',
          examples: ['Rice', 'Wheat', 'Milk', 'Ghee', 'Most grains'],
          therapeuticUse: 'Tissue building, rejuvenation, convalescence'
        },
        {
          name: 'Amla Vipaka (Sour)',
          sanskrit: 'अम्ल विपाक',
          originalTastes: ['Sour'],
          effects: 'Increases heat, promotes digestion, can cause inflammation',
          doshaEffect: 'Increases Pitta and Kapha, decreases Vata',
          examples: ['Citrus fruits', 'Tomatoes', 'Fermented foods'],
          therapeuticUse: 'Digestive stimulation, but use cautiously in Pitta conditions'
        },
        {
          name: 'Katu Vipaka (Pungent)',
          sanskrit: 'कटु विपाक',
          originalTastes: ['Pungent', 'Bitter', 'Astringent'],
          effects: 'Promotes elimination, reduces tissues, creates dryness',
          doshaEffect: 'Increases Vata, decreases Pitta and Kapha',
          examples: ['Most vegetables', 'Legumes', 'Spices'],
          therapeuticUse: 'Weight management, detoxification, reducing excess Kapha'
        }
      ]
    }
  ];

  const selectedConceptData = concepts?.find(concept => concept?.id === selectedConcept);

  const RasaInfographic = ({ data }) => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.tastes?.map((taste, index) => (
          <div key={index} className="bg-background rounded-xl p-4 organic-shadow">
            <div className="text-center mb-3">
              <h4 className="font-semibold text-primary">{taste?.name}</h4>
              <p className="text-sm text-text-secondary">{taste?.sanskrit}</p>
            </div>
            
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium text-primary">Elements: </span>
                <span className="text-text-secondary">{taste?.elements}</span>
              </div>
              <div>
                <span className="font-medium text-primary">Effects: </span>
                <span className="text-text-secondary">{taste?.effects}</span>
              </div>
              <div>
                <span className="font-medium text-primary">Dosha Impact: </span>
                <span className="text-text-secondary">{taste?.doshaEffect}</span>
              </div>
            </div>
            
            <div className="mt-3">
              <h5 className="font-medium text-primary text-sm mb-1">Examples:</h5>
              <div className="flex flex-wrap gap-1">
                {taste?.examples?.map((example, idx) => (
                  <span key={idx} className="bg-muted px-2 py-1 rounded text-xs">
                    {example}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="mt-3 bg-brand-cream/50 p-2 rounded">
              <span className="font-medium text-primary text-sm">Therapeutic Use: </span>
              <span className="text-text-secondary text-sm">{taste?.therapeuticUse}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const ViryaInfographic = ({ data }) => (
    <div className="grid md:grid-cols-2 gap-6">
      {data?.types?.map((type, index) => (
        <div key={index} className="bg-background rounded-xl p-6 organic-shadow">
          <div className="text-center mb-4">
            <div className={`w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center ${
              type?.name?.includes('Heating') ? 'bg-red-100' : 'bg-blue-100'
            }`}>
              <Icon 
                name={type?.name?.includes('Heating') ? 'Flame' : 'Snowflake'} 
                size={24} 
                className={type?.name?.includes('Heating') ? 'text-red-500' : 'text-blue-500'}
              />
            </div>
            <h4 className="text-lg font-semibold text-primary">{type?.name}</h4>
            <p className="text-sm text-text-secondary">{type?.sanskrit}</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <h5 className="font-medium text-primary mb-2">Effects:</h5>
              <p className="text-text-secondary text-sm">{type?.effects}</p>
            </div>
            
            <div>
              <h5 className="font-medium text-primary mb-2">Examples:</h5>
              <div className="flex flex-wrap gap-2">
                {type?.examples?.map((example, idx) => (
                  <span key={idx} className="bg-muted px-2 py-1 rounded text-sm">
                    {example}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="bg-success/10 p-3 rounded">
                <h6 className="font-medium text-success text-sm mb-1">Indications:</h6>
                <p className="text-text-secondary text-sm">{type?.indications}</p>
              </div>
              <div className="bg-error/10 p-3 rounded">
                <h6 className="font-medium text-error text-sm mb-1">Contraindications:</h6>
                <p className="text-text-secondary text-sm">{type?.contraindications}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const GunaInfographic = ({ data }) => (
    <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
      {data?.qualities?.map((quality, index) => (
        <div key={index} className="bg-background rounded-xl p-4 organic-shadow text-center">
          <div className="mb-3">
            <div className="w-12 h-12 bg-brand-sage/20 rounded-full mx-auto flex items-center justify-center mb-2">
              <Icon name="Circle" size={20} className="text-brand-sage" />
            </div>
            <h4 className="font-semibold text-primary text-sm">{quality?.name}</h4>
            <p className="text-xs text-text-secondary">vs {quality?.opposite}</p>
          </div>
          <p className="text-text-secondary text-xs">{quality?.effect}</p>
        </div>
      ))}
    </div>
  );

  const VipakaInfographic = ({ data }) => (
    <div className="space-y-6">
      {data?.types?.map((type, index) => (
        <div key={index} className="bg-background rounded-xl p-6 organic-shadow">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-brand-gold/20 rounded-full flex items-center justify-center">
              <Icon name="RotateCw" size={20} className="text-brand-gold" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-primary">{type?.name}</h4>
              <p className="text-sm text-text-secondary">{type?.sanskrit}</p>
            </div>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <span className="font-medium text-primary">Original Tastes: </span>
                <span className="text-text-secondary">{type?.originalTastes?.join(', ')}</span>
              </div>
              <div>
                <span className="font-medium text-primary">Effects: </span>
                <span className="text-text-secondary">{type?.effects}</span>
              </div>
              <div>
                <span className="font-medium text-primary">Dosha Effect: </span>
                <span className="text-text-secondary">{type?.doshaEffect}</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <h5 className="font-medium text-primary mb-2">Examples:</h5>
                <div className="flex flex-wrap gap-2">
                  {type?.examples?.map((example, idx) => (
                    <span key={idx} className="bg-muted px-2 py-1 rounded text-sm">
                      {example}
                    </span>
                  ))}
                </div>
              </div>
              <div className="bg-brand-cream/50 p-3 rounded">
                <span className="font-medium text-primary">Therapeutic Use: </span>
                <span className="text-text-secondary">{type?.therapeuticUse}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderInfographic = () => {
    switch (selectedConcept) {
      case 'rasa':
        return <RasaInfographic data={selectedConceptData} />;
      case 'virya':
        return <ViryaInfographic data={selectedConceptData} />;
      case 'guna':
        return <GunaInfographic data={selectedConceptData} />;
      case 'vipaka':
        return <VipakaInfographic data={selectedConceptData} />;
      default:
        return <RasaInfographic data={selectedConceptData} />;
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-display font-semibold text-primary mb-3">
          Ayurvedic Concept Infographics
        </h2>
        <p className="text-text-secondary max-w-3xl mx-auto">
          Visual guides to understanding the sophisticated principles that govern food energetics 
          and their therapeutic applications in personalized nutrition.
        </p>
      </div>
      {/* Concept Selection */}
      <div className="flex justify-center">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl">
          {concepts?.map((concept) => (
            <button
              key={concept?.id}
              onClick={() => setSelectedConcept(concept?.id)}
              className={`p-4 rounded-xl organic-transition text-left ${
                selectedConcept === concept?.id
                  ? 'bg-background elevated-shadow border-2 border-brand-gold'
                  : 'bg-muted/50 hover:bg-background hover:organic-shadow'
              }`}
            >
              <div className="flex items-center space-x-3 mb-2">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${concept?.color}20` }}
                >
                  <Icon name={concept?.icon} size={20} style={{ color: concept?.color }} />
                </div>
                <div>
                  <h3 className="font-semibold text-primary">{concept?.name}</h3>
                  <div className="flex items-center space-x-2 text-sm text-text-secondary">
                    <span>{concept?.sanskrit}</span>
                    <button className="text-xs bg-muted px-1 rounded">
                      🔊 {concept?.pronunciation}
                    </button>
                  </div>
                </div>
              </div>
              <p className="text-sm text-text-secondary">{concept?.description}</p>
            </button>
          ))}
        </div>
      </div>
      {/* Selected Concept Header */}
      <div className="text-center bg-gradient-to-r from-brand-cream to-brand-ivory rounded-2xl p-6 border border-brand-gold/20">
        <div className="flex items-center justify-center space-x-4 mb-3">
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${selectedConceptData?.color}20` }}
          >
            <Icon 
              name={selectedConceptData?.icon} 
              size={32} 
              style={{ color: selectedConceptData?.color }} 
            />
          </div>
          <div>
            <h2 className="text-2xl font-display font-semibold text-primary">
              {selectedConceptData?.name}
            </h2>
            <div className="flex items-center space-x-2 text-text-secondary">
              <span className="text-lg">{selectedConceptData?.sanskrit}</span>
              <button className="text-sm bg-muted px-2 py-1 rounded">
                🔊 {selectedConceptData?.pronunciation}
              </button>
            </div>
          </div>
        </div>
        <p className="text-text-secondary max-w-2xl mx-auto">
          {selectedConceptData?.description}
        </p>
      </div>
      {/* Infographic Content */}
      <div className="bg-gradient-to-br from-brand-ivory to-brand-cream rounded-2xl p-8">
        {renderInfographic()}
      </div>
      {/* Download Options */}
      <div className="text-center bg-background rounded-xl p-6 organic-shadow">
        <h3 className="text-lg font-semibold text-primary mb-3">
          Take These Concepts With You
        </h3>
        <p className="text-text-secondary mb-4">
          Download high-resolution infographics for your practice or study materials.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            variant="default"
            iconName="Download"
            iconPosition="left"
          >
            Download PDF Guide
          </Button>
          <Button 
            variant="outline"
            iconName="Image"
            iconPosition="left"
          >
            Download Infographic
          </Button>
          <Button 
            variant="outline"
            iconName="Share"
            iconPosition="left"
          >
            Share with Colleagues
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConceptInfographics;