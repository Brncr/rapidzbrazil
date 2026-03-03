import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import {
    CreatorKPI,
    EntityType,
    PlatformType,
    getCreatorKPIs,
    upsertCreatorKPI,
} from "@/lib/entityData";

interface CreatorKPIsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    entityType: EntityType;
    entityId: string;
    entityName: string;
}

const PLATFORMS: { value: PlatformType; label: string; emoji: string }[] = [
    { value: "twitter", label: "Twitter/X", emoji: "🐦" },
    { value: "telegram", label: "Telegram", emoji: "📱" },
    { value: "youtube", label: "YouTube", emoji: "🎥" },
    { value: "instagram", label: "Instagram", emoji: "📸" },
    { value: "general", label: "Geral", emoji: "📊" },
];

interface PlatformField {
    key: keyof CreatorKPI;
    label: string;
    type: "number" | "percent" | "text";
    placeholder: string;
}

const PLATFORM_FIELDS: Record<PlatformType, PlatformField[]> = {
    twitter: [
        { key: "impressions", label: "Impressões", type: "number", placeholder: "0" },
        { key: "engagement_rate", label: "Engajamento (%)", type: "percent", placeholder: "0.00" },
        { key: "link_clicks", label: "Cliques no Link", type: "number", placeholder: "0" },
        { key: "follower_growth", label: "Crescimento Seguidores", type: "number", placeholder: "0" },
    ],
    telegram: [
        { key: "members", label: "Membros", type: "number", placeholder: "0" },
        { key: "views", label: "Views por Post", type: "number", placeholder: "0" },
        { key: "retention_rate", label: "Retenção (%)", type: "percent", placeholder: "0.00" },
        { key: "link_clicks", label: "Cliques no Link", type: "number", placeholder: "0" },
    ],
    youtube: [
        { key: "views", label: "Visualizações", type: "number", placeholder: "0" },
        { key: "watch_time_min", label: "Watch Time (min)", type: "number", placeholder: "0.0" },
        { key: "ctr", label: "CTR Thumbnail (%)", type: "percent", placeholder: "0.00" },
        { key: "new_subscribers", label: "Novos Inscritos", type: "number", placeholder: "0" },
    ],
    instagram: [
        { key: "reach", label: "Alcance", type: "number", placeholder: "0" },
        { key: "engagement_rate", label: "Engajamento (%)", type: "percent", placeholder: "0.00" },
        { key: "story_views", label: "Views dos Stories", type: "number", placeholder: "0" },
        { key: "link_clicks", label: "Cliques no Link (Bio)", type: "number", placeholder: "0" },
    ],
    general: [
        { key: "cpa", label: "CPA (R$)", type: "number", placeholder: "0.00" },
        { key: "roi", label: "ROI (%)", type: "percent", placeholder: "0.00" },
        { key: "score", label: "Score (1-10)", type: "number", placeholder: "1" },
        { key: "notes", label: "Notas", type: "text", placeholder: "Observações do criador..." },
    ],
};

