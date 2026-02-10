import { useState, useEffect } from "react";
import { ExternalLink, Twitter, MessageCircle, TrendingUp, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Influencer, getInfluencers } from "@/lib/entityData";
import { cn } from "@/lib/utils";

const InfluencerCard = ({ inf, index }: { inf: Influencer; index: number }) => {
  return (
    <div
      className="rounded-xl bg-card border border-border p-4 md:p-6 fade-up flex flex-col md:flex-row gap-4 md:gap-6 hover:border-primary/50 transition-colors w-full"
      style={{ animationDelay: `${0.1 + index * 0.05}s` }}
    >
      {/* Left Section: Profile & Stats */}
      <div className="flex flex-col gap-3 min-w-[200px] md:w-[250px] shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-rapidz p-[2px] overflow-hidden flex-shrink-0">
            <div className="w-full h-full rounded-full overflow-hidden bg-background flex items-center justify-center">
              {inf.image_url ? (
                <img
                  src={inf.image_url}
                  alt={inf.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Twitter className="w-6 h-6 text-primary" />
              )}
            </div>
          </div>
          <div className="flex flex-col min-w-0">
            <h4 className="font-bold font-display text-base leading-tight truncate">{inf.name}</h4>
            <a
              href={`https://x.com/${inf.handle.replace("@", "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 mt-0.5 truncate"
            >
              {inf.handle} <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {inf.followers && (
            <div className="bg-muted/40 px-2.5 py-1 rounded-full text-xs font-medium border border-border/50">
              <span className="text-foreground">{inf.followers}</span> <span className="text-muted-foreground/70">Followers</span>
            </div>
          )}
          {inf.tier && (
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${inf.tier === "Top" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
              inf.tier === "Medium" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                "bg-muted text-muted-foreground border-border"
              }`}>
              {inf.tier}
            </span>
          )}
        </div>

        {inf.category && (
          <div className="text-xs text-muted-foreground font-medium bg-muted/20 px-2 py-1 rounded border border-border/30 w-fit">
            {inf.category}
          </div>
        )}
      </div>

      {/* Divider on desktop */}
      <div className="hidden md:block w-px bg-border/50 self-stretch" />

      {/* Right Section: Strategy */}
      <div className="flex-1 flex flex-col justify-center">
        <h5 className="text-xs font-bold mb-2 flex items-center gap-1.5 text-primary uppercase tracking-wide">
          <TrendingUp className="w-3.5 h-3.5" /> Strategy & Insight
        </h5>
        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
          {inf.detailed_info || "No detailed strategy info available."}
        </p>
      </div>
    </div>
  );
};

const InfluencersSlide = () => {
  const [influencers, setInfluencers] = useState<Influencer[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const data = await getInfluencers();
      setInfluencers(data.filter(inf => inf.visible !== false));
    };
    loadData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8 pb-20 md:pb-8 relative overflow-hidden overflow-y-auto">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-card" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px]" />

      <div className="relative z-10 max-w-5xl mx-auto w-full">
        {/* Header */}
        <div className="mb-6 fade-up">
          <div className="flex items-center justify-between mb-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30">
              <span className="text-primary font-semibold text-sm">Phase 1</span>
            </div>
          </div>
          <h2 className="text-2xl md:text-5xl font-bold font-display mb-2">
            <span className="text-gradient-rapidz">Twitter</span>
            <span className="text-primary"> Influencers</span>
          </h2>
          <p className="text-muted-foreground text-sm md:text-lg max-w-2xl">
            First attack: conquer the main opinion leaders of Crypto Twitter Brazil
          </p>
        </div>

        {/* Influencers List - Full Width Cards */}
        <div className="flex flex-col gap-3 mb-8">
          {influencers.map((inf, i) => (
            <InfluencerCard key={inf.id} inf={inf} index={i} />
          ))}
        </div>

        {/* Strategy Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-4 rounded-xl bg-card/50 border border-border fade-up" style={{ animationDelay: "0.6s" }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <MessageCircle className="w-5 h-5 text-primary" />
              </div>
              <h4 className="font-bold font-display text-sm">Approach</h4>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Personalized DMs + Partnership proposal with exclusive benefits
            </p>
          </div>
          <div className="p-4 rounded-xl bg-card/50 border border-border fade-up" style={{ animationDelay: "0.7s" }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <h4 className="font-bold font-display text-sm">Incentive</h4>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Affiliate code + Commission per signup + Early access
            </p>
          </div>
          <div className="p-4 rounded-xl bg-card/50 border border-border fade-up" style={{ animationDelay: "0.8s" }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <h4 className="font-bold font-display text-sm">Goal</h4>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Close with 6 influencers in the first month
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfluencersSlide;
