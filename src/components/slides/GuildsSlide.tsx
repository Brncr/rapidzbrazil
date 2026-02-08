import { Users, Globe, ExternalLink, Crown } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const guilds = [
  { id: 1, name: "Legacy", leader: "Ovrr", discord: "https://discord.gg/kUB7QE8a", region: "Brazil" },
  { id: 2, name: "AuraDAO", leader: "!Deevl1", discord: "https://discord.gg/auradao", region: "Brazil" },
  { id: 3, name: "OLAGG", leader: "Changz", discord: "https://discord.gg/6xJYxEcf", region: "Brazil" },
  { id: 4, name: "Sura Gaming", leader: "Nenesk", discord: "https://discord.gg/suragaming", region: "Brazil" },
  { id: 5, name: "SNKDAO", leader: "Smirnokk", discord: "https://discord.gg/aMewuYM9", region: "Brazil" },
  { id: 6, name: "The Nest", leader: "Pedrox", discord: "https://discord.gg/the-nest-dao", region: "Brazil" },
  { id: 7, name: "BigoDAO", leader: "LucasMinahrt", discord: "https://discord.gg/bigodao", region: "Brazil" },
  { id: 8, name: "Infinity", leader: "Kyo", discord: "https://discord.gg/CQeNFHfw", region: "Brazil" },
  { id: 9, name: "MOKODAO", leader: "Itoka", discord: "https://discord.gg/mokodaogg", region: "Brazil" },
  { id: 10, name: "DARKDAO", leader: "Wantedz", discord: "https://discord.com/invite/darkdao", region: "Brazil" },
  { id: 11, name: "Radiantz", leader: "Leadrin", discord: "https://discord.com/invite/radiantz", region: "Latam" },
  { id: 12, name: "Whata Well DAO", leader: "Well", discord: "https://discord.gg/D636nnNG", region: "Brazil" },
  { id: 13, name: "Mana Gaming", leader: "Joseph", discord: "https://discord.gg/ESBdv7MY", region: "Brazil" },
  { id: 14, name: "Colmeia CW3", leader: "Vinicius", discord: "https://discord.gg/cw3", region: "Brazil" },
  { id: 15, name: "Lumen DAO", leader: "Texcode", discord: "https://discord.gg/ZY7bzTu8", region: "Brazil" },
  { id: 16, name: "Fury Guild", leader: "NeymarNFT", discord: "https://discord.gg/Ngt2Vp9t", region: "Brazil" },
  { id: 17, name: "LekoNFT", leader: "Leko", discord: "https://discord.gg/7tVS6zB9qA", region: "Brazil" },
  { id: 18, name: "Fora do Padrão", leader: "Lucas", discord: "https://discord.gg/BynQhTZr", region: "Brazil" },
  { id: 19, name: "Tribo", leader: "Roosevelt", discord: "https://discord.gg/xbUbjKe6", region: "Brazil" },
  { id: 20, name: "Fraternidade Crypto", leader: "Ivan Bianco", discord: "https://discord.gg/s2hyvRC3", region: "Brazil" },
  { id: 21, name: "Dream Scape", leader: "CM", discord: "https://discord.gg/E8uGHzQd", region: "Brazil" },
  { id: 22, name: "Dynasty DAO", leader: "Katchuca", discord: "https://discord.gg/dynasty-dao", region: "Brazil" },
  { id: 23, name: "Astrofera", leader: "DigoNirvana", discord: "https://discord.gg/astrofera", region: "Brazil" },
  { id: 24, name: "MegaDAO", leader: "Condz", discord: "https://discord.gg/megadao", region: "Brazil" },
];

const GuildsSlide = () => {
  return (
    <div className="min-h-screen flex flex-col p-8 relative overflow-hidden bg-background">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20" />
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[120px]" />
      
      <div className="relative z-10 max-w-6xl mx-auto w-full flex flex-col h-[calc(100vh-4rem)]">
        {/* Header */}
        <div className="mb-6 fade-up flex-shrink-0">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/30 mb-4">
            <Users className="w-4 h-4 text-indigo-400" />
            <span className="text-indigo-400 font-medium text-sm">Partner Network</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-semibold font-display mb-3 tracking-tight">
            <span className="text-foreground">Web3</span>
            <span className="text-indigo-400 ml-2">Guild Partners</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl font-light">
            24 strategic guild partnerships across Brazil and Latam
          </p>
        </div>
        
        {/* List Header */}
        <div className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-border/50 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 flex-shrink-0">
          <div className="col-span-1">#</div>
          <div className="col-span-4">Guild</div>
          <div className="col-span-3">Founder</div>
          <div className="col-span-2">Region</div>
          <div className="col-span-2 text-right">Discord</div>
        </div>
        
        {/* Guilds List */}
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-1">
            {guilds.map((guild, i) => (
              <div
                key={guild.id}
                className="grid grid-cols-12 gap-4 px-4 py-3 rounded-lg bg-card/30 border border-border/30 fade-up hover:bg-card/60 hover:border-indigo-500/30 transition-all group"
                style={{ animationDelay: `${0.05 + i * 0.02}s` }}
              >
                <div className="col-span-1 text-muted-foreground text-sm font-mono">
                  {String(guild.id).padStart(2, '0')}
                </div>
                <div className="col-span-4">
                  <span className="font-medium text-foreground">{guild.name}</span>
                </div>
                <div className="col-span-3 flex items-center gap-2">
                  <Crown className="w-3.5 h-3.5 text-amber-500/70" />
                  <span className="text-indigo-400 font-medium">{guild.leader}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-muted/50 text-muted-foreground">
                    {guild.region}
                  </span>
                </div>
                <div className="col-span-2 text-right">
                  <a
                    href={guild.discord}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-indigo-400 transition-colors"
                  >
                    <span className="hidden md:inline">Join</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        
        {/* Summary Stats */}
        <div className="grid md:grid-cols-3 gap-4 mt-6 flex-shrink-0">
          <div className="p-4 rounded-xl bg-card/50 border border-border/50 fade-up" style={{ animationDelay: "0.55s" }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-indigo-400">24</div>
                <p className="text-xs text-muted-foreground">Active Guilds</p>
              </div>
            </div>
          </div>
          
          <div className="p-4 rounded-xl bg-card/50 border border-border/50 fade-up" style={{ animationDelay: "0.6s" }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center">
                <Globe className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-indigo-400">2</div>
                <p className="text-xs text-muted-foreground">Regions (BR + Latam)</p>
              </div>
            </div>
          </div>
          
          <div className="p-4 rounded-xl bg-card/50 border border-border/50 fade-up" style={{ animationDelay: "0.65s" }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                <Crown className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-500">24</div>
                <p className="text-xs text-muted-foreground">Guild Founders</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuildsSlide;
