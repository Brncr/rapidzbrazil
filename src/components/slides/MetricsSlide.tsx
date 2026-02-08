import { Target, TrendingUp, Calendar, CheckCircle2, Rocket } from "lucide-react";
import logo from "@/assets/logo-rapidz.png";

const MetricsSlide = () => {
  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8 pb-20 md:pb-8 relative overflow-hidden overflow-y-auto">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-card" />
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] bg-green-500/5 rounded-full blur-[100px]" />
      
      <div className="relative z-10 max-w-6xl mx-auto w-full">
        {/* Header */}
        <div className="mb-6 md:mb-10 text-center fade-up">
          <img src={logo} alt="Rapidz" className="h-6 md:h-8 mx-auto mb-4 md:mb-6" />
          <h2 className="text-2xl md:text-5xl font-bold font-display mb-2 md:mb-4">
            <span className="text-gradient-rapidz">Metrics &</span>
            <span className="text-green-400"> Timeline</span>
          </h2>
          <p className="text-muted-foreground text-sm md:text-lg">
            Execution roadmap to reach 1,000 signups/month
          </p>
        </div>
        
        {/* Timeline - Mobile: vertical cards, Desktop: zigzag */}
        <div className="relative mb-8 md:mb-12">
          {/* Center line - hidden on mobile */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-border -translate-x-1/2" />
          {/* Left line on mobile */}
          <div className="md:hidden absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
          
          <div className="grid gap-4 md:gap-8">
            {/* Month 1 */}
            <div className="flex items-center gap-3 md:gap-6 fade-up" style={{ animationDelay: "0.2s" }}>
              {/* Mobile layout */}
              <div className="md:hidden w-3 h-3 rounded-full bg-primary glow-rapidz-sm z-10 shrink-0 ml-2.5" />
              <div className="md:hidden p-3 rounded-xl bg-card border border-primary/50 flex-1">
                <h4 className="font-bold font-display text-primary text-sm mb-0.5">Month 1</h4>
                <p className="text-xs text-muted-foreground">Twitter Influencers</p>
                <p className="text-xl font-bold font-display mt-1">~400</p>
                <p className="text-[10px] text-muted-foreground">expected signups</p>
              </div>
              {/* Desktop layout */}
              <div className="hidden md:block flex-1 text-right">
                <div className="inline-block p-4 rounded-xl bg-card border border-primary/50 text-left">
                  <h4 className="font-bold font-display text-primary mb-1">Month 1</h4>
                  <p className="text-sm text-muted-foreground">Twitter Influencers</p>
                  <p className="text-2xl font-bold font-display mt-2">~400</p>
                  <p className="text-xs text-muted-foreground">expected signups</p>
                </div>
              </div>
              <div className="hidden md:block w-4 h-4 rounded-full bg-primary glow-rapidz-sm z-10" />
              <div className="hidden md:block flex-1" />
            </div>
            
            {/* Month 2-3 */}
            <div className="flex items-center gap-3 md:gap-6 fade-up" style={{ animationDelay: "0.3s" }}>
              {/* Mobile layout */}
              <div className="md:hidden w-3 h-3 rounded-full bg-purple-500 z-10 shrink-0 ml-2.5" style={{ boxShadow: "0 0 15px rgba(168, 85, 247, 0.4)" }} />
              <div className="md:hidden p-3 rounded-xl bg-card border border-purple-500/50 flex-1">
                <h4 className="font-bold font-display text-purple-400 text-sm mb-0.5">Month 2-3</h4>
                <p className="text-xs text-muted-foreground">+ Twitch/YT Streamers</p>
                <p className="text-xl font-bold font-display mt-1">~700</p>
                <p className="text-[10px] text-muted-foreground">cumulative signups</p>
              </div>
              {/* Desktop layout */}
              <div className="hidden md:block flex-1" />
              <div className="hidden md:block w-4 h-4 rounded-full bg-purple-500 z-10" style={{ boxShadow: "0 0 20px rgba(168, 85, 247, 0.4)" }} />
              <div className="hidden md:block flex-1 text-left">
                <div className="inline-block p-4 rounded-xl bg-card border border-purple-500/50">
                  <h4 className="font-bold font-display text-purple-400 mb-1">Month 2-3</h4>
                  <p className="text-sm text-muted-foreground">+ Twitch/YT Streamers</p>
                  <p className="text-2xl font-bold font-display mt-2">~700</p>
                  <p className="text-xs text-muted-foreground">cumulative signups</p>
                </div>
              </div>
            </div>
            
            {/* Month 3-4 */}
            <div className="flex items-center gap-3 md:gap-6 fade-up" style={{ animationDelay: "0.4s" }}>
              {/* Mobile layout */}
              <div className="md:hidden w-3 h-3 rounded-full bg-blue-500 z-10 shrink-0 ml-2.5" style={{ boxShadow: "0 0 15px rgba(59, 130, 246, 0.4)" }} />
              <div className="md:hidden p-3 rounded-xl bg-card border border-blue-500/50 flex-1">
                <h4 className="font-bold font-display text-blue-400 text-sm mb-0.5">Month 3-4</h4>
                <p className="text-xs text-muted-foreground">+ Communities</p>
                <p className="text-xl font-bold font-display mt-1">1,000+</p>
                <p className="text-[10px] text-muted-foreground">goal achieved 🎯</p>
              </div>
              {/* Desktop layout */}
              <div className="hidden md:block flex-1 text-right">
                <div className="inline-block p-4 rounded-xl bg-card border border-blue-500/50 text-left">
                  <h4 className="font-bold font-display text-blue-400 mb-1">Month 3-4</h4>
                  <p className="text-sm text-muted-foreground">+ Communities</p>
                  <p className="text-2xl font-bold font-display mt-2">1,000+</p>
                  <p className="text-xs text-muted-foreground">goal achieved 🎯</p>
                </div>
              </div>
              <div className="hidden md:block w-4 h-4 rounded-full bg-blue-500 z-10" style={{ boxShadow: "0 0 20px rgba(59, 130, 246, 0.4)" }} />
              <div className="hidden md:block flex-1" />
            </div>
          </div>
        </div>
        
        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-6 md:mb-8">
          <div className="p-3 md:p-5 rounded-xl bg-card border border-border text-center fade-up" style={{ animationDelay: "0.5s" }}>
            <Target className="w-5 h-5 md:w-8 md:h-8 text-primary mx-auto mb-2 md:mb-3" />
            <div className="text-xl md:text-3xl font-bold font-display text-primary">1K</div>
            <p className="text-[10px] md:text-sm text-muted-foreground">Signups/Month</p>
          </div>
          <div className="p-3 md:p-5 rounded-xl bg-card border border-border text-center fade-up" style={{ animationDelay: "0.6s" }}>
            <TrendingUp className="w-5 h-5 md:w-8 md:h-8 text-green-400 mx-auto mb-2 md:mb-3" />
            <div className="text-xl md:text-3xl font-bold font-display text-green-400">25%</div>
            <p className="text-[10px] md:text-sm text-muted-foreground">Conversion Rate</p>
          </div>
          <div className="p-3 md:p-5 rounded-xl bg-card border border-border text-center fade-up" style={{ animationDelay: "0.7s" }}>
            <Calendar className="w-5 h-5 md:w-8 md:h-8 text-purple-400 mx-auto mb-2 md:mb-3" />
            <div className="text-xl md:text-3xl font-bold font-display text-purple-400">4</div>
            <p className="text-[10px] md:text-sm text-muted-foreground">Months to Goal</p>
          </div>
          <div className="p-3 md:p-5 rounded-xl bg-card border border-border text-center fade-up" style={{ animationDelay: "0.8s" }}>
            <CheckCircle2 className="w-5 h-5 md:w-8 md:h-8 text-blue-400 mx-auto mb-2 md:mb-3" />
            <div className="text-xl md:text-3xl font-bold font-display text-blue-400">15+</div>
            <p className="text-[10px] md:text-sm text-muted-foreground">Active Partnerships</p>
          </div>
        </div>
        
        {/* CTA */}
        <div className="text-center fade-up" style={{ animationDelay: "0.9s" }}>
          <div className="inline-flex items-center gap-2 md:gap-3 px-5 md:px-8 py-3 md:py-4 rounded-full bg-gradient-rapidz glow-rapidz">
            <Rocket className="w-4 h-4 md:w-6 md:h-6" />
            <span className="font-display font-bold text-sm md:text-lg">Let's Dominate CTBR! 🚀</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsSlide;
