import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
    ArrowLeft, Loader2, Eye, Heart, Repeat2, MessageCircle,
    ExternalLink, Calendar, Trash2, BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface SavedPost {
    id: string;
    entity_id: string; // UUID
    post_url: string;
    post_date: string;
    description: string | null;
    views: number;
    clicks: number; // retweets
    engagement: number; // likes
    conversions: number; // replies
}

interface CreatorGroup {
    uuid: string;
    handle: string;
    name: string;
    posts: SavedPost[];
    totalViews: number;
    totalLikes: number;
    totalRetweets: number;
    totalReplies: number;
}

// Extract handle from description prefix: "[@handle] tweet text..."
const extractHandle = (desc: string | null): string => {
    if (!desc) return "unknown";
    const match = desc.match(/^\[@([^\]]+)\]/);
    return match ? match[1] : "unknown";
};

// Extract clean text (without handle prefix)
const extractText = (desc: string | null): string => {
    if (!desc) return "(Sem texto)";
    return desc.replace(/^\[@[^\]]+\]\s*/, "");
};

const MetricsReportPage: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState<SavedPost[]>([]);
    const [uuidToName, setUuidToName] = useState<Record<string, string>>({});
    const [expandedCreator, setExpandedCreator] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            setLoading(true);

            // Load influencer names
            const { data: influencers } = await supabase.from("influencers").select("id,name,handle");
            const nameMap: Record<string, string> = {};
            (influencers || []).forEach((inf: any) => {
                nameMap[inf.id] = inf.name || inf.handle?.replace("@", "") || "Unknown";
            });
            setUuidToName(nameMap);

            // Load posts
            const { data, error } = await supabase
                .from("creator_posts")
                .select("id,entity_id,post_url,post_date,description,views,clicks,engagement,conversions")
                .eq("platform", "twitter")
                .order("post_date", { ascending: false });

            if (error) {
                toast.error("Erro ao carregar posts salvos");
                console.error(error);
            } else {
                setPosts((data as SavedPost[]) || []);
            }
            setLoading(false);
        })();
    }, []);

    const creators = useMemo((): CreatorGroup[] => {
        const map = new Map<string, SavedPost[]>();
        for (const post of posts) {
            if (!map.has(post.entity_id)) map.set(post.entity_id, []);
            map.get(post.entity_id)!.push(post);
        }
        return Array.from(map.entries())
            .map(([uuid, posts]) => ({
                uuid,
                handle: extractHandle(posts[0]?.description),
                name: uuidToName[uuid] || extractHandle(posts[0]?.description),
                posts: posts.sort((a, b) => new Date(b.post_date).getTime() - new Date(a.post_date).getTime()),
                totalViews: posts.reduce((s, p) => s + (p.views || 0), 0),
                totalLikes: posts.reduce((s, p) => s + (p.engagement || 0), 0),
                totalRetweets: posts.reduce((s, p) => s + (p.clicks || 0), 0),
                totalReplies: posts.reduce((s, p) => s + (p.conversions || 0), 0),
            }))
            .sort((a, b) => b.totalViews - a.totalViews);
    }, [posts, uuidToName]);

    const totals = useMemo(() => ({
        posts: posts.length,
        creators: creators.length,
        views: posts.reduce((s, p) => s + (p.views || 0), 0),
        likes: posts.reduce((s, p) => s + (p.engagement || 0), 0),
        retweets: posts.reduce((s, p) => s + (p.clicks || 0), 0),
        replies: posts.reduce((s, p) => s + (p.conversions || 0), 0),
    }), [posts, creators]);

    const deletePost = async (id: string) => {
        const { error } = await supabase.from("creator_posts").delete().eq("id", id);
        if (error) { toast.error("Erro ao remover"); return; }
        setPosts((prev) => prev.filter((p) => p.id !== id));
        toast.success("Post removido");
    };

    const fmt = (n: number) => n >= 1e6 ? `${(n / 1e6).toFixed(1)}M` : n >= 1e3 ? `${(n / 1e3).toFixed(1)}K` : n.toLocaleString("pt-BR");
    const fmtDate = (d: string) => { try { return new Date(d + "T12:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" }); } catch { return d; } };

    if (loading) return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
    );

    return (
        <div className="min-h-screen bg-background">
            {/* HEADER */}
            <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link to="/dashboard"><Button variant="ghost" size="icon" className="rounded-full"><ArrowLeft className="w-5 h-5" /></Button></Link>
                        <div>
                            <h1 className="text-xl font-bold">📋 Relatório de Métricas</h1>
                            <p className="text-sm text-muted-foreground">{totals.creators} creators • {totals.posts} posts salvos</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

                {/* TOTALS */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    {[
                        { label: "Posts", value: fmt(totals.posts), icon: <BarChart3 className="w-4 h-4" />, color: "#60a5fa" },
                        { label: "Creators", value: fmt(totals.creators), icon: <MessageCircle className="w-4 h-4" />, color: "#fbbf24" },
                        { label: "Views", value: fmt(totals.views), icon: <Eye className="w-4 h-4" />, color: "#a78bfa" },
                        { label: "Likes", value: fmt(totals.likes), icon: <Heart className="w-4 h-4" />, color: "#f472b6" },
                        { label: "Retweets", value: fmt(totals.retweets), icon: <Repeat2 className="w-4 h-4" />, color: "#34d399" },
                        { label: "Replies", value: fmt(totals.replies), icon: <MessageCircle className="w-4 h-4" />, color: "#fb923c" },
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

                {/* EMPTY */}
                {posts.length === 0 && (
                    <div className="text-center py-20">
                        <Calendar className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
                        <p className="text-lg text-muted-foreground">Nenhum post salvo ainda</p>
                        <Link to="/twitter-metrics" className="text-sm text-primary hover:underline mt-2 inline-block">
                            Ir para Twitter Metrics →
                        </Link>
                    </div>
                )}

                {/* CREATORS */}
                <div className="space-y-4">
                    {creators.map((creator) => {
                        const isExpanded = expandedCreator === creator.uuid;

                        return (
                            <Card key={creator.uuid} className="overflow-hidden border-border/50">
                                <div
                                    className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-muted/30 transition"
                                    onClick={() => setExpandedCreator(isExpanded ? null : creator.uuid)}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                                            {creator.name?.[0]?.toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-semibold">{creator.name}</p>
                                            <p className="text-xs text-muted-foreground">@{creator.handle} • {creator.posts.length} posts</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <span className="flex items-center gap-1"><Eye className="w-4 h-4 text-purple-400" />{fmt(creator.totalViews)}</span>
                                        <span className="flex items-center gap-1"><Heart className="w-4 h-4 text-pink-400" />{fmt(creator.totalLikes)}</span>
                                        <span className="flex items-center gap-1"><Repeat2 className="w-4 h-4 text-green-400" />{fmt(creator.totalRetweets)}</span>
                                        <span className="flex items-center gap-1"><MessageCircle className="w-4 h-4 text-orange-400" />{fmt(creator.totalReplies)}</span>
                                    </div>
                                </div>

                                {isExpanded && (
                                    <div className="border-t border-border/50 divide-y divide-border/20 bg-muted/5">
                                        {creator.posts.map((post) => (
                                            <div key={post.id} className="px-5 py-4 flex gap-3">
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm text-foreground/80 whitespace-pre-wrap mb-2 leading-relaxed line-clamp-4">
                                                        {extractText(post.description)}
                                                    </p>
                                                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground mb-2">
                                                        <Calendar className="w-3 h-3" />
                                                        {fmtDate(post.post_date)}
                                                    </div>
                                                    <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                                                        <span className="flex items-center gap-1 font-medium text-purple-400"><Eye className="w-3.5 h-3.5" />{fmt(post.views)}</span>
                                                        <span className="flex items-center gap-1 font-medium text-pink-400"><Heart className="w-3.5 h-3.5" />{fmt(post.engagement)}</span>
                                                        <span className="flex items-center gap-1 font-medium text-green-400"><Repeat2 className="w-3.5 h-3.5" />{fmt(post.clicks)}</span>
                                                        <span className="flex items-center gap-1 font-medium text-orange-400"><MessageCircle className="w-3.5 h-3.5" />{fmt(post.conversions)}</span>
                                                        {post.post_url && (
                                                            <a href={post.post_url} target="_blank" rel="noopener noreferrer"
                                                                className="flex items-center gap-1 text-primary hover:underline ml-auto">
                                                                <ExternalLink className="w-3.5 h-3.5" /> Ver no X
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                                <Button variant="ghost" size="icon"
                                                    className="flex-shrink-0 text-muted-foreground/30 hover:text-red-400"
                                                    onClick={() => deletePost(post.id)}>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </Card>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default MetricsReportPage;
