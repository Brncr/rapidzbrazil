import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    ArrowLeft,
    Loader2,
    Plus,
    Trash2,
    Check,
    X,
    Home,
    Users,
    DollarSign,
    Calendar,
    MapPin,
    Utensils,
    Wine,
    Car,
    Gift,
    ClipboardList,
    Pencil,
    UserPlus,
    CheckCircle2,
    XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
    EventPlan, EventInfluencer, EventExpense, EventActivity,
    getEventPlans, upsertEventPlan,
    getEventInfluencers, addEventInfluencer, updateEventInfluencer, deleteEventInfluencer,
    getEventExpenses, addEventExpense, updateEventExpense, deleteEventExpense,
    getEventActivities, addEventActivity, deleteEventActivity,
    getInfluencers, Influencer,
} from "@/lib/entityData";

// ==================== CONSTANTS ====================

const EXPENSE_CATEGORIES: { key: string; label: string; emoji: string; icon: React.ElementType; color: string }[] = [
    { key: "house", label: "House Rental", emoji: "🏠", icon: Home, color: "#8b5cf6" },
    { key: "food", label: "Food & Catering", emoji: "🍕", icon: Utensils, color: "#f59e0b" },
    { key: "drinks", label: "Drinks", emoji: "🍺", icon: Wine, color: "#10b981" },
    { key: "transport", label: "Transport", emoji: "✈️", icon: Car, color: "#3b82f6" },
    { key: "merch", label: "Merch & Swag", emoji: "🎁", icon: Gift, color: "#ec4899" },
    { key: "other", label: "Other", emoji: "💰", icon: DollarSign, color: "#94a3b8" },
];

const ACTIVITY_PLATFORMS = [
    { key: "instagram", label: "Instagram", emoji: "📸" },
    { key: "twitter", label: "Twitter / X", emoji: "🐦" },
    { key: "tiktok", label: "TikTok", emoji: "🎵" },
    { key: "youtube", label: "YouTube", emoji: "🎥" },
    { key: "telegram", label: "Telegram", emoji: "📱" },
    { key: "all", label: "All Platforms", emoji: "🌐" },
];

const ACTIVITY_TYPES = [
    "Stories", "Reels", "Thread", "Post", "Video", "Live", "Spaces", "Review", "Tutorial", "Trend",
];

const DEFAULT_EVENT: EventPlan = {
    name: "Rapidz x BeInCrypto House — Merge SP 2026",
    location: "São Paulo, SP",
    start_date: "2026-05-15",
    end_date: "2026-05-17",
    days: 3,
    description: "Influencer house for Merge São Paulo 2026. Rapidz + BeInCrypto bring creators for 3 days of content, networking, and crypto coverage.",
};

// ==================== COMPONENT ====================

