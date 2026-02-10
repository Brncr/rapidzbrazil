import { useState, useEffect } from "react";
import { ExternalLink, Twitter, MessageCircle, TrendingUp, Users, ChevronDown, ChevronUp, X, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Influencer, getInfluencers } from "@/lib/entityData";
import { cn } from "@/lib/utils";

const InfluencerCard = ({ inf, index }: { inf: Influencer; index: number }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={cn(
        "relative rounded-xl border transition-all duration-300 ease-in-out fade-up flex flex-col w-full",
        isOpen
          ? "bg-card z-10 shadow-2xl border-primary ring-1 ring-primary/20"
          : "bg-card border-border hover:border-primary/50 cursor-pointer p-3 md:p-4 hover:shadow-lg hover:shadow-primary/5"
      )}
      style={{ animationDelay: `${0.1 + index * 0.05}s` }}
      onClick={() => !isOpen && setIsOpen(true)}
    >
      {/* Closed State Only */}
      {!isOpen && (
        <>
          <div className="flex items-start justify-between mb-2">
            <div className="w-10 h-10 rounded-full bg-gradient-rapidz flex items-center justify-center overflow-hidden flex-shrink-0 ring-2 ring-background">
              {inf.image_url ? (
                <img
                  src={inf.image_url}
                  alt={inf.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Twitter className="w-5 h-5 text-primary-foreground" />
              )}
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>

          <div className="mb-3">
            <h4 className="font-bold font-display text-sm truncate">{inf.name}</h4>
            <div className="flex items-center justify-between">
              <p className="text-primary text-xs truncate opacity-80">{inf.handle}</p>
              {inf.tier && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium border ${inf.tier === "Top" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                  inf.tier === "Medium" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                    "bg-muted text-muted-foreground border-border"
                  }`}>
                  {inf.tier}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 mt-auto">
            <div className="bg-muted/30 px-2 py-1 rounded text-xs text-muted-foreground font-medium flex items-center gap-1.5">
              <Users className="w-3 h-3" />
              {inf.followers || "-"}
            </div>
            <ChevronDown className="w-4 h-4 text-muted-foreground/50 ml-auto" />
          </div>
        </>
      )}

      {/* Expanded State */}
      {isOpen && (
        <div className="p-4 flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-rapidz p-[2px] overflow-hidden flex-shrink-0">
                <div className="w-full h-full rounded-full overflow-hidden bg-background flex items-center justify-center">
                  {inf.image_url ? (
                    <img src={inf.image_url} alt={inf.name} className="w-full h-full object-cover" />
                  ) : (
                    <Twitter className="w-6 h-6 text-primary" />
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-base font-bold font-display leading-tight">{inf.name}</h3>
                <a
                  href={`https://x.com/${inf.handle.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary font-medium flex items-center gap-1 hover:underline mt-0.5"
                  onClick={(e) => e.stopPropagation()}
                >
                  {inf.handle} <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
              className="h-8 w-8 text-muted-foreground hover:text-foreground shrink-0 -mt-2 -mr-2"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Stats Rows */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-muted/30 rounded-lg p-2 border border-border/50 flex flex-col items-center justify-center text-center">
              <span className="text-lg font-bold text-foreground leading-none">{inf.followers || "-"}</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">Followers</span>
            </div>
            <div className="bg-muted/30 rounded-lg p-2 border border-border/50 flex flex-col items-center justify-center text-center">
              <span className="text-sm font-bold text-foreground leading-none mt-0.5">{inf.tier || "-"}</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">Tier</span>
            </div>
            {/* Category Full Width */}
            <div className="col-span-2 bg-muted/30 rounded-lg p-2 border border-border/50 flex flex-col items-center justify-center text-center">
              <span className="text-sm font-medium text-foreground leading-snug">{inf.category || "-"}</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">Category</span>
            </div>
          </div>

          {/* Strategy Box */}
          <div className="bg-primary/5 rounded-xl border border-primary/20 p-3">
            <h5 className="text-xs font-bold mb-2 flex items-center gap-1.5 text-primary uppercase tracking-wide">
              <TrendingUp className="w-3.5 h-3.5" /> Strategy & Insight
            </h5>
            <p className="text-xs text-muted-foreground leading-relaxed text-left whitespace-pre-wrap">
              {inf.detailed_info || "No detailed strategy info available."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

const InfluencersSlide = () => {
  const [influencers, setInfluencers] = useState<Influencer[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const data = await getInfluencers();
      // Filter out hidden influencers (visible defaults to true if undefined)
      setInfluencers(data.filter(inf => inf.visible !== false));
    };
    loadData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8 pb-20 md:pb-8 relative overflow-hidden overflow-y-auto">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-card" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px]" />

      <div className="relative z-10 max-w-6xl mx-auto w-full">
        {/* Header */}
        <div className="mb-4 md:mb-8 fade-up">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-primary/10 border border-primary/30">
              <span className="text-primary font-semibold text-sm">Phase 1</span>
            </div>

          </div>
          <h2 className="text-2xl md:text-5xl font-bold font-display mb-2 md:mb-4">
            <span className="text-gradient-rapidz">Twitter</span>
            <span className="text-primary"> Influencers</span>
          </h2>
          <p className="text-muted-foreground text-sm md:text-lg max-w-2xl">
            First attack: conquer the main opinion leaders of Crypto Twitter Brazil
          </p>
        </div>

        {/* Influencers Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4 mb-4 md:mb-8 items-start">
          {influencers.map((inf, i) => (
            <InfluencerCard key={inf.id} inf={inf} index={i} />
          ))}
        </div>

        {/* Strategy Actions */}
        <div className="grid grid-cols-3 gap-2 md:gap-4">
          <div className="p-3 md:p-5 rounded-xl bg-card/50 border border-border fade-up" style={{ animationDelay: "0.6s" }}>
            <MessageCircle className="w-5 h-5 md:w-8 md:h-8 text-primary mb-2 md:mb-3" />
            <h4 className="font-bold font-display text-xs md:text-base mb-1 md:mb-2">Approach</h4>
            <p className="text-[10px] md:text-sm text-muted-foreground hidden md:block">
              Personalized DMs + Partnership proposal with exclusive benefits
            </p>
          </div>
          <div className="p-3 md:p-5 rounded-xl bg-card/50 border border-border fade-up" style={{ animationDelay: "0.7s" }}>
            <TrendingUp className="w-5 h-5 md:w-8 md:h-8 text-primary mb-2 md:mb-3" />
            <h4 className="font-bold font-display text-xs md:text-base mb-1 md:mb-2">Incentive</h4>
            <p className="text-[10px] md:text-sm text-muted-foreground hidden md:block">
              Affiliate code + Commission per signup + Early access to features
            </p>
          </div>
          <div className="p-3 md:p-5 rounded-xl bg-card/50 border border-border fade-up" style={{ animationDelay: "0.8s" }}>
            <Users className="w-5 h-5 md:w-8 md:h-8 text-primary mb-2 md:mb-3" />
            <h4 className="font-bold font-display text-xs md:text-base mb-1 md:mb-2">Goal</h4>
            <p className="text-[10px] md:text-sm text-muted-foreground hidden md:block">
              Close with 6 influencers in the first month
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfluencersSlide;
