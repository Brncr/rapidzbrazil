import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
    ArrowLeft,
    Loader2,
    Plus,
    Trash2,
    Check,
    Clock,
    Target,
    CalendarDays,
    Pencil,
    X,
    ChevronRight,
    Flag,
    ListChecks,
    Clipboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
    EntityType,
    PostPlatform,
    CreatorScope,
    CreatorTask,
    TaskStatus,
    TaskPriority,
    getCreatorScopes,
    upsertCreatorScope,
    deleteCreatorScope,
    getCreatorTasks,
    addCreatorTask,
    updateCreatorTask,
    deleteCreatorTask,
    getInfluencers,
    getCommunities,
    getStreamers,
} from "@/lib/entityData";

// ==================== CONSTANTS ====================

const PLATFORMS: { key: PostPlatform; label: string; emoji: string; color: string }[] = [
    { key: "twitter", label: "Twitter / X", emoji: "🐦", color: "#1da1f2" },
    { key: "telegram", label: "Telegram", emoji: "📱", color: "#0088cc" },
    { key: "youtube", label: "YouTube", emoji: "🎥", color: "#ff0000" },
    { key: "instagram", label: "Instagram", emoji: "📸", color: "#e1306c" },
    { key: "tiktok", label: "TikTok", emoji: "🎵", color: "#ff0050" },
    { key: "other", label: "Outro", emoji: "🔗", color: "#94a3b8" },
];

const STATUS_CONFIG: Record<TaskStatus, { label: string; emoji: string; color: string; bg: string }> = {
    pending: { label: "A Fazer", emoji: "⏳", color: "#fbbf24", bg: "rgba(251,191,36,0.08)" },
    in_progress: { label: "Em Andamento", emoji: "🔄", color: "#60a5fa", bg: "rgba(96,165,250,0.08)" },
    done: { label: "Concluído", emoji: "✅", color: "#34d399", bg: "rgba(52,211,153,0.08)" },
};

const PRIORITY_CONFIG: Record<TaskPriority, { label: string; emoji: string; color: string }> = {
    low: { label: "Baixa", emoji: "🟢", color: "#34d399" },
    medium: { label: "Média", emoji: "🟡", color: "#fbbf24" },
    high: { label: "Alta", emoji: "🔴", color: "#f87171" },
};

const FREQUENCY_OPTIONS = ["Diário", "2x/semana", "3x/semana", "Semanal", "Quinzenal", "Mensal"];
const FORMAT_OPTIONS: Record<string, string[]> = {
    twitter: ["Thread", "Tweet", "Poll", "Space"],
    telegram: ["Post", "Enquete", "Tutorial", "Alerta"],
    youtube: ["Vídeo", "Short", "Live", "Review"],
    instagram: ["Post", "Reels", "Stories", "Carousel"],
    tiktok: ["Vídeo", "Trend", "Tutorial", "Live"],
    other: ["Post", "Artigo", "Newsletter"],
};

// ==================== COMPONENT ====================