const EventPage: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [event, setEvent] = useState<EventPlan>(DEFAULT_EVENT);
    const [editingEvent, setEditingEvent] = useState(false);

    // Data
    const [influencers, setInfluencers] = useState<EventInfluencer[]>([]);
    const [expenses, setExpenses] = useState<EventExpense[]>([]);
    const [activities, setActivities] = useState<EventActivity[]>([]);

    // Influencer picker
    const [allInfluencers, setAllInfluencers] = useState<Influencer[]>([]);
    const [showAddInfluencer, setShowAddInfluencer] = useState(false);

    // Add / edit expense
    const [showAddExpense, setShowAddExpense] = useState(false);
    const [newExpense, setNewExpense] = useState<Partial<EventExpense>>({ category: "house", amount: 0, per_day: false, description: "" });
    const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);
    const [editExpense, setEditExpense] = useState<Partial<EventExpense>>({});

    // Add activity
    const [showAddActivity, setShowAddActivity] = useState(false);
    const [newActivity, setNewActivity] = useState<Partial<EventActivity>>({ title: "", platform: "all", type: "Stories", required: true });

    // ==================== LOAD DATA ====================

    const loadData = async () => {
        setLoading(true);
        try {
            const plans = await getEventPlans();
            let currentEvent: EventPlan;

            if (plans.length === 0) {
                const created = await upsertEventPlan(DEFAULT_EVENT);
                if (created) {
                    currentEvent = created;
                } else {
                    currentEvent = DEFAULT_EVENT;
                }
            } else {
                currentEvent = plans[0];
            }

            setEvent(currentEvent);

            if (currentEvent.id) {
                const [inf, exp, act] = await Promise.all([
                    getEventInfluencers(currentEvent.id),
                    getEventExpenses(currentEvent.id),
                    getEventActivities(currentEvent.id),
                ]);
                setInfluencers(inf);
                setExpenses(exp);
                setActivities(act);
            }

            const allInf = await getInfluencers();
            setAllInfluencers(allInf);
        } catch (err) {
            console.error("Error loading event data:", err);
            toast.error("Failed to load event data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ==================== HANDLERS ====================

    const handleSaveEvent = async () => {
        try {
            const updated = await upsertEventPlan(event);
            if (updated) {
                setEvent(updated);
                setEditingEvent(false);
                toast.success("Event updated!");
            }
        } catch {
            toast.error("Failed to save event");
        }
    };

    const handleAddInfluencer = async (inf: Influencer) => {
        if (!event.id) return;
        if (influencers.find((i) => i.influencer_id === inf.id)) {
            toast.error("Influencer already added");
            return;
        }
        try {
            const added = await addEventInfluencer({
                event_id: event.id,
                influencer_id: inf.id!,
                influencer_name: inf.name,
                influencer_image: inf.image_url || null,
                travel_aid: 0,
                confirmed: false,
            });
            if (added) {
                setInfluencers((prev) => [...prev, added]);
                toast.success(`${inf.name} added!`);
            }
        } catch {
            toast.error("Failed to add influencer");
        }
    };

    const handleToggleConfirm = async (inf: EventInfluencer) => {
        try {
            const updated = await updateEventInfluencer({ ...inf, confirmed: !inf.confirmed });
            if (updated) {
                setInfluencers((prev) => prev.map((i) => (i.id === inf.id ? updated : i)));
            }
        } catch {
            toast.error("Failed to update status");
        }
    };

    const handleUpdateTravelAid = async (inf: EventInfluencer, amount: number) => {
        try {
            const updated = await updateEventInfluencer({ ...inf, travel_aid: amount });
            if (updated) {
                setInfluencers((prev) => prev.map((i) => (i.id === inf.id ? updated : i)));
            }
        } catch {
            toast.error("Failed to update travel aid");
        }
    };

    const handleRemoveInfluencer = async (id: string) => {
        try {
            await deleteEventInfluencer(id);
            setInfluencers((prev) => prev.filter((i) => i.id !== id));
            toast.success("Influencer removed");
        } catch {
            toast.error("Failed to remove");
        }
    };

    const handleAddExpense = async () => {
        if (!event.id || !newExpense.amount) {
            toast.error("Amount is required");
            return;
        }
        try {
            const added = await addEventExpense({
                event_id: event.id,
                category: newExpense.category || "other",
                description: newExpense.description || "",
                amount: newExpense.amount || 0,
                per_day: newExpense.per_day || false,
            });
            if (added) {
                setExpenses((prev) => [...prev, added]);
                setNewExpense({ category: "house", amount: 0, per_day: false, description: "" });
                setShowAddExpense(false);
                toast.success("Expense added!");
            }
        } catch {
            toast.error("Failed to add expense");
        }
    };

    const handleDeleteExpense = async (id: string) => {
        try {
            await deleteEventExpense(id);
            setExpenses((prev) => prev.filter((e) => e.id !== id));
        } catch {
            toast.error("Failed to remove expense");
        }
    };

    const handleStartEditExpense = (exp: EventExpense) => {
        setEditingExpenseId(exp.id || null);
        setEditExpense({ ...exp });
    };

    const handleSaveExpense = async () => {
        if (!editingExpenseId || !editExpense) return;
        try {
            const updated = await updateEventExpense(editExpense as EventExpense);
            if (updated) {
                setExpenses((prev) => prev.map((e) => (e.id === editingExpenseId ? updated : e)));
                toast.success("Expense updated!");
            }
        } catch {
            toast.error("Failed to update expense");
        }
        setEditingExpenseId(null);
        setEditExpense({});
    };

    const handleCancelEditExpense = () => {
        setEditingExpenseId(null);
        setEditExpense({});
    };

    const handleAddActivity = async () => {
        if (!event.id || !newActivity.title) {
            toast.error("Title is required");
            return;
        }
        try {
            const added = await addEventActivity({
                event_id: event.id,
                title: newActivity.title || "",
                platform: newActivity.platform || "all",
                type: newActivity.type || "Stories",
                description: newActivity.description || "",
                required: newActivity.required !== false,
            });
            if (added) {
                setActivities((prev) => [...prev, added]);
                setNewActivity({ title: "", platform: "all", type: "Stories", required: true });
                setShowAddActivity(false);
                toast.success("Activity added!");
            }
        } catch {
            toast.error("Failed to add activity");
        }
    };

    const handleDeleteActivity = async (id: string) => {
        try {
            await deleteEventActivity(id);
            setActivities((prev) => prev.filter((a) => a.id !== id));
        } catch {
            toast.error("Failed to remove activity");
        }
    };

    // ==================== COMPUTED ====================

    const days = event.days || 3;
    const totalTravelAid = influencers.reduce((s, i) => s + (i.travel_aid || 0), 0);
    const confirmedCount = influencers.filter((i) => i.confirmed).length;

    const getExpenseTotal = (category: string) => {
        return expenses
            .filter((e) => e.category === category)
            .reduce((s, e) => s + (e.per_day ? e.amount * days : e.amount), 0);
    };

    const totalExpenses = EXPENSE_CATEGORIES.reduce((s, cat) => s + getExpenseTotal(cat.key), 0);

    // Fixed scenario: 15 creators × $230 travel aid
    const MAX_PEOPLE = 15;
    const AID_PER_CREATOR = 230;
    const projectedTravelAid = MAX_PEOPLE * AID_PER_CREATOR;
    const grandTotal = totalExpenses + projectedTravelAid;

    const fmt = (v: number) => v.toLocaleString("en-US", { style: "currency", currency: "USD" });

    // ==================== RENDER ====================

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background p-4 sm:p-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
                <div className="flex items-center gap-4">
                    <Link to="/dashboard">
                        <Button variant="ghost" size="icon"><ArrowLeft className="w-5 h-5" /></Button>
                    </Link>
                    <div>
                        <h1 className="text-lg font-bold flex items-center gap-2">
                            🎪 {event.name}
                        </h1>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {event.location}</span>
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {days} days</span>
                            {event.start_date && (
                                <span>
                                    {new Date(event.start_date + "T12:00:00").toLocaleDateString("en-US", { day: "2-digit", month: "short" })}
                                    {event.end_date && ` — ${new Date(event.end_date + "T12:00:00").toLocaleDateString("en-US", { day: "2-digit", month: "short" })}`}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                <Button size="sm" variant="outline" className="gap-2" onClick={() => setEditingEvent(!editingEvent)}>
                    <Pencil className="w-3.5 h-3.5" /> Edit Event
                </Button>
            </div>

            {/* Edit event form */}
            {editingEvent && (
                <Card className="mb-6 border-primary/20">
                    <CardContent className="p-4 space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="sm:col-span-2">
                                <label className="text-[10px] text-muted-foreground font-medium mb-1 block">Event Name</label>
                                <Input value={event.name} onChange={(e) => setEvent((p) => ({ ...p, name: e.target.value }))} className="h-9" />
                            </div>
                            <div>
                                <label className="text-[10px] text-muted-foreground font-medium mb-1 block">📍 Location</label>
                                <Input value={event.location || ""} onChange={(e) => setEvent((p) => ({ ...p, location: e.target.value }))} className="h-9" />
                            </div>
                            <div>
                                <label className="text-[10px] text-muted-foreground font-medium mb-1 block">📅 Days</label>
                                <Input type="number" value={event.days || 3} onChange={(e) => setEvent((p) => ({ ...p, days: Number(e.target.value) }))} className="h-9" />
                            </div>
                            <div>
                                <label className="text-[10px] text-muted-foreground font-medium mb-1 block">Start Date</label>
                                <Input type="date" value={event.start_date || ""} onChange={(e) => setEvent((p) => ({ ...p, start_date: e.target.value }))} className="h-9" />
                            </div>
                            <div>
                                <label className="text-[10px] text-muted-foreground font-medium mb-1 block">End Date</label>
                                <Input type="date" value={event.end_date || ""} onChange={(e) => setEvent((p) => ({ ...p, end_date: e.target.value }))} className="h-9" />
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] text-muted-foreground font-medium mb-1 block">📝 Description</label>
                            <Input value={event.description || ""} onChange={(e) => setEvent((p) => ({ ...p, description: e.target.value }))} className="h-9" />
                        </div>
                        <div className="flex gap-2 justify-end">
                            <Button size="sm" variant="ghost" onClick={() => setEditingEvent(false)}>Cancel</Button>
                            <Button size="sm" className="gap-2" onClick={handleSaveEvent}>
                                <Check className="w-4 h-4" /> Save
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Description */}
            {event.description && !editingEvent && (
                <Card className="mb-6 border-border/30">
                    <CardContent className="p-4">
                        <p className="text-xs text-muted-foreground italic">{event.description}</p>
                    </CardContent>
                </Card>
            )}

            {/* Quick Stats */}
            <Card className="mb-6">
                <CardContent className="p-5">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="text-center">
                            <p className="text-[10px] text-muted-foreground">👥 Influencers</p>
                            <p className="text-2xl font-bold text-primary">{influencers.length}</p>
                            <p className="text-[9px] text-green-400">{confirmedCount} confirmed</p>
                        </div>
                        <div className="text-center">
                            <p className="text-[10px] text-muted-foreground">✈️ Travel Aid ({MAX_PEOPLE}×${AID_PER_CREATOR})</p>
                            <p className="text-2xl font-bold text-blue-400">{fmt(projectedTravelAid)}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-[10px] text-muted-foreground">💰 Operational Costs</p>
                            <p className="text-2xl font-bold text-amber-400">{fmt(totalExpenses)}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-[10px] text-muted-foreground">🏷️ Grand Total</p>
                            <p className="text-2xl font-bold text-red-400">{fmt(grandTotal)}</p>
                            <p className="text-[9px] text-muted-foreground">{fmt(grandTotal / days)}/day</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* ==================== INFLUENCERS ==================== */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-semibold flex items-center gap-2">
                        <Users className="w-4 h-4 text-primary" />
                        👥 Invited Influencers ({influencers.length})
                    </h2>
                    <Button size="sm" variant="outline" className="gap-2" onClick={() => setShowAddInfluencer(!showAddInfluencer)}>
                        <UserPlus className="w-4 h-4" /> Add
                    </Button>
                </div>

                {/* Influencer Picker */}
                {showAddInfluencer && (
                    <Card className="mb-3 border-primary/20">
                        <CardContent className="p-4">
                            <p className="text-[10px] text-muted-foreground mb-2">Select from existing influencers:</p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 max-h-48 overflow-y-auto">
                                {allInfluencers
                                    .filter((ai) => !influencers.find((ei) => ei.influencer_id === ai.id))
                                    .map((inf) => (
                                        <button
                                            key={inf.id}
                                            onClick={() => handleAddInfluencer(inf)}
                                            className="flex items-center gap-2 p-2 rounded-lg border border-border/30 hover:border-primary/40 hover:bg-primary/5 transition-all text-left"
                                        >
                                            {inf.image_url ? (
                                                <img src={inf.image_url} alt="" className="w-7 h-7 rounded-full object-cover" />
                                            ) : (
                                                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <span className="text-[9px] font-bold text-primary">{inf.name?.[0]}</span>
                                                </div>
                                            )}
                                            <span className="text-[10px] font-medium truncate">{inf.name}</span>
                                        </button>
                                    ))}
                            </div>
                            <Button size="sm" variant="ghost" className="mt-2" onClick={() => setShowAddInfluencer(false)}>Close</Button>
                        </CardContent>
                    </Card>
                )}

                {/* Influencer Cards */}
                {influencers.length === 0 ? (
                    <Card>
                        <CardContent className="p-6 text-center text-muted-foreground/50">
                            <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
                            <p className="text-sm">No influencers added yet.</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {influencers.map((inf) => (
                            <Card key={inf.id} className={`border-border/30 transition-all ${inf.confirmed ? "border-green-500/30" : ""}`}>
                                <CardContent className="p-3">
                                    <div className="flex items-center gap-3">
                                        {inf.influencer_image ? (
                                            <img src={inf.influencer_image} alt="" className="w-10 h-10 rounded-full object-cover border-2 border-primary/20" />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
                                                <span className="text-xs font-bold text-primary">{inf.influencer_name?.[0]}</span>
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-semibold truncate">{inf.influencer_name}</p>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${inf.confirmed ? "bg-green-500/15 text-green-400" : "bg-amber-500/15 text-amber-400"}`}>
                                                    {inf.confirmed ? "✅ Confirmed" : "⏳ Pending"}
                                                </span>
                                                {(() => {
                                                    const match = allInfluencers.find((a) => a.id === inf.influencer_id);
                                                    return match?.followers ? (
                                                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-blue-500/15 text-blue-400 font-bold">
                                                            👥 {match.followers}
                                                        </span>
                                                    ) : null;
                                                })()}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Button
                                                variant="ghost" size="icon" className="h-6 w-6"
                                                onClick={() => handleToggleConfirm(inf)}
                                                title={inf.confirmed ? "Unconfirm" : "Confirm"}
                                            >
                                                {inf.confirmed ? <XCircle className="w-3.5 h-3.5 text-amber-400" /> : <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />}
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => inf.id && handleRemoveInfluencer(inf.id)}>
                                                <Trash2 className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    </div>

                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* ==================== BUDGET ==================== */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-semibold flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-primary" />
                        💰 Budget — Operational Costs
                    </h2>
                    <Button size="sm" variant="outline" className="gap-2" onClick={() => setShowAddExpense(!showAddExpense)}>
                        <Plus className="w-4 h-4" /> Expense
                    </Button>
                </div>

                {/* Add expense form */}
                {showAddExpense && (
                    <Card className="mb-3 border-primary/20">
                        <CardContent className="p-4 space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                                <div>
                                    <label className="text-[10px] text-muted-foreground font-medium mb-1 block">Category</label>
                                    <select
                                        value={newExpense.category || "house"}
                                        onChange={(e) => setNewExpense((p) => ({ ...p, category: e.target.value }))}
                                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                                    >
                                        {EXPENSE_CATEGORIES.map((c) => <option key={c.key} value={c.key}>{c.emoji} {c.label}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] text-muted-foreground font-medium mb-1 block">Amount ($)</label>
                                    <Input
                                        type="number"
                                        value={newExpense.amount || ""}
                                        onChange={(e) => setNewExpense((p) => ({ ...p, amount: Number(e.target.value) }))}
                                        className="h-9"
                                        placeholder="0.00"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] text-muted-foreground font-medium mb-1 block">Description</label>
                                    <Input
                                        value={newExpense.description || ""}
                                        onChange={(e) => setNewExpense((p) => ({ ...p, description: e.target.value }))}
                                        className="h-9"
                                        placeholder="Details..."
                                    />
                                </div>
                                <div className="flex items-end gap-2">
                                    <label className="flex items-center gap-2 text-xs cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={newExpense.per_day || false}
                                            onChange={(e) => setNewExpense((p) => ({ ...p, per_day: e.target.checked }))}
                                            className="rounded"
                                        />
                                        <span className="text-[10px]">Per day (×{days})</span>
                                    </label>
                                </div>
                            </div>
                            <div className="flex gap-2 justify-end">
                                <Button size="sm" variant="ghost" onClick={() => setShowAddExpense(false)}>Cancel</Button>
                                <Button size="sm" className="gap-2" onClick={handleAddExpense}>
                                    <Plus className="w-4 h-4" /> Add
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Clean expense table */}
                <Card className="border-border/30 overflow-hidden">
                    <CardContent className="p-0">
                        <table className="w-full text-xs">
                            <thead>
                                <tr className="border-b border-border/20 bg-card/50">
                                    <th className="text-left p-3 text-muted-foreground font-medium">Item</th>
                                    <th className="text-center p-3 text-muted-foreground font-medium w-20">Unit $</th>
                                    <th className="text-center p-3 text-muted-foreground font-medium w-16">×</th>
                                    <th className="text-right p-3 text-muted-foreground font-medium w-24">Subtotal</th>
                                    <th className="w-8"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {EXPENSE_CATEGORIES.map((cat) => {
                                    const catExpenses = expenses.filter((e) => e.category === cat.key);
                                    const catTotal = getExpenseTotal(cat.key);
                                    if (catExpenses.length === 0) return null;

                                    return (
                                        <React.Fragment key={cat.key}>
                                            {/* Category header row */}
                                            <tr className="border-b border-border/10" style={{ backgroundColor: cat.color + "06" }}>
                                                <td colSpan={3} className="p-2.5 pl-3">
                                                    <span className="text-[11px] font-bold flex items-center gap-1.5" style={{ color: cat.color }}>
                                                        {cat.emoji} {cat.label}
                                                    </span>
                                                </td>
                                                <td className="p-2.5 text-right">
                                                    <span className="text-[11px] font-bold" style={{ color: cat.color }}>{fmt(catTotal)}</span>
                                                </td>
                                                <td></td>
                                            </tr>
                                            {/* Expense rows */}
                                            {catExpenses.map((exp) => {
                                                const isEditing = editingExpenseId === exp.id;
                                                return isEditing ? (
                                                    <tr key={exp.id} className="border-b border-primary/20 bg-primary/5">
                                                        <td className="p-1.5 pl-6">
                                                            <Input
                                                                value={editExpense.description || ""}
                                                                onChange={(e) => setEditExpense((p) => ({ ...p, description: e.target.value }))}
                                                                className="h-7 text-xs"
                                                                placeholder="Description..."
                                                                autoFocus
                                                            />
                                                        </td>
                                                        <td className="p-1.5">
                                                            <Input
                                                                type="number"
                                                                value={editExpense.amount ?? 0}
                                                                onChange={(e) => setEditExpense((p) => ({ ...p, amount: Number(e.target.value) }))}
                                                                className="h-7 text-xs text-center w-20 mx-auto"
                                                                step="0.01"
                                                            />
                                                        </td>
                                                        <td className="p-1.5 text-center">
                                                            <label className="flex items-center justify-center gap-1 cursor-pointer">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={editExpense.per_day || false}
                                                                    onChange={(e) => setEditExpense((p) => ({ ...p, per_day: e.target.checked }))}
                                                                    className="rounded w-3 h-3"
                                                                />
                                                                <span className="text-[10px] text-muted-foreground">×{days}d</span>
                                                            </label>
                                                        </td>
                                                        <td className="p-1.5 text-right font-medium text-xs">
                                                            {fmt((editExpense.per_day ? (editExpense.amount || 0) * days : (editExpense.amount || 0)))}
                                                        </td>
                                                        <td className="p-1 whitespace-nowrap">
                                                            <Button variant="ghost" size="icon" className="h-5 w-5 text-green-400" onClick={handleSaveExpense}>
                                                                <Check className="w-3 h-3" />
                                                            </Button>
                                                            <Button variant="ghost" size="icon" className="h-5 w-5 text-muted-foreground" onClick={handleCancelEditExpense}>
                                                                <X className="w-3 h-3" />
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    <tr key={exp.id} className="border-b border-border/5 group hover:bg-card/30 cursor-pointer" onClick={() => handleStartEditExpense(exp)}>
                                                        <td className="p-2 pl-6 text-muted-foreground">{exp.description || cat.label}</td>
                                                        <td className="p-2 text-center font-mono">{fmt(exp.amount)}</td>
                                                        <td className="p-2 text-center text-muted-foreground/60">
                                                            {exp.per_day ? `×${days}d` : "fixed"}
                                                        </td>
                                                        <td className="p-2 text-right font-medium">
                                                            {fmt(exp.per_day ? exp.amount * days : exp.amount)}
                                                        </td>
                                                        <td className="p-1">
                                                            <Button variant="ghost" size="icon" className="h-5 w-5 opacity-0 group-hover:opacity-100" onClick={(e) => { e.stopPropagation(); exp.id && handleDeleteExpense(exp.id); }}>
                                                                <Trash2 className="w-3 h-3 text-destructive" />
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </React.Fragment>
                                    );
                                })}
                            </tbody>
                            {/* Table footer with total */}
                            <tfoot>
                                <tr className="border-t-2 border-primary/20 bg-primary/5">
                                    <td colSpan={3} className="p-3 text-sm font-bold">💰 Total Operational ({days} days)</td>
                                    <td className="p-3 text-right text-sm font-black text-primary">{fmt(totalExpenses)}</td>
                                    <td></td>
                                </tr>
                            </tfoot>
                        </table>
                    </CardContent>
                </Card>
            </div>

            {/* ==================== ACTIVITIES ==================== */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-semibold flex items-center gap-2">
                        <ClipboardList className="w-4 h-4 text-primary" />
                        📋 Activity Scope ({activities.length})
                    </h2>
                    <Button size="sm" variant="outline" className="gap-2" onClick={() => setShowAddActivity(!showAddActivity)}>
                        <Plus className="w-4 h-4" /> Activity
                    </Button>
                </div>

                {/* Add activity form */}
                {showAddActivity && (
                    <Card className="mb-3 border-primary/20">
                        <CardContent className="p-4 space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                                <div className="sm:col-span-2">
                                    <label className="text-[10px] text-muted-foreground font-medium mb-1 block">Title</label>
                                    <Input value={newActivity.title || ""} onChange={(e) => setNewActivity((p) => ({ ...p, title: e.target.value }))} placeholder="E.g: Daily event stories" className="h-9" />
                                </div>
                                <div>
                                    <label className="text-[10px] text-muted-foreground font-medium mb-1 block">Platform</label>
                                    <select
                                        value={newActivity.platform || "all"}
                                        onChange={(e) => setNewActivity((p) => ({ ...p, platform: e.target.value }))}
                                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                                    >
                                        {ACTIVITY_PLATFORMS.map((p) => <option key={p.key} value={p.key}>{p.emoji} {p.label}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] text-muted-foreground font-medium mb-1 block">Type</label>
                                    <select
                                        value={newActivity.type || "Stories"}
                                        onChange={(e) => setNewActivity((p) => ({ ...p, type: e.target.value }))}
                                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                                    >
                                        {ACTIVITY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[10px] text-muted-foreground font-medium mb-1 block">Description</label>
                                    <Input value={newActivity.description || ""} onChange={(e) => setNewActivity((p) => ({ ...p, description: e.target.value }))} placeholder="Details..." className="h-9" />
                                </div>
                                <div className="flex items-end">
                                    <label className="flex items-center gap-2 text-xs cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={newActivity.required !== false}
                                            onChange={(e) => setNewActivity((p) => ({ ...p, required: e.target.checked }))}
                                            className="rounded"
                                        />
                                        <span className="text-[10px]">Required</span>
                                    </label>
                                </div>
                            </div>
                            <div className="flex gap-2 justify-end">
                                <Button size="sm" variant="ghost" onClick={() => setShowAddActivity(false)}>Cancel</Button>
                                <Button size="sm" className="gap-2" onClick={handleAddActivity}>
                                    <Plus className="w-4 h-4" /> Add
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {activities.length === 0 ? (
                    <Card>
                        <CardContent className="p-6 text-center text-muted-foreground/50">
                            <ClipboardList className="w-8 h-8 mx-auto mb-2 opacity-30" />
                            <p className="text-sm">No activities defined yet.</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {activities.map((act) => {
                            const platInfo = ACTIVITY_PLATFORMS.find((p) => p.key === act.platform) || ACTIVITY_PLATFORMS[5];
                            return (
                                <Card key={act.id} className="border-border/30">
                                    <CardContent className="p-3 flex items-center gap-3">
                                        <div className="flex items-center gap-2 flex-1 min-w-0">
                                            <span className="text-sm">{platInfo.emoji}</span>
                                            <div className="min-w-0">
                                                <p className="text-xs font-medium truncate">{act.title}</p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary/80">{act.type}</span>
                                                    <span className="text-[9px] text-muted-foreground">{platInfo.label}</span>
                                                    {act.required && <span className="text-[9px] text-red-400 font-bold">Required</span>}
                                                </div>
                                                {act.description && <p className="text-[10px] text-muted-foreground/70 mt-0.5 italic truncate">{act.description}</p>}
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0 text-destructive" onClick={() => act.id && handleDeleteActivity(act.id)}>
                                            <Trash2 className="w-3 h-3" />
                                        </Button>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* ==================== FINAL COST OVERVIEW ==================== */}
            <Card className="border-primary/20 mb-8">
                <CardContent className="p-5 space-y-5">
                    {/* Section title */}
                    <h2 className="text-sm font-semibold flex items-center gap-2">
                        📊 Final Cost Overview — {days} Days
                    </h2>

                    {/* Operational breakdown */}
                    <div>
                        <p className="text-[10px] text-muted-foreground font-medium mb-2 uppercase tracking-wider">Operational Costs (Fixed)</p>
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                            {EXPENSE_CATEGORIES.map((cat) => {
                                const total = getExpenseTotal(cat.key);
                                return (
                                    <div key={cat.key} className="text-center p-2 rounded-lg border border-border/10" style={{ backgroundColor: total > 0 ? cat.color + "08" : undefined }}>
                                        <p className="text-sm mb-0.5">{cat.emoji}</p>
                                        <p className="text-[9px] text-muted-foreground">{cat.label}</p>
                                        <p className="text-xs font-bold mt-0.5" style={{ color: total > 0 ? cat.color : undefined }}>
                                            {total > 0 ? fmt(total) : "—"}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="flex justify-between items-center mt-3 pt-2 border-t border-border/10">
                            <span className="text-xs font-medium text-muted-foreground">Total Operational</span>
                            <span className="text-sm font-black text-primary">{fmt(totalExpenses)}</span>
                        </div>
                    </div>

                    {/* Single projection */}
                    <div>
                        <p className="text-[10px] text-muted-foreground font-medium mb-2 uppercase tracking-wider">💰 Cost Projection — {MAX_PEOPLE} creators × ${AID_PER_CREATOR} travel aid</p>
                        <div className="space-y-2 mt-3">
                            <div className="flex justify-between items-center py-1.5 border-b border-border/10">
                                <span className="text-xs text-muted-foreground">✈️ Travel Aid ({MAX_PEOPLE} × ${AID_PER_CREATOR})</span>
                                <span className="text-xs font-bold text-blue-400">{fmt(projectedTravelAid)}</span>
                            </div>
                            <div className="flex justify-between items-center py-1.5 border-b border-border/10">
                                <span className="text-xs text-muted-foreground">💰 Operational Costs ({days} days)</span>
                                <span className="text-xs font-bold text-amber-400">{fmt(totalExpenses)}</span>
                            </div>
                            <div className="flex justify-between items-center pt-3 border-t-2 border-primary/20">
                                <span className="text-sm font-bold">🏷️ GRAND TOTAL</span>
                                <span className="text-lg font-black text-primary">{fmt(grandTotal)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] text-muted-foreground">Cost per day</span>
                                <span className="text-xs font-bold text-muted-foreground">{fmt(grandTotal / days)}/day</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] text-muted-foreground">Cost per creator</span>
                                <span className="text-xs font-bold text-muted-foreground">{fmt(grandTotal / MAX_PEOPLE)}/creator</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default EventPage;
