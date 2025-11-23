import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const CommunicationTools = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const conversations = [
    {
      id: 1,
      patient: {
        name: "Sarah Johnson",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
        dosha: "Vata-Pitta",
        status: "online"
      },
      lastMessage: "Thank you for the updated meal plan. I\'m feeling much better!",
      timestamp: new Date(Date.now() - 300000), // 5 minutes ago
      unread: 2,
      priority: "normal"
    },
    {
      id: 2,
      patient: {
        name: "Michael Chen",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        dosha: "Kapha",
        status: "offline"
      },
      lastMessage: "I have some questions about the dietary restrictions you mentioned.",
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      unread: 0,
      priority: "normal"
    },
    {
      id: 3,
      patient: {
        name: "Emma Davis",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
        dosha: "Pitta-Vata",
        status: "online"
      },
      lastMessage: "Emergency: Experiencing severe digestive discomfort after following the new plan.",
      timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
      unread: 1,
      priority: "urgent"
    },
    {
      id: 4,
      patient: {
        name: "Robert Wilson",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        dosha: "Vata",
        status: "offline"
      },
      lastMessage: "The joint pain has reduced significantly. Should I continue with the current plan?",
      timestamp: new Date(Date.now() - 7200000), // 2 hours ago
      unread: 0,
      priority: "normal"
    }
  ];

  const messages = [
    {
      id: 1,
      sender: "patient",
      content: "Hi Dr. Patel, I wanted to update you on my progress with the new nutrition plan.",
      timestamp: new Date(Date.now() - 1800000),
      read: true
    },
    {
      id: 2,
      sender: "doctor",
      content: "That's wonderful to hear! How are you feeling overall? Any specific improvements you've noticed?",
      timestamp: new Date(Date.now() - 1500000),
      read: true
    },
    {
      id: 3,
      sender: "patient",
      content: "My energy levels have improved dramatically, and the digestive issues are almost gone. The morning routine you suggested is working perfectly.",
      timestamp: new Date(Date.now() - 1200000),
      read: true
    },
    {
      id: 4,
      sender: "doctor",
      content: "Excellent progress! This aligns perfectly with your Vata-Pitta constitution. Let\'s schedule a follow-up next week to review and potentially adjust the plan.",
      timestamp: new Date(Date.now() - 900000),
      read: true
    },
    {
      id: 5,
      sender: "patient",
      content: "Thank you for the updated meal plan. I\'m feeling much better!",
      timestamp: new Date(Date.now() - 300000),
      read: false
    }
  ];

  const automatedUpdates = [
    {
      id: 1,
      type: "plan_update",
      patient: "Sarah Johnson",
      title: "Nutrition Plan Updated",
      description: "Seasonal adjustments made for autumn transition",
      timestamp: new Date(Date.now() - 3600000),
      status: "sent"
    },
    {
      id: 2,
      type: "reminder",
      patient: "Michael Chen",
      title: "Appointment Reminder",
      description: "Follow-up consultation scheduled for tomorrow at 2:00 PM",
      timestamp: new Date(Date.now() - 7200000),
      status: "scheduled"
    },
    {
      id: 3,
      type: "progress_alert",
      patient: "Emma Davis",
      title: "Progress Milestone Reached",
      description: "Patient has achieved 80% adherence to meal plan",
      timestamp: new Date(Date.now() - 10800000),
      status: "sent"
    }
  ];

  const familyCaregivers = [
    {
      id: 1,
      name: "John Johnson",
      relationship: "Spouse",
      patient: "Sarah Johnson",
      permissions: ["View Plans", "Receive Updates"],
      contact: "john.johnson@email.com"
    },
    {
      id: 2,
      name: "Mary Chen",
      relationship: "Mother",
      patient: "Michael Chen",
      permissions: ["Emergency Contact", "Progress Reports"],
      contact: "mary.chen@email.com"
    }
  ];

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'border-l-error bg-error/5';
      case 'high': return 'border-l-warning bg-warning/5';
      default: return 'border-l-primary bg-primary/5';
    }
  };

  const getStatusColor = (status) => {
    return status === 'online' ? 'bg-success' : 'bg-muted';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-semibold text-primary">Communication Tools</h2>
          <p className="text-text-secondary">Secure messaging and patient coordination</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" iconName="Users">
            Manage Caregivers
          </Button>
          <Button variant="default" iconName="MessageSquare">
            New Message
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversations List */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-lg border border-border organic-shadow">
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-text-primary">Messages</h3>
                <Icon name="Search" size={20} className="text-text-secondary" />
              </div>
              <Input
                type="search"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e?.target?.value)}
              />
            </div>

            <div className="divide-y divide-border max-h-96 overflow-y-auto">
              {conversations?.map((conversation) => (
                <div
                  key={conversation?.id}
                  onClick={() => setSelectedConversation(conversation)}
                  className={`p-4 cursor-pointer hover:bg-muted/30 organic-transition border-l-4 ${
                    getPriorityColor(conversation?.priority)
                  } ${selectedConversation?.id === conversation?.id ? 'bg-muted/50' : ''}`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="relative">
                      <img
                        src={conversation?.patient?.avatar}
                        alt={conversation?.patient?.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                        getStatusColor(conversation?.patient?.status)
                      }`}></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-text-primary truncate">
                          {conversation?.patient?.name}
                        </h4>
                        {conversation?.unread > 0 && (
                          <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                            {conversation?.unread}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-text-secondary truncate mb-1">
                        {conversation?.lastMessage}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-text-secondary">
                          {formatTimestamp(conversation?.timestamp)}
                        </span>
                        <span className="text-xs px-2 py-1 bg-accent/20 text-accent rounded">
                          {conversation?.patient?.dosha}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="lg:col-span-2">
          {selectedConversation ? (
            <div className="bg-card rounded-lg border border-border organic-shadow h-96 flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={selectedConversation?.patient?.avatar}
                      alt={selectedConversation?.patient?.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-text-primary">
                        {selectedConversation?.patient?.name}
                      </h3>
                      <p className="text-sm text-text-secondary">
                        {selectedConversation?.patient?.dosha} • {selectedConversation?.patient?.status}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" iconName="Phone">
                      Call
                    </Button>
                    <Button variant="ghost" size="sm" iconName="Video">
                      Video
                    </Button>
                    <Button variant="ghost" size="sm" iconName="MoreVertical">
                      More
                    </Button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages?.map((message) => (
                  <div
                    key={message?.id}
                    className={`flex ${message?.sender === 'doctor' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message?.sender === 'doctor'
                          ? 'bg-primary text-primary-foreground' :'bg-muted text-text-primary'
                      }`}
                    >
                      <p className="text-sm">{message?.content}</p>
                      <p className={`text-xs mt-1 ${
                        message?.sender === 'doctor' ? 'text-primary-foreground/70' : 'text-text-secondary'
                      }`}>
                        {formatTimestamp(message?.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-border">
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" iconName="Paperclip">
                    Attach
                  </Button>
                  <Input
                    type="text"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e?.target?.value)}
                    className="flex-1"
                  />
                  <Button variant="default" size="sm" iconName="Send">
                    Send
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-card rounded-lg border border-border organic-shadow h-96 flex items-center justify-center">
              <div className="text-center">
                <Icon name="MessageSquare" size={48} className="text-text-secondary mb-4 mx-auto" />
                <h3 className="text-lg font-semibold text-text-primary mb-2">Select a conversation</h3>
                <p className="text-text-secondary">Choose a patient from the list to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Automated Updates & Family Coordination */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Automated Updates */}
        <div className="bg-card rounded-lg border border-border organic-shadow">
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-text-primary">Automated Updates</h3>
              <Button variant="ghost" size="sm" iconName="Settings">
                Configure
              </Button>
            </div>
          </div>
          <div className="p-4 space-y-3">
            {automatedUpdates?.map((update) => (
              <div key={update?.id} className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <Icon 
                    name={update?.type === 'plan_update' ? 'FileText' : update?.type === 'reminder' ? 'Clock' : 'TrendingUp'} 
                    size={16} 
                    className="text-primary" 
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-text-primary">{update?.title}</h4>
                    <span className={`text-xs px-2 py-1 rounded ${
                      update?.status === 'sent' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                    }`}>
                      {update?.status}
                    </span>
                  </div>
                  <p className="text-sm text-text-secondary mb-1">{update?.patient}</p>
                  <p className="text-sm text-text-secondary">{update?.description}</p>
                  <p className="text-xs text-text-secondary mt-1">
                    {formatTimestamp(update?.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Family Caregiver Coordination */}
        <div className="bg-card rounded-lg border border-border organic-shadow">
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-text-primary">Family Caregivers</h3>
              <Button variant="ghost" size="sm" iconName="UserPlus">
                Add Caregiver
              </Button>
            </div>
          </div>
          <div className="p-4 space-y-3">
            {familyCaregivers?.map((caregiver) => (
              <div key={caregiver?.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div>
                  <h4 className="font-medium text-text-primary">{caregiver?.name}</h4>
                  <p className="text-sm text-text-secondary">
                    {caregiver?.relationship} of {caregiver?.patient}
                  </p>
                  <p className="text-xs text-text-secondary">{caregiver?.contact}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {caregiver?.permissions?.map((permission, index) => (
                      <span key={index} className="text-xs px-2 py-1 bg-secondary/10 text-secondary rounded">
                        {permission}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" iconName="Mail">
                    Contact
                  </Button>
                  <Button variant="ghost" size="sm" iconName="Edit">
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunicationTools;