import { supabase } from "@/integrations/supabase/client";

// Types matching database schema
export interface Influencer {
  id: string;
  handle: string;
  name: string;
  category: string;
  followers: string;
  engagement: string;
  tier?: string | null;
  image_url?: string | null;
  visible?: boolean | null;
  detailed_info?: string | null;
}

export interface Community {
  id: string;
  name: string;
  discord_url?: string | null;
  twitter_handle?: string | null;
  website_url?: string | null;
  members?: string | null;
  image_url?: string | null;
  visible?: boolean | null;
}

export interface Streamer {
  id: string;
  name: string;
  platform: string;
  handle: string;
  followers: string;
  category: string;
  image_url?: string | null;
  twitch_url?: string | null;
  youtube_url?: string | null;
  twitter_handle?: string | null;
  visible?: boolean | null;
}

export type EntityType = 'influencer' | 'community' | 'streamer';

export interface CreatorKPI {
  id?: string;
  entity_type: EntityType;
  entity_id: string;
  period: string;
  // Funnel
  impressions?: number | null;
  clicks?: number | null;
  telegram_members?: number | null;
  telegram_engagement_pct?: number | null;
  downloads?: number | null;
  kyc_completed?: number | null;
  first_deposit?: number | null;
  topup?: number | null;
  volume_usd?: number | null;
  recurrence_pct?: number | null;
  // Creator Performance
  cac_per_active_user?: number | null;
  retention_30d_pct?: number | null;
  ltv_projected?: number | null;
  // General
  score?: number | null;
  notes?: string | null;
}

// Fetch data from database
export const getInfluencers = async (): Promise<Influencer[]> => {
  const { data, error } = await supabase
    .from("influencers")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching influencers:", error);
    return [];
  }
  return data || [];
};

export const getCommunities = async (): Promise<Community[]> => {
  const { data, error } = await supabase
    .from("communities")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching communities:", error);
    return [];
  }
  return data || [];
};

export const getStreamers = async (): Promise<Streamer[]> => {
  const { data, error } = await supabase
    .from("streamers")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching streamers:", error);
    return [];
  }
  return data || [];
};

// Update image URLs
export const updateInfluencerImage = async (id: string, imageUrl: string): Promise<void> => {
  const { error } = await supabase
    .from("influencers")
    .update({ image_url: imageUrl })
    .eq("id", id);

  if (error) {
    console.error("Error updating influencer image:", error);
    throw error;
  }
};

export const updateCommunityImage = async (id: string, imageUrl: string): Promise<void> => {
  const { error } = await supabase
    .from("communities")
    .update({ image_url: imageUrl })
    .eq("id", id);

  if (error) {
    console.error("Error updating community image:", error);
    throw error;
  }
};

export const updateStreamerImage = async (id: string, imageUrl: string): Promise<void> => {
  const { error } = await supabase
    .from("streamers")
    .update({ image_url: imageUrl })
    .eq("id", id);

  if (error) {
    console.error("Error updating streamer image:", error);
    throw error;
  }
};

// Update streamer fields
export const updateStreamer = async (id: string, data: Partial<Streamer>): Promise<void> => {
  const { error } = await supabase
    .from("streamers")
    .update(data)
    .eq("id", id);

  if (error) {
    console.error("Error updating streamer:", error);
    throw error;
  }
};

// Update influencer fields
export const updateInfluencer = async (id: string, data: Partial<Influencer>): Promise<void> => {
  const { error } = await supabase
    .from("influencers")
    .update(data)
    .eq("id", id);

  if (error) {
    console.error("Error updating influencer:", error);
    throw error;
  }
};

// Update community fields
export const updateCommunity = async (id: string, data: Partial<Community>): Promise<void> => {
  const { error } = await supabase
    .from("communities")
    .update(data)
    .eq("id", id);

  if (error) {
    console.error("Error updating community:", error);
    throw error;
  }
};

// Add new streamer
export const addStreamer = async (streamer: Omit<Streamer, "id">): Promise<Streamer | null> => {
  const { data, error } = await supabase
    .from("streamers")
    .insert(streamer)
    .select()
    .single();

  if (error) {
    console.error("Error adding streamer:", error);
    throw error;
  }
  return data;
};

