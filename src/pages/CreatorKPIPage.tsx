import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import {
    ArrowLeft,
    Download,
    Printer,
    Loader2,
    TrendingUp,
    Eye,
    MousePointerClick,
    Users,
    Smartphone,
    ShieldCheck,
    Wallet,
    CreditCard,
    DollarSign,
    RefreshCw,
    Target,
    Star,
    MessageSquare,
    BarChart3,
    ChevronRight,
    Plus,
    Trash2,
    ExternalLink,
    Link2,
    Pencil,
    Check,
    X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";
import {
    CreatorKPI,
    EntityType,
    getCreatorKPIs,
    upsertCreatorKPI,
    getInfluencers,
    getCommunities,
    getStreamers,
    CreatorPost,
    PostPlatform,
    getCreatorPosts,
    addCreatorPost,
    updateCreatorPost,
    deleteCreatorPost,
} from "@/lib/entityData";

// ==================== FUNNEL STEPS ====================

interface FunnelStep {
    key: keyof CreatorKPI;
    label: string;
    shortLabel: string;
    icon: React.ReactNode;
    color: string;
    benchmark?: string;
    benchmarkCalc?: (kpi: CreatorKPI) => string;
    type: "number" | "percent" | "currency";
}

const FUNNEL_STEPS: FunnelStep[] = [
    {
        key: "impressions",
        label: "Impressões",
        shortLabel: "Impr.",
        icon: <Eye className="w-4 h-4" />,
        color: "#818cf8",
        type: "number",
    },
    {
        key: "clicks",
        label: "Cliques",
        shortLabel: "Clicks",
        icon: <MousePointerClick className="w-4 h-4" />,
        color: "#60a5fa",
        type: "number",
        benchmark: "CTR 1-3%",
        benchmarkCalc: (k) => k.impressions ? `${((Number(k.clicks || 0) / Number(k.impressions)) * 100).toFixed(1)}%` : "—",
    },
    {
        key: "telegram_members",
        label: "Telegram Membros",
        shortLabel: "Telegram",
        icon: <Users className="w-4 h-4" />,
        color: "#22d3ee",
        type: "number",
        benchmark: "Conv. 10-20%",
        benchmarkCalc: (k) => k.clicks ? `${((Number(k.telegram_members || 0) / Number(k.clicks)) * 100).toFixed(1)}%` : "—",
    },
    {
        key: "downloads",
        label: "Downloads App",
        shortLabel: "Downloads",
        icon: <Smartphone className="w-4 h-4" />,
        color: "#34d399",
        type: "number",
    },
    {
        key: "kyc_completed",
        label: "KYC Completo",
        shortLabel: "KYC",
        icon: <ShieldCheck className="w-4 h-4" />,
        color: "#a78bfa",
        type: "number",
        benchmark: "40-65% downloads",
        benchmarkCalc: (k) => k.downloads ? `${((Number(k.kyc_completed || 0) / Number(k.downloads)) * 100).toFixed(1)}%` : "—",
    },
    {
        key: "first_deposit",
        label: "1º Depósito",
        shortLabel: "Depósito",
        icon: <Wallet className="w-4 h-4" />,
        color: "#fb923c",
        type: "number",
        benchmark: "30-50% KYC",
        benchmarkCalc: (k) => k.kyc_completed ? `${((Number(k.first_deposit || 0) / Number(k.kyc_completed)) * 100).toFixed(1)}%` : "—",
    },
    {
        key: "topup",
        label: "Top-up",
        shortLabel: "Top-up",
        icon: <CreditCard className="w-4 h-4" />,
        color: "#f472b6",
        type: "number",
        benchmark: "20-40% depósito",
        benchmarkCalc: (k) => k.first_deposit ? `${((Number(k.topup || 0) / Number(k.first_deposit)) * 100).toFixed(1)}%` : "—",
    },
    {
        key: "volume_usd",
        label: "Volume (USD)",
        shortLabel: "Volume",
        icon: <DollarSign className="w-4 h-4" />,
        color: "#4ade80",
        type: "currency",
    },
    {
        key: "recurrence_pct",
        label: "Recorrência",
        shortLabel: "Recorr.",
        icon: <RefreshCw className="w-4 h-4" />,
        color: "#fbbf24",
        type: "percent",
        benchmark: "Meta: 25-40%",
    },
];

const PERFORMANCE_FIELDS: FunnelStep[] = [
    {
        key: "cac_per_active_user",
        label: "CAC / Usuário Ativo",
        shortLabel: "CAC",
        icon: <Target className="w-4 h-4" />,
        color: "#f87171",
        type: "currency",
    },
    {
        key: "retention_30d_pct",
        label: "Retenção 30 dias",
        shortLabel: "Ret. 30d",
        icon: <TrendingUp className="w-4 h-4" />,
        color: "#34d399",
        type: "percent",
        benchmark: "15-25% recorrente",
    },
    {
        key: "ltv_projected",
        label: "LTV Projetado",
        shortLabel: "LTV",
        icon: <DollarSign className="w-4 h-4" />,
        color: "#818cf8",
        type: "currency",
    },
    {
        key: "score",
        label: "Score (1-10)",
        shortLabel: "Score",
        icon: <Star className="w-4 h-4" />,
        color: "#fbbf24",
        type: "number",
    },
];

// ==================== HELPERS ====================

const formatValue = (val: number | null | undefined, type: "number" | "percent" | "currency"): string => {
    if (val == null) return "—";
    if (type === "currency") return `$${Number(val).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
    if (type === "percent") return `${val}%`;
    if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M`;
    if (val >= 1_000) return `${(val / 1_000).toFixed(1)}K`;
    return val.toLocaleString("pt-BR");
};

const getVal = (kpi: CreatorKPI | undefined, field: keyof CreatorKPI): string => {
    if (!kpi) return "";
    const val = kpi[field];
    if (val === null || val === undefined) return "";
    return String(val);
};

// ==================== COMPONENT ====================

const CreatorKPIPage: React.FC = () => {
    const { entityType, entityId } = useParams<{ entityType: string; entityId: string }>();
    const printRef = useRef<HTMLDivElement>(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [entityName, setEntityName] = useState("");
    const [entityImage, setEntityImage] = useState("");
    const [kpi, setKpi] = useState<CreatorKPI>({
        entity_type: (entityType || "influencer") as EntityType,
        entity_id: entityId || "",
        period: new Date().toISOString().slice(0, 7),
    });
    const [editMode, setEditMode] = useState(false);

    // Posts state
    const [posts, setPosts] = useState<CreatorPost[]>([]);
    const [showAddPost, setShowAddPost] = useState(false);
    const [editingPostId, setEditingPostId] = useState<string | null>(null);
    const [editingPost, setEditingPost] = useState<Partial<CreatorPost>>({});
    const [newPost, setNewPost] = useState<Partial<CreatorPost>>({
        platform: "twitter",
        post_url: "",
        post_date: new Date().toISOString().slice(0, 10),
        description: "",
        impressions: 0,
        views: 0,
        clicks: 0,
        engagement: 0,
        conversions: 0,
    });

    useEffect(() => {
        if (entityType && entityId) loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [entityType, entityId]);

    const loadData = async () => {
        setLoading(true);
        try {
            let name = "", image = "";
            if (entityType === "influencer") {
                const items = await getInfluencers();
                const found = items.find((i) => i.id === entityId);
                name = found?.name || "Influencer";
                image = found?.image_url || "";
            } else if (entityType === "community") {
                const items = await getCommunities();
                const found = items.find((c) => c.id === entityId);
                name = found?.name || "Community";
                image = found?.image_url || "";
            } else if (entityType === "streamer") {
                const items = await getStreamers();
                const found = items.find((s) => s.id === entityId);
                name = found?.name || "Streamer";
                image = found?.image_url || "";
            }
            setEntityName(name);
            setEntityImage(image);

            const existing = await getCreatorKPIs(entityType as EntityType, entityId!);
            if (existing.length > 0) {
                setKpi(existing[0]);
            } else {
                setKpi({
                    entity_type: entityType as EntityType,
                    entity_id: entityId!,
                    period: new Date().toISOString().slice(0, 7),
                });
            }

            // Load posts
            const existingPosts = await getCreatorPosts(entityType as EntityType, entityId!);
            setPosts(existingPosts);
        } catch (error) {
            console.error("Error loading KPI data:", error);
            toast.error("Erro ao carregar dados");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field: keyof CreatorKPI, value: string) => {
        setKpi((prev) => ({
            ...prev,
            [field]: field === "notes" || field === "period" ? value : value === "" ? null : Number(value),
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const result = await upsertCreatorKPI(kpi);
            if (result) setKpi(result);
            toast.success("KPIs salvos com sucesso!");
            setEditMode(false);
        } catch (error) {
            console.error("Error saving KPIs:", error);
            toast.error("Erro ao salvar KPIs");
        } finally {
            setSaving(false);
        }
    };

    const handlePrint = () => window.print();

    const handleExportCSV = () => {
        const headers = ["Período", ...FUNNEL_STEPS.map((s) => s.label), ...PERFORMANCE_FIELDS.map((f) => f.label), "Notas"];
        const row = [
            kpi.period || "",
            ...FUNNEL_STEPS.map((s) => kpi[s.key] ?? ""),
            ...PERFORMANCE_FIELDS.map((f) => kpi[f.key] ?? ""),
            `"${(kpi.notes || "").replace(/"/g, '""')}"`,
        ].join(",");

        const csv = [headers.join(","), row].join("\n");
        const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `kpis_${entityName.replace(/\s+/g, "_").toLowerCase()}_${kpi.period || "all"}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success("CSV exportado!");
    };

    // Posts handlers
    const handleAddPost = async () => {
        if (!newPost.post_url) {
            toast.error("Cole o link do post");
            return;
        }
        try {
            const created = await addCreatorPost({
                entity_type: entityType as EntityType,
                entity_id: entityId!,
                platform: newPost.platform as PostPlatform,
                post_url: newPost.post_url || "",
                post_date: newPost.post_date || new Date().toISOString().slice(0, 10),
                description: newPost.description || null,
                impressions: Number(newPost.impressions) || 0,
                views: Number(newPost.views) || 0,
                clicks: Number(newPost.clicks) || 0,
                engagement: Number(newPost.engagement) || 0,
                conversions: Number(newPost.conversions) || 0,
            });
            if (created) {
                setPosts((prev) => [created, ...prev]);
                setNewPost({
                    platform: "twitter",
                    post_url: "",
                    post_date: new Date().toISOString().slice(0, 10),
                    description: "",
                    impressions: 0,
                    views: 0,
                    clicks: 0,
                    engagement: 0,
                    conversions: 0,
                });
                setShowAddPost(false);
                toast.success("Post adicionado!");
            }
        } catch (err) {
            toast.error("Erro ao adicionar post");
        }
    };

    const handleDeletePost = async (postId: string) => {
        try {
            await deleteCreatorPost(postId);
            setPosts((prev) => prev.filter((p) => p.id !== postId));
            toast.success("Post removido");
        } catch (err) {
            toast.error("Erro ao remover post");
        }
    };

    const handleStartEditPost = (post: CreatorPost) => {
        setEditingPostId(post.id || null);
        setEditingPost({ ...post });
    };

    const handleSaveEditPost = async () => {
        if (!editingPostId) return;
        try {
            const updated = await updateCreatorPost({
                ...editingPost,
                id: editingPostId,
                entity_type: (entityType || "influencer") as EntityType,
                entity_id: entityId || "",
                platform: (editingPost.platform || "twitter") as PostPlatform,
                post_url: editingPost.post_url || "",
                post_date: editingPost.post_date || new Date().toISOString().slice(0, 10),
                description: editingPost.description || null,
                impressions: Number(editingPost.impressions) || 0,
                views: Number(editingPost.views) || 0,
                clicks: Number(editingPost.clicks) || 0,
                engagement: Number(editingPost.engagement) || 0,
                conversions: Number(editingPost.conversions) || 0,
            } as CreatorPost);
            if (updated) {
                setPosts((prev) => prev.map((p) => (p.id === editingPostId ? updated : p)));
                toast.success("Post atualizado!");
            }
            setEditingPostId(null);
        } catch (err) {
            toast.error("Erro ao atualizar post");
        }
    };

    // Get embed for a post URL
    const getPostEmbed = (url: string, platform: PostPlatform) => {
        if (!url) return null;

        // Twitter/X embed
        if (platform === "twitter" || url.includes("twitter.com") || url.includes("x.com")) {
            const tweetMatch = url.match(/status\/(\d+)/);
            if (tweetMatch) {
                return (
                    <iframe
                        src={`https://platform.twitter.com/embed/Tweet.html?id=${tweetMatch[1]}&theme=dark`}
                        className="w-full h-[300px] rounded-lg border-0"
                        allowFullScreen
                    />
                );
            }
        }

        // YouTube embed
        if (platform === "youtube" || url.includes("youtube.com") || url.includes("youtu.be")) {
            let videoId = "";
            const ytMatch = url.match(/(?:v=|youtu\.be\/)([\w-]{11})/);
            if (ytMatch) videoId = ytMatch[1];
            if (videoId) {
                return (
                    <iframe
                        src={`https://www.youtube.com/embed/${videoId}`}
                        className="w-full h-[280px] rounded-lg border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                );
            }
        }

        // Instagram embed
        if (platform === "instagram" || url.includes("instagram.com")) {
            return (
                <iframe
                    src={`${url.replace(/\/$/, "")}/embed`}
                    className="w-full h-[400px] rounded-lg border-0"
                    allowFullScreen
                />
            );
        }

        // Generic link preview card
        return null;
    };

    const PLATFORM_LABELS: Record<PostPlatform, { label: string; emoji: string; color: string }> = {
        twitter: { label: "Twitter / X", emoji: "🐦", color: "#1da1f2" },
        telegram: { label: "Telegram", emoji: "📱", color: "#0088cc" },
        youtube: { label: "YouTube", emoji: "🎥", color: "#ff0000" },
        instagram: { label: "Instagram", emoji: "📸", color: "#e1306c" },
        tiktok: { label: "TikTok", emoji: "🎵", color: "#ff0050" },
        other: { label: "Outro", emoji: "🔗", color: "#94a3b8" },
    };

    // ==================== CHART DATA ====================

    const getFunnelChartData = () => {
        return FUNNEL_STEPS
            .filter((s) => s.type !== "percent")
            .map((s) => ({
                name: s.shortLabel,
                value: Number(kpi[s.key] || 0),
                fill: s.color,
            }));
    };

    const getConversionData = () => {
        const steps: { from: string; to: string; rate: number; color: string }[] = [];
        const pairs: [keyof CreatorKPI, keyof CreatorKPI, string, string][] = [
            ["impressions", "clicks", "Impressões → Cliques", "#60a5fa"],
            ["clicks", "telegram_members", "Cliques → Telegram", "#22d3ee"],
            ["downloads", "kyc_completed", "Downloads → KYC", "#a78bfa"],
            ["kyc_completed", "first_deposit", "KYC → Depósito", "#fb923c"],
            ["first_deposit", "topup", "Depósito → Top-up", "#f472b6"],
        ];
        for (const [fromKey, toKey, label, color] of pairs) {
            const from = Number(kpi[fromKey] || 0);
            const to = Number(kpi[toKey] || 0);
            if (from > 0) {
                steps.push({ from: label, to: label, rate: Math.round((to / from) * 100), color });
            }
        }
        return steps;
    };

    // ==================== RENDER ====================

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <>
            <style>{`
        @media print {
          body { background: white !important; color: black !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
          .dark { --background: 0 0% 100%; --foreground: 0 0% 10%; --card: 0 0% 97%; --card-foreground: 0 0% 10%; --muted-foreground: 0 0% 40%; --border: 0 0% 85%; }
        }
      `}</style>

            <div ref={printRef} className="min-h-screen bg-background">
                {/* HEADER */}
                <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10 no-print">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Link to="/dashboard">
                                    <Button variant="ghost" size="icon" className="rounded-full">
                                        <ArrowLeft className="w-5 h-5" />
                                    </Button>
                                </Link>
                                <div className="flex items-center gap-3">
                                    {entityImage && (
                                        <img src={entityImage} alt={entityName}
                                            className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/30"
                                            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                                        />
                                    )}
                                    <div>
                                        <h1 className="text-xl font-bold font-display">🎯 KPIs Rapidz</h1>
                                        <p className="text-sm text-muted-foreground">{entityName}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" className="gap-2" onClick={handlePrint}>
                                    <Printer className="w-4 h-4" />
                                    <span className="hidden sm:inline">Imprimir</span>
                                </Button>
                                <Button variant="outline" size="sm" className="gap-2" onClick={handleExportCSV}>
                                    <Download className="w-4 h-4" />
                                    <span className="hidden sm:inline">CSV</span>
                                </Button>
                                {editMode ? (
                                    <Button size="sm" className="gap-2" onClick={handleSave} disabled={saving}>
                                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <BarChart3 className="w-4 h-4" />}
                                        Salvar
                                    </Button>
                                ) : (
                                    <Button size="sm" variant="secondary" className="gap-2" onClick={() => setEditMode(true)}>
                                        ✏️ Editar
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* PRINT HEADER */}
                <div className="hidden print:block px-6 py-4 border-b">
                    <h1 className="text-2xl font-bold">🎯 KPIs Rapidz — {entityName}</h1>
                    <p className="text-sm text-muted-foreground mt-1">Gerado em {new Date().toLocaleDateString("pt-BR")}</p>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

                    {/* ===== PERIOD ===== */}
                    <div className="flex items-center gap-3 text-sm">
                        <span className="text-muted-foreground">📅 Período:</span>
                        {editMode ? (
                            <Input type="month" value={kpi.period || ""} onChange={(e) => handleChange("period", e.target.value)} className="w-44 h-8 text-sm" />
                        ) : (
                            <span className="font-semibold">
                                {kpi.period ? new Date(kpi.period + "-01").toLocaleDateString("pt-BR", { month: "long", year: "numeric" }) : "—"}
                            </span>
                        )}
                    </div>

                    {/* ===== NORTH STAR ===== */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                            { label: "Volume Mensal", value: kpi.volume_usd, type: "currency" as const, color: "#4ade80", icon: <DollarSign className="w-5 h-5" /> },
                            { label: "Recorrência", value: kpi.recurrence_pct, type: "percent" as const, color: "#fbbf24", icon: <RefreshCw className="w-5 h-5" /> },
                            { label: "Score Geral", value: kpi.score, type: "number" as const, color: "#f59e0b", icon: <Star className="w-5 h-5" /> },
                        ].map((ns) => (
                            <Card key={ns.label} className="bg-gradient-to-br from-card to-background border-border/50">
                                <CardContent className="p-5">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="p-2 rounded-xl" style={{ backgroundColor: ns.color + "15" }}>
                                            {React.cloneElement(ns.icon as React.ReactElement, { style: { color: ns.color } })}
                                        </div>
                                        <span className="text-sm font-medium text-muted-foreground">{ns.label}</span>
                                    </div>
                                    {editMode && ns.label !== "Score Geral" ? (
                                        <Input
                                            type="number" step={ns.type === "percent" ? "0.01" : "0.01"}
                                            value={getVal(kpi, ns.label === "Volume Mensal" ? "volume_usd" : "recurrence_pct")}
                                            onChange={(e) => handleChange(ns.label === "Volume Mensal" ? "volume_usd" : "recurrence_pct", e.target.value)}
                                            className="text-2xl font-bold h-12"
                                        />
                                    ) : editMode && ns.label === "Score Geral" ? (
                                        <Input type="number" min="1" max="10" value={getVal(kpi, "score")} onChange={(e) => handleChange("score", e.target.value)} className="text-2xl font-bold h-12" />
                                    ) : (
                                        <p className="text-3xl font-bold" style={{ color: ns.color }}>
                                            {formatValue(ns.value as number, ns.type)}
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* ===== FUNNEL VISUALIZATION ===== */}
                    <Card>
                        <CardContent className="p-5">
                            <h3 className="text-sm font-semibold mb-5 flex items-center gap-2">
                                <BarChart3 className="w-4 h-4 text-primary" />
                                🔻 Funil de Conversão
                            </h3>

                            {/* Funnel steps */}
                            <div className="space-y-2">
                                {FUNNEL_STEPS.map((step, idx) => {
                                    const val = Number(kpi[step.key] || 0);
                                    const maxVal = Math.max(...FUNNEL_STEPS.filter(s => s.type !== "percent").map((s) => Number(kpi[s.key] || 0)), 1);
                                    const widthPct = step.type === "percent" ? (val) : Math.max((val / maxVal) * 100, val > 0 ? 8 : 2);
                                    const conversionRate = step.benchmarkCalc ? step.benchmarkCalc(kpi) : null;

                                    return (
                                        <div key={step.key} className="group">
                                            <div className="flex items-center gap-3">
                                                {/* Icon */}
                                                <div className="p-1.5 rounded-lg flex-shrink-0" style={{ backgroundColor: step.color + "20" }}>
                                                    {React.cloneElement(step.icon as React.ReactElement, { style: { color: step.color } })}
                                                </div>

                                                {/* Label */}
                                                <div className="w-16 sm:w-32 flex-shrink-0">
                                                    <span className="text-xs font-medium hidden sm:inline">{step.label}</span>
                                                    <span className="text-[10px] font-medium sm:hidden">{step.shortLabel}</span>
                                                </div>

                                                {/* Bar */}
                                                <div className="flex-1 relative">
                                                    {editMode ? (
                                                        <Input
                                                            type="number"
                                                            step={step.type === "percent" ? "0.01" : "1"}
                                                            value={getVal(kpi, step.key)}
                                                            onChange={(e) => handleChange(step.key, e.target.value)}
                                                            className="h-8 text-sm"
                                                            placeholder="0"
                                                        />
                                                    ) : (
                                                        <div className="h-8 rounded-md overflow-hidden bg-muted/30 relative">
                                                            <div
                                                                className="h-full rounded-md transition-all duration-500 flex items-center px-3"
                                                                style={{
                                                                    width: `${Math.min(widthPct, 100)}%`,
                                                                    backgroundColor: step.color + "30",
                                                                    borderLeft: `3px solid ${step.color}`,
                                                                    minWidth: "60px",
                                                                }}
                                                            >
                                                                <span className="text-xs font-bold whitespace-nowrap" style={{ color: step.color }}>
                                                                    {formatValue(val, step.type)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Conversion rate badge */}
                                                <div className="hidden sm:block w-28 flex-shrink-0 text-right">
                                                    {conversionRate && conversionRate !== "—" && !editMode && (
                                                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                                                            conv: {conversionRate}
                                                        </span>
                                                    )}
                                                    {step.benchmark && !editMode && (
                                                        <p className="text-[9px] text-muted-foreground/50 mt-0.5">{step.benchmark}</p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Arrow between steps */}
                                            {idx < FUNNEL_STEPS.length - 1 && (
                                                <div className="flex items-center ml-[22px] my-0.5">
                                                    <ChevronRight className="w-3 h-3 text-muted-foreground/30 rotate-90" />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    {/* ===== CHARTS + PERFORMANCE ===== */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                        {/* Bar Chart */}
                        <Card>
                            <CardContent className="p-5">
                                <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                                    <BarChart3 className="w-4 h-4 text-primary" />
                                    Funil — Valores Absolutos
                                </h3>
                                <div className="h-[280px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={getFunnelChartData()} barSize={32}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 20%)" />
                                            <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(0 0% 65%)" }} />
                                            <YAxis tick={{ fontSize: 10, fill: "hsl(0 0% 65%)" }} />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: "hsl(0 0% 10%)", border: "1px solid hsl(0 0% 20%)", borderRadius: "8px", fontSize: "12px" }}
                                                labelStyle={{ color: "hsl(0 0% 90%)" }}
                                            />
                                            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                                                {getFunnelChartData().map((entry, idx) => (
                                                    <Cell key={idx} fill={entry.fill} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Conversion Rates + Performance */}
                        <Card>
                            <CardContent className="p-5">
                                <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                                    <Target className="w-4 h-4 text-primary" />
                                    Taxas de Conversão
                                </h3>
                                <div className="space-y-3 mb-6">
                                    {getConversionData().length > 0 ? (
                                        getConversionData().map((conv) => (
                                            <div key={conv.from} className="flex items-center gap-3">
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="text-xs text-muted-foreground">{conv.from}</span>
                                                        <span className="text-xs font-bold" style={{ color: conv.color }}>{conv.rate}%</span>
                                                    </div>
                                                    <div className="h-2 rounded-full bg-muted/30 overflow-hidden">
                                                        <div
                                                            className="h-full rounded-full transition-all duration-700"
                                                            style={{ width: `${Math.min(conv.rate, 100)}%`, backgroundColor: conv.color }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-xs text-muted-foreground/50 text-center py-4">
                                            Preencha os dados do funil para ver as taxas de conversão
                                        </p>
                                    )}
                                </div>

                                {/* Performance metrics */}
                                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2 pt-3 border-t border-border">
                                    <Star className="w-4 h-4 text-primary" />
                                    Creator Performance
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {PERFORMANCE_FIELDS.map((field) => (
                                        <div key={field.key} className="rounded-lg border border-border/30 p-3 bg-gradient-to-br from-card to-background">
                                            <div className="flex items-center gap-1.5 mb-1.5">
                                                <div className="p-1 rounded" style={{ backgroundColor: field.color + "15" }}>
                                                    {React.cloneElement(field.icon as React.ReactElement, { className: "w-3 h-3", style: { color: field.color } })}
                                                </div>
                                                <span className="text-[10px] text-muted-foreground font-medium">{field.label}</span>
                                            </div>
                                            {editMode ? (
                                                <Input
                                                    type="number"
                                                    step={field.type === "percent" ? "0.01" : "0.01"}
                                                    value={getVal(kpi, field.key)}
                                                    onChange={(e) => handleChange(field.key, e.target.value)}
                                                    className="h-8 text-sm font-bold"
                                                />
                                            ) : (
                                                <p className="text-lg font-bold" style={{ color: field.color }}>
                                                    {formatValue(kpi[field.key] as number, field.type)}
                                                </p>
                                            )}
                                            {field.benchmark && !editMode && (
                                                <p className="text-[9px] text-muted-foreground/50 mt-0.5">{field.benchmark}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* ===== NOTES ===== */}
                    <Card>
                        <CardContent className="p-5">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="p-1.5 rounded-lg bg-muted">
                                    <MessageSquare className="w-4 h-4 text-muted-foreground" />
                                </div>
                                <h3 className="text-sm font-semibold">Notas & Observações</h3>
                            </div>
                            {editMode ? (
                                <textarea
                                    value={kpi.notes || ""}
                                    onChange={(e) => handleChange("notes", e.target.value)}
                                    className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    placeholder="Observações sobre o creator, estratégia, próximos passos..."
                                />
                            ) : (
                                <p className="text-sm whitespace-pre-wrap text-foreground/80">
                                    {kpi.notes || "Nenhuma nota adicionada."}
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    {/* ===== TELEGRAM ENGAGEMENT ===== */}
                    {!editMode && (
                        <Card className="border-cyan-500/20 bg-gradient-to-br from-cyan-500/5 to-transparent">
                            <CardContent className="p-5">
                                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                    📱 Telegram — Engajamento
                                </h3>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    <div>
                                        <p className="text-xs text-muted-foreground">Membros</p>
                                        <p className="text-xl font-bold text-cyan-400">{formatValue(kpi.telegram_members as number, "number")}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Engajamento</p>
                                        {editMode ? (
                                            <Input type="number" step="0.01" value={getVal(kpi, "telegram_engagement_pct")} onChange={(e) => handleChange("telegram_engagement_pct", e.target.value)} className="h-8 text-sm" />
                                        ) : (
                                            <p className="text-xl font-bold text-cyan-400">{formatValue(kpi.telegram_engagement_pct as number, "percent")}</p>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Benchmark</p>
                                        <p className="text-sm text-muted-foreground/70">15-30% ativo</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Retenção 30d</p>
                                        <p className="text-sm text-muted-foreground/70">Meta: &gt;50%</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* ===== POSTS & AÇÕES ===== */}
                    <Card>
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-semibold flex items-center gap-2">
                                    <Link2 className="w-4 h-4 text-primary" />
                                    📝 Posts & Ações do Creator
                                </h3>
                                <Button size="sm" variant="outline" className="gap-2" onClick={() => setShowAddPost(!showAddPost)}>
                                    <Plus className="w-4 h-4" />
                                    Adicionar Post
                                </Button>
                            </div>

                            {/* Add post form */}
                            {showAddPost && (
                                <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent p-4 mb-4 space-y-3">
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        <div>
                                            <label className="text-[10px] text-muted-foreground font-medium mb-1 block">Plataforma</label>
                                            <select
                                                value={newPost.platform || "twitter"}
                                                onChange={(e) => setNewPost((p) => ({ ...p, platform: e.target.value as PostPlatform }))}
                                                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                                            >
                                                {Object.entries(PLATFORM_LABELS).map(([key, val]) => (
                                                    <option key={key} value={key}>{val.emoji} {val.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-muted-foreground font-medium mb-1 block">Data</label>
                                            <Input type="date" value={newPost.post_date || ""} onChange={(e) => setNewPost((p) => ({ ...p, post_date: e.target.value }))} className="h-9" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-muted-foreground font-medium mb-1 block">🔗 Link do Post</label>
                                            <Input placeholder="https://x.com/..." value={newPost.post_url || ""} onChange={(e) => setNewPost((p) => ({ ...p, post_url: e.target.value }))} className="h-9" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-muted-foreground font-medium mb-1 block">Descrição</label>
                                        <Input placeholder="Ex: Thread sobre cartão Rapidz" value={newPost.description || ""} onChange={(e) => setNewPost((p) => ({ ...p, description: e.target.value }))} />
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                                        {[
                                            { key: "impressions", label: "Impressões", icon: "👁" },
                                            { key: "views", label: "Visualizações", icon: "▶" },
                                            { key: "clicks", label: "Cliques", icon: "🖱" },
                                            { key: "engagement", label: "Engajamento", icon: "💬" },
                                            { key: "conversions", label: "Conversões", icon: "🎯" },
                                        ].map((m) => (
                                            <div key={m.key}>
                                                <label className="text-[10px] text-muted-foreground font-medium mb-1 block">{m.icon} {m.label}</label>
                                                <Input
                                                    type="number"
                                                    value={newPost[m.key as keyof typeof newPost] || 0}
                                                    onChange={(e) => setNewPost((p) => ({ ...p, [m.key]: Number(e.target.value) }))}
                                                    className="h-8 text-sm"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex gap-2 justify-end">
                                        <Button size="sm" variant="ghost" onClick={() => setShowAddPost(false)}>Cancelar</Button>
                                        <Button size="sm" className="gap-2" onClick={handleAddPost}>
                                            <Plus className="w-4 h-4" />
                                            Salvar Post
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Posts list */}
                            {posts.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground/50">
                                    <Link2 className="w-8 h-8 mx-auto mb-2 opacity-30" />
                                    <p className="text-sm">Nenhum post registrado ainda.</p>
                                    <p className="text-xs mt-1">Clique em "Adicionar Post" para começar a trackar.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {/* Quick stats */}
                                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                                        {[
                                            { label: "Total Impressões", value: posts.reduce((s, p) => s + (p.impressions || 0), 0), color: "#818cf8" },
                                            { label: "Total Views", value: posts.reduce((s, p) => s + (p.views || 0), 0), color: "#60a5fa" },
                                            { label: "Total Cliques", value: posts.reduce((s, p) => s + (p.clicks || 0), 0), color: "#34d399" },
                                            { label: "Total Engajam.", value: posts.reduce((s, p) => s + (p.engagement || 0), 0), color: "#fbbf24" },
                                            { label: "Total Conversões", value: posts.reduce((s, p) => s + (p.conversions || 0), 0), color: "#f87171" },
                                        ].map((stat) => (
                                            <div key={stat.label} className="rounded-lg border border-border/30 p-2 text-center bg-card">
                                                <p className="text-[9px] text-muted-foreground">{stat.label}</p>
                                                <p className="text-sm font-bold" style={{ color: stat.color }}>{formatValue(stat.value, "number")}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Posts chart */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                        {/* Bar chart - metrics per post */}
                                        <Card className="border-border/30">
                                            <CardContent className="p-4">
                                                <h4 className="text-xs font-semibold mb-3 flex items-center gap-2 text-muted-foreground">
                                                    <BarChart3 className="w-3.5 h-3.5 text-primary" />
                                                    Métricas por Post
                                                </h4>
                                                <div className="h-[220px]">
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <BarChart
                                                            data={posts.map((p, i) => ({
                                                                name: p.description?.slice(0, 15) || `Post ${i + 1}`,
                                                                Impressões: p.impressions || 0,
                                                                Views: p.views || 0,
                                                                Cliques: p.clicks || 0,
                                                                Engajamento: p.engagement || 0,
                                                                Conversões: p.conversions || 0,
                                                            }))}
                                                            barSize={12}
                                                        >
                                                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 20%)" />
                                                            <XAxis dataKey="name" tick={{ fontSize: 9, fill: "hsl(0 0% 65%)" }} />
                                                            <YAxis tick={{ fontSize: 9, fill: "hsl(0 0% 65%)" }} />
                                                            <Tooltip
                                                                contentStyle={{ backgroundColor: "hsl(0 0% 10%)", border: "1px solid hsl(0 0% 20%)", borderRadius: "8px", fontSize: "11px" }}
                                                                labelStyle={{ color: "hsl(0 0% 90%)" }}
                                                            />
                                                            <Bar dataKey="Impressões" fill="#818cf8" radius={[3, 3, 0, 0]} />
                                                            <Bar dataKey="Views" fill="#60a5fa" radius={[3, 3, 0, 0]} />
                                                            <Bar dataKey="Cliques" fill="#34d399" radius={[3, 3, 0, 0]} />
                                                            <Bar dataKey="Engajamento" fill="#fbbf24" radius={[3, 3, 0, 0]} />
                                                            <Bar dataKey="Conversões" fill="#f87171" radius={[3, 3, 0, 0]} />
                                                        </BarChart>
                                                    </ResponsiveContainer>
                                                </div>
                                                {/* Legend */}
                                                <div className="flex flex-wrap gap-3 mt-2 justify-center">
                                                    {[
                                                        { label: "Impressões", color: "#818cf8" },
                                                        { label: "Views", color: "#60a5fa" },
                                                        { label: "Cliques", color: "#34d399" },
                                                        { label: "Engajamento", color: "#fbbf24" },
                                                        { label: "Conversões", color: "#f87171" },
                                                    ].map((l) => (
                                                        <div key={l.label} className="flex items-center gap-1">
                                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: l.color }} />
                                                            <span className="text-[9px] text-muted-foreground">{l.label}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* Posts timeline / platform breakdown */}
                                        <Card className="border-border/30">
                                            <CardContent className="p-4">
                                                <h4 className="text-xs font-semibold mb-3 flex items-center gap-2 text-muted-foreground">
                                                    <Target className="w-3.5 h-3.5 text-primary" />
                                                    Performance por Plataforma
                                                </h4>
                                                <div className="space-y-3">
                                                    {(() => {
                                                        const platformStats: Record<string, { impressions: number; views: number; clicks: number; count: number }> = {};
                                                        posts.forEach((p) => {
                                                            if (!platformStats[p.platform]) platformStats[p.platform] = { impressions: 0, views: 0, clicks: 0, count: 0 };
                                                            platformStats[p.platform].impressions += p.impressions || 0;
                                                            platformStats[p.platform].views += p.views || 0;
                                                            platformStats[p.platform].clicks += p.clicks || 0;
                                                            platformStats[p.platform].count += 1;
                                                        });
                                                        const maxImpressions = Math.max(...Object.values(platformStats).map((s) => s.impressions), 1);

                                                        return Object.entries(platformStats).map(([platform, stats]) => {
                                                            const info = PLATFORM_LABELS[platform as PostPlatform] || PLATFORM_LABELS.other;
                                                            const ctr = stats.impressions > 0 ? ((stats.clicks / stats.impressions) * 100).toFixed(1) : "0";
                                                            return (
                                                                <div key={platform}>
                                                                    <div className="flex items-center justify-between mb-1">
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: info.color + "20", color: info.color }}>
                                                                                {info.emoji} {info.label}
                                                                            </span>
                                                                            <span className="text-[10px] text-muted-foreground">{stats.count} post{stats.count > 1 ? "s" : ""}</span>
                                                                        </div>
                                                                        <div className="flex items-center gap-3 text-[10px]">
                                                                            <span className="text-muted-foreground">👁 {formatValue(stats.impressions, "number")}</span>
                                                                            <span className="text-muted-foreground">▶ {formatValue(stats.views, "number")}</span>
                                                                            <span className="font-bold" style={{ color: info.color }}>CTR {ctr}%</span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="h-3 rounded-full bg-muted/30 overflow-hidden">
                                                                        <div
                                                                            className="h-full rounded-full transition-all duration-500"
                                                                            style={{
                                                                                width: `${Math.max((stats.impressions / maxImpressions) * 100, 5)}%`,
                                                                                backgroundColor: info.color + "60",
                                                                            }}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            );
                                                        });
                                                    })()}
                                                </div>

                                                {/* Total summary */}
                                                <div className="mt-4 pt-3 border-t border-border/30">
                                                    <div className="grid grid-cols-3 gap-2 text-center">
                                                        <div>
                                                            <p className="text-[9px] text-muted-foreground">Total Posts</p>
                                                            <p className="text-lg font-bold text-primary">{posts.length}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[9px] text-muted-foreground">Avg. Views/Post</p>
                                                            <p className="text-lg font-bold text-blue-400">
                                                                {formatValue(Math.round(posts.reduce((s, p) => s + (p.views || 0), 0) / posts.length), "number")}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[9px] text-muted-foreground">CTR Geral</p>
                                                            <p className="text-lg font-bold text-green-400">
                                                                {posts.reduce((s, p) => s + (p.impressions || 0), 0) > 0
                                                                    ? ((posts.reduce((s, p) => s + (p.clicks || 0), 0) / posts.reduce((s, p) => s + (p.impressions || 0), 0)) * 100).toFixed(1)
                                                                    : "0"}%
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    {/* Post cards */}
                                    {posts.map((post) => {
                                        const isEditing = editingPostId === post.id;
                                        const ep = isEditing ? editingPost : post;
                                        const platformInfo = PLATFORM_LABELS[(ep.platform || post.platform) as PostPlatform] || PLATFORM_LABELS.other;
                                        const embed = !isEditing ? getPostEmbed(post.post_url, post.platform as PostPlatform) : null;

                                        return (
                                            <div key={post.id} className={`rounded-xl border bg-gradient-to-br from-card to-background overflow-hidden ${isEditing ? 'border-primary/40 ring-1 ring-primary/20' : 'border-border/40'}`}>
                                                {/* Post header */}
                                                <div className="p-4 flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        {isEditing ? (
                                                            <select
                                                                value={ep.platform || "twitter"}
                                                                onChange={(e) => setEditingPost((p) => ({ ...p, platform: e.target.value as PostPlatform }))}
                                                                className="flex h-8 rounded-md border border-input bg-background px-2 text-xs"
                                                            >
                                                                {Object.entries(PLATFORM_LABELS).map(([key, val]) => (
                                                                    <option key={key} value={key}>{val.emoji} {val.label}</option>
                                                                ))}
                                                            </select>
                                                        ) : (
                                                            <span
                                                                className="text-xs font-bold px-2.5 py-1 rounded-full"
                                                                style={{ backgroundColor: platformInfo.color + "20", color: platformInfo.color }}
                                                            >
                                                                {platformInfo.emoji} {platformInfo.label}
                                                            </span>
                                                        )}
                                                        {isEditing ? (
                                                            <Input type="date" value={ep.post_date || ""} onChange={(e) => setEditingPost((p) => ({ ...p, post_date: e.target.value }))} className="h-8 w-40 text-xs" />
                                                        ) : (
                                                            <span className="text-xs text-muted-foreground">
                                                                {new Date(post.post_date + "T12:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        {isEditing ? (
                                                            <>
                                                                <Button variant="ghost" size="icon" className="h-7 w-7 text-green-500 hover:text-green-400" onClick={() => handleSaveEditPost()}>
                                                                    <Check className="w-3.5 h-3.5" />
                                                                </Button>
                                                                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground" onClick={() => setEditingPostId(null)}>
                                                                    <X className="w-3.5 h-3.5" />
                                                                </Button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                {post.post_url && (
                                                                    <a href={post.post_url} target="_blank" rel="noopener noreferrer">
                                                                        <Button variant="ghost" size="icon" className="h-7 w-7">
                                                                            <ExternalLink className="w-3.5 h-3.5" />
                                                                        </Button>
                                                                    </a>
                                                                )}
                                                                <Button variant="ghost" size="icon" className="h-7 w-7 text-primary hover:text-primary" onClick={() => handleStartEditPost(post)}>
                                                                    <Pencil className="w-3.5 h-3.5" />
                                                                </Button>
                                                                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => post.id && handleDeletePost(post.id)}>
                                                                    <Trash2 className="w-3.5 h-3.5" />
                                                                </Button>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* URL + Description */}
                                                {isEditing ? (
                                                    <div className="px-4 pb-3 space-y-2">
                                                        <div>
                                                            <label className="text-[10px] text-muted-foreground font-medium mb-1 block">🔗 Link</label>
                                                            <Input value={ep.post_url || ""} onChange={(e) => setEditingPost((p) => ({ ...p, post_url: e.target.value }))} className="h-8 text-xs" placeholder="https://..." />
                                                        </div>
                                                        <div>
                                                            <label className="text-[10px] text-muted-foreground font-medium mb-1 block">Descrição</label>
                                                            <Input value={ep.description || ""} onChange={(e) => setEditingPost((p) => ({ ...p, description: e.target.value }))} className="h-8 text-xs" placeholder="Descrição do post..." />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <>
                                                        {post.description && (
                                                            <div className="px-4 pb-2">
                                                                <p className="text-sm text-foreground/80">{post.description}</p>
                                                            </div>
                                                        )}
                                                        {embed && (
                                                            <div className="px-4 pb-3">
                                                                {embed}
                                                            </div>
                                                        )}
                                                        {!embed && post.post_url && (
                                                            <div className="mx-4 mb-3 rounded-lg border border-border/30 bg-muted/20 p-3">
                                                                <a href={post.post_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-primary hover:underline">
                                                                    <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                                                                    <span className="truncate">{post.post_url}</span>
                                                                </a>
                                                            </div>
                                                        )}
                                                    </>
                                                )}

                                                {/* Metrics bar */}
                                                <div className="border-t border-border/30 bg-card/50 px-3 sm:px-4 py-2.5 grid grid-cols-3 sm:grid-cols-5 gap-2 text-center">
                                                    {[
                                                        { key: "impressions", label: "Impressões", icon: "👁" },
                                                        { key: "views", label: "Views", icon: "▶" },
                                                        { key: "clicks", label: "Cliques", icon: "🖱" },
                                                        { key: "engagement", label: "Engajam.", icon: "💬" },
                                                        { key: "conversions", label: "Conversões", icon: "🎯" },
                                                    ].map((m) => (
                                                        <div key={m.key}>
                                                            <p className="text-[9px] text-muted-foreground">{m.icon} {m.label}</p>
                                                            {isEditing ? (
                                                                <Input
                                                                    type="number"
                                                                    value={ep[m.key as keyof CreatorPost] as number || 0}
                                                                    onChange={(e) => setEditingPost((p) => ({ ...p, [m.key]: Number(e.target.value) }))}
                                                                    className="h-7 text-xs text-center mt-0.5"
                                                                />
                                                            ) : (
                                                                <p className="text-xs font-bold">{formatValue(post[m.key as keyof CreatorPost] as number, "number")}</p>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                </div>
            </div>
        </>
    );
};

export default CreatorKPIPage;
