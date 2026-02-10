import { ExternalLink, Users, MessageSquare } from "lucide-react";
import { useState, useEffect } from "react";
import { Community, getCommunities } from "@/lib/entityData";

const CommunitiesSlide = () => {
  const [communities, setCommunities] = useState<Community[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const data = await getCommunities();
      setCommunities(data);
    };
    loadData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8 pb-20 md:pb-8 relative overflow-hidden overflow-y-auto">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-card" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[150px]" />

      <div className="relative z-10 max-w-6xl mx-auto w-full">
        {/* Header */}
        <div className="mb-4 md:mb-8 fade-up">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-blue-500/10 border border-blue-500/30">
              <span className="text-blue-400 font-semibold text-sm">Phase 3</span>
            </div>
          </div>
          <h2 className="text-2xl md:text-5xl font-bold font-display mb-2 md:mb-4">
            <span className="text-gradient-rapidz">Crypto</span>
            <span className="text-blue-400"> Communities</span>
          </h2>
          <p className="text-muted-foreground text-sm md:text-lg max-w-2xl">
            Third attack: infiltrate and dominate the main crypto communities in Brazil
          </p>
        </div>

        {/* Communities Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 mb-8 md:mb-12">
          {communities.map((comm, i) => (
            <div
              key={comm.id}
              className="p-3 md:p-5 rounded-xl md:rounded-2xl bg-card border border-border hover:border-blue-500/30 transition-all group fade-up relative overflow-hidden"
              style={{ animationDelay: `${0.1 + i * 0.05}s` }}
            >
              <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                {comm.discord_url && (
                  <a href={comm.discord_url} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-full bg-background/80 hover:bg-blue-500 hover:text-white transition-colors">
                    <MessageSquare className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  </a>
                )}
                {comm.website_url && (
                  <a href={comm.website_url} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-full bg-background/80 hover:bg-blue-500 hover:text-white transition-colors">
                    <ExternalLink className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  </a>
                )}
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-blue-500/10 flex items-center justify-center mb-3 md:mb-4 group-hover:scale-105 transition-transform overflow-hidden border-2 border-transparent group-hover:border-blue-500/30">
                  {comm.image_url ? (
                    <img
                      src={comm.image_url}
                      alt={comm.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Users className="w-6 h-6 md:w-8 md:h-8 text-blue-400" />
                  )}
                </div>
                <h3 className="font-bold font-display text-base md:text-lg mb-1 md:mb-2">{comm.name}</h3>
                {comm.twitter_handle && (
                  <p className="text-xs md:text-sm text-blue-400/80 mb-2">{comm.twitter_handle}</p>
                )}
                {comm.members && (
                  <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-muted text-[10px] md:text-xs text-muted-foreground mt-2">
                    <Users className="w-3 h-3" />
                    <span>{comm.members} Members</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommunitiesSlide;
