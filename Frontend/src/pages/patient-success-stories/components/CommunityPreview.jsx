import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CommunityPreview = () => {
  const forumPosts = [
    {
      id: 1,
      author: "Sarah M.",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      title: "Amazing Vata-balancing breakfast recipe!",
      preview: "I've been following my personalized plan for 3 months now, and this warm quinoa porridge with ghee and dates has become my morning staple...",
      replies: 12,
      likes: 28,
      timeAgo: "2 hours ago",
      category: "Recipes"
    },
    {
      id: 2,
      author: "Michael R.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      title: "Pitta season adjustments working wonders",
      preview: "As we transition into summer, I've been following the seasonal modifications suggested in my plan. The cooling foods and evening routines...",
      replies: 8,
      likes: 19,
      timeAgo: "5 hours ago",
      category: "Seasonal Tips"
    },
    {
      id: 3,
      author: "Priya K.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      title: "Question about Kapha-reducing spices",
      preview: "My nutritionist recommended increasing warming spices in my diet. I've been experimenting with turmeric, ginger, and black pepper combinations...",
      replies: 15,
      likes: 22,
      timeAgo: "1 day ago",
      category: "Questions"
    }
  ];

  const getCategoryColor = (category) => {
    const colors = {
      'Recipes': 'bg-green-100 text-green-800',
      'Seasonal Tips': 'bg-blue-100 text-blue-800',
      'Questions': 'bg-orange-100 text-orange-800',
      'Success': 'bg-purple-100 text-purple-800'
    };
    return colors?.[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-card rounded-xl p-8 organic-shadow">
      <div className="text-center mb-8">
        <h3 className="font-display font-semibold text-2xl text-text-primary mb-3">
          Join Our Wellness Community
        </h3>
        <p className="text-text-secondary max-w-2xl mx-auto">
          Connect with fellow patients, share recipes, ask questions, and support each other on your Ayurvedic wellness journeys. Our community is a safe space for learning and growth.
        </p>
      </div>
      {/* Community Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="text-center p-4 bg-muted rounded-lg">
          <div className="text-2xl font-semibold text-primary mb-1">2,847</div>
          <div className="text-sm text-text-secondary">Active Members</div>
        </div>
        <div className="text-center p-4 bg-muted rounded-lg">
          <div className="text-2xl font-semibold text-accent mb-1">1,293</div>
          <div className="text-sm text-text-secondary">Recipes Shared</div>
        </div>
        <div className="text-center p-4 bg-muted rounded-lg">
          <div className="text-2xl font-semibold text-secondary mb-1">456</div>
          <div className="text-sm text-text-secondary">Success Stories</div>
        </div>
        <div className="text-center p-4 bg-muted rounded-lg">
          <div className="text-2xl font-semibold text-brand-gold mb-1">98%</div>
          <div className="text-sm text-text-secondary">Satisfaction Rate</div>
        </div>
      </div>
      {/* Recent Forum Posts */}
      <div className="mb-8">
        <h4 className="font-display font-semibold text-lg text-text-primary mb-6">
          Recent Community Discussions
        </h4>
        <div className="space-y-4">
          {forumPosts?.map(post => (
            <div key={post?.id} className="border border-border rounded-lg p-4 hover:bg-muted/30 organic-transition">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={post?.avatar}
                    alt={post?.author}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-medium text-text-primary text-sm">
                      {post?.author}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(post?.category)}`}>
                      {post?.category}
                    </span>
                    <span className="text-xs text-text-secondary">
                      {post?.timeAgo}
                    </span>
                  </div>
                  <h5 className="font-medium text-text-primary mb-2">
                    {post?.title}
                  </h5>
                  <p className="text-sm text-text-secondary mb-3 line-clamp-2">
                    {post?.preview}
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-text-secondary">
                    <div className="flex items-center space-x-1">
                      <Icon name="MessageCircle" size={14} />
                      <span>{post?.replies} replies</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="Heart" size={14} />
                      <span>{post?.likes} likes</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Community Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="text-center p-4">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <Icon name="Users" size={24} className="text-primary" />
          </div>
          <h5 className="font-medium text-text-primary mb-2">Peer Support</h5>
          <p className="text-sm text-text-secondary">
            Connect with others on similar wellness journeys
          </p>
        </div>
        <div className="text-center p-4">
          <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <Icon name="BookOpen" size={24} className="text-accent" />
          </div>
          <h5 className="font-medium text-text-primary mb-2">Recipe Library</h5>
          <p className="text-sm text-text-secondary">
            Thousands of dosha-specific recipes and meal ideas
          </p>
        </div>
        <div className="text-center p-4">
          <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <Icon name="Award" size={24} className="text-secondary" />
          </div>
          <h5 className="font-medium text-text-primary mb-2">Expert Guidance</h5>
          <p className="text-sm text-text-secondary">
            Regular Q&A sessions with Ayurvedic practitioners
          </p>
        </div>
      </div>
      {/* CTA */}
      <div className="text-center">
        <Button
          variant="default"
          size="lg"
          className="bg-brand-gold hover:bg-brand-gold/90"
          iconName="Users"
          iconPosition="left"
        >
          Join Our Community
        </Button>
        <p className="text-xs text-text-secondary mt-2">
          Free to join • Moderated by healthcare professionals
        </p>
      </div>
    </div>
  );
};

export default CommunityPreview;