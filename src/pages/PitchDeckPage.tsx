import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import {
    getEventPlans, getEventInfluencers, getInfluencers,
    EventInfluencer, Influencer,
} from "@/lib/entityData";

// ==================== TYPES ====================

interface SlideEntry { id: string; content: React.FC }

interface ConfirmedCreator {
    name: string;
    image: string | null;
    handle?: string;
    category?: string;
    followers?: string;
    tier?: string | null;
}

// Helper component for partner logos row
const PartnerLogos = ({ size = 48 }: { size?: number }) => (
    <div className="flex items-center justify-center gap-8 mt-6">
        <img src="/tether-gold-logo.png" alt="Tether Gold" style={{ height: size }} className="object-contain" />
        <span className="text-2xl text-white/20">×</span>
        <img src="/beincrypto-logo.jpg" alt="BeInCrypto" style={{ height: size }} className="rounded-lg object-contain" />
        <span className="text-2xl text-white/20">×</span>
        <img src="/og-image.png" alt="Rapidz" style={{ height: size }} className="object-contain" />
    </div>
);

// ==================== SLIDE COMPONENTS ====================

// SLIDE 0: Cover
const SlideCover: React.FC = () => (
    <div className="flex flex-col items-center justify-center h-full text-center px-8">
        <PartnerLogos size={72} />
        <h1 className="text-5xl md:text-7xl font-black mt-10 bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 bg-clip-text text-transparent leading-tight">
            Creator House
        </h1>
        <p className="text-xl md:text-2xl text-white/60 mt-4 font-light">
            Merge São Paulo 2026
        </p>
        <div className="mt-8 px-6 py-3 border border-yellow-500/30 rounded-full bg-yellow-500/5">
            <span className="text-sm text-yellow-400 font-semibold tracking-wider uppercase">
                Partnership Proposal — Confidential
            </span>
        </div>
        <p className="text-xs text-white/30 mt-12 absolute bottom-8">Press ← → or click arrows to navigate</p>
    </div>
);

// SLIDE 1: The Opportunity
const SlideOpportunity: React.FC = () => (
    <div className="flex flex-col justify-center h-full px-12 md:px-20">
        <p className="text-sm font-bold text-yellow-400 tracking-widest uppercase mb-4">01 — The Opportunity</p>
        <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
            Merge São Paulo 2026 is the<br />
            <span className="bg-gradient-to-r from-yellow-400 to-amber-300 bg-clip-text text-transparent">biggest crypto event in LATAM</span>
        </h2>
        <p className="text-lg text-white/50 mt-6 max-w-2xl leading-relaxed">
            We're building a <strong className="text-white">Creator House</strong> — a private residence where
            <strong className="text-yellow-400"> 15 hand-picked crypto influencers</strong> will live together for
            <strong className="text-white"> 3 days</strong>, producing non-stop content.
        </p>
        <div className="mt-10 grid grid-cols-3 gap-6 max-w-xl">
            <div className="text-center">
                <p className="text-4xl font-black text-yellow-400">15</p>
                <p className="text-xs text-white/40 mt-1">Creators</p>
            </div>
            <div className="text-center">
                <p className="text-4xl font-black text-yellow-400">3</p>
                <p className="text-xs text-white/40 mt-1">Days</p>
            </div>
            <div className="text-center">
                <p className="text-4xl font-black text-yellow-400">100</p>
                <p className="text-xs text-white/40 mt-1">VIP Tickets</p>
            </div>
        </div>
    </div>
);

