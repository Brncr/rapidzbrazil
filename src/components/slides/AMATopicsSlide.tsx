import { MessageCircle, Lightbulb, User, Briefcase, Crown } from "lucide-react";

const amaCategories = [
  {
    category: "Fundamentals & Technology",
    icon: Lightbulb,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    topics: [
      "Mission and Vision of Rapidz",
      "Platform Overview & Pillars",
      "Regulatory Compliance (LFSA, FinCEN)",
      "Security Measures",
      "Future Roadmap & Innovations",
      "Global Expansion Plans",
      "Strategic Partnerships",
    ],
  },
  {
    category: "Personal Users",
    icon: User,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    topics: [
      "The Rapidz Card & Benefits",
      "Spending Crypto (Contactless, Mobile Wallets)",
      "Rewards & Cashback Program",
      "Portfolio Management Tools",
      "Easy Crypto Purchase",
      "Instant Swaps & Exchange",
      "Staking & Yield Generation",
      "Customer Support Channels",
      "User Experience & App Interface",
      "Onboarding Process",
    ],
  },
  {
    category: "Business Solutions (B2B)",
    icon: Briefcase,
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    topics: [
      "White Label Card Solutions",
      "Rapid Launch (2 Weeks)",
      "Branding & Customization",
      "Modular Components",
      "Buy Crypto White Label",
      "Simplified Customer Acquisition",
      "Integrated Compliance",
      "Customer Engagement",
      "B2B Rewards Program",
    ],
  },
  {
    category: "Premier & OTC",
    icon: Crown,
    color: "text-rose-400",
    bgColor: "bg-rose-500/10",
    topics: [
      "Exclusive Premier Benefits",
      "Virtual & Physical Premium Cards",
      "OTC Trading Desk",
      "OTC Fees & Personalized Service",
    ],
  },
];

const AMATopicsSlide = () => {
  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8 pb-20 md:pb-8 relative overflow-hidden overflow-y-auto bg-background">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-orange-500/5 rounded-full blur-[120px]" />
      
      <div className="relative z-10 max-w-6xl mx-auto w-full">
        {/* Header */}
        <div className="mb-4 md:mb-6 fade-up">
          <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-orange-500/10 border border-orange-500/30 mb-3 md:mb-4">
            <MessageCircle className="w-3.5 h-3.5 md:w-4 md:h-4 text-orange-400" />
            <span className="text-orange-400 font-medium text-xs md:text-sm">Community Events</span>
          </div>
          <h2 className="text-2xl md:text-4xl font-semibold font-display mb-2 md:mb-3 tracking-tight">
            <span className="text-foreground">AMA</span>
            <span className="text-orange-400 ml-2">Topics Library</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl font-light text-sm md:text-base">
            30 structured AMA topics across 4 categories for community engagement
          </p>
        </div>
        
        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {amaCategories.map((cat, i) => (
            <div
              key={cat.category}
              className="p-3 md:p-5 rounded-xl md:rounded-2xl bg-card/50 border border-border/50 fade-up hover:border-orange-500/30 transition-all"
              style={{ animationDelay: `${0.1 + i * 0.1}s` }}
            >
              <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full ${cat.bgColor} flex items-center justify-center`}>
                  <cat.icon className={`w-4 h-4 md:w-5 md:h-5 ${cat.color}`} />
                </div>
                <div>
                  <h3 className="font-medium text-foreground text-sm md:text-base">{cat.category}</h3>
                  <p className="text-[10px] md:text-xs text-muted-foreground">{cat.topics.length} topics</p>
                </div>
              </div>
              
              <div className="space-y-1 md:space-y-1.5">
                {cat.topics.map((topic, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center gap-2 text-xs md:text-sm py-0.5 md:py-1 border-b border-border/20 last:border-0"
                  >
                    <div className={`w-1.5 h-1.5 rounded-full ${cat.bgColor} shrink-0`} />
                    <span className="text-muted-foreground">{topic}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {/* Summary */}
        <div className="mt-4 md:mt-6 p-3 md:p-5 rounded-xl md:rounded-2xl bg-gradient-to-r from-orange-500/10 to-amber-500/5 border border-orange-500/20 fade-up" style={{ animationDelay: "0.5s" }}>
          <div className="flex items-center justify-between flex-wrap gap-3 md:gap-4">
            <div>
              <h4 className="font-semibold text-foreground text-sm md:text-base">AMA Session Strategy</h4>
              <p className="text-xs md:text-sm text-muted-foreground">Weekly sessions across partner guilds and communities</p>
            </div>
            <div className="flex gap-4 md:gap-6">
              <div className="text-center">
                <div className="text-xl md:text-2xl font-bold text-orange-400">30</div>
                <p className="text-[10px] md:text-xs text-muted-foreground">Total Topics</p>
              </div>
              <div className="text-center">
                <div className="text-xl md:text-2xl font-bold text-orange-400">4</div>
                <p className="text-[10px] md:text-xs text-muted-foreground">Categories</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AMATopicsSlide;
