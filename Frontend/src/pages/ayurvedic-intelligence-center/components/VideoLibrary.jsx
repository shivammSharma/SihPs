import React, { useMemo, useState, useRef, useEffect } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import Image from "../../../components/AppImage";

const VideoLibrary = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedVideo, setSelectedVideo] = useState(null);

  // ----------------------------
  // VIDEO DATA (add youtubeId)
  // ----------------------------
  const videos = [
    {
      id: 1,
      title:
        "What is Ayurveda | What is your Prakriti? | Are you Vata, Pitta, Kapha?",
      description:
        "An in-depth explanation of Vata, Pitta and Kapha doshas by an Ayurveda specialist.",
      duration: "23:19", // you may want to check exact runtime on YouTube
      category: "clinical",
      instructor: "Dr. Rekha",
      credentials: "Ayurvedic Doctor",
      youtubeId: "01YIl8vbobA",
      thumbnail: "https://img.youtube.com/vi/01YIl8vbobA/hqdefault.jpg",
      topics: ["Vata Dosha", "Pitta Dosha", "Kapha Dosha", "Dosha Balance"],
    },
    {
      id: 2,
      title:
        "Understanding Rasaayana: Going Beyond The Lazy Translation of Rejuvenation",
      description:
        "In the wellness industry today, rejuvenation is a buzzword that often gets thrown around. However, this is a limited and somewhat lazy translation of what the Ayurvedic concept of Rasayana truly stands for. Rasayana is a special  branch of Ayurveda, and it goes far beyond the surface-level notions of anti-aging and vitality.",
      duration: "13:35",
      category: "nutrition",
      instructor: "Dr. Vignesh Devraj",
      credentials: "PhD Nutrition, BAMS",
      // Suggested earlier
      youtubeId: "FOioDTmPaTE",
      thumbnail: "https://img.youtube.com/vi/FOioDTmPaTE/hqdefault.jpg",
      topics: [
        "Six Tastes",
        "Food Potency",
        "Post-Digestive Effects",
        "Therapeutic Applications",
      ],
    },
    {
      id: 3,
      title: "Integrating Ayurveda in Clinical Practice: A Case Study Approach",
      description:
        "Real-world examples of how healthcare professionals successfully integrate Ayurvedic principles with modern medicine.",
      duration: "6:55", // keep or update if you want exact duration
      category: "clinical",
      instructor: "Dr. Anam Aftab",
      credentials: "Ayurveda consultant and integrative‐healthcare lead",
      youtubeId: "Mx26Oob_Bdw", // <-- YouTube ID from your link
      thumbnail: "https://img.youtube.com/vi/Mx26Oob_Bdw/hqdefault.jpg",
      topics: [
        "Patient Assessment",
        "Treatment Planning",
        "Outcome Measurement",
        "Documentation",
      ],
    },
    {
      id: 4,
      title:
        "7-Day Ayurvedic Diet Plan | Fix Your Digestion, Skin, Sleep & Immunity Naturally",
      description:
        "A complete 7-day Ayurvedic meal plan designed to improve digestion, cleanse the gut, enhance immunity, and balance doshas naturally through mindful eating practices.",
      duration: "9:01", // ✅ YouTube actual duration (from video)
      category: "nutrition",
      instructor: "Dr Hansaji",
      credentials: "Ayurvedic Wellness Expert & Holistic Nutrition Specialist",
      youtubeId: "gWu0zRWB-eM", // ✅ Extracted from your link
      thumbnail: "https://img.youtube.com/vi/gWu0zRWB-eM/hqdefault.jpg",
      views: "92K", // approximate YouTube views (can be updated anytime)
      rating: 4.9,
      topics: [
        "7-Day Diet Plan",
        "Dosha Balancing",
        "Healthy Digestion",
        "Immunity Boosting Foods",
      ],
    },

    {
      id: 5,
      title:
        "Weak or Strong Digestion? Find Out What Ayurveda Says About Your Agni",
      description:
        "Explore how the concept of Agni (digestive/metabolic fire) in Ayurveda determines whether your digestion is weak or strong — with signs, causes, and dietary tips for balancing it.",
      duration: "25:09", // ✅ exact duration from YouTube
      category: "fundamentals",
      instructor: "Dr. Rini Shivastava",
      credentials: "Advisor, Scientific Maharishi Ayurveda",
      youtubeId: "_H_yFqQ1ozw", // ✅ from the link: https://www.youtube.com/watch?v=_H_yFqQ1ozw
      thumbnail: "https://img.youtube.com/vi/_H_yFqQ1ozw/hqdefault.jpg",
      topics: [
        "Agni Types",
        "Weak Digestion (Mandagni)",
        "Signs of Strong Agni",
        "Diet & Lifestyle Tips",
      ],
    },

    {
      id: 6,
      title: "Easy Diet Tips to Control Diabetes",
      description:
        "Renowned endocrinologist Dr. V Mohan shares practical and scientifically backed Ayurvedic-inspired dietary tips to help manage and prevent diabetes through food, lifestyle, and awareness.",
      duration: "21:42",
      category: "case-studies",
      instructor: "Dr. V Mohan",
      credentials: "MD Endocrinology, CAP",
      youtubeId: "l5qIcj-RylA", // TODO: add ID when you have a real video
      thumbnail: "https://img.youtube.com/vi/l5qIcj-RylA/hqdefault.jpg",
      views: "3.1M",
      // rating: 4.6,
      topics: [
        "Blood Sugar Management",
        "Balanced Diet for Diabetes",
        "Lifestyle and Exercise Tips",
        "Preventing Type 2 Diabetes",
      ],
    },
  ];

  // ----------------------------
  // DYNAMIC CATEGORIES + FILTER
  // ----------------------------
  const categories = useMemo(() => {
    const map = new Map();
    videos.forEach((v) => {
      const key =
        v.category === "fundamentals" ||
        v.category === "clinical" ||
        v.category === "nutrition" ||
        v.category === "case-studies"
          ? v.category
          : "other";
      map.set(key, (map.get(key) || 0) + 1);
    });

    const list = [
      { id: "all", name: "All Videos", count: videos.length },
      {
        id: "fundamentals",
        name: "Fundamentals",
        count: map.get("fundamentals") || 0,
      },
      {
        id: "clinical",
        name: "Clinical Practice",
        count: map.get("clinical") || 0,
      },
      {
        id: "nutrition",
        name: "Nutrition Science",
        count: map.get("nutrition") || 0,
      },
      {
        id: "case-studies",
        name: "Case Studies",
        count: map.get("case-studies") || 0,
      },
    ];
    return list;
  }, [videos]);

  const filteredVideos =
    selectedCategory === "all"
      ? videos
      : videos?.filter((video) => video?.category === selectedCategory);

  // ----------------------------
  // VIDEO CARD
  // ----------------------------
  const VideoCard = ({ video }) => (
    <div
      className="bg-background rounded-xl organic-shadow hover:elevated-shadow organic-transition cursor-pointer"
      onClick={() => setSelectedVideo(video)}
    >
      <div className="relative">
        <Image
          src={video?.thumbnail}
          alt={video?.title}
          className="w-full h-48 object-cover rounded-t-xl"
        />
        <div className="absolute inset-0 bg-black/20 rounded-t-xl flex items-center justify-center opacity-0 hover:opacity-100 organic-transition">
          <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
            <Icon name="Play" size={24} className="text-primary ml-1" />
          </div>
        </div>
        <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
          {video?.duration}
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-primary mb-2 line-clamp-2">
          {video?.title}
        </h3>
        <p className="text-sm text-text-secondary mb-3 line-clamp-2">
          {video?.description}
        </p>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-brand-sage/20 rounded-full flex items-center justify-center">
              <Icon name="User" size={14} className="text-brand-sage" />
            </div>
            <div>
              <div className="text-sm font-medium text-primary">
                {video?.instructor}
              </div>
              <div className="text-xs text-text-secondary">
                {video?.credentials}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-1 text-sm text-text-secondary">
            {/* <Icon
              name="Star"
              size={14}
              className="text-brand-gold fill-current"
            />
            <span>{video?.rating}</span> */}
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-text-secondary">
          <div className="flex items-center space-x-1">
            {/* <Icon name="Eye" size={14} />
            <span>{video?.views} Views </span> */}
          </div>
          <div className="flex flex-wrap gap-1">
            {video?.topics?.slice(0, 2)?.map((topic, index) => (
              <span
                key={index}
                className="bg-muted px-2 py-1 rounded-full text-xs"
              >
                {topic}
              </span>
            ))}
            {video?.topics?.length > 2 && (
              <span className="text-xs text-text-secondary">
                +{video?.topics?.length - 2}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // ----------------------------
  // VIDEO MODAL (YouTube iframe)
  // ----------------------------
  const Backdrop = ({ onClose, children }) => {
    const ref = useRef(null);
    useEffect(() => {
      const onEsc = (e) => e.key === "Escape" && onClose();
      document.addEventListener("keydown", onEsc);
      return () => document.removeEventListener("keydown", onEsc);
    }, [onClose]);

    const onBackdrop = (e) => {
      if (e.target === ref.current) onClose();
    };

    return (
      <div
        ref={ref}
        onClick={onBackdrop}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        {children}
      </div>
    );
  };

  const VideoModal = ({ video, onClose }) => (
    <Backdrop onClose={onClose}>
      <div className="bg-background rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-xl font-display font-semibold text-primary">
            {video?.title}
          </h2>
          <Button variant="ghost" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        <div className="p-6">
          {/* Player */}
          <div className="aspect-video bg-black rounded-xl mb-6 relative overflow-hidden">
            {video?.youtubeId ? (
              <iframe
                title={video?.title}
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-center p-6">
                <div>
                  <Icon
                    name="AlertTriangle"
                    size={40}
                    className="text-brand-gold mx-auto mb-2"
                  />
                  <p className="text-text-secondary">
                    Video link not available yet. Please add a{" "}
                    <code className="px-1">youtubeId</code> for this item.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div>
                <h3 className="font-semibold text-primary mb-2">Description</h3>
                <p className="text-text-secondary">{video?.description}</p>
              </div>

              <div>
                <h3 className="font-semibold text-primary mb-2">
                  Topics Covered
                </h3>
                <div className="flex flex-wrap gap-2">
                  {video?.topics?.map((topic, index) => (
                    <span
                      key={index}
                      className="bg-brand-sage/20 text-brand-sage px-3 py-1 rounded-full text-sm"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-muted/50 rounded-xl p-4">
                <h3 className="font-semibold text-primary mb-3">Instructor</h3>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-brand-sage/20 rounded-full flex items-center justify-center">
                    <Icon name="User" size={20} className="text-brand-sage" />
                  </div>
                  <div>
                    <div className="font-medium text-primary">
                      {video?.instructor}
                    </div>
                    <div className="text-sm text-text-secondary">
                      {video?.credentials}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 rounded-xl p-4">
                <h3 className="font-semibold text-primary mb-3">Video Stats</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-text-secondary">Views</span>
                    <span className="font-medium">{video?.views}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text-secondary">Rating</span>
                    <div className="flex items-center space-x-1">
                      <Icon
                        name="Star"
                        size={14}
                        className="text-brand-gold fill-current"
                      />
                      <span className="font-medium">{video?.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text-secondary">Duration</span>
                    <span className="font-medium">{video?.duration}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Backdrop>
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-display font-semibold text-primary mb-3">
          Expert Video Library
        </h2>
        <p className="text-text-secondary max-w-3xl mx-auto">
          Learn from respected Ayurvedic practitioners and integrative medicine
          experts who bridge ancient wisdom with modern clinical practice.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2">
        {categories?.map((category) => (
          <button
            key={category?.id}
            onClick={() => setSelectedCategory(category?.id)}
            className={`px-4 py-2 rounded-full organic-transition ${
              selectedCategory === category?.id
                ? "bg-brand-gold text-white"
                : "bg-muted text-text-secondary hover:bg-brand-gold/20 hover:text-primary"
            }`}
          >
            {category?.name} ({category?.count})
          </button>
        ))}
      </div>

      {/* Video Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos?.map((video) => (
          <VideoCard key={video?.id} video={video} />
        ))}
      </div>

      {/* Load More
      <div className="text-center">
        <Button variant="outline" iconName="Plus" iconPosition="left">
          Load More Videos
        </Button>
      </div> */}

      {/* Video Modal */}
      {selectedVideo && (
        <VideoModal
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </div>
  );
};

export default VideoLibrary;
