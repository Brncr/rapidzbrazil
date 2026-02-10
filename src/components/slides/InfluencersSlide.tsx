import { useState, useEffect } from "react";
import { ExternalLink, Twitter, MessageCircle, TrendingUp, Users, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Influencer, getInfluencers } from "@/lib/entityData";

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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-4 mb-4 md:mb-8">
          {influencers.map((inf, i) => (
            <div
              key={inf.id}
              className="p-3 md:p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-all group fade-up cursor-pointer"
              style={{ animationDelay: `${0.1 + i * 0.05}s` }}
            >
              <div className="flex items-start justify-between mb-2 md:mb-3">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-rapidz flex items-center justify-center overflow-hidden">
                  {inf.image_url ? (
                    <img
                      src={inf.image_url}
                      alt={inf.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Twitter className="w-4 h-4 md:w-5 md:h-5 text-primary-foreground" />
                  )}
                </div>
                <a
                  href={`https://x.com/${inf.handle.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ExternalLink className="w-3.5 h-3.5 md:w-4 md:h-4 text-muted-foreground hover:text-primary" />
                </a>
              </div>
              <h4 className="font-bold font-display text-xs md:text-sm truncate">{inf.name}</h4>
              <p className="text-primary text-[10px] md:text-xs truncate">{inf.handle}</p>
              <div className="flex items-center gap-1 md:gap-2 mt-1 flex-wrap">
                {inf.followers && (
                  <span className="text-[10px] md:text-xs text-muted-foreground">{inf.followers}</span>
                )}
                {inf.tier && (
                  <span className={`text-[10px] md:text-xs px-1 md:px-1.5 py-0.5 rounded-full font-medium ${inf.tier === "Top" ? "bg-amber-500/20 text-amber-400" :
                    inf.tier === "Medium" ? "bg-blue-500/20 text-blue-400" :
                      "bg-muted text-muted-foreground"
                    }`}>
                    {inf.tier}
                  </span>
                )}
              </div>
            </div>
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
