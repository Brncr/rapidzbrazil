import { ArrowRight, Megaphone, Video, MessagesSquare } from "lucide-react";
import logo from "@/assets/logo-rapidz.png";

const IntroSlide = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden bg-background">
      {/* Subtle Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/30" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px]" />
      
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Logo */}
        <div className="mb-8 md:mb-12 fade-up" style={{ animationDelay: "0.1s" }}>
          <img src={logo} alt="Rapidz" className="h-8 md:h-10 mx-auto opacity-90" />
        </div>
        
        {/* Main Title */}
        <h1 className="text-3xl md:text-6xl font-semibold font-display mb-3 md:mb-4 fade-up tracking-tight" style={{ animationDelay: "0.2s" }}>
          <span className="text-foreground">CTBR</span>
          <span className="text-primary ml-2 md:ml-3">Domination</span>
        </h1>
        
        {/* Subtitle */}
        <p className="text-base md:text-xl text-muted-foreground mb-10 md:mb-16 max-w-xl mx-auto fade-up font-light" style={{ animationDelay: "0.3s" }}>
          Strategic expansion to conquer Crypto Twitter Brazil
        </p>
        
        {/* Strategy Phases - Clean Cards */}
        <div className="grid grid-cols-3 gap-2 md:gap-4 mb-10 md:mb-16">
          <div className="group p-3 md:p-6 rounded-xl md:rounded-2xl bg-card/50 border border-border/50 fade-up hover:border-primary/30 hover:bg-card transition-all duration-300" style={{ animationDelay: "0.4s" }}>
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2 md:mb-4 mx-auto group-hover:bg-primary/20 transition-colors">
              <Megaphone className="w-4 h-4 md:w-5 md:h-5 text-primary" />
            </div>
            <p className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-widest mb-1">Phase 1</p>
            <h3 className="text-sm md:text-base font-medium text-foreground">Influencers</h3>
            <p className="text-xs md:text-sm text-muted-foreground mt-1 hidden md:block">Twitter / X</p>
          </div>
          
          <div className="group p-3 md:p-6 rounded-xl md:rounded-2xl bg-card/50 border border-border/50 fade-up hover:border-primary/30 hover:bg-card transition-all duration-300" style={{ animationDelay: "0.5s" }}>
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2 md:mb-4 mx-auto group-hover:bg-primary/20 transition-colors">
              <Video className="w-4 h-4 md:w-5 md:h-5 text-primary" />
            </div>
            <p className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-widest mb-1">Phase 2</p>
            <h3 className="text-sm md:text-base font-medium text-foreground">Streamers</h3>
            <p className="text-xs md:text-sm text-muted-foreground mt-1 hidden md:block">Twitch / YouTube</p>
          </div>
          
          <div className="group p-3 md:p-6 rounded-xl md:rounded-2xl bg-card/50 border border-border/50 fade-up hover:border-primary/30 hover:bg-card transition-all duration-300" style={{ animationDelay: "0.6s" }}>
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2 md:mb-4 mx-auto group-hover:bg-primary/20 transition-colors">
              <MessagesSquare className="w-4 h-4 md:w-5 md:h-5 text-primary" />
            </div>
            <p className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-widest mb-1">Phase 3</p>
            <h3 className="text-sm md:text-base font-medium text-foreground">Communities</h3>
            <p className="text-xs md:text-sm text-muted-foreground mt-1 hidden md:block">Discord / Telegram</p>
          </div>
        </div>
        
        {/* Goal - Minimal CTA */}
        <div className="inline-flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2 md:py-3 rounded-full bg-primary/10 border border-primary/20 fade-up group hover:bg-primary/15 transition-colors cursor-default" style={{ animationDelay: "0.7s" }}>
          <span className="text-xs md:text-sm font-medium text-foreground">Goal: 1,000 signups/month</span>
          <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </div>
  );
};

export default IntroSlide;
