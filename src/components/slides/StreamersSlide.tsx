import { ExternalLink, Tv, MessageSquare } from "lucide-react";
import { useState, useEffect } from "react";
import { Streamer, getStreamers } from "@/lib/entityData";

const StreamersSlide = () => {
  const [streamers, setStreamers] = useState<Streamer[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const data = await getStreamers();
      setStreamers(data.filter(s => s.visible !== false));
    };
    loadData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8 pb-20 md:pb-8 relative overflow-hidden overflow-y-auto">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-card" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[150px]" />

      <div className="relative z-10 max-w-6xl mx-auto w-full">
        {/* Header */}
        <div className="mb-4 md:mb-8 fade-up">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-purple-500/10 border border-purple-500/30">
              <span className="text-purple-400 font-semibold text-sm">Phase 2</span>
            </div>
          </div>
          <h2 className="text-2xl md:text-5xl font-bold font-display mb-2 md:mb-4">
            <span className="text-gradient-rapidz">Streamers &</span>
            <span className="text-purple-400"> Creators</span>
          </h2>
          <p className="text-muted-foreground text-sm md:text-lg max-w-2xl">
            Second attack: activate video content creators to reach broader audiences
          </p>
        </div>

        {/* Streamers Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 mb-8 md:mb-12">
          {streamers.map((streamer, i) => (
            <div
              key={streamer.id}
              className="p-3 md:p-5 rounded-xl md:rounded-2xl bg-card border border-border hover:border-purple-500/30 transition-all group fade-up relative overflow-hidden"
              style={{ animationDelay: `${0.1 + i * 0.05}s` }}
            >
              <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                {streamer.twitch_url && (
                  <a href={streamer.twitch_url} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-full bg-background/80 hover:bg-purple-500 hover:text-white transition-colors">
                    <Tv className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  </a>
                )}
                {streamer.youtube_url && (
                  <a href={streamer.youtube_url} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-full bg-background/80 hover:bg-red-500 hover:text-white transition-colors">
                    <ExternalLink className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  </a>
                )}
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-purple-500/10 flex items-center justify-center mb-3 md:mb-4 group-hover:scale-105 transition-transform overflow-hidden border-2 border-transparent group-hover:border-purple-500/30">
                  {streamer.image_url ? (
                    <img
                      src={streamer.image_url}
                      alt={streamer.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Tv className="w-6 h-6 md:w-8 md:h-8 text-purple-400" />
                  )}
                </div>
                <h3 className="font-bold font-display text-base md:text-lg mb-1 md:mb-2">{streamer.name}</h3>
                {streamer.platform && (
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-purple-500/10 text-[10px] md:text-xs text-purple-400 font-medium mb-1">
                    <span className="capitalize">{streamer.platform}</span>
                  </div>
                )}
                {streamer.followers && (
                  <p className="text-xs text-muted-foreground mt-1">{streamer.followers} followers</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StreamersSlide;
