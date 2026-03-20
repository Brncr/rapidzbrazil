import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    ArrowLeft, Loader2, Eye, Heart, Repeat2, MessageCircle,
    Quote, Bookmark, ExternalLink, AlertTriangle,
    Calendar, CheckSquare, Square, Search, Save, Lock, ClipboardList
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { fetchUserTweets, TweetData, CreatorTweetData, TWITTER_PROFILES } from "@/lib/twitterApi";

const TwitterMetricsPage: React.FC = () => {
    const navigate = useNavigate();
    const [syncing, setSyncing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [syncingHandle, setSyncingHandle] = useState<string | null>(null);
    const [sinceDate, setSinceDate] = useState("2026-03-16");
    const [untilDate, setUntilDate] = useState("2026-03-21");
    const [creatorsData, setCreatorsData] = useState<CreatorTweetData[]>([]);
    const [selectedTweets, setSelectedTweets] = useState<Set<string>>(new Set());
    const [confirmedCreators, setConfirmedCreators] = useState<Set<string>>(new Set());
    const [expandedCreator, setExpandedCreator] = useState<string | null>(null);
    const [hasSynced, setHasSynced] = useState(false);

    const syncAll = async () => {
        setSyncing(true);
        setHasSynced(true);
        setSelectedTweets(new Set());
        setConfirmedCreators(new Set());

        const empty: CreatorTweetData[] = TWITTER_PROFILES.map((p) => ({
            handle: p.handle, name: p.name, tweets: [],
            totalViews: 0, totalLikes: 0, totalRetweets: 0, totalReplies: 0,
        }));
        setCreatorsData(empty);
        const results = [...empty];

        for (let i = 0; i < TWITTER_PROFILES.length; i++) {
            const p = TWITTER_PROFILES[i];
            setSyncingHandle(p.handle);
            try {
                const tweets = await fetchUserTweets(p.handle, sinceDate, untilDate);
                results[i] = {
                    handle: p.handle, name: p.name, tweets,
                    totalViews: tweets.reduce((s, t) => s + t.views, 0),
                    totalLikes: tweets.reduce((s, t) => s + t.likes, 0),
                    totalRetweets: tweets.reduce((s, t) => s + t.retweets, 0),
                    totalReplies: tweets.reduce((s, t) => s + t.replies, 0),
                };
            } catch (err: any) {
                if (err?.message?.includes("429") || err?.message?.includes("403")) {
                    await new Promise((r) => setTimeout(r, 8000));
                    try {
                        const tweets = await fetchUserTweets(p.handle, sinceDate, untilDate);
                        results[i] = {
                            handle: p.handle, name: p.name, tweets,
                            totalViews: tweets.reduce((s, t) => s + t.views, 0),
                            totalLikes: tweets.reduce((s, t) => s + t.likes, 0),
                            totalRetweets: tweets.reduce((s, t) => s + t.retweets, 0),
                            totalReplies: tweets.reduce((s, t) => s + t.replies, 0),
                        };
                    } catch {
                        results[i] = { handle: p.handle, name: p.name, tweets: [], totalViews: 0, totalLikes: 0, totalRetweets: 0, totalReplies: 0, error: "Rate limit" };
                    }
                } else {
                    results[i] = { handle: p.handle, name: p.name, tweets: [], totalViews: 0, totalLikes: 0, totalRetweets: 0, totalReplies: 0, error: err?.message || "Erro" };
                }
            }
            setCreatorsData([...results]);
            if (i < TWITTER_PROFILES.length - 1) await new Promise((r) => setTimeout(r, 5000));
        }

        setSyncingHandle(null);
        setSyncing(false);
        const total = results.reduce((s, c) => s + c.tweets.length, 0);
        toast.success(`${total} posts puxados! Selecione e confirme cada creator.`);
    };

    // Confirm a creator — locks their selected posts
    const confirmCreator = (handle: string) => {
        const creator = creatorsData.find((c) => c.handle === handle);
        if (!creator) return;
        const selCount = creator.tweets.filter((t) => selectedTweets.has(t.id)).length;
        if (selCount === 0) {
            toast.warning(`Selecione pelo menos 1 post de @${handle}`);
            return;
        }
        setConfirmedCreators((prev) => new Set(prev).add(handle));
        setExpandedCreator(null);
        toast.success(`@${handle} confirmado com ${selCount} posts ✅`);
    };

    // Unconfirm a creator — unlocks for editing
    const unconfirmCreator = (handle: string) => {
        setConfirmedCreators((prev) => {
            const next = new Set(prev);
            next.delete(handle);
            return next;
        });
    };

    // Save ALL confirmed creators to Supabase
    const saveAll = async () => {
        if (confirmedCreators.size === 0) { toast.warning("Confirme pelo menos um creator"); return; }
        setSaving(true);

        // Load influencer UUIDs from Supabase
        const { data: influencers } = await supabase.from("influencers").select("id,handle");
        const handleToUuid: Record<string, string> = {};
        (influencers || []).forEach((inf: any) => {
            const h = (inf.handle || "").replace("@", "");
            if (h) handleToUuid[h.toLowerCase()] = inf.id;
        });

        // Clear old twitter posts first
        await supabase.from("creator_posts").delete().eq("platform", "twitter");

        let saved = 0;
        let skipped = 0;

        for (const creator of creatorsData) {
            if (!confirmedCreators.has(creator.handle)) continue;
            const uuid = handleToUuid[creator.handle.toLowerCase()];
            if (!uuid) { console.warn(`No UUID for @${creator.handle}, skipping`); skipped++; continue; }

            const sel = creator.tweets.filter((t) => selectedTweets.has(t.id));
            for (const tweet of sel) {
                const postDate = (() => { try { return new Date(tweet.created_at).toISOString().split("T")[0]; } catch { return sinceDate; } })();
                const { error } = await supabase.from("creator_posts").insert({
                    entity_type: "influencer", entity_id: uuid, platform: "twitter",
                    post_url: tweet.url, post_date: postDate,
                    description: `[@${creator.handle}] ${tweet.text.substring(0, 450)}`,
                    impressions: tweet.views, views: tweet.views, clicks: tweet.retweets,
                    engagement: tweet.likes, conversions: tweet.replies,
                });
                if (error) console.error(`Save error @${creator.handle}:`, error.message);
                else saved++;
            }
        }

        setSaving(false);
        if (skipped > 0) toast.warning(`${skipped} creators sem cadastro no banco`);
        toast.success(`${saved} posts salvos de ${confirmedCreators.size - skipped} creators! ✅`);
        setTimeout(() => navigate("/metrics-report"), 1500);
    };

    const toggleTweet = (id: string, creatorHandle: string) => {
        if (confirmedCreators.has(creatorHandle)) return; // locked
        setSelectedTweets((prev) => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
    };

    const toggleAllCreator = (creator: CreatorTweetData) => {
        if (confirmedCreators.has(creator.handle)) return; // locked
        const ids = creator.tweets.map((t) => t.id);
        const allIn = ids.every((id) => selectedTweets.has(id));
        setSelectedTweets((prev) => { const next = new Set(prev); ids.forEach((id) => allIn ? next.delete(id) : next.add(id)); return next; });
    };

    // Metrics from CONFIRMED creators' selected posts only
    const confirmedMetrics = useMemo(() => {
        let tweets = 0, views = 0, likes = 0, retweets = 0, replies = 0;
        for (const c of creatorsData) {
            if (!confirmedCreators.has(c.handle)) continue;
            for (const t of c.tweets) {
                if (selectedTweets.has(t.id)) { tweets++; views += t.views; likes += t.likes; retweets += t.retweets; replies += t.replies; }
            }
        }
        return { tweets, views, likes, retweets, replies };
    }, [creatorsData, selectedTweets, confirmedCreators]);

    const fmt = (n: number) => n >= 1e6 ? `${(n / 1e6).toFixed(1)}M` : n >= 1e3 ? `${(n / 1e3).toFixed(1)}K` : n.toLocaleString("pt-BR");
    const fmtDate = (d: string) => { try { return new Date(d).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }); } catch { return d; } };

    return (
        <div className="min-h-screen bg-background">
            {/* HEADER */}
            <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-4">
                        <Link to="/dashboard"><Button variant="ghost" size="icon" className="rounded-full"><ArrowLeft className="w-5 h-5" /></Button></Link>
                        <div>
                            <h1 className="text-xl font-bold">📊 Twitter Metrics</h1>
                            <p className="text-sm text-muted-foreground">{TWITTER_PROFILES.length} perfis • Selecione, confirme e salve</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <Link to="/metrics-report">
                            <Button variant="outline" size="sm" className="gap-1.5">
                                <ClipboardList className="w-4 h-4" /> Relatório
                            </Button>
                        </Link>
                        <div className="flex items-center gap-1.5 bg-muted/50 rounded-lg px-3 py-1.5">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <input type="date" value={sinceDate} onChange={(e) => setSinceDate(e.target.value)} className="bg-transparent text-sm border-none outline-none w-[130px]" />
                            <span className="text-xs text-muted-foreground">até</span>
                            <input type="date" value={untilDate} onChange={(e) => setUntilDate(e.target.value)} className="bg-transparent text-sm border-none outline-none w-[130px]" />
                        </div>
                        <Button onClick={syncAll} disabled={syncing || saving} className="gap-2">
                            {syncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                            {syncing ? `@${syncingHandle || "..."}` : "Buscar Tweets"}
                        </Button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-5">

                {/* CONFIRMED METRICS TALLY */}
                {hasSynced && (
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                        {[
                            { label: "Confirmados", value: `${confirmedCreators.size} creators / ${confirmedMetrics.tweets} posts`, icon: <Lock className="w-4 h-4" />, color: "#60a5fa" },
                            { label: "Views", value: fmt(confirmedMetrics.views), icon: <Eye className="w-4 h-4" />, color: "#a78bfa" },
                            { label: "Likes", value: fmt(confirmedMetrics.likes), icon: <Heart className="w-4 h-4" />, color: "#f472b6" },
                            { label: "Retweets", value: fmt(confirmedMetrics.retweets), icon: <Repeat2 className="w-4 h-4" />, color: "#34d399" },
                            { label: "Replies", value: fmt(confirmedMetrics.replies), icon: <MessageCircle className="w-4 h-4" />, color: "#fbbf24" },
                        ].map((c) => (
                            <Card key={c.label} className="bg-card border-border/50">
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="p-1.5 rounded-lg" style={{ backgroundColor: c.color + "20" }}>
                                            {React.cloneElement(c.icon as React.ReactElement, { style: { color: c.color } })}
                                        </div>
                                        <span className="text-xs text-muted-foreground">{c.label}</span>
                                    </div>
                                    <p className="text-xl font-bold" style={{ color: c.color }}>{c.value}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* EMPTY STATE */}
                {!hasSynced && (
                    <div className="text-center py-20">
                        <Calendar className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
                        <p className="text-lg text-muted-foreground">Selecione o período e clique <strong>"Buscar Tweets"</strong></p>
                        <p className="text-sm text-muted-foreground/60 mt-2">{TWITTER_PROFILES.length} perfis configurados</p>
                    </div>
                )}

                {/* CREATORS */}
                <div className="space-y-2">
                    {creatorsData.map((creator) => {
                        const isExpanded = expandedCreator === creator.handle;
                        const isSyncing = syncingHandle === creator.handle;
                        const isConfirmed = confirmedCreators.has(creator.handle);
                        const selCount = creator.tweets.filter((t) => selectedTweets.has(t.id)).length;
                        const allSel = creator.tweets.length > 0 && selCount === creator.tweets.length;

                        // Metrics for this creator's selected tweets
                        const creatorSelViews = creator.tweets.filter(t => selectedTweets.has(t.id)).reduce((s, t) => s + t.views, 0);
                        const creatorSelLikes = creator.tweets.filter(t => selectedTweets.has(t.id)).reduce((s, t) => s + t.likes, 0);

                        return (
                            <Card key={creator.handle} className={`overflow-hidden transition-all ${isConfirmed ? "border-green-500/50 bg-green-500/5" : "border-border/50"}`}>
                                {/* Creator Header */}
                                <div className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-muted/30 transition"
                                    onClick={() => !isConfirmed && setExpandedCreator(isExpanded ? null : creator.handle)}>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${isConfirmed ? "bg-green-500/20 text-green-400" : "bg-primary/10 text-primary"}`}>
                                            {isConfirmed ? <Lock className="w-4 h-4" /> : creator.name?.[0]}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="font-semibold text-sm">{creator.name}</p>
                                                {isConfirmed && <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full font-medium">✓ Confirmado</span>}
                                            </div>
                                            <p className="text-xs text-muted-foreground">@{creator.handle}</p>
                                        </div>
                                        {creator.error && <span className="text-xs text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> {creator.error}</span>}
                                        {isSyncing && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                        {creator.tweets.length > 0 && (
                                            <>
                                                <span className={selCount > 0 ? "text-primary font-bold" : ""}>{selCount}/{creator.tweets.length}</span>
                                                {selCount > 0 && (
                                                    <>
                                                        <span className="hidden sm:flex items-center gap-1"><Eye className="w-3 h-3" />{fmt(creatorSelViews)}</span>
                                                        <span className="hidden sm:flex items-center gap-1"><Heart className="w-3 h-3" />{fmt(creatorSelLikes)}</span>
                                                    </>
                                                )}
                                            </>
                                        )}
                                        {isConfirmed && (
                                            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-yellow-400 h-7 px-2"
                                                onClick={(e) => { e.stopPropagation(); unconfirmCreator(creator.handle); setExpandedCreator(creator.handle); }}>
                                                Editar
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                {/* Posts (only visible when expanded & not confirmed) */}
                                {isExpanded && !isConfirmed && creator.tweets.length > 0 && (
                                    <div className="border-t border-border/50 bg-muted/5">
                                        {/* Select all / Confirm */}
                                        <div className="flex items-center justify-between px-4 py-2 bg-muted/20 border-b border-border/30">
                                            <button className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-primary transition"
                                                onClick={(e) => { e.stopPropagation(); toggleAllCreator(creator); }}>
                                                {allSel ? <CheckSquare className="w-4 h-4 text-primary" /> : <Square className="w-4 h-4" />}
                                                {allSel ? "Desmarcar todos" : "Selecionar todos"}
                                            </button>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-muted-foreground">{selCount} selecionados</span>
                                                <Button size="sm" className="gap-1.5 bg-green-600 hover:bg-green-700 text-white h-7 px-3 text-xs"
                                                    onClick={(e) => { e.stopPropagation(); confirmCreator(creator.handle); }}
                                                    disabled={selCount === 0}>
                                                    <Lock className="w-3 h-3" /> Confirmar
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Tweet list */}
                                        <div className="divide-y divide-border/20 max-h-[500px] overflow-y-auto">
                                            {creator.tweets.map((tweet) => {
                                                const sel = selectedTweets.has(tweet.id);
                                                return (
                                                    <div key={tweet.id} className={`px-4 py-3 flex gap-3 cursor-pointer hover:bg-muted/20 transition ${sel ? "" : "opacity-40"}`}
                                                        onClick={() => toggleTweet(tweet.id, creator.handle)}>
                                                        <div className="pt-0.5 flex-shrink-0">
                                                            {sel ? <CheckSquare className="w-5 h-5 text-primary" /> : <Square className="w-5 h-5 text-muted-foreground/30" />}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm text-foreground/80 whitespace-pre-wrap mb-1.5 leading-relaxed line-clamp-3">{tweet.text}</p>
                                                            <div className="text-[10px] text-muted-foreground mb-1.5">{fmtDate(tweet.created_at)}</div>
                                                            <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                                                                <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{fmt(tweet.views)}</span>
                                                                <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5" />{fmt(tweet.likes)}</span>
                                                                <span className="flex items-center gap-1"><Repeat2 className="w-3.5 h-3.5" />{fmt(tweet.retweets)}</span>
                                                                <span className="flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5" />{fmt(tweet.replies)}</span>
                                                                <span className="flex items-center gap-1"><Quote className="w-3.5 h-3.5" />{fmt(tweet.quotes)}</span>
                                                                <span className="flex items-center gap-1"><Bookmark className="w-3.5 h-3.5" />{fmt(tweet.bookmarks)}</span>
                                                                <a href={tweet.url} target="_blank" rel="noopener noreferrer"
                                                                    className="flex items-center gap-1 text-primary hover:underline ml-auto"
                                                                    onClick={(e) => e.stopPropagation()}>
                                                                    <ExternalLink className="w-3.5 h-3.5" /> Ver no X
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Bottom confirm bar */}
                                        <div className="px-4 py-3 bg-muted/20 border-t border-border/30 flex items-center justify-between">
                                            <div className="text-xs text-muted-foreground">
                                                {selCount > 0 ? (
                                                    <span>
                                                        <strong className="text-foreground">{selCount} posts</strong> • {fmt(creator.tweets.filter(t => selectedTweets.has(t.id)).reduce((s, t) => s + t.views, 0))} views • {fmt(creator.tweets.filter(t => selectedTweets.has(t.id)).reduce((s, t) => s + t.likes, 0))} likes
                                                    </span>
                                                ) : "Nenhum post selecionado"}
                                            </div>
                                            <Button size="sm" className="gap-1.5 bg-green-600 hover:bg-green-700 text-white"
                                                onClick={(e) => { e.stopPropagation(); confirmCreator(creator.handle); }}
                                                disabled={selCount === 0}>
                                                <Lock className="w-3.5 h-3.5" /> Confirmar @{creator.handle}
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {isExpanded && !isConfirmed && creator.tweets.length === 0 && !isSyncing && (
                                    <div className="border-t border-border/50 px-4 py-8 text-center text-sm text-muted-foreground/50">
                                        {creator.error ? `❌ ${creator.error}` : "Nenhum post no período"}
                                    </div>
                                )}
                            </Card>
                        );
                    })}
                </div>

                {/* SAVE ALL BUTTON */}
                {confirmedCreators.size > 0 && (
                    <div className="sticky bottom-4 flex justify-center pt-4">
                        <Button onClick={saveAll} disabled={saving}
                            className="gap-2 bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-500/20 px-8 py-6 text-lg rounded-xl"
                            size="lg">
                            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            {saving ? "Salvando..." : `Salvar Tudo — ${confirmedCreators.size} creators, ${confirmedMetrics.tweets} posts`}
                        </Button>
                    </div>
                )}

                {syncing && (
                    <p className="text-center text-xs text-muted-foreground/50 flex items-center justify-center gap-2 py-4">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        5s entre cada perfil para evitar rate limit
                    </p>
                )}
            </div>
        </div>
    );
};

export default TwitterMetricsPage;