// SLIDE 2: The Concept
const SlideConcept: React.FC = () => (
    <div className="flex flex-col justify-center h-full px-12 md:px-20">
        <p className="text-sm font-bold text-yellow-400 tracking-widest uppercase mb-4">02 — The Concept</p>
        <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-8">
            This is not a booth.<br />
            <span className="text-white/30">This is an immersive</span><br />
            <span className="bg-gradient-to-r from-yellow-400 to-amber-300 bg-clip-text text-transparent">content factory.</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
            {[
                { icon: "📍", label: "Location", value: "Private house, São Paulo" },
                { icon: "📅", label: "Duration", value: "March 17–19, 2026 (3 days)" },
                { icon: "👥", label: "Creators", value: "15 crypto/web3 influencers" },
                { icon: "🎟️", label: "Tickets", value: "100 VIP tickets by BeInCrypto" },
                { icon: "🍕", label: "Full Coverage", value: "Housing, food, transport, merch" },
                { icon: "🎯", label: "Mission", value: "Non-stop content for all 3 brands" },
            ].map((item) => (
                <div key={item.label} className="flex items-center gap-4 bg-white/5 rounded-xl px-5 py-4 border border-white/5">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                        <p className="text-[10px] text-white/40 uppercase tracking-wider">{item.label}</p>
                        <p className="text-sm font-semibold text-white">{item.value}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

// SLIDE 3: Content Scope
const SlideScope: React.FC = () => (
    <div className="flex flex-col justify-center h-full px-12 md:px-20">
        <p className="text-sm font-bold text-yellow-400 tracking-widest uppercase mb-4">Content Scope</p>
        <h2 className="text-3xl md:text-4xl font-black text-white mb-2">
            <span className="text-yellow-400">3 content pieces/day</span> per creator
        </h2>
        <p className="text-sm text-white/40 mb-8">Each creator commits to delivering 3 pieces of content daily across platforms — as part of the partnership agreement</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
            <div>
                <p className="text-xs font-bold text-green-400 mb-3 uppercase tracking-wider">✅ Daily Obligation (3 per day)</p>
                <div className="space-y-2">
                    {[
                        "1 Instagram Reels / TikTok",
                        "1 Twitter/X Thread or tweet tagging brands",
                        "1 Story sequence (IG or X)",
                    ].map((t) => (
                        <div key={t} className="flex items-center gap-3 text-sm text-white/70 bg-green-500/5 border border-green-500/10 rounded-lg px-4 py-2.5">
                            <span className="text-green-400 text-xs">●</span> {t}
                        </div>
                    ))}
                </div>
                <div className="mt-4 bg-yellow-500/5 border border-yellow-500/20 rounded-lg px-4 py-3">
                    <p className="text-xs text-yellow-400 font-bold">= 15 creators × 3/day × 3 days</p>
                    <p className="text-lg font-black text-white mt-1">135 content pieces total</p>
                </div>
            </div>
            <div>
                <p className="text-xs font-bold text-blue-400 mb-3 uppercase tracking-wider">🎯 Extras (3-Day Period)</p>
                <div className="space-y-2">
                    {[
                        "Workshop — Crypto Education / USDT",
                        "Gaming Tournament (stream)",
                        "YouTube Recap Video (5-10 min)",
                        "Telegram Community Engagement",
                        "Twitter Spaces / Live AMA",
                    ].map((t) => (
                        <div key={t} className="flex items-center gap-3 text-sm text-white/70 bg-blue-500/5 border border-blue-500/10 rounded-lg px-4 py-2.5">
                            <span className="text-blue-400 text-xs">●</span> {t}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

// SLIDE 4: Giveaway Strategy
const SlideGiveaway: React.FC = () => (
    <div className="flex flex-col justify-center h-full px-12 md:px-20">
        <p className="text-sm font-bold text-yellow-400 tracking-widest uppercase mb-4">04 — Giveaway Activation</p>
        <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-6">
            100 VIP Tickets.<br />
            <span className="bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">Massive engagement engine.</span>
        </h2>
        <p className="text-lg text-white/50 max-w-2xl mb-8">
            BeInCrypto provides <strong className="text-white">100 VIP tickets</strong> to Merge SP 2026.
            Creators distribute them via giveaways, driving <strong className="text-green-400">viral growth</strong> for all 3 brands.
        </p>
        <div className="bg-white/5 rounded-2xl border border-white/10 p-8 max-w-lg">
            <p className="text-xs text-white/40 uppercase tracking-wider mb-4">Giveaway Rules</p>
            <div className="space-y-3">
                {[
                    { step: "1", text: "Follow @tether_gold" },
                    { step: "2", text: "Follow @rapidz" },
                    { step: "3", text: "Follow @beaboratcrypto" },
                    { step: "4", text: "RT + Tag 3 friends" },
                ].map((r) => (
                    <div key={r.step} className="flex items-center gap-4">
                        <span className="w-8 h-8 rounded-full bg-yellow-500/20 text-yellow-400 flex items-center justify-center font-black text-sm">{r.step}</span>
                        <span className="text-white font-semibold">{r.text}</span>
                    </div>
                ))}
            </div>
            <p className="text-xs text-white/30 mt-6 italic">
                → Estimated 1,000–5,000 giveaway entries per activation
            </p>
        </div>
    </div>
);

// SLIDE 5: Projected Reach
const SlideReach: React.FC = () => (
    <div className="flex flex-col justify-center h-full px-12 md:px-20">
        <p className="text-sm font-bold text-yellow-400 tracking-widest uppercase mb-4">05 — Projected Impact</p>
        <h2 className="text-4xl md:text-5xl font-black text-white mb-10">
            The <span className="text-yellow-400">numbers</span> speak
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-3xl">
            {[
                { value: "500K–2M+", label: "Combined Reach", color: "text-yellow-400" },
                { value: "135+", label: "Content Pieces", color: "text-green-400" },
                { value: "45+", label: "Tweets & Threads", color: "text-blue-400" },
                { value: "45+", label: "Reels/TikToks", color: "text-red-400" },
                { value: "1–5K", label: "Giveaway Entries", color: "text-purple-400" },
                { value: "100%", label: "Brand Mentions", color: "text-amber-400" },
            ].map((m) => (
                <div key={m.label} className="bg-white/5 rounded-xl border border-white/5 p-6 text-center">
                    <p className={`text-3xl md:text-4xl font-black ${m.color}`}>{m.value}</p>
                    <p className="text-xs text-white/40 mt-2">{m.label}</p>
                </div>
            ))}
        </div>
        <p className="text-sm text-white/30 mt-8 max-w-xl">
            15 creators × 3 contents/day × 3 days = 135 guaranteed content pieces + extras
        </p>
    </div>
);

// SLIDE 6: Budget
const SlideBudget: React.FC = () => (
    <div className="flex flex-col justify-center h-full px-12 md:px-20">
        <p className="text-sm font-bold text-yellow-400 tracking-widest uppercase mb-4">06 — Investment Breakdown</p>
        <h2 className="text-3xl md:text-4xl font-black text-white mb-8">
            Total Event Budget: <span className="text-yellow-400">$6,496</span>
        </h2>
        <div className="max-w-2xl">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-white/10">
                        <th className="text-left py-3 text-white/40 font-medium">Category</th>
                        <th className="text-right py-3 text-white/40 font-medium">Cost (USD)</th>
                    </tr>
                </thead>
                <tbody>
                    {[
                        { cat: "🏠 House Rental", cost: "$686", note: "3-day private house" },
                        { cat: "🍕 Food & Catering", cost: "$1,150", note: "Groceries + Private chef" },
                        { cat: "🍺 Drinks", cost: "$420", note: "All beverages" },
                        { cat: "✈️ Transport", cost: "$330", note: "Uber + airport transfers" },
                        { cat: "🎁 Merch & Swag", cost: "$230", note: "Branded items" },
                        { cat: "💰 Other", cost: "$230", note: "Cleaning, décor, internet" },
                        { cat: "✈️ Creator Travel Aid", cost: "$3,450", note: "$230 × 15 creators" },
                    ].map((r) => (
                        <tr key={r.cat} className="border-b border-white/5">
                            <td className="py-3 text-white">{r.cat} <span className="text-white/30 text-xs">— {r.note}</span></td>
                            <td className="py-3 text-right font-bold text-white">{r.cost}</td>
                        </tr>
                    ))}
                    <tr className="border-t-2 border-yellow-500/30">
                        <td className="py-4 font-black text-lg text-white">🏷️ TOTAL</td>
                        <td className="py-4 text-right font-black text-2xl text-yellow-400">$6,496</td>
                    </tr>
                </tbody>
            </table>
            <div className="flex gap-8 mt-4 text-xs text-white/30">
                <span>💰 $2,165/day</span>
                <span>👤 $433/creator</span>
                <span>📊 CPM &lt; $1.00</span>
            </div>
        </div>
    </div>
);

// SLIDE 7: Partnership Structure
const SlidePartnership: React.FC = () => (
    <div className="flex flex-col justify-center h-full px-12 md:px-20">
        <p className="text-sm font-bold text-yellow-400 tracking-widest uppercase mb-4">07 — Partnership Structure</p>
        <h2 className="text-3xl md:text-4xl font-black text-white mb-10">
            Three partners. <span className="text-yellow-400">One mission.</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
            {/* Tether */}
            <div className="bg-gradient-to-b from-yellow-500/10 to-transparent rounded-2xl border border-yellow-500/20 p-6 text-center">
                <img src="/tether-gold-logo.png" alt="Tether Gold" className="w-16 h-16 mx-auto mb-4 object-contain" />
                <p className="text-lg font-black text-yellow-400">Tether Gold</p>
                <p className="text-xs text-white/40 mt-1 mb-4">Headline Sponsor</p>
                <p className="text-2xl font-black text-white">$5,000</p>
                <p className="text-xs text-white/30 mt-2">Covers majority of operational costs + travel aid</p>
            </div>
            {/* BeInCrypto */}
            <div className="bg-gradient-to-b from-green-500/10 to-transparent rounded-2xl border border-green-500/20 p-6 text-center">
                <img src="/beincrypto-logo.jpg" alt="BeInCrypto" className="w-16 h-16 mx-auto mb-4 rounded-xl object-contain" />
                <p className="text-lg font-black text-green-400">BeInCrypto</p>
                <p className="text-xs text-white/40 mt-1 mb-4">Media Partner</p>
                <p className="text-2xl font-black text-white">100 Tickets</p>
                <p className="text-xs text-white/30 mt-2">VIP access to Merge SP 2026 for giveaways</p>
            </div>
            {/* Rapidz */}
            <div className="bg-gradient-to-b from-red-500/10 to-transparent rounded-2xl border border-red-500/20 p-6 text-center">
                <img src="/og-image.png" alt="Rapidz" className="h-12 mx-auto mb-4 object-contain mt-2" />
                <p className="text-lg font-black text-red-400 mt-2">Rapidz</p>
                <p className="text-xs text-white/40 mt-1 mb-4">Operations Lead</p>
                <p className="text-2xl font-black text-white">Execution</p>
                <p className="text-xs text-white/30 mt-2">House logistics, creator management, coordination</p>
            </div>
        </div>
    </div>
);

// SLIDE 8: What Tether Gets
const SlideTetherROI: React.FC = () => (
    <div className="flex flex-col justify-center h-full px-12 md:px-20">
        <p className="text-sm font-bold text-yellow-400 tracking-widest uppercase mb-4">08 — What Tether Gets</p>
        <h2 className="text-3xl md:text-4xl font-black text-white mb-8">
            <span className="text-yellow-400">$5,000</span> delivers
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
            {[
                { icon: "📱", text: "Brand in 100% of content — every post, story, tweet" },
                { icon: "🎟️", text: "Giveaway integration — followers must follow Tether" },
                { icon: "🎓", text: "Workshop/AMA about USDT — educational session" },
                { icon: "👥", text: "15 creators promoting Tether for 3 days" },
                { icon: "🎥", text: "YouTube recap videos featuring Tether" },
                { icon: "🐦", text: "Twitter Spaces/AMA with Tether as topic" },
                { icon: "👕", text: "Branded merch — Tether logo on swag" },
                { icon: "📊", text: "Full content report — media coverage post-event" },
            ].map((item) => (
                <div key={item.text} className="flex items-start gap-3 bg-yellow-500/5 border border-yellow-500/10 rounded-xl px-5 py-4">
                    <span className="text-xl mt-0.5">{item.icon}</span>
                    <span className="text-sm text-white/80">{item.text}</span>
                </div>
            ))}
        </div>
        <div className="mt-8 bg-white/5 rounded-xl border border-white/10 px-6 py-4 max-w-md">
            <p className="text-xs text-white/40">Compared to traditional influencer marketing</p>
            <div className="flex items-center gap-4 mt-2">
                <div>
                    <p className="text-xs text-white/30">Market rate per post</p>
                    <p className="text-lg font-bold text-red-400 line-through">$500–$2,000</p>
                </div>
                <span className="text-white/20 text-2xl">→</span>
                <div>
                    <p className="text-xs text-white/30">Our cost per piece</p>
                    <p className="text-lg font-black text-green-400">$37</p>
                </div>
                <span className="text-xs text-yellow-400 font-bold bg-yellow-400/10 px-3 py-1 rounded-full">13–54x cheaper</span>
            </div>
        </div>
    </div>
);

// SLIDE 9: Timeline
const SlideTimeline: React.FC = () => (
    <div className="flex flex-col justify-center h-full px-12 md:px-20">
        <p className="text-sm font-bold text-yellow-400 tracking-widest uppercase mb-4">09 — Timeline</p>
        <h2 className="text-3xl md:text-4xl font-black text-white mb-10">Execution Plan</h2>
        <div className="max-w-2xl space-y-0">
            {[
                { date: "NOW", text: "Partnership confirmed, creator selection underway", color: "bg-blue-500", active: true },
                { date: "MAR 10", text: "All creators confirmed, content plan finalized", color: "bg-purple-500", active: false },
                { date: "MAR 12-16", text: "Pre-event social media campaign & teasers", color: "bg-amber-500", active: false },
                { date: "MAR 17-19", text: "CREATOR HOUSE LIVE — 3 Days", color: "bg-yellow-500", active: false },
                { date: "MAR 20-27", text: "Post-event content (recaps, highlights)", color: "bg-green-500", active: false },
                { date: "MAR 31", text: "Full media report delivered to all partners", color: "bg-emerald-500", active: false },
            ].map((step, i) => (
                <div key={step.date} className="flex items-stretch gap-6">
                    {/* Timeline line */}
                    <div className="flex flex-col items-center">
                        <div className={`w-4 h-4 rounded-full ${step.color} ${step.active ? "ring-4 ring-yellow-400/30" : ""} flex-shrink-0`} />
                        {i < 5 && <div className="w-px h-full bg-white/10 my-1" />}
                    </div>
                    {/* Content */}
                    <div className={`pb-8 ${step.active ? "" : ""}`}>
                        <p className={`text-xs font-bold ${step.active ? "text-yellow-400" : "text-white/40"} tracking-wider`}>{step.date}</p>
                        <p className={`text-sm mt-1 ${step.active ? "text-white font-bold text-base" : "text-white/60"}`}>{step.text}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

// SLIDE 10: The Ask (CTA)
const SlideAsk: React.FC = () => (
    <div className="flex flex-col items-center justify-center h-full text-center px-8">
        <img src="/tether-gold-logo.png" alt="Tether Gold" className="w-24 h-24 mb-8 object-contain" />
        <h2 className="text-3xl md:text-4xl font-black text-white mb-4 max-w-2xl leading-tight">
            We're inviting Tether Gold to be the<br />
            <span className="bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 bg-clip-text text-transparent">
                headline sponsor
            </span>
            <br />of the Creator House
        </h2>
        <div className="mt-6 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 rounded-2xl px-12 py-8">
            <p className="text-xs text-yellow-400/60 uppercase tracking-widest mb-2">Investment</p>
            <p className="text-6xl font-black text-yellow-400">$5,000</p>
            <p className="text-sm text-white/40 mt-2">USD</p>
        </div>
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl">
            {[
                { icon: "📱", text: "135+ content pieces" },
                { icon: "👥", text: "500K–2M reach" },
                { icon: "🎟️", text: "100 ticket giveaways" },
                { icon: "📊", text: "Full media report" },
            ].map((b) => (
                <div key={b.text} className="text-center bg-white/5 rounded-xl border border-white/10 px-4 py-3">
                    <p className="text-xl">{b.icon}</p>
                    <p className="text-[10px] text-white/60 mt-1">{b.text}</p>
                </div>
            ))}
        </div>
        <PartnerLogos size={40} />
        <p className="text-xs text-white/20 mt-8">
            Let's make Merge SP 2026 Tether's biggest creator activation in LATAM.
        </p>
    </div>
);

// SLIDE: Venue Preview
const SlideVenue: React.FC = () => (
    <div className="flex flex-col justify-center h-full px-12 md:px-20">
        <p className="text-sm font-bold text-yellow-400 tracking-widest uppercase mb-4">Venue Preview</p>
        <h2 className="text-3xl md:text-4xl font-black text-white mb-2">
            The <span className="text-yellow-400">Creator House</span> experience
        </h2>
        <p className="text-sm text-white/40 mb-6">Branded environment simulation — Tether Gold × BeInCrypto × Rapidz</p>
        <div className="max-w-2xl">
            <img src="/house-pool-area.png" alt="Activation Area" className="w-full rounded-2xl border border-white/10 object-cover" />
            <p className="text-xs text-white/40 text-center mt-3">🎯 Activation Area — Branded photo backdrop, merch display & event space</p>
        </div>
    </div>
);

// Build static slides list
const STATIC_SLIDES: SlideEntry[] = [
    { id: "cover", content: SlideCover },
    { id: "opportunity", content: SlideOpportunity },
    { id: "concept", content: SlideConcept },
    { id: "venue", content: SlideVenue },
    // creators slide inserted dynamically
    { id: "scope", content: SlideScope },
    { id: "giveaway", content: SlideGiveaway },
    { id: "reach", content: SlideReach },
    { id: "budget", content: SlideBudget },
    { id: "partnership", content: SlidePartnership },
    { id: "roi", content: SlideTetherROI },
    { id: "timeline", content: SlideTimeline },
    { id: "ask", content: SlideAsk },
];

// ==================== MAIN COMPONENT ====================

const PitchDeckPage: React.FC = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [creators, setCreators] = useState<ConfirmedCreator[]>([]);

    // Load confirmed creators from event data
    useEffect(() => {
        (async () => {
            try {
                const plans = await getEventPlans();
                if (plans.length === 0) return;
                const eventInf = await getEventInfluencers(plans[0].id!);
                const allInf = await getInfluencers();
                const confirmed = eventInf
                    .filter((ei) => ei.confirmed)
                    .map((ei) => {
                        const match = allInf.find((a) => a.id === ei.influencer_id);
                        return {
                            name: match?.name || ei.influencer_name,
                            image: ei.influencer_image,
                            handle: match?.handle,
                            category: match?.category,
                            followers: match?.followers,
                            tier: match?.tier,
                        };
                    });
                setCreators(confirmed);
            } catch (err) {
                console.error("Failed to load creators for pitch deck", err);
            }
        })();
    }, []);

    // Build dynamic creators slide
    const SlideCreators: React.FC = () => (
        <div className="flex flex-col justify-center h-full px-12 md:px-20">
            <p className="text-sm font-bold text-yellow-400 tracking-widest uppercase mb-4">03 — Confirmed Creators</p>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-2">
                <span className="text-yellow-400">{creators.length}</span> creators confirmed
            </h2>
            <p className="text-sm text-white/40 mb-8">Hand-picked crypto influencers ready to produce content</p>
            {creators.length === 0 ? (
                <p className="text-white/30 text-sm">Loading creators...</p>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-5 max-w-3xl">
                    {creators.map((c) => (
                        <a
                            key={c.name}
                            href={c.handle ? `https://x.com/${c.handle.replace("@", "")}` : "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white/5 border border-white/10 rounded-xl p-5 text-center hover:border-yellow-500/30 hover:bg-white/[0.08] transition block"
                        >
                            {c.image ? (
                                <img src={c.image} alt={c.name} className="w-16 h-16 rounded-full mx-auto mb-3 object-cover border-2 border-yellow-500/30" />
                            ) : (
                                <div className="w-16 h-16 rounded-full mx-auto mb-3 bg-yellow-500/20 flex items-center justify-center border-2 border-yellow-500/30">
                                    <span className="text-xl font-black text-yellow-400">{c.name?.[0]}</span>
                                </div>
                            )}
                            <p className="text-sm font-bold text-white truncate block">{c.name}</p>
                            {c.handle && <p className="text-[10px] text-white/40 truncate block mt-0.5">{c.handle}</p>}
                            <div className="flex items-center justify-center gap-2 mt-3 flex-wrap">
                                {c.followers && (
                                    <span className="text-[9px] px-2 py-1 rounded-full bg-blue-500/15 text-blue-400 font-bold">
                                        👥 {c.followers}
                                    </span>
                                )}
                                {c.category && (
                                    <span className="text-[9px] px-2 py-1 rounded-full bg-purple-500/15 text-purple-400 font-bold">
                                        {c.category}
                                    </span>
                                )}
                            </div>
                        </a>
                    ))}
                </div>
            )}
        </div>
    );

    // Build slides with dynamic creators slide inserted after venue
    const SLIDES: SlideEntry[] = [
        ...STATIC_SLIDES.slice(0, 4), // cover, opportunity, concept, venue
        { id: "creators", content: SlideCreators },
        ...STATIC_SLIDES.slice(4), // scope onwards
    ];

    const total = SLIDES.length;

    const goNext = useCallback(() => setCurrentSlide((s) => Math.min(s + 1, total - 1)), [total]);
    const goPrev = useCallback(() => setCurrentSlide((s) => Math.max(s - 1, 0)), []);

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); goNext(); }
            if (e.key === "ArrowLeft") { e.preventDefault(); goPrev(); }
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [goNext, goPrev]);

    const SlideContent = SLIDES[currentSlide].content;

    return (
        <div className="fixed inset-0 bg-[#0a0a0f] text-white overflow-hidden select-none" style={{ fontFamily: "'Inter', sans-serif" }}>
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/3 via-transparent to-purple-500/3 pointer-events-none" />

            {/* Top bar */}
            <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-4 z-20">
                <Link to="/evento" className="flex items-center gap-2 text-white/30 hover:text-white/60 transition text-xs">
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Event
                </Link>
                <span className="text-xs text-white/20 font-mono">
                    {String(currentSlide + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                </span>
            </div>

            {/* Progress bar */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-white/5 z-30">
                <div
                    className="h-full bg-gradient-to-r from-yellow-400 to-amber-300 transition-all duration-500 ease-out"
                    style={{ width: `${((currentSlide + 1) / total) * 100}%` }}
                />
            </div>

            {/* Slide content */}
            <div className="relative h-full w-full">
                <SlideContent />
            </div>

            {/* Navigation arrows */}
            <button
                onClick={goPrev}
                disabled={currentSlide === 0}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition disabled:opacity-20 disabled:cursor-not-allowed z-20"
            >
                <ChevronLeft className="w-5 h-5 text-white/60" />
            </button>
            <button
                onClick={goNext}
                disabled={currentSlide === total - 1}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition disabled:opacity-20 disabled:cursor-not-allowed z-20"
            >
                <ChevronRight className="w-5 h-5 text-white/60" />
            </button>

            {/* Slide dots */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {SLIDES.map((s, i) => (
                    <button
                        key={s.id}
                        onClick={() => setCurrentSlide(i)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${i === currentSlide ? "bg-yellow-400 w-6" : "bg-white/20 hover:bg-white/40"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default PitchDeckPage;
