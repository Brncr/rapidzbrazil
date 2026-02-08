import { ExternalLink, Settings, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { useState } from "react";

const EMBED_URL = "https://brasil-web3-gateway.lovable.app/communities";

const CommunitiesSlide = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-card" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[150px]" />
      
      <div className="relative z-10 max-w-6xl mx-auto w-full flex flex-col h-[calc(100vh-2rem)] md:h-[calc(100vh-4rem)]">
        {/* Header */}
        <div className="mb-3 md:mb-4 fade-up flex-shrink-0">
          <div className="flex items-center justify-between mb-2 md:mb-3">
            <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-blue-500/10 border border-blue-500/30">
              <span className="text-blue-400 font-semibold text-sm">Phase 3</span>
            </div>
            <div className="flex items-center gap-1 md:gap-2">
              <a href={EMBED_URL} target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="sm" className="gap-1 md:gap-2 text-muted-foreground hover:text-foreground text-xs px-2 md:px-3">
                  <ExternalLink className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  <span className="hidden md:inline">Open External</span>
                </Button>
              </a>
              <Link to="/dashboard">
                <Button variant="ghost" size="sm" className="gap-1 md:gap-2 text-muted-foreground hover:text-foreground text-xs px-2 md:px-3">
                  <Settings className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  <span className="hidden md:inline">Edit Photos</span>
                </Button>
              </Link>
            </div>
          </div>
          <h2 className="text-2xl md:text-4xl font-bold font-display mb-1">
            <span className="text-gradient-rapidz">Crypto</span>
            <span className="text-blue-400"> Communities</span>
          </h2>
          <p className="text-muted-foreground text-xs md:text-base max-w-2xl">
            Third attack: infiltrate and dominate the main crypto communities in Brazil
          </p>
        </div>
        
        {/* Embedded View - cropped to hide external header */}
        <div className="flex-1 rounded-xl md:rounded-2xl overflow-hidden border border-blue-500/20 fade-up min-h-0 relative mb-12 md:mb-0">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-card/80 z-10">
              <Loader2 className="w-6 h-6 md:w-8 md:h-8 text-blue-400 animate-spin" />
              <span className="ml-2 md:ml-3 text-muted-foreground text-sm">Loading communities...</span>
            </div>
          )}
          <div className="absolute inset-0 overflow-hidden">
            <iframe
              src={EMBED_URL}
              className="absolute border-0"
              style={{
                top: '-140px',
                left: 0,
                width: '100%',
                height: 'calc(100% + 140px)',
              }}
              title="Communities List"
              onLoad={() => setIsLoading(false)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunitiesSlide;