// Add new influencer
export const addInfluencer = async (influencer: Omit<Influencer, "id">): Promise<Influencer | null> => {
  const { data, error } = await supabase
    .from("influencers")
    .insert(influencer)
    .select()
    .single();

  if (error) {
    console.error("Error adding influencer:", error);
    throw error;
  }
  return data;
};

// Add new community
export const addCommunity = async (community: Omit<Community, "id">): Promise<Community | null> => {
  const { data, error } = await supabase
    .from("communities")
    .insert(community)
    .select()
    .single();

  if (error) {
    console.error("Error adding community:", error);
    throw error;
  }
  return data;
};

// Creator KPIs
export const getCreatorKPIs = async (
  entityType: EntityType,
  entityId: string,
): Promise<CreatorKPI[]> => {
  const { data, error } = await supabase
    .from("creator_kpis")
    .select("*")
    .eq("entity_type", entityType)
    .eq("entity_id", entityId)
    .order("period", { ascending: false });

  if (error) {
    console.error("Error fetching creator KPIs:", error);
    return [];
  }
  return (data || []) as unknown as CreatorKPI[];
};

export const upsertCreatorKPI = async (kpi: CreatorKPI): Promise<CreatorKPI | null> => {
  const { id, ...rest } = kpi;

  if (id) {
    // Update existing
    const { data, error } = await supabase
      .from("creator_kpis")
      .update({ ...rest, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating creator KPI:", error);
      throw error;
    }
    return data as unknown as CreatorKPI;
  } else {
    // Insert new
    const { data, error } = await supabase
      .from("creator_kpis")
      .insert(rest)
      .select()
      .single();

    if (error) {
      console.error("Error inserting creator KPI:", error);
      throw error;
    }
    return data as unknown as CreatorKPI;
  }
};

// ==================== CREATOR POSTS ====================

export type PostPlatform = 'twitter' | 'telegram' | 'youtube' | 'instagram' | 'tiktok' | 'other';

export interface CreatorPost {
  id?: string;
  entity_type: EntityType;
  entity_id: string;
  platform: PostPlatform;
  post_url: string;
  post_date: string;
  description?: string | null;
  impressions: number;
  views: number;
  clicks: number;
  engagement: number;
  conversions: number;
}

export const getCreatorPosts = async (
  entityType: EntityType,
  entityId: string,
): Promise<CreatorPost[]> => {
  const { data, error } = await supabase
    .from("creator_posts")
    .select("*")
    .eq("entity_type", entityType)
    .eq("entity_id", entityId)
    .order("post_date", { ascending: false });

  if (error) {
    console.error("Error fetching creator posts:", error);
    return [];
  }
  return (data || []) as unknown as CreatorPost[];
};

export const addCreatorPost = async (post: CreatorPost): Promise<CreatorPost | null> => {
  const { id, ...rest } = post;
  const { data, error } = await supabase
    .from("creator_posts")
    .insert(rest)
    .select()
    .single();

  if (error) {
    console.error("Error adding creator post:", error);
    throw error;
  }
  return data as unknown as CreatorPost;
};

export const updateCreatorPost = async (post: CreatorPost): Promise<CreatorPost | null> => {
  if (!post.id) throw new Error("Post ID required for update");
  const { id, ...rest } = post;
  const { data, error } = await supabase
    .from("creator_posts")
    .update({ ...rest, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating creator post:", error);
    throw error;
  }
  return data as unknown as CreatorPost;
};

export const deleteCreatorPost = async (postId: string): Promise<void> => {
  const { error } = await supabase
    .from("creator_posts")
    .delete()
    .eq("id", postId);

  if (error) {
    console.error("Error deleting creator post:", error);
    throw error;
  }
};

// ==================== CREATOR SCOPES ====================

export type TaskStatus = 'pending' | 'in_progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface CreatorScope {
  id?: string;
  entity_type: EntityType;
  entity_id: string;
  period: string;
  platform: PostPlatform;
  post_count: number;
  frequency: string;
  themes: string;
  formats: string;
  notes?: string | null;
}

export interface CreatorTask {
  id?: string;
  entity_type: EntityType;
  entity_id: string;
  scope_id?: string | null;
  title: string;
  platform: PostPlatform;
  status: TaskStatus;
  priority: TaskPriority;
  due_date?: string | null;
  completed_at?: string | null;
  notes?: string | null;
}

export const getCreatorScopes = async (entityType: EntityType, entityId: string, period?: string): Promise<CreatorScope[]> => {
  let query = supabase
    .from("creator_scopes")
    .select("*")
    .eq("entity_type", entityType)
    .eq("entity_id", entityId);

  if (period) query = query.eq("period", period);

  const { data, error } = await query.order("platform", { ascending: true });
  if (error) { console.error("Error fetching scopes:", error); throw error; }
  return (data as unknown as CreatorScope[]) || [];
};

export const upsertCreatorScope = async (scope: CreatorScope): Promise<CreatorScope | null> => {
  const { data, error } = await supabase
    .from("creator_scopes")
    .upsert(
      { ...scope, updated_at: new Date().toISOString() },
      { onConflict: "entity_type,entity_id,period,platform" }
    )
    .select()
    .single();

  if (error) { console.error("Error upserting scope:", error); throw error; }
  return data as unknown as CreatorScope;
};

export const deleteCreatorScope = async (scopeId: string): Promise<void> => {
  const { error } = await supabase.from("creator_scopes").delete().eq("id", scopeId);
  if (error) { console.error("Error deleting scope:", error); throw error; }
};

// ==================== CREATOR TASKS ====================

export const getCreatorTasks = async (entityType: EntityType, entityId: string): Promise<CreatorTask[]> => {
  const { data, error } = await supabase
    .from("creator_tasks")
    .select("*")
    .eq("entity_type", entityType)
    .eq("entity_id", entityId)
    .order("created_at", { ascending: true });

  if (error) { console.error("Error fetching tasks:", error); throw error; }
  return (data as unknown as CreatorTask[]) || [];
};

export const addCreatorTask = async (task: Omit<CreatorTask, 'id'>): Promise<CreatorTask | null> => {
  const { data, error } = await supabase
    .from("creator_tasks")
    .insert([task])
    .select()
    .single();

  if (error) { console.error("Error adding task:", error); throw error; }
  return data as unknown as CreatorTask;
};

export const updateCreatorTask = async (task: CreatorTask): Promise<CreatorTask | null> => {
  if (!task.id) throw new Error("Task ID required");
  const { id, ...rest } = task;
  const { data, error } = await supabase
    .from("creator_tasks")
    .update({ ...rest, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) { console.error("Error updating task:", error); throw error; }
  return data as unknown as CreatorTask;
};

export const deleteCreatorTask = async (taskId: string): Promise<void> => {
  const { error } = await supabase.from("creator_tasks").delete().eq("id", taskId);
  if (error) { console.error("Error deleting task:", error); throw error; }
};

// ==================== TASK COMMENTS ====================

export interface TaskComment {
  id?: string;
  task_id: string;
  content: string;
  author: string;
  created_at?: string;
}

export const getTaskComments = async (taskId: string): Promise<TaskComment[]> => {
  const { data, error } = await supabase
    .from("task_comments")
    .select("*")
    .eq("task_id", taskId)
    .order("created_at", { ascending: true });

  if (error) { console.error("Error fetching comments:", error); throw error; }
  return (data as unknown as TaskComment[]) || [];
};

export const addTaskComment = async (comment: Omit<TaskComment, 'id'>): Promise<TaskComment | null> => {
  const { data, error } = await supabase
    .from("task_comments")
    .insert([comment])
    .select()
    .single();

  if (error) { console.error("Error adding comment:", error); throw error; }
  return data as unknown as TaskComment;
};

export const deleteTaskComment = async (commentId: string): Promise<void> => {
  const { error } = await supabase.from("task_comments").delete().eq("id", commentId);
  if (error) { console.error("Error deleting comment:", error); throw error; }
};

// ==================== EVENT PLANS ====================

export interface EventPlan {
  id?: string;
  name: string;
  location?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  days?: number;
  description?: string | null;
  created_at?: string;
}

export interface EventInfluencer {
  id?: string;
  event_id: string;
  influencer_id: string;
  influencer_name: string;
  influencer_image?: string | null;
  travel_aid?: number;
  confirmed?: boolean;
  notes?: string | null;
}

export interface EventExpense {
  id?: string;
  event_id: string;
  category: string;
  description?: string | null;
  amount: number;
  per_day?: boolean;
}

export interface EventActivity {
  id?: string;
  event_id: string;
  title: string;
  platform?: string | null;
  type?: string | null;
  description?: string | null;
  required?: boolean;
}

// Event plans CRUD
export const getEventPlans = async (): Promise<EventPlan[]> => {
  const { data, error } = await supabase.from("event_plans").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return (data as unknown as EventPlan[]) || [];
};

export const upsertEventPlan = async (plan: EventPlan): Promise<EventPlan | null> => {
  const { data, error } = await supabase.from("event_plans").upsert([plan]).select().single();
  if (error) throw error;
  return data as unknown as EventPlan;
};

export const deleteEventPlan = async (id: string): Promise<void> => {
  const { error } = await supabase.from("event_plans").delete().eq("id", id);
  if (error) throw error;
};

// Event influencers CRUD
export const getEventInfluencers = async (eventId: string): Promise<EventInfluencer[]> => {
  const { data, error } = await supabase.from("event_influencers").select("*").eq("event_id", eventId);
  if (error) throw error;
  return (data as unknown as EventInfluencer[]) || [];
};

export const addEventInfluencer = async (inf: EventInfluencer): Promise<EventInfluencer | null> => {
  const { data, error } = await supabase.from("event_influencers").insert([inf]).select().single();
  if (error) throw error;
  return data as unknown as EventInfluencer;
};

export const updateEventInfluencer = async (inf: EventInfluencer): Promise<EventInfluencer | null> => {
  const { data, error } = await supabase.from("event_influencers").update(inf).eq("id", inf.id).select().single();
  if (error) throw error;
  return data as unknown as EventInfluencer;
};

export const deleteEventInfluencer = async (id: string): Promise<void> => {
  const { error } = await supabase.from("event_influencers").delete().eq("id", id);
  if (error) throw error;
};

// Event expenses CRUD
export const getEventExpenses = async (eventId: string): Promise<EventExpense[]> => {
  const { data, error } = await supabase.from("event_expenses").select("*").eq("event_id", eventId);
  if (error) throw error;
  return (data as unknown as EventExpense[]) || [];
};

export const addEventExpense = async (exp: EventExpense): Promise<EventExpense | null> => {
  const { data, error } = await supabase.from("event_expenses").insert([exp]).select().single();
  if (error) throw error;
  return data as unknown as EventExpense;
};

export const updateEventExpense = async (exp: EventExpense): Promise<EventExpense | null> => {
  const { data, error } = await supabase.from("event_expenses").update(exp).eq("id", exp.id).select().single();
  if (error) throw error;
  return data as unknown as EventExpense;
};

export const deleteEventExpense = async (id: string): Promise<void> => {
  const { error } = await supabase.from("event_expenses").delete().eq("id", id);
  if (error) throw error;
};

// Event activities CRUD
export const getEventActivities = async (eventId: string): Promise<EventActivity[]> => {
  const { data, error } = await supabase.from("event_activities").select("*").eq("event_id", eventId);
  if (error) throw error;
  return (data as unknown as EventActivity[]) || [];
};

export const addEventActivity = async (act: EventActivity): Promise<EventActivity | null> => {
  const { data, error } = await supabase.from("event_activities").insert([act]).select().single();
  if (error) throw error;
  return data as unknown as EventActivity;
};

export const updateEventActivity = async (act: EventActivity): Promise<EventActivity | null> => {
  const { data, error } = await supabase.from("event_activities").update(act).eq("id", act.id).select().single();
  if (error) throw error;
  return data as unknown as EventActivity;
};

export const deleteEventActivity = async (id: string): Promise<void> => {
  const { error } = await supabase.from("event_activities").delete().eq("id", id);
  if (error) throw error;
};
