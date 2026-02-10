import { useState, useEffect } from "react";
import { ExternalLink, Twitter, MessageCircle, TrendingUp, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Influencer, getInfluencers } from "@/lib/entityData";
import { cn } from "@/lib/utils";

const InfluencerCard = ({ inf, index }: { inf: Influencer; index: number }) => {
  return (
    <div
      className="rounded-xl bg-card border border-border p-4 md:p-5 fade-up flex flex-col gap-4 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all w-full h-full"
      style={{ animationDelay: `${0.1 + index * 0.05}s` }}
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-rapidz p-[2px] overflow-hidden flex-shrink-0">
          <div className="w-full h-full rounded-full overflow-hidden bg-background flex items-center justify-center">
            {inf.image_url ? (
              <img
                src={inf.image_url}
                alt={inf.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <Twitter className="w-5 h-5 text-primary" />
            )}
          </div>
        </div>
        <div className="flex flex-col min-w-0">
          <h4 className="font-bold font-display text-sm leading-tight truncate">{inf.name}</h4>
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

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-muted/30 rounded py-1.5 px-1 text-center border border-border/50">
          <span className="block font-bold text-sm text-foreground">{inf.followers || "-"}</span>
          <span className="text-[9px] text-muted-foreground uppercase tracking-wider">Followers</span>
        </div>
        <div className="bg-muted/30 rounded py-1.5 px-1 text-center border border-border/50">
          <span className="block font-bold text-sm text-foreground">{inf.tier || "-"}</span>
          <span className="text-[9px] text-muted-foreground uppercase tracking-wider">Tier</span>
        </div>
        <div className="bg-muted/30 rounded py-1.5 px-1 text-center border border-border/50">
          <span className="block font-bold text-xs text-foreground truncate px-1">{inf.category || "-"}</span>
          <span className="text-[9px] text-muted-foreground uppercase tracking-wider">Category</span>
        </div>
      </div>

      {/* Strategy Box - Always Visible */}
      <div className="flex-1 bg-primary/5 rounded-lg border border-primary/10 p-3">
        <h5 className="text-[10px] font-bold mb-1.5 flex items-center gap-1.5 text-primary uppercase tracking-wide">
          <TrendingUp className="w-3 h-3" /> Strategy
        </h5>
        <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">
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

      <div className="relative z-10 max-w-7xl mx-auto w-full">
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

        {/* Influencers Grid - 3 Columns for Wider Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
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
