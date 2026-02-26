import { DollarSign, Users, Megaphone, TrendingUp } from "lucide-react";

const milestones = [
  {
    id: 1,
    title: "Campaign Execution & Partnerships",
    description: "Monthly tiers, performance-based content & community operations",
    items: [
      { name: "1 Top Influencer", cost: "", detail: "$1000" },
      { name: "1 Medium Influencer", cost: "", detail: "$500" },
      { name: "1 Small Influencer", cost: "", detail: "$300" },
      { name: "1 Community Telegram", cost: "", detail: "$300" },
    ],
    total: "Total: $2,100",
    icon: Megaphone,
  },
  {
    id: 2,
    title: "Community Builder Strategy",
    description: "Dedicated strategy execution and specialized community building",
    items: [
      { name: "Bruno (Community Builder)", cost: "", detail: "$400" },
    ],
    total: "Total: $400",
    icon: Users,
  },
];

const BudgetSlide = () => {
  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8 pb-20 md:pb-8 relative overflow-hidden overflow-y-auto bg-background">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-6xl mx-auto w-full">
        {/* Header */}
        <div className="mb-4 md:mb-8 fade-up">
          <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-3 md:mb-4">
            <DollarSign className="w-3.5 h-3.5 md:w-4 md:h-4 text-emerald-400" />
            <span className="text-emerald-400 font-medium text-xs md:text-sm">Investment</span>
          </div>
          <h2 className="text-2xl md:text-4xl font-semibold font-display mb-2 md:mb-3 tracking-tight">
            <span className="text-foreground">Budget</span>
            <span className="text-emerald-400 ml-2">Breakdown</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl font-light text-sm md:text-base">
            Testing 4 channels: large, medium and small influence + community
          </p>
        </div>

        {/* Milestones Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-8">
          {milestones.map((milestone, i) => (
            <div
              key={milestone.id}
              className="p-3 md:p-5 rounded-xl md:rounded-2xl bg-card/50 border border-border/50 fade-up hover:border-emerald-500/30 transition-all flex flex-col"
              style={{ animationDelay: `${0.1 + i * 0.1}s` }}
            >
              <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <milestone.icon className="w-4 h-4 md:w-5 md:h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-widest">Milestone {milestone.id}</p>
                  <h3 className="font-medium text-foreground text-sm md:text-base">{milestone.title}</h3>
                </div>
              </div>

              <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4 font-light">{milestone.description}</p>

              <div className="space-y-2 md:space-y-3 flex-1">
                {milestone.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-start text-xs md:text-sm">
                    <div className="min-w-0 mr-2">
                      <p className="text-foreground font-medium truncate">{item.name}</p>
                      <p className="text-[10px] md:text-xs text-muted-foreground truncate">{item.detail}</p>
                    </div>
                    <span className="text-emerald-400 font-medium shrink-0">{item.cost}</span>
                  </div>
                ))}
              </div>

              <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-border/50 flex justify-between items-center">
                <span className="text-xs md:text-sm text-muted-foreground"></span>
                <span className="text-base md:text-lg font-semibold text-emerald-400">{milestone.total}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Total Budget Display */}
        <div className="mt-6 md:mt-8 p-4 md:p-6 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 md:p-3 rounded-full bg-emerald-500/20">
                <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm md:text-base text-muted-foreground font-medium">Total Campaign Investment</p>
                <p className="text-xs md:text-sm text-emerald-400/80">All inclusive (Team + Influencers)</p>
              </div>
            </div>
            <div className="text-3xl md:text-4xl font-bold font-display text-white">
              $2,500
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetSlide;
