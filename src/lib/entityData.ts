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
