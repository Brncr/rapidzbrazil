import { FileText, Video, Image, MessageSquare, BookOpen, GraduationCap, Briefcase, Crown } from "lucide-react";

const contentTypes = [
  { type: "Article", count: 19, icon: FileText, color: "text-blue-400" },
  { type: "Video", count: 19, icon: Video, color: "text-purple-400" },
  { type: "Infographic", count: 19, icon: Image, color: "text-pink-400" },
  { type: "Thread", count: 19, icon: MessageSquare, color: "text-amber-400" },
  { type: "Post", count: 19, icon: MessageSquare, color: "text-green-400" },
];

const categories = [
  { name: "Getting Started", level: "Beginner", count: 5, icon: BookOpen },
  { name: "Account & Security", level: "Beginner", count: 15, icon: BookOpen },
  { name: "Funding Your Account", level: "Beginner", count: 5, icon: BookOpen },
  { name: "Using Your Crypto", level: "Beginner", count: 15, icon: BookOpen },
  { name: "Support", level: "Beginner", count: 5, icon: BookOpen },
  { name: "Portfolio Management", level: "Intermediate", count: 5, icon: GraduationCap },
  { name: "Trading & Exchange", level: "Intermediate", count: 5, icon: GraduationCap },
  { name: "Earning & Rewards", level: "Intermediate", count: 10, icon: GraduationCap },
  { name: "Card Management", level: "Intermediate", count: 5, icon: GraduationCap },
  { name: "Security & Compliance", level: "Intermediate", count: 5, icon: GraduationCap },
  { name: "Business Solutions", level: "Advanced", count: 10, icon: Briefcase },
  { name: "Premier Services", level: "Advanced", count: 5, icon: Crown },
  { name: "OTC Trading", level: "Advanced", count: 5, icon: Crown },
  { name: "Regulatory Insights", level: "Advanced", count: 5, icon: Briefcase },
];

const ContentPlanSlide = () => {
  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8 pb-20 md:pb-8 relative overflow-hidden overflow-y-auto bg-background">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[120px]" />
      
      <div className="relative z-10 max-w-6xl mx-auto w-full">
        {/* Header */}
        <div className="mb-4 md:mb-6 fade-up">
          <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-purple-500/10 border border-purple-500/30 mb-3 md:mb-4">
            <FileText className="w-3.5 h-3.5 md:w-4 md:h-4 text-purple-400" />
            <span className="text-purple-400 font-medium text-xs md:text-sm">Content Strategy</span>
          </div>
          <h2 className="text-2xl md:text-4xl font-semibold font-display mb-2 md:mb-3 tracking-tight">
            <span className="text-foreground">100</span>
            <span className="text-purple-400 ml-2">Contents Plan</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl font-light text-sm md:text-base">
            Comprehensive educational content library in English and Portuguese
          </p>
        </div>
        
        {/* Content Types Overview */}
        <div className="grid grid-cols-5 gap-1.5 md:gap-3 mb-4 md:mb-6">
          {contentTypes.map((item, i) => (
            <div
              key={item.type}
              className="p-2 md:p-4 rounded-lg md:rounded-xl bg-card/50 border border-border/50 text-center fade-up hover:border-purple-500/30 transition-all"
              style={{ animationDelay: `${0.1 + i * 0.05}s` }}
            >
              <item.icon className={`w-4 h-4 md:w-6 md:h-6 ${item.color} mx-auto mb-1 md:mb-2`} />
              <div className="text-lg md:text-2xl font-bold text-foreground">{item.count}</div>
              <p className="text-[9px] md:text-xs text-muted-foreground">{item.type}</p>
            </div>
          ))}
        </div>
        
        {/* Categories by Level */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          {/* Beginner */}
          <div className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-card/50 border border-border/50 fade-up" style={{ animationDelay: "0.35s" }}>
            <div className="flex items-center gap-2 mb-3 md:mb-4">
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                <BookOpen className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-400" />
              </div>
              <div>
                <h3 className="font-medium text-foreground text-sm md:text-base">Beginner</h3>
                <p className="text-[10px] md:text-xs text-muted-foreground">7 base articles</p>
              </div>
            </div>
            <div className="space-y-1.5 md:space-y-2">
              {categories.filter(c => c.level === "Beginner").map((cat, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs md:text-sm py-1 md:py-1.5 border-b border-border/30 last:border-0">
                  <span className="text-muted-foreground">{cat.name}</span>
                  <span className="text-blue-400 font-medium">{cat.count}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Intermediate */}
          <div className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-card/50 border border-border/50 fade-up" style={{ animationDelay: "0.4s" }}>
            <div className="flex items-center gap-2 mb-3 md:mb-4">
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-amber-500/10 flex items-center justify-center">
                <GraduationCap className="w-3.5 h-3.5 md:w-4 md:h-4 text-amber-400" />
              </div>
              <div>
                <h3 className="font-medium text-foreground text-sm md:text-base">Intermediate</h3>
                <p className="text-[10px] md:text-xs text-muted-foreground">6 base articles</p>
              </div>
            </div>
            <div className="space-y-1.5 md:space-y-2">
              {categories.filter(c => c.level === "Intermediate").map((cat, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs md:text-sm py-1 md:py-1.5 border-b border-border/30 last:border-0">
                  <span className="text-muted-foreground">{cat.name}</span>
                  <span className="text-amber-400 font-medium">{cat.count}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Advanced */}
          <div className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-card/50 border border-border/50 fade-up" style={{ animationDelay: "0.45s" }}>
            <div className="flex items-center gap-2 mb-3 md:mb-4">
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-rose-500/10 flex items-center justify-center">
                <Crown className="w-3.5 h-3.5 md:w-4 md:h-4 text-rose-400" />
              </div>
              <div>
                <h3 className="font-medium text-foreground text-sm md:text-base">Advanced</h3>
                <p className="text-[10px] md:text-xs text-muted-foreground">6 base articles</p>
              </div>
            </div>
            <div className="space-y-1.5 md:space-y-2">
              {categories.filter(c => c.level === "Advanced").map((cat, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs md:text-sm py-1 md:py-1.5 border-b border-border/30 last:border-0">
                  <span className="text-muted-foreground">{cat.name}</span>
                  <span className="text-rose-400 font-medium">{cat.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Summary */}
        <div className="mt-4 md:mt-6 p-3 md:p-5 rounded-xl md:rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/5 border border-purple-500/20 fade-up" style={{ animationDelay: "0.5s" }}>
          <div className="flex items-center justify-between flex-wrap gap-3 md:gap-4">
            <div>
              <h4 className="font-semibold text-foreground text-sm md:text-base">Complete Content Library</h4>
              <p className="text-xs md:text-sm text-muted-foreground">19 base articles × 5 formats = 95 pieces (+ 5 extras)</p>
            </div>
            <div className="flex gap-4 md:gap-6">
              <div className="text-center">
                <div className="text-xl md:text-2xl font-bold text-purple-400">100</div>
                <p className="text-[10px] md:text-xs text-muted-foreground">Total Contents</p>
              </div>
              <div className="text-center">
                <div className="text-xl md:text-2xl font-bold text-purple-400">2</div>
                <p className="text-[10px] md:text-xs text-muted-foreground">Languages</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentPlanSlide;