const CreatorScopePage: React.FC = () => {
    const { entityType, entityId } = useParams<{ entityType: string; entityId: string }>();
    const [loading, setLoading] = useState(true);
    const [entityName, setEntityName] = useState("");
    const [entityImage, setEntityImage] = useState("");
    const [period, setPeriod] = useState(new Date().toISOString().slice(0, 7));

    // Scopes & Tasks
    const [scopes, setScopes] = useState<CreatorScope[]>([]);
    const [tasks, setTasks] = useState<CreatorTask[]>([]);

    // Add scope form
    const [showAddScope, setShowAddScope] = useState(false);
    const [newScopePlatform, setNewScopePlatform] = useState<PostPlatform>("twitter");

    // Add task form
    const [showAddTask, setShowAddTask] = useState(false);
    const [newTask, setNewTask] = useState<Partial<CreatorTask>>({
        title: "",
        platform: "twitter",
        priority: "medium",
        due_date: "",
        notes: "",
    });

    // Edit scope
    const [editingScopeId, setEditingScopeId] = useState<string | null>(null);
    const [editingScope, setEditingScope] = useState<Partial<CreatorScope>>({});

    useEffect(() => {
        if (entityType && entityId) loadData();
    }, [entityType, entityId, period]);

    const loadData = async () => {
        setLoading(true);
        try {
            // Get entity name
            let entities: any[] = [];
            if (entityType === "influencer") entities = await getInfluencers();
            else if (entityType === "community") entities = await getCommunities();
            else if (entityType === "streamer") entities = await getStreamers();
            const ent = entities.find((e: any) => e.id === entityId);
            if (ent) {
                setEntityName(ent.name || "");
                setEntityImage(ent.image_url || "");
            }

            const [existingScopes, existingTasks] = await Promise.all([
                getCreatorScopes(entityType as EntityType, entityId!, period),
                getCreatorTasks(entityType as EntityType, entityId!),
            ]);
            setScopes(existingScopes);
            setTasks(existingTasks);
        } catch (error) {
            console.error("Error loading scope data:", error);
            toast.error("Erro ao carregar dados");
        } finally {
            setLoading(false);
        }
    };

    // ==================== HANDLERS ====================

    const handleAddScope = async () => {
        const exists = scopes.find((s) => s.platform === newScopePlatform);
        if (exists) {
            toast.error("Plataforma já adicionada nesse período");
            return;
        }
        try {
            const created = await upsertCreatorScope({
                entity_type: entityType as EntityType,
                entity_id: entityId!,
                period,
                platform: newScopePlatform,
                post_count: 0,
                frequency: "",
                themes: "",
                formats: "",
            });
            if (created) {
                setScopes((prev) => [...prev, created]);
                setShowAddScope(false);
                toast.success("Plataforma adicionada ao escopo!");
            }
        } catch (err) {
            toast.error("Erro ao adicionar escopo");
        }
    };

    const handleSaveScope = async (scope: CreatorScope) => {
        try {
            const updated = await upsertCreatorScope(scope);
            if (updated) {
                setScopes((prev) => prev.map((s) => (s.id === scope.id ? updated : s)));
                setEditingScopeId(null);
                toast.success("Escopo salvo!");
            }
        } catch (err) {
            toast.error("Erro ao salvar escopo");
        }
    };

    const handleDeleteScope = async (scopeId: string) => {
        try {
            await deleteCreatorScope(scopeId);
            setScopes((prev) => prev.filter((s) => s.id !== scopeId));
            toast.success("Escopo removido");
        } catch (err) {
            toast.error("Erro ao remover escopo");
        }
    };

    const handleAddTask = async () => {
        if (!newTask.title) {
            toast.error("Título obrigatório");
            return;
        }
        try {
            const created = await addCreatorTask({
                entity_type: entityType as EntityType,
                entity_id: entityId!,
                title: newTask.title || "",
                platform: (newTask.platform || "twitter") as PostPlatform,
                status: "pending",
                priority: (newTask.priority || "medium") as TaskPriority,
                due_date: newTask.due_date || null,
                notes: newTask.notes || null,
            });
            if (created) {
                setTasks((prev) => [...prev, created]);
                setNewTask({ title: "", platform: "twitter", priority: "medium", due_date: "", notes: "" });
                setShowAddTask(false);
                toast.success("Tarefa adicionada!");
            }
        } catch (err) {
            toast.error("Erro ao adicionar tarefa");
        }
    };

    const handleUpdateTaskStatus = async (task: CreatorTask, newStatus: TaskStatus) => {
        try {
            const updated = await updateCreatorTask({
                ...task,
                status: newStatus,
                completed_at: newStatus === "done" ? new Date().toISOString() : null,
            });
            if (updated) {
                setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)));
            }
        } catch (err) {
            toast.error("Erro ao atualizar tarefa");
        }
    };

    const handleDeleteTask = async (taskId: string) => {
        try {
            await deleteCreatorTask(taskId);
            setTasks((prev) => prev.filter((t) => t.id !== taskId));
            toast.success("Tarefa removida");
        } catch (err) {
            toast.error("Erro ao remover tarefa");
        }
    };

    // ==================== COMPUTED ====================

    const totalTasks = tasks.length;
    const doneTasks = tasks.filter((t) => t.status === "done").length;
    const inProgressTasks = tasks.filter((t) => t.status === "in_progress").length;
    const pendingTasks = tasks.filter((t) => t.status === "pending").length;
    const progressPct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

    const totalPlannedPosts = scopes.reduce((s, sc) => s + (sc.post_count || 0), 0);

    const getPlatformInfo = (platform: string) => PLATFORMS.find((p) => p.key === platform) || PLATFORMS[5];

    const cycleStatus = (current: TaskStatus): TaskStatus => {
        if (current === "pending") return "in_progress";
        if (current === "in_progress") return "done";
        return "pending";
    };

    // ==================== LOADING ====================

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    // ==================== RENDER ====================

    return (
        <>
            <div className="min-h-screen bg-background p-4 sm:p-6 max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6 print:mb-2">
                    <div className="flex items-center gap-4">
                        <Link to="/dashboard">
                            <Button variant="ghost" size="icon"><ArrowLeft className="w-5 h-5" /></Button>
                        </Link>
                        {entityImage && (
                            <img src={entityImage} alt="" className="w-10 h-10 rounded-full object-cover border-2 border-primary/30" />
                        )}
                        <div>
                            <h1 className="text-lg font-bold flex items-center gap-2">
                                📋 Escopo & Tarefas
                            </h1>
                            <p className="text-xs text-muted-foreground">{entityName}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Input
                            type="month"
                            value={period}
                            onChange={(e) => setPeriod(e.target.value)}
                            className="h-9 w-40 text-sm"
                        />
                        <Link to={`/kpis/${entityType}/${entityId}`}>
                            <Button variant="outline" size="sm" className="gap-2">
                                📊 KPIs
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Progress Overview */}
                <Card className="mb-6">
                    <CardContent className="p-5">
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                            <div className="col-span-2 sm:col-span-1">
                                <p className="text-[10px] text-muted-foreground mb-1">Progresso Geral</p>
                                <p className="text-3xl font-black text-primary">{progressPct}%</p>
                                <div className="h-2 rounded-full bg-muted/30 mt-2 overflow-hidden">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-primary to-green-400 transition-all duration-700"
                                        style={{ width: `${progressPct}%` }}
                                    />
                                </div>
                            </div>
                            {[
                                { label: "Posts Planejados", value: totalPlannedPosts, color: "#818cf8", icon: "📝" },
                                { label: "A Fazer", value: pendingTasks, color: "#fbbf24", icon: "⏳" },
                                { label: "Em Andamento", value: inProgressTasks, color: "#60a5fa", icon: "🔄" },
                                { label: "Concluídas", value: doneTasks, color: "#34d399", icon: "✅" },
                            ].map((stat) => (
                                <div key={stat.label} className="text-center">
                                    <p className="text-[10px] text-muted-foreground">{stat.icon} {stat.label}</p>
                                    <p className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Scope per Platform */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-sm font-semibold flex items-center gap-2">
                            <Target className="w-4 h-4 text-primary" />
                            🎯 Escopo por Plataforma
                        </h2>
                        <Button size="sm" variant="outline" className="gap-2" onClick={() => setShowAddScope(!showAddScope)}>
                            <Plus className="w-4 h-4" /> Plataforma
                        </Button>
                    </div>

                    {showAddScope && (
                        <Card className="mb-3 border-primary/20">
                            <CardContent className="p-4 flex items-center gap-3">
                                <select
                                    value={newScopePlatform}
                                    onChange={(e) => setNewScopePlatform(e.target.value as PostPlatform)}
                                    className="flex h-9 rounded-md border border-input bg-background px-3 text-sm"
                                >
                                    {PLATFORMS.map((p) => (
                                        <option key={p.key} value={p.key}>{p.emoji} {p.label}</option>
                                    ))}
                                </select>
                                <Button size="sm" onClick={handleAddScope} className="gap-2">
                                    <Plus className="w-4 h-4" /> Adicionar
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => setShowAddScope(false)}>Cancelar</Button>
                            </CardContent>
                        </Card>
                    )}

                    {scopes.length === 0 ? (
                        <Card>
                            <CardContent className="p-8 text-center text-muted-foreground/50">
                                <Clipboard className="w-8 h-8 mx-auto mb-2 opacity-30" />
                                <p className="text-sm">Nenhuma plataforma no escopo.</p>
                                <p className="text-xs mt-1">Clique em "Plataforma" para definir o escopo de trabalho.</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {scopes.map((scope) => {
                                const info = getPlatformInfo(scope.platform);
                                const isEditing = editingScopeId === scope.id;
                                const sc = isEditing ? editingScope : scope;
                                const platformTasks = tasks.filter((t) => t.platform === scope.platform);
                                const platformDone = platformTasks.filter((t) => t.status === "done").length;
                                const platformPct = platformTasks.length > 0 ? Math.round((platformDone / platformTasks.length) * 100) : 0;

                                return (
                                    <Card key={scope.id} className={`overflow-hidden transition-all ${isEditing ? "border-primary/40 ring-1 ring-primary/20" : "border-border/40"}`}>
                                        {/* Platform header */}
                                        <div className="px-4 py-3 flex items-center justify-between" style={{ backgroundColor: info.color + "08" }}>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: info.color + "20", color: info.color }}>
                                                    {info.emoji} {info.label}
                                                </span>
                                                {!isEditing && platformTasks.length > 0 && (
                                                    <span className="text-[10px] text-muted-foreground">{platformPct}% feito</span>
                                                )}
                                            </div>
                                            <div className="flex gap-1">
                                                {isEditing ? (
                                                    <>
                                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-green-500" onClick={() => handleSaveScope({ ...scope, ...editingScope } as CreatorScope)}>
                                                            <Check className="w-3.5 h-3.5" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditingScopeId(null)}>
                                                            <X className="w-3.5 h-3.5" />
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-primary" onClick={() => { setEditingScopeId(scope.id || null); setEditingScope({ ...scope }); }}>
                                                            <Pencil className="w-3.5 h-3.5" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => scope.id && handleDeleteScope(scope.id)}>
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        {/* Progress bar */}
                                        {platformTasks.length > 0 && !isEditing && (
                                            <div className="h-1" style={{ backgroundColor: info.color + "10" }}>
                                                <div className="h-full transition-all duration-500" style={{ width: `${platformPct}%`, backgroundColor: info.color + "60" }} />
                                            </div>
                                        )}

                                        <CardContent className="p-4 space-y-3">
                                            {isEditing ? (
                                                <>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <div>
                                                            <label className="text-[10px] text-muted-foreground font-medium mb-1 block">📝 Qtd Posts</label>
                                                            <Input type="number" value={sc.post_count || 0} onChange={(e) => setEditingScope((p) => ({ ...p, post_count: Number(e.target.value) }))} className="h-8 text-sm" />
                                                        </div>
                                                        <div>
                                                            <label className="text-[10px] text-muted-foreground font-medium mb-1 block">📅 Frequência</label>
                                                            <select
                                                                value={sc.frequency || ""}
                                                                onChange={(e) => setEditingScope((p) => ({ ...p, frequency: e.target.value }))}
                                                                className="flex h-8 w-full rounded-md border border-input bg-background px-2 text-xs"
                                                            >
                                                                <option value="">Selecionar...</option>
                                                                {FREQUENCY_OPTIONS.map((f) => <option key={f} value={f}>{f}</option>)}
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] text-muted-foreground font-medium mb-1 block">🎨 Formatos</label>
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {(FORMAT_OPTIONS[scope.platform] || FORMAT_OPTIONS.other).map((fmt) => {
                                                                const selected = (sc.formats || "").split(",").map((s: string) => s.trim()).includes(fmt);
                                                                return (
                                                                    <button
                                                                        key={fmt}
                                                                        type="button"
                                                                        onClick={() => {
                                                                            const current = (sc.formats || "").split(",").map((s: string) => s.trim()).filter(Boolean);
                                                                            const next = selected ? current.filter((c) => c !== fmt) : [...current, fmt];
                                                                            setEditingScope((p) => ({ ...p, formats: next.join(", ") }));
                                                                        }}
                                                                        className={`text-[10px] px-2 py-1 rounded-full border transition-all ${selected ? "border-primary bg-primary/10 text-primary font-bold" : "border-border/40 text-muted-foreground hover:border-primary/40"}`}
                                                                    >
                                                                        {fmt}
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] text-muted-foreground font-medium mb-1 block">💡 Temas</label>
                                                        <Input value={sc.themes || ""} onChange={(e) => setEditingScope((p) => ({ ...p, themes: e.target.value }))} className="h-8 text-xs" placeholder="Ex: cartão crypto, staking, tutorial" />
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] text-muted-foreground font-medium mb-1 block">📝 Notas</label>
                                                        <Input value={sc.notes || ""} onChange={(e) => setEditingScope((p) => ({ ...p, notes: e.target.value }))} className="h-8 text-xs" placeholder="Observações..." />
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div>
                                                            <p className="text-[9px] text-muted-foreground">📝 Posts</p>
                                                            <p className="text-lg font-bold" style={{ color: info.color }}>{scope.post_count || 0}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[9px] text-muted-foreground">📅 Frequência</p>
                                                            <p className="text-xs font-medium">{scope.frequency || "—"}</p>
                                                        </div>
                                                    </div>
                                                    {scope.formats && (
                                                        <div>
                                                            <p className="text-[9px] text-muted-foreground mb-1">🎨 Formatos</p>
                                                            <div className="flex flex-wrap gap-1">
                                                                {scope.formats.split(",").map((f) => f.trim()).filter(Boolean).map((fmt) => (
                                                                    <span key={fmt} className="text-[9px] px-2 py-0.5 rounded-full border border-border/40 text-muted-foreground">{fmt}</span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                    {scope.themes && (
                                                        <div>
                                                            <p className="text-[9px] text-muted-foreground mb-1">💡 Temas</p>
                                                            <div className="flex flex-wrap gap-1">
                                                                {scope.themes.split(",").map((t) => t.trim()).filter(Boolean).map((theme) => (
                                                                    <span key={theme} className="text-[9px] px-2 py-0.5 rounded-full bg-primary/10 text-primary/80">{theme}</span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                    {scope.notes && (
                                                        <p className="text-[10px] text-muted-foreground italic">📝 {scope.notes}</p>
                                                    )}
                                                </>
                                            )}
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Task Board */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-sm font-semibold flex items-center gap-2">
                            <ListChecks className="w-4 h-4 text-primary" />
                            ✅ Board de Tarefas
                        </h2>
                        <Button size="sm" variant="outline" className="gap-2" onClick={() => setShowAddTask(!showAddTask)}>
                            <Plus className="w-4 h-4" /> Nova Tarefa
                        </Button>
                    </div>

                    {/* Add task form */}
                    {showAddTask && (
                        <Card className="mb-4 border-primary/20">
                            <CardContent className="p-4 space-y-3">
                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                                    <div className="sm:col-span-2">
                                        <label className="text-[10px] text-muted-foreground font-medium mb-1 block">Título da Tarefa</label>
                                        <Input value={newTask.title || ""} onChange={(e) => setNewTask((p) => ({ ...p, title: e.target.value }))} placeholder="Ex: Thread sobre cartão Rapidz" className="h-9" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-muted-foreground font-medium mb-1 block">Plataforma</label>
                                        <select
                                            value={newTask.platform || "twitter"}
                                            onChange={(e) => setNewTask((p) => ({ ...p, platform: e.target.value as PostPlatform }))}
                                            className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                                        >
                                            {PLATFORMS.map((p) => <option key={p.key} value={p.key}>{p.emoji} {p.label}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-muted-foreground font-medium mb-1 block">Prioridade</label>
                                        <select
                                            value={newTask.priority || "medium"}
                                            onChange={(e) => setNewTask((p) => ({ ...p, priority: e.target.value as TaskPriority }))}
                                            className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                                        >
                                            {Object.entries(PRIORITY_CONFIG).map(([key, val]) => <option key={key} value={key}>{val.emoji} {val.label}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-[10px] text-muted-foreground font-medium mb-1 block">📅 Data Limite</label>
                                        <Input type="date" value={newTask.due_date || ""} onChange={(e) => setNewTask((p) => ({ ...p, due_date: e.target.value }))} className="h-9" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-muted-foreground font-medium mb-1 block">📝 Notas</label>
                                        <Input value={newTask.notes || ""} onChange={(e) => setNewTask((p) => ({ ...p, notes: e.target.value }))} placeholder="Detalhes..." className="h-9" />
                                    </div>
                                </div>
                                <div className="flex gap-2 justify-end">
                                    <Button size="sm" variant="ghost" onClick={() => setShowAddTask(false)}>Cancelar</Button>
                                    <Button size="sm" className="gap-2" onClick={handleAddTask}>
                                        <Plus className="w-4 h-4" /> Criar Tarefa
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Kanban columns */}
                    {tasks.length === 0 ? (
                        <Card>
                            <CardContent className="p-8 text-center text-muted-foreground/50">
                                <ListChecks className="w-8 h-8 mx-auto mb-2 opacity-30" />
                                <p className="text-sm">Nenhuma tarefa criada.</p>
                                <p className="text-xs mt-1">Clique em "Nova Tarefa" para começar o board.</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            {(["pending", "in_progress", "done"] as TaskStatus[]).map((status) => {
                                const config = STATUS_CONFIG[status];
                                const columnTasks = tasks.filter((t) => t.status === status);
                                const nextStatus = cycleStatus(status);

                                return (
                                    <div key={status} className="space-y-2">
                                        {/* Column header */}
                                        <div className="flex items-center justify-between px-2 py-2 rounded-lg" style={{ backgroundColor: config.bg }}>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm">{config.emoji}</span>
                                                <span className="text-xs font-bold" style={{ color: config.color }}>{config.label}</span>
                                            </div>
                                            <span className="text-[10px] font-bold rounded-full px-2 py-0.5" style={{ backgroundColor: config.color + "20", color: config.color }}>
                                                {columnTasks.length}
                                            </span>
                                        </div>

                                        {/* Task cards */}
                                        {columnTasks.map((task) => {
                                            const platformInfo = getPlatformInfo(task.platform);
                                            const priorityInfo = PRIORITY_CONFIG[task.priority as TaskPriority] || PRIORITY_CONFIG.medium;
                                            const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== "done";

                                            return (
                                                <Card key={task.id} className={`border-border/30 hover:border-border/60 transition-all group ${isOverdue ? "border-red-500/30" : ""}`}>
                                                    <CardContent className="p-3 space-y-2">
                                                        {/* Top row: platform + priority + actions */}
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-1.5">
                                                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: platformInfo.color + "15", color: platformInfo.color }}>
                                                                    {platformInfo.emoji}
                                                                </span>
                                                                <span className="text-[10px]">{priorityInfo.emoji}</span>
                                                            </div>
                                                            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <Button
                                                                    variant="ghost" size="icon" className="h-6 w-6"
                                                                    title={`Mover para ${STATUS_CONFIG[nextStatus].label}`}
                                                                    onClick={() => handleUpdateTaskStatus(task, nextStatus)}
                                                                >
                                                                    <ChevronRight className="w-3 h-3" />
                                                                </Button>
                                                                <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => task.id && handleDeleteTask(task.id)}>
                                                                    <Trash2 className="w-3 h-3" />
                                                                </Button>
                                                            </div>
                                                        </div>

                                                        {/* Title */}
                                                        <p className={`text-xs font-medium leading-snug ${task.status === "done" ? "line-through text-muted-foreground" : ""}`}>
                                                            {task.title}
                                                        </p>

                                                        {/* Notes */}
                                                        {task.notes && (
                                                            <p className="text-[10px] text-muted-foreground/70 italic">{task.notes}</p>
                                                        )}

                                                        {/* Bottom: due date + move button */}
                                                        <div className="flex items-center justify-between">
                                                            {task.due_date ? (
                                                                <span className={`text-[9px] flex items-center gap-1 ${isOverdue ? "text-red-400 font-bold" : "text-muted-foreground"}`}>
                                                                    <CalendarDays className="w-3 h-3" />
                                                                    {new Date(task.due_date + "T12:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
                                                                    {isOverdue && " ⚠️"}
                                                                </span>
                                                            ) : (
                                                                <span />
                                                            )}
                                                            <button
                                                                onClick={() => handleUpdateTaskStatus(task, nextStatus)}
                                                                className="text-[9px] font-medium px-2 py-0.5 rounded-full transition-all hover:scale-105"
                                                                style={{ backgroundColor: STATUS_CONFIG[nextStatus].color + "15", color: STATUS_CONFIG[nextStatus].color }}
                                                            >
                                                                {nextStatus === "in_progress" && "▶ Iniciar"}
                                                                {nextStatus === "done" && "✓ Concluir"}
                                                                {nextStatus === "pending" && "↩ Voltar"}
                                                            </button>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            );
                                        })}

                                        {columnTasks.length === 0 && (
                                            <div className="border border-dashed border-border/30 rounded-lg p-4 text-center">
                                                <p className="text-[10px] text-muted-foreground/40">Sem tarefas</p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default CreatorScopePage;