const CreatorKPIsDialog: React.FC<CreatorKPIsDialogProps> = ({
    open,
    onOpenChange,
    entityType,
    entityId,
    entityName,
}) => {
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [kpis, setKpis] = useState<Record<PlatformType, CreatorKPI>>({} as Record<PlatformType, CreatorKPI>);
    const [activeTab, setActiveTab] = useState<PlatformType>("twitter");

    useEffect(() => {
        if (open) {
            loadKPIs();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, entityId]);

    const loadKPIs = async () => {
        setLoading(true);
        try {
            const existing = await getCreatorKPIs(entityType, entityId);
            const mapped: Record<PlatformType, CreatorKPI> = {} as Record<PlatformType, CreatorKPI>;

            for (const platform of PLATFORMS) {
                const found = existing.find((k) => k.platform === platform.value);
                mapped[platform.value] = found || {
                    entity_type: entityType,
                    entity_id: entityId,
                    platform: platform.value,
                    period: new Date().toISOString().slice(0, 7), // e.g. "2026-03"
                };
            }
            setKpis(mapped);
        } catch (error) {
            console.error("Error loading KPIs:", error);
            toast.error("Erro ao carregar KPIs");
        } finally {
            setLoading(false);
        }
    };

    const handleFieldChange = (
        platform: PlatformType,
        field: keyof CreatorKPI,
        value: string
    ) => {
        setKpis((prev) => ({
            ...prev,
            [platform]: {
                ...prev[platform],
                [field]: field === "notes" ? value : (value === "" ? null : Number(value)),
            },
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            for (const platform of PLATFORMS) {
                const kpi = kpis[platform.value];
                if (kpi) {
                    await upsertCreatorKPI(kpi);
                }
            }
            toast.success("KPIs salvos com sucesso!");
        } catch (error) {
            console.error("Error saving KPIs:", error);
            toast.error("Erro ao salvar KPIs");
        } finally {
            setSaving(false);
        }
    };

    const getFieldValue = (platform: PlatformType, field: keyof CreatorKPI): string => {
        const kpi = kpis[platform];
        if (!kpi) return "";
        const val = kpi[field];
        if (val === null || val === undefined) return "";
        return String(val);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-lg">
                        📊 KPIs — {entityName}
                    </DialogTitle>
                </DialogHeader>

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="space-y-4">
                        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as PlatformType)}>
                            <TabsList className="grid grid-cols-5 w-full">
                                {PLATFORMS.map((p) => (
                                    <TabsTrigger key={p.value} value={p.value} className="text-xs gap-1 px-1">
                                        <span>{p.emoji}</span>
                                        <span className="hidden sm:inline">{p.label}</span>
                                    </TabsTrigger>
                                ))}
                            </TabsList>

                            {PLATFORMS.map((platform) => (
                                <TabsContent key={platform.value} value={platform.value} className="space-y-3 mt-4">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-xl">{platform.emoji}</span>
                                        <h3 className="font-semibold text-sm">{platform.label}</h3>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        {PLATFORM_FIELDS[platform.value].map((field) => (
                                            <div
                                                key={field.key}
                                                className={field.type === "text" ? "col-span-2" : ""}
                                            >
                                                <label className="text-xs text-muted-foreground mb-1 block">
                                                    {field.label}
                                                </label>
                                                {field.type === "text" ? (
                                                    <textarea
                                                        value={getFieldValue(platform.value, field.key)}
                                                        onChange={(e) =>
                                                            handleFieldChange(platform.value, field.key, e.target.value)
                                                        }
                                                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                                        placeholder={field.placeholder}
                                                    />
                                                ) : (
                                                    <Input
                                                        type="number"
                                                        step={field.type === "percent" ? "0.01" : "1"}
                                                        value={getFieldValue(platform.value, field.key)}
                                                        onChange={(e) =>
                                                            handleFieldChange(platform.value, field.key, e.target.value)
                                                        }
                                                        placeholder={field.placeholder}
                                                        className="text-sm h-9"
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Period field */}
                                    <div className="pt-2 border-t border-border">
                                        <label className="text-xs text-muted-foreground mb-1 block">
                                            Período
                                        </label>
                                        <Input
                                            type="month"
                                            value={kpis[platform.value]?.period || ""}
                                            onChange={(e) =>
                                                handleFieldChange(platform.value, "period" as keyof CreatorKPI, e.target.value)
                                            }
                                            className="text-sm h-9 w-40"
                                        />
                                    </div>
                                </TabsContent>
                            ))}
                        </Tabs>

                        <div className="flex justify-end pt-2">
                            <Button onClick={handleSave} disabled={saving} className="gap-2">
                                {saving ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Save className="w-4 h-4" />
                                )}
                                Salvar KPIs
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default CreatorKPIsDialog;
