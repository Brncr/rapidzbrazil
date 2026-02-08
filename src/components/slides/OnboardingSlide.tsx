import { BookOpen, GraduationCap, Briefcase, CreditCard, Shield, TrendingUp, Headphones, Wallet } from "lucide-react";

const articles = [
  {
    level: "Beginner",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    items: [
      { title: "Welcome to Rapidz", category: "Getting Started", icon: BookOpen },
      { title: "Understanding KYC", category: "Account & Security", icon: Shield },
      { title: "How to Buy Crypto", category: "Funding", icon: Wallet },
      { title: "The Rapidz Card", category: "Using Crypto", icon: CreditCard },
      { title: "Mobile Payments", category: "Using Crypto", icon: CreditCard },
      { title: "Password & Security Tips", category: "Security", icon: Shield },
      { title: "Customer Support Guide", category: "Support", icon: Headphones },
    ],
  },
  {
    level: "Intermediate",
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
    items: [
      { title: "Portfolio Tracking", category: "Management", icon: TrendingUp },
      { title: "Instant Swaps", category: "Trading", icon: TrendingUp },
      { title: "Cashback Program", category: "Rewards", icon: TrendingUp },
      { title: "Staking & Yield", category: "Earning", icon: TrendingUp },
      { title: "Card Management", category: "Card", icon: CreditCard },
      { title: "Advanced Security", category: "Security", icon: Shield },
    ],
  },
  {
    level: "Advanced",
    color: "text-rose-400",
    bgColor: "bg-rose-500/10",
    borderColor: "border-rose-500/30",
    items: [
      { title: "White Label Cards", category: "B2B", icon: Briefcase },
      { title: "Buy Crypto Platform", category: "B2B", icon: Briefcase },
      { title: "Rapidz Premier", category: "Premium", icon: GraduationCap },
      { title: "OTC Trading Desk", category: "OTC", icon: TrendingUp },
      { title: "Crypto Regulations", category: "Compliance", icon: Shield },
      { title: "Future Roadmap", category: "Innovation", icon: GraduationCap },
    ],
  },
];

const OnboardingSlide = () => {
  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8 pb-20 md:pb-8 relative overflow-hidden overflow-y-auto bg-background">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20" />
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[120px]" />
      
      <div className="relative z-10 max-w-6xl mx-auto w-full">
        {/* Header */}
        <div className="mb-4 md:mb-6 fade-up">
          <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 mb-3 md:mb-4">
            <BookOpen className="w-3.5 h-3.5 md:w-4 md:h-4 text-cyan-400" />
            <span className="text-cyan-400 font-medium text-xs md:text-sm">Educational Content</span>
          </div>
          <h2 className="text-2xl md:text-4xl font-semibold font-display mb-2 md:mb-3 tracking-tight">
            <span className="text-foreground">Onboarding</span>
            <span className="text-cyan-400 ml-2">Articles</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl font-light text-sm md:text-base">
            19 comprehensive articles in English and Portuguese covering all user journeys
          </p>
        </div>
        
        {/* Articles by Level */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6">
          {articles.map((level, i) => (
            <div
              key={level.level}
              className={`p-3 md:p-5 rounded-xl md:rounded-2xl bg-card/50 border border-border/50 fade-up hover:${level.borderColor} transition-all`}
              style={{ animationDelay: `${0.1 + i * 0.1}s` }}
            >
              <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full ${level.bgColor} flex items-center justify-center`}>
                  {level.level === "Beginner" && <BookOpen className={`w-4 h-4 md:w-5 md:h-5 ${level.color}`} />}
                  {level.level === "Intermediate" && <GraduationCap className={`w-4 h-4 md:w-5 md:h-5 ${level.color}`} />}
                  {level.level === "Advanced" && <Briefcase className={`w-4 h-4 md:w-5 md:h-5 ${level.color}`} />}
                </div>
                <div>
                  <h3 className="font-medium text-foreground text-sm md:text-base">{level.level}</h3>
                  <p className="text-[10px] md:text-xs text-muted-foreground">{level.items.length} articles</p>
                </div>
              </div>
              
              <div className="space-y-1.5 md:space-y-2">
                {level.items.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center gap-2 md:gap-3 p-1.5 md:p-2 rounded-lg bg-background/50 hover:bg-background/80 transition-colors"
                  >
                    <div className={`w-6 h-6 md:w-7 md:h-7 rounded-full ${level.bgColor} flex items-center justify-center shrink-0`}>
                      <item.icon className={`w-3 h-3 md:w-3.5 md:h-3.5 ${level.color}`} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs md:text-sm font-medium text-foreground truncate">{item.title}</p>
                      <p className="text-[10px] md:text-xs text-muted-foreground">{item.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {/* Content Formats */}
        <div className="grid grid-cols-5 gap-1.5 md:gap-3 mb-4 md:mb-6">
          {[
            { format: "Articles", desc: "Long-form guides" },
            { format: "Videos", desc: "Step-by-step tutorials" },
            { format: "Infographics", desc: "Visual summaries" },
            { format: "Threads", desc: "Social carousels" },
            { format: "Posts", desc: "Quick tips" },
          ].map((item, i) => (
            <div
              key={item.format}
              className="p-2 md:p-3 rounded-lg md:rounded-xl bg-card/50 border border-border/50 text-center fade-up"
              style={{ animationDelay: `${0.4 + i * 0.05}s` }}
            >
              <p className="text-[10px] md:text-sm font-medium text-foreground">{item.format}</p>
              <p className="text-[9px] md:text-xs text-muted-foreground hidden md:block">{item.desc}</p>
            </div>
          ))}
        </div>
        
        {/* Summary */}
        <div className="p-3 md:p-5 rounded-xl md:rounded-2xl bg-gradient-to-r from-cyan-500/10 to-blue-500/5 border border-cyan-500/20 fade-up" style={{ animationDelay: "0.6s" }}>
          <div className="flex items-center justify-between flex-wrap gap-3 md:gap-4">
            <div>
              <h4 className="font-semibold text-foreground text-sm md:text-base">Content Production Value</h4>
              <p className="text-xs md:text-sm text-muted-foreground">$700 for basic articles + $3,600 for premium content</p>
            </div>
            <div className="flex gap-4 md:gap-6">
              <div className="text-center">
                <div className="text-xl md:text-2xl font-bold text-cyan-400">19</div>
                <p className="text-[10px] md:text-xs text-muted-foreground">Base Articles</p>
              </div>
              <div className="text-center">
                <div className="text-xl md:text-2xl font-bold text-cyan-400">$4,300</div>
                <p className="text-[10px] md:text-xs text-muted-foreground">Total Cost</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingSlide;
