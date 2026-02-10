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
