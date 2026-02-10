import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Twitter, Users, Tv, Save, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Influencer,
  Community,
  Streamer,
  getInfluencers,
  getCommunities,
  getStreamers,
  updateInfluencer,
  updateCommunity,
  updateStreamer,
  addStreamer,
  addInfluencer,
  addCommunity,
} from "@/lib/entityData";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const Dashboard = () => {
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [streamers, setStreamers] = useState<Streamer[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Track changes
  const [changedInfluencers, setChangedInfluencers] = useState<Set<string>>(new Set());
  const [changedCommunities, setChangedCommunities] = useState<Set<string>>(new Set());
  const [changedStreamers, setChangedStreamers] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [inf, comm, str] = await Promise.all([
          getInfluencers(),
          getCommunities(),
          getStreamers(),
        ]);
        setInfluencers(inf);
        setCommunities(comm);
        setStreamers(str);
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Error loading data");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const toggleInfluencerVisibility = (id: string) => {
    const influencer = influencers.find(inf => inf.id === id);
    if (!influencer) return;

    // Toggle the visible property (default to true if undefined)
    const newVisible = influencer.visible === undefined ? false : !influencer.visible;

    handleInfluencerFieldChange(id, "visible", newVisible as any);
  };

  const handleInfluencerFieldChange = (id: string, field: keyof Influencer, value: string | boolean) => {
    setInfluencers(prev => prev.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
    setChangedInfluencers(prev => new Set(prev).add(id));
  };

  const toggleCommunityVisibility = (id: string) => {
    const community = communities.find(c => c.id === id);
    if (!community) return;

    // Toggle visible property, default to true if undefined
    const newVisible = community.visible === undefined ? false : !community.visible;
    handleCommunityFieldChange(id, "visible", newVisible as any);
  };

  const handleCommunityFieldChange = (id: string, field: keyof Community, value: string | boolean) => {
    setCommunities(prev => prev.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
    setChangedCommunities(prev => new Set(prev).add(id));
  };

  const toggleStreamerVisibility = (id: string) => {
    const streamer = streamers.find(s => s.id === id);
    if (!streamer) return;

    // Toggle visible property, default to true if undefined
    const newVisible = streamer.visible === undefined ? false : !streamer.visible;
    handleStreamerFieldChange(id, "visible", newVisible as any);
  };

  const handleStreamerFieldChange = (id: string, field: keyof Streamer, value: string | boolean) => {
    setStreamers(prev => prev.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
    setChangedStreamers(prev => new Set(prev).add(id));
  };

  const handleAddStreamer = async () => {
    try {
      const newStreamer = await addStreamer({
        name: "New Streamer",
        platform: "twitch",
        handle: "@new",
        followers: "",
        category: "Crypto",
      });
      if (newStreamer) {
        setStreamers(prev => [...prev, newStreamer]);
        toast.success("Streamer added!");
      }
    } catch (error) {
      toast.error("Error adding streamer");
    }
  };

  const handleAddInfluencer = async () => {
    try {
      const newInfluencer = await addInfluencer({
        name: "New Influencer",
        handle: "@new",
        category: "Crypto",
        followers: "",
        engagement: "",
      });
      if (newInfluencer) {
        setInfluencers(prev => [...prev, newInfluencer]);
        toast.success("Influencer added!");
      }
    } catch (error) {
      toast.error("Error adding influencer");
    }
  };

  const handleAddCommunity = async () => {
    try {
      const newCommunity = await addCommunity({
        name: "New Community",
      });
      if (newCommunity) {
        setCommunities(prev => [...prev, newCommunity]);
        toast.success("Community added!");
      }
    } catch (error) {
      toast.error("Error adding community");
    }
  };

  const saveAll = async () => {
    setSaving(true);
    try {
      // Save influencer changes
      for (const id of changedInfluencers) {
        const item = influencers.find(i => i.id === id);
        if (item) {
          await updateInfluencer(id, {
            name: item.name,
            handle: item.handle,
            category: item.category,
            followers: item.followers,
            tier: item.tier,
            image_url: item.image_url,
            visible: item.visible,
            detailed_info: item.detailed_info,
          });
        }
      }

      // Save community changes
      for (const id of changedCommunities) {
        const item = communities.find(c => c.id === id);
        if (item) {
          await updateCommunity(id, {
            name: item.name,
            twitter_handle: item.twitter_handle,
            discord_url: item.discord_url,
            website_url: item.website_url,
            members: item.members,
            image_url: item.image_url,
            visible: item.visible,
          });
        }
      }

      // Save streamer changes
      for (const id of changedStreamers) {
        const item = streamers.find(s => s.id === id);
        if (item) {
          await updateStreamer(id, {
            name: item.name,
            handle: item.handle,
            category: item.category,
            platform: item.platform,
            followers: item.followers,
            image_url: item.image_url,
            twitch_url: item.twitch_url,
            twitter_handle: item.twitter_handle,
            visible: item.visible,
          });
        }
      }

      // Clear change tracking
      setChangedInfluencers(new Set());
      setChangedCommunities(new Set());
      setChangedStreamers(new Set());

      toast.success("Data saved successfully!");
    } catch (error) {
      console.error("Error saving:", error);
      toast.error("Error saving data");
    } finally {
      setSaving(false);
    }
  };

  const hasChanges = changedInfluencers.size > 0 || changedCommunities.size > 0 || changedStreamers.size > 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold font-display">Image Dashboard</h1>
              <p className="text-muted-foreground text-sm">Manage photos for presentation cards</p>
            </div>
          </div>
          <Button onClick={saveAll} disabled={saving || !hasChanges} className="gap-2">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {hasChanges ? "Save Changes" : "Saved"}
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="influencers" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="influencers" className="gap-2">
              <Twitter className="w-4 h-4" />
              Influencers ({influencers.length})
            </TabsTrigger>
            <TabsTrigger value="communities" className="gap-2">
              <Users className="w-4 h-4" />
              Communities ({communities.length})
            </TabsTrigger>
            <TabsTrigger value="streamers" className="gap-2">
              <Tv className="w-4 h-4" />
              Streamers ({streamers.length})
            </TabsTrigger>
          </TabsList>

          {/* Influencers Tab */}
          <TabsContent value="influencers">
            <div className="mb-4">
              <Button onClick={handleAddInfluencer} variant="outline" className="gap-2">
                <Twitter className="w-4 h-4" />
                Add Influencer
              </Button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {influencers.map((inf) => (
                <Card key={inf.id} className={`overflow-hidden ${changedInfluencers.has(inf.id) ? 'ring-2 ring-primary' : ''}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
                        {inf.image_url ? (
                          <img
                            src={inf.image_url}
                            alt={inf.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <Twitter className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <Input
                          value={inf.name}
                          onChange={(e) => handleInfluencerFieldChange(inf.id, "name", e.target.value)}
                          className="text-base font-semibold h-7 px-2 mb-2"
                          placeholder="Name"
                        />
                        <div className="flex items-center gap-2 px-2">
                          <Switch
                            id={`visible-${inf.id}`}
                            checked={inf.visible !== false}
                            onCheckedChange={() => toggleInfluencerVisibility(inf.id)}
                            className="scale-75"
                          />
                          <Label htmlFor={`visible-${inf.id}`} className="text-xs text-muted-foreground cursor-pointer">
                            Visible on Slide
                          </Label>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs text-muted-foreground">Handle</label>
                        <Input
                          value={inf.handle}
                          onChange={(e) => handleInfluencerFieldChange(inf.id, "handle", e.target.value)}
                          className="text-sm h-8"
                          placeholder="@username"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">Category</label>
                        <Input
                          value={inf.category}
                          onChange={(e) => handleInfluencerFieldChange(inf.id, "category", e.target.value)}
                          className="text-sm h-8"
                          placeholder="Crypto"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs text-muted-foreground">Followers</label>
                        <Input
                          value={inf.followers}
                          onChange={(e) => handleInfluencerFieldChange(inf.id, "followers", e.target.value)}
                          className="text-sm h-8"
                          placeholder="10K"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">Tier</label>
                        <select
                          value={inf.tier || "Small"}
                          onChange={(e) => handleInfluencerFieldChange(inf.id, "tier", e.target.value)}
                          className="w-full h-8 rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <option value="Small">Small</option>
                          <option value="Medium">Medium</option>
                          <option value="Top">Top</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Image URL</label>
                      <Input
                        placeholder="https://example.com/photo.jpg"
                        value={inf.image_url || ""}
                        onChange={(e) => handleInfluencerFieldChange(inf.id, "image_url", e.target.value)}
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Detailed Info</label>
                      <textarea
                        value={inf.detailed_info || ""}
                        onChange={(e) => handleInfluencerFieldChange(inf.id, "detailed_info", e.target.value)}
                        className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Additional details here..."
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Communities Tab */}
          <TabsContent value="communities">
            <div className="mb-4">
              <Button onClick={handleAddCommunity} variant="outline" className="gap-2">
                <Users className="w-4 h-4" />
                Add Community
              </Button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {communities.map((comm) => (
                <Card key={comm.id} className={`overflow-hidden ${changedCommunities.has(comm.id) ? 'ring-2 ring-primary' : ''}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
                        {comm.image_url ? (
                          <img
                            src={comm.image_url}
                            alt={comm.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <Users className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <Input
                          value={comm.name}
                          onChange={(e) => handleCommunityFieldChange(comm.id, "name", e.target.value)}
                          className="text-base font-semibold h-7 px-2 mb-2"
                          placeholder="Community Name"
                        />
                        <div className="flex items-center gap-2 px-2">
                          <Switch
                            id={`visible-comm-${comm.id}`}
                            checked={comm.visible !== false}
                            onCheckedChange={() => toggleCommunityVisibility(comm.id)}
                            className="scale-75"
                          />
                          <Label htmlFor={`visible-comm-${comm.id}`} className="text-xs text-muted-foreground cursor-pointer">
                            Visible on Slide
                          </Label>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-3">
                    <div>
                      <label className="text-xs text-muted-foreground">Twitter Handle</label>
                      <Input
                        value={comm.twitter_handle || ""}
                        onChange={(e) => handleCommunityFieldChange(comm.id, "twitter_handle", e.target.value)}
                        className="text-sm h-8"
                        placeholder="@community"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Discord URL</label>
                      <Input
                        value={comm.discord_url || ""}
                        onChange={(e) => handleCommunityFieldChange(comm.id, "discord_url", e.target.value)}
                        className="text-sm h-8"
                        placeholder="https://discord.gg/..."
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Website URL</label>
                      <Input
                        value={comm.website_url || ""}
                        onChange={(e) => handleCommunityFieldChange(comm.id, "website_url", e.target.value)}
                        className="text-sm h-8"
                        placeholder="https://..."
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Members</label>
                      <Input
                        value={comm.members || ""}
                        onChange={(e) => handleCommunityFieldChange(comm.id, "members", e.target.value)}
                        className="text-sm h-8"
                        placeholder="e.g. 15,000"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Image URL</label>
                      <Input
                        placeholder="https://example.com/logo.jpg"
                        value={comm.image_url || ""}
                        onChange={(e) => handleCommunityFieldChange(comm.id, "image_url", e.target.value)}
                        className="text-sm"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Streamers Tab */}
          <TabsContent value="streamers">
            <div className="mb-4">
              <Button onClick={handleAddStreamer} variant="outline" className="gap-2">
                <Tv className="w-4 h-4" />
                Add Streamer
              </Button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {streamers.map((str) => (
                <Card key={str.id} className={`overflow-hidden ${changedStreamers.has(str.id) ? 'ring-2 ring-primary' : ''}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
                        {str.image_url ? (
                          <img
                            src={str.image_url}
                            alt={str.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <Tv className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <Input
                          value={str.name}
                          onChange={(e) => handleStreamerFieldChange(str.id, "name", e.target.value)}
                          className="text-base font-semibold h-7 px-2 mb-2"
                        />
                        <div className="flex items-center gap-2 px-2">
                          <Switch
                            id={`visible-str-${str.id}`}
                            checked={str.visible !== false}
                            onCheckedChange={() => toggleStreamerVisibility(str.id)}
                            className="scale-75"
                          />
                          <Label htmlFor={`visible-str-${str.id}`} className="text-xs text-muted-foreground cursor-pointer">
                            Visible on Slide
                          </Label>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs text-muted-foreground">Handle</label>
                        <Input
                          value={str.handle}
                          onChange={(e) => handleStreamerFieldChange(str.id, "handle", e.target.value)}
                          className="text-sm h-8"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">Category</label>
                        <Input
                          value={str.category}
                          onChange={(e) => handleStreamerFieldChange(str.id, "category", e.target.value)}
                          className="text-sm h-8"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="text-xs text-muted-foreground">Followers</label>
                        <Input
                          value={str.followers || ""}
                          onChange={(e) => handleStreamerFieldChange(str.id, "followers", e.target.value)}
                          placeholder="e.g. 50K"
                          className="text-sm h-8"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Platform</label>
                      <select
                        value={str.platform}
                        onChange={(e) => handleStreamerFieldChange(str.id, "platform", e.target.value)}
                        className="w-full h-8 rounded-md border border-input bg-background px-3 text-sm"
                      >
                        <option value="twitch">Twitch</option>
                        <option value="youtube">YouTube</option>
                        <option value="both">Both</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Twitch URL</label>
                      <Input
                        placeholder="https://www.twitch.tv/..."
                        value={str.twitch_url || ""}
                        onChange={(e) => handleStreamerFieldChange(str.id, "twitch_url", e.target.value)}
                        className="text-sm h-8"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Twitter Handle</label>
                      <Input
                        placeholder="@username"
                        value={str.twitter_handle || ""}
                        onChange={(e) => handleStreamerFieldChange(str.id, "twitter_handle", e.target.value)}
                        className="text-sm h-8"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Image URL</label>
                      <Input
                        placeholder="https://example.com/photo.jpg"
                        value={str.image_url || ""}
                        onChange={(e) => handleStreamerFieldChange(str.id, "image_url", e.target.value)}
                        className="text-sm"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div >
  );
};

export default Dashboard;
