import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Lock, User, LogIn, RefreshCw, Users, ShieldCheck } from "lucide-react";
import { isSupabaseConfigured, supabase } from "../lib/supabaseClient";
import { useAdmin } from "../context/AdminContext";

// Import Layout and Managers
import AdminLayout from "../components/admin/AdminLayout";
import DashboardStats from "../components/admin/DashboardStats";
import EventsManager from "../components/admin/EventsManager";
import BlogManager from "../components/admin/BlogManager";
import MembersManager from "../components/admin/MembersManager";
import GalleryManager from "../components/admin/GalleryManager";
import AdminsManager from "../components/admin/AdminsManager";
import ResourcesManager from "../components/admin/ResourcesManager";

const Admin = () => {
  const { admin, isLoading: authLoading, login, logout, hasAccess, isAuthenticated } = useAdmin();
  
  const [authError, setAuthError] = useState("");
  const [loginMode, setLoginMode] = useState("team");
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  });

  // Dashboard State
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isDashboardLoading, setIsDashboardLoading] = useState(false);
  const [lastUpdatedAt, setLastUpdatedAt] = useState(null);

  const [stats, setStats] = useState({
    events: null,
    members: null,
    posts: null,
    gallery: null,
  });
  const [recent, setRecent] = useState({ event: null, post: null });

  const [events, setEvents] = useState([]);
  const [members, setMembers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [galleryItems, setGalleryItems] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [resources, setResources] = useState([]);

  /* -------------------------------------------------------------------------- */
  /*                                Data Fetching                               */
  /* -------------------------------------------------------------------------- */

  const loadDashboard = async () => {
    if (!supabase) return;
    setIsDashboardLoading(true);
    try {
      const [eventsCount, membersCount, postsCount, galleryCount] =
        await Promise.all([
          supabase.from("events").select("id", { count: "exact", head: true }),
          supabase.from("members").select("id", { count: "exact", head: true }),
          supabase
            .from("blog_posts")
            .select("id", { count: "exact", head: true }),
          supabase
            .from("gallery_items")
            .select("id", { count: "exact", head: true }),
        ]);

      setStats({
        events: eventsCount.count ?? 0,
        members: membersCount.count ?? 0,
        posts: postsCount.count ?? 0,
        gallery: galleryCount.count ?? 0,
      });

      const [latestEvent, latestPost] = await Promise.all([
        supabase
          .from("events")
          .select("title, created_at")
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle(),
        supabase
          .from("blog_posts")
          .select("title, created_at")
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle(),
      ]);

      setRecent({ event: latestEvent.data, post: latestPost.data });
    } catch (error) {
      console.error(error);
    } finally {
      setIsDashboardLoading(false);
    }
  };

  const loadLists = async () => {
    if (!supabase || !admin) return;
    setIsDashboardLoading(true);
    try {
      const promises = [];
      let eventsIndex = -1, membersIndex = -1, postsIndex = -1, galleryIndex = -1, resourcesIndex = -1, adminsIndex = -1;
      let currentIndex = 0;

      // Events - super_admin and admin can see all
      if (hasAccess('events')) {
        eventsIndex = currentIndex++;
        promises.push(
          supabase
            .from("events")
            .select("*")
            .order("created_at", { ascending: false })
        );
      }

      // Members - only super_admin. The public table uses is_published;
      // expose is_active as a UI compatibility alias for MembersManager.
      if (hasAccess('members')) {
        membersIndex = currentIndex++;
        promises.push(
          supabase
            .from("members")
            .select("*")
            .order("is_published", { ascending: false })
            .order("display_order", { ascending: true })
            .order("created_at", { ascending: false })
        );
      }

      // Blog Posts - super_admin sees all, others see only their own
      postsIndex = currentIndex++;
      if (admin.admin_type === 'super_admin') {
        promises.push(
          supabase
            .from("blog_posts")
            .select("*")
            .order("created_at", { ascending: false })
        );
      } else {
        promises.push(
          supabase
            .from("blog_posts")
            .select("*")
            .eq("created_by", admin.admin_id)
            .order("created_at", { ascending: false })
        );
      }

      // Gallery - super_admin and admin can see all
      if (hasAccess('gallery')) {
        galleryIndex = currentIndex++;
        promises.push(
          supabase
            .from("gallery_items")
            .select("*")
            .order("created_at", { ascending: false })
        );
      }

      // Resources - super_admin sees all, others see only their own
      resourcesIndex = currentIndex++;
      if (admin.admin_type === 'super_admin') {
        promises.push(
          supabase
            .from("resources")
            .select("*")
            .order("created_at", { ascending: false })
        );
      } else {
        promises.push(
          supabase
            .from("resources")
            .select("*")
            .eq("created_by", admin.admin_id)
            .order("created_at", { ascending: false })
        );
      }

      // Admins - only super_admin
      if (hasAccess('admins')) {
        adminsIndex = currentIndex++;
        promises.push(
          supabase
            .from("admins")
            .select("*")
            .order("created_at", { ascending: false })
        );
      }

      const results = await Promise.all(promises);
      
      if (eventsIndex >= 0) setEvents(results[eventsIndex].data || []);
      if (membersIndex >= 0) {
        const memberResult = results[membersIndex];
        if (memberResult.error) throw memberResult.error;
        setMembers((memberResult.data || []).map((member) => ({
          ...member,
          is_active: member.is_published,
        })));
      }
      if (postsIndex >= 0) setPosts(results[postsIndex].data || []);
      if (galleryIndex >= 0) setGalleryItems(results[galleryIndex].data || []);
      if (resourcesIndex >= 0) setResources(results[resourcesIndex].data || []);
      if (adminsIndex >= 0) setAdmins(results[adminsIndex].data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsDashboardLoading(false);
    }
  };

  const refreshAll = async () => {
    setIsDashboardLoading(true);
    try {
      await Promise.all([loadDashboard(), loadLists()]);
      setLastUpdatedAt(new Date().toISOString());
    } finally {
      setIsDashboardLoading(false);
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                                CRUD Handlers                               */
  /* -------------------------------------------------------------------------- */

  const handleCreate = async (table, data) => {
    if (!supabase || !admin) return;
    setIsDashboardLoading(true);
    
    // Special handling for admins table using RPC
    if (table === 'admins') {
      const { error } = await supabase.rpc('create_admin_with_auth', {
        p_email: data.email,
        p_password: data.password,
        p_admin_name: data.admin_name,
        p_admin_type: data.admin_type,
        p_team_name: data.team_name,
        p_admin_position: data.admin_position,
        p_is_active: data.is_active
      });
      if (error) alert(`Error: ${error.message}`);
    } else if (table === 'members') {
      // Use the members table directly; no legacy RPC is required.
      const { is_active, ...memberData } = data;
      const payload = {
        ...memberData,
        is_published: data.is_published ?? is_active ?? false,
        bio: data.bio || null,
        display_order: Number(data.display_order) || 0,
      };
      const { data: createdMember, error } = await supabase
        .from("members")
        .insert(payload)
        .select("*")
        .single();

      if (error) {
        alert(`Error creating member: ${error.message}`);
        return null;
      }

      await refreshAll();
      return { id: createdMember.id, ...createdMember };
    } else {
      const { error } = await supabase.from(table).insert({
        ...data,
        created_by: admin.admin_id,
      });
      if (error) alert(`Error: ${error.message}`);
    }
    await refreshAll();
  };

  const handleUpdate = async (table, id, data) => {
    if (!supabase || !admin) return;
    setIsDashboardLoading(true);
    
    // Special handling for admins table using RPC
    if (table === 'admins') {
      const { error } = await supabase.rpc('update_admin', {
        p_admin_id: id,
        p_admin_name: data.admin_name,
        p_email: data.email,
        p_admin_type: data.admin_type,
        p_team_name: data.team_name,
        p_admin_position: data.admin_position,
        p_is_active: data.is_active
      });
      if (error) alert(`Error: ${error.message}`);
    } else if (table === 'members') {
      // Map the manager's is_active UI flag to the database's is_published field.
      const { is_active, ...memberData } = data;
      const payload = {
        ...memberData,
        ...(data.is_published !== undefined || is_active !== undefined
          ? { is_published: data.is_published ?? is_active }
          : {}),
        ...(data.display_order !== undefined
          ? { display_order: Number(data.display_order) || 0 }
          : {}),
      };
      const { error } = await supabase
        .from("members")
        .update(payload)
        .eq("id", id);
      if (error) {
        alert(`Error updating member: ${error.message}`);
        throw error;
      }
    } else {
      const { error } = await supabase.from(table).update(data).eq("id", id);
      if (error) alert(`Error: ${error.message}`);
    }
    await refreshAll();
  };

  const handleDelete = async (table, id) => {
    if (!supabase || !admin) return;
    if (!confirm("Are you sure you want to delete this specific item?")) return;
    setIsDashboardLoading(true);
    
    // Special handling for admins table using RPC
    if (table === 'admins') {
      const { error } = await supabase.rpc('delete_admin', {
        p_admin_id: id
      });
      if (error) alert(`Error: ${error.message}`);
    } else if (table === 'members') {
      const { error } = await supabase.from("members").delete().eq("id", id);
      if (error) {
        alert(`Error deleting member: ${error.message}`);
        throw error;
      }
    } else {
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) alert(`Error: ${error.message}`);
    }
    await refreshAll();
  };

  // Specialized Event Saver (Deep Save)
  const handleSaveEvent = async (eventData, isEdit = false, id = null) => {
    if (!supabase || !admin) return;
    setIsDashboardLoading(true);

    try {
      // 1. Separate generic fields from relation fields
      const { timeline, themes, prizes, ...mainData } = eventData;

      let eventId = id;

      if (isEdit && id) {
        // Update Main Event
        const { error } = await supabase
          .from("events")
          .update(mainData)
          .eq("id", id);
        if (error) throw error;
      } else {
        // Create Main Event
        const { data, error } = await supabase
          .from("events")
          .insert({ ...mainData, created_by: admin.admin_id })
          .select()
          .single();
        if (error) throw error;
        eventId = data.id;
      }

      // 2. Handle Relations (Timeline, Themes, Prizes)
      if (isEdit) {
        await Promise.all([
          supabase
            .from("event_timeline_items")
            .delete()
            .eq("event_id", eventId),
          supabase.from("event_themes").delete().eq("event_id", eventId),
          supabase.from("event_prizes").delete().eq("event_id", eventId),
        ]);
      }

      const operations = [];

      if (timeline && timeline.length > 0) {
        const timelineRows = timeline.map((item, index) => ({
          event_id: eventId,
          title: item.title,
          date: item.date,
          time: item.time,
          label: item.label || "COMPLETE",
          description: item.description,
          order_index: index,
          created_by: admin.admin_id,
        }));
        operations.push(
          supabase.from("event_timeline_items").insert(timelineRows)
        );
      }

      if (themes && themes.length > 0) {
        const themeRows = themes.map((theme, index) => ({
          event_id: eventId,
          theme,
          order_index: index,
          created_by: admin.admin_id,
        }));
        operations.push(supabase.from("event_themes").insert(themeRows));
      }

      if (prizes && prizes.length > 0) {
        const prizeRows = prizes.map((prize, index) => ({
          event_id: eventId,
          position: prize.position,
          amount: prize.amount,
          description: prize.description,
          created_by: admin.admin_id,
        }));
        operations.push(supabase.from("event_prizes").insert(prizeRows));
      }

      await Promise.all(operations);
      
      // Return event ID for image upload
      return { id: eventId };
    } catch (error) {
      console.error("Save Event Error:", error);
      alert(`Failed to save event: ${error.message}`);
      throw error;
    } finally {
      await refreshAll();
      setIsDashboardLoading(false);
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                                Auth Effects                                */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      refreshAll();
    }
  }, [isAuthenticated, authLoading]);

  // Protect against unauthorized tab access
  useEffect(() => {
    if (!isAuthenticated || !admin) return;

    const tabPermissions = {
      'dashboard': true,
      'admins': hasAccess('admins'),
      'events': hasAccess('events'),
      'members': hasAccess('members'),
      'blog': hasAccess('blogs'),
      'gallery': hasAccess('gallery'),
      'resources': hasAccess('resources'),
    };

    if (!tabPermissions[activeTab]) {
      setActiveTab('dashboard');
    }
  }, [activeTab, isAuthenticated, admin]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError("");

    const result = await login(
      credentials.email,
      "",
      "",
      credentials.password
    );

    if (!result.success) {
      setAuthError(result.error || "Invalid email or password.");
      return;
    }

    const role = result.admin?.role || result.admin?.admin_type;
    const isFounderAccount = role === "super_admin";

    // The selected mode must match the verified database role.
    if (loginMode === "founder" && !isFounderAccount) {
      await logout();
      setAuthError("Founder Login is only available to the authorized Founder account.");
      return;
    }

    if (loginMode === "team" && isFounderAccount) {
      await logout();
      setAuthError("Please select Founder Login for this account.");
    }
  };

  const handleLogout = async () => {
    await logout();
    setCredentials({ email: "", password: "" });
  };

  /* -------------------------------------------------------------------------- */
  /*                                Render Views                                */
  /* -------------------------------------------------------------------------- */

  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Configuration Error
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Supabase is not configured properly. Please check your environment
            variables.
          </p>
        </div>
      </div>
    );
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sharda-blue"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
        >
          <div className="text-center mb-8">
            <div className="inline-flex p-4 bg-sharda-blue/10 rounded-2xl mb-4">
              <Lock className="w-8 h-8 text-sharda-blue" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              AARAMBH Admin Access
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Choose how you want to sign in
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => { setLoginMode("team"); setAuthError(""); }}
              className={`rounded-xl border p-4 text-left transition-all ${loginMode === "team" ? "border-sharda-blue bg-sharda-blue/10 ring-2 ring-sharda-blue/20" : "border-gray-200 dark:border-gray-600 hover:border-sharda-blue/50"}`}
            >
              <Users className={`w-6 h-6 mb-2 ${loginMode === "team" ? "text-sharda-blue" : "text-gray-500"}`} />
              <span className="block font-semibold text-gray-900 dark:text-white">Team Login</span>
              <span className="block text-xs text-gray-500 dark:text-gray-400 mt-1">Authorized team</span>
            </button>
            <button
              type="button"
              onClick={() => { setLoginMode("founder"); setAuthError(""); }}
              className={`rounded-xl border p-4 text-left transition-all ${loginMode === "founder" ? "border-purple-500 bg-purple-500/10 ring-2 ring-purple-500/20" : "border-gray-200 dark:border-gray-600 hover:border-purple-500/50"}`}
            >
              <ShieldCheck className={`w-6 h-6 mb-2 ${loginMode === "founder" ? "text-purple-500" : "text-gray-500"}`} />
              <span className="block font-semibold text-gray-900 dark:text-white">Founder Login</span>
              <span className="block text-xs text-gray-500 dark:text-gray-400 mt-1">Super admin only</span>
            </button>
          </div>

          <div className="mb-5 text-center">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {loginMode === "founder" ? "Founder Sign In" : "Team Sign In"}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {loginMode === "founder" ? "Sign in with your authorized Founder account." : "Sign in with your authorized team account."}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  autoComplete="username"
                  value={credentials.email}
                  onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-sharda-blue/20 outline-none transition-all"
                  placeholder={loginMode === "founder" ? "Founder email address" : "Team email address"}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  autoComplete="current-password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-sharda-blue/20 outline-none transition-all"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            {authError && (
              <div role="alert" className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm border border-red-100 dark:border-red-900/30">
                {authError}
              </div>
            )}

            <button
              type="submit"
              className={`w-full text-white py-3 rounded-xl font-semibold active:scale-[0.98] transition-all flex items-center justify-center gap-2 ${loginMode === "founder" ? "bg-purple-600 hover:bg-purple-700" : "bg-sharda-blue hover:bg-blue-600"}`}
            >
              <LogIn size={20} />
              {loginMode === "founder" ? "Founder Sign In" : "Team Sign In"}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        // Build quick actions based on access
        const quickActions = [];
        
        if (hasAccess('events')) {
          quickActions.push({ 
            label: "Create Event", 
            onClick: () => setActiveTab("events") 
          });
        }
        
        quickActions.push({
          label: "Write Blog Post",
          onClick: () => setActiveTab("blog"),
          className: "bg-blue-50 dark:bg-blue-900/20 text-sharda-blue hover:bg-blue-100",
        });
        
        if (hasAccess('members')) {
          quickActions.push({
            label: "Add Member",
            onClick: () => setActiveTab("members"),
            className: "bg-green-50 dark:bg-green-900/20 text-green-600 hover:bg-green-100",
          });
        }
        
        if (hasAccess('gallery')) {
          quickActions.push({
            label: "Upload Photo",
            onClick: () => setActiveTab("gallery"),
            className: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 hover:bg-purple-100",
          });
        }

        if (admin?.admin_type === "super_admin") {
          const founderCards = [
            { label: "Events", value: stats.events ?? 0, detail: "Manage programs and event timelines", tab: "events", icon: "✦", tone: "from-blue-500 to-cyan-400" },
            { label: "Community Members", value: stats.members ?? 0, detail: "Review member profiles and teams", tab: "members", icon: "◎", tone: "from-violet-500 to-fuchsia-500" },
            { label: "Published Posts", value: stats.posts ?? 0, detail: "Oversee community stories and updates", tab: "blog", icon: "✎", tone: "from-cyan-500 to-emerald-400" },
            { label: "Gallery Assets", value: stats.gallery ?? 0, detail: "Curate public photos and memories", tab: "gallery", icon: "▧", tone: "from-amber-400 to-orange-500" },
          ];

          return (
            <div className="aarambh-admin-compact space-y-6">
              <style>{`
                .aarambh-admin-compact h1 { font-size: clamp(1.65rem, 2.4vw, 2rem) !important; line-height: 1.2 !important; }
                .aarambh-admin-compact h2 { font-size: clamp(1.2rem, 1.8vw, 1.45rem) !important; line-height: 1.3 !important; }
                .aarambh-admin-compact h3 { font-size: 1rem !important; line-height: 1.35 !important; }
                .aarambh-admin-compact p { line-height: 1.5; }
              `}</style>
              <section className="relative overflow-hidden rounded-2xl border border-slate-700 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 p-5 md:p-6 text-white">
                <div className="absolute -right-12 -top-16 h-48 w-48 rounded-full bg-blue-500/15 blur-3xl" />
                <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1 text-xs font-semibold tracking-wide text-cyan-300">
                      <ShieldCheck size={14} /> FOUNDER CONTROL ROOM
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">Welcome back, Founder.</h1>
                    <p className="mt-2 max-w-2xl text-sm text-slate-300">Your overview of AARAMBH operations, content, events, and community activity.</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
                    <div className="text-xs text-slate-400">SIGNED IN AS</div>
                    <div className="mt-1 font-semibold">{admin?.email || admin?.admin_name}</div>
                    <div className="mt-1 text-xs font-medium text-emerald-300">Super Admin · Full dashboard role</div>
                  </div>
                </div>
              </section>

              <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {founderCards.map((card) => (
                  <button key={card.tab} onClick={() => setActiveTab(card.tab)} className="group rounded-2xl border border-slate-700/80 bg-slate-800/80 p-4 text-left transition hover:-translate-y-0.5 hover:border-blue-400/60 hover:bg-slate-800">
                    <div className="flex items-start justify-between gap-3">
                      <span className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${card.tone} text-lg font-bold text-white shadow-lg`}>{card.icon}</span>
                      <span className="text-2xl font-bold tracking-tight text-white">{card.value}</span>
                    </div>
                    <div className="mt-4 text-sm font-semibold text-slate-100">{card.label}</div>
                    <p className="mt-1 text-xs text-slate-400">{card.detail}</p>
                    <div className="mt-3 text-xs font-semibold text-cyan-300">Open section →</div>
                  </button>
                ))}
              </section>

              <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1.15fr_0.85fr]">
                <div className="rounded-2xl border border-slate-700 bg-slate-800/70 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h2 className="font-bold text-white">Founder quick actions</h2>
                      <p className="mt-1 text-sm text-slate-400">Jump directly into the work that moves the community forward.</p>
                    </div>
                    <span className="rounded-lg bg-blue-500/15 px-2.5 py-1 text-xs font-semibold text-blue-300">CONTROL</span>
                  </div>
                  <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {[
                      { label: "Create or update an event", desc: "Timeline, themes, prizes", tab: "events" },
                      { label: "Manage community members", desc: "Profiles and team details", tab: "members" },
                      { label: "Publish a community story", desc: "Blog and announcements", tab: "blog" },
                      { label: "Curate event memories", desc: "Gallery and photos", tab: "gallery" },
                      { label: "Manage learning resources", desc: "Useful tools and materials", tab: "resources" },
                      { label: "Review admin access", desc: "Existing admin section", tab: "admins" },
                    ].map((action) => (
                      <button key={action.tab} onClick={() => setActiveTab(action.tab)} className="rounded-xl border border-slate-700 bg-slate-900/60 p-3 text-left transition hover:border-blue-400/60 hover:bg-slate-900">
                        <div className="text-sm font-semibold text-slate-100">{action.label}</div>
                        <div className="mt-1 text-xs text-slate-400">{action.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-700 bg-slate-800/70 p-5">
                  <h2 className="font-bold text-white">Recent activity</h2>
                  <p className="mt-1 text-sm text-slate-400">Latest content currently available in your database.</p>
                  <div className="mt-4 space-y-3">
                    <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-3">
                      <div className="text-xs font-semibold uppercase tracking-wide text-cyan-300">Latest event</div>
                      <div className="mt-1 text-sm font-semibold text-slate-100">{recent.event?.title || "No event activity found"}</div>
                      <div className="mt-1 text-xs text-slate-400">{recent.event?.created_at ? new Date(recent.event.created_at).toLocaleString() : "Create an event to start tracking activity."}</div>
                    </div>
                    <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-3">
                      <div className="text-xs font-semibold uppercase tracking-wide text-violet-300">Latest post</div>
                      <div className="mt-1 text-sm font-semibold text-slate-100">{recent.post?.title || "No post activity found"}</div>
                      <div className="mt-1 text-xs text-slate-400">{recent.post?.created_at ? new Date(recent.post.created_at).toLocaleString() : "Publish a story to start tracking activity."}</div>
                    </div>
                    <div className="rounded-xl border border-amber-400/20 bg-amber-400/5 p-3 text-xs leading-relaxed text-amber-100/80">
                      Team account creation and the legacy Admins list still require database integration; these shortcuts open the existing sections and do not create accounts by themselves.
                    </div>
                  </div>
                </div>
              </section>
            </div>
          );
        }

        return (
          <div className="aarambh-admin-compact">
            <style>{`
              .aarambh-admin-compact h1 { font-size: clamp(1.65rem, 2.4vw, 2rem) !important; line-height: 1.2 !important; }
              .aarambh-admin-compact h2 { font-size: clamp(1.2rem, 1.8vw, 1.45rem) !important; line-height: 1.3 !important; }
              .aarambh-admin-compact h3 { font-size: 1rem !important; line-height: 1.35 !important; }
            `}</style>
            <DashboardStats
              stats={stats}
              recent={recent}
              isLoading={isDashboardLoading}
              lastUpdatedAt={lastUpdatedAt}
              quickActions={quickActions}
            />
          </div>
        );
      case "admins":
        return (
          <AdminsManager
            admins={admins}
            onCreate={(data) => handleCreate("admins", data)}
            onEdit={(id, data) => handleUpdate("admins", id, data)}
            onDelete={(id) => handleDelete("admins", id)}
            isLoading={isDashboardLoading}
          />
        );
      case "events":
        return (
          <EventsManager
            events={events}
            onSave={handleSaveEvent}
            onDelete={(id) => handleDelete("events", id)}
            isLoading={isDashboardLoading}
          />
        );
      case "blog":
        return (
          <BlogManager
            posts={posts}
            onCreate={(data) => handleCreate("blog_posts", data)}
            onEdit={(id, data) => handleUpdate("blog_posts", id, data)}
            onDelete={(id) => handleDelete("blog_posts", id)}
            isLoading={isDashboardLoading}
          />
        );
      case "members":
        return (
          <MembersManager
            members={members}
            onCreate={(data) => handleCreate("members", data)}
            onEdit={(id, data) => handleUpdate("members", id, data)}
            onDelete={(id) => handleDelete("members", id)}
            isLoading={isDashboardLoading}
          />
        );
      case "gallery":
        return (
          <GalleryManager
            galleryItems={galleryItems}
            onCreate={(data) => handleCreate("gallery_items", data)}
            onEdit={(id, data) => handleUpdate("gallery_items", id, data)}
            onDelete={(id) => handleDelete("gallery_items", id)}
            isLoading={isDashboardLoading}
          />
        );
      case "resources":
        return (
          <ResourcesManager
            resources={resources}
            onCreate={(data) => handleCreate("resources", data)}
            onEdit={(id, data) => handleUpdate("resources", id, data)}
            onDelete={(id) => handleDelete("resources", id)}
            isLoading={isDashboardLoading}
            isSuperAdmin={admin?.admin_type === 'super_admin'}
          />
        );
      default:
        return <div>Select a tab</div>;
    }
  };

  const headerMeta = {
    dashboard: {
      title: "Dashboard",
      subtitle:
        "Quick overview of events, members, posts, and gallery content.",
    },
    admins: {
      title: "Admin Management",
      subtitle: "Manage admin users and their access levels to the system.",
    },
    events: {
      title: "Events",
      subtitle:
        "Create and manage upcoming events, timeline, themes, and prizes.",
    },
    members: {
      title: "Members",
      subtitle:
        "Manage teams, leads, and executive members shown on the website.",
    },
    blog: {
      title: "Blog",
      subtitle: "Publish and update blog posts visible on the website.",
    },
    gallery: {
      title: "Gallery",
      subtitle: "Upload and curate photos for the gallery section.",
    },
    resources: {
      title: "Resources",
      subtitle: "Manage community-submitted learning resources and tools.",
    },
  };

  const meta = headerMeta[activeTab] || headerMeta.dashboard;

  return (
    <AdminLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onLogout={handleLogout}
      headerTitle={meta.title}
      headerSubtitle={meta.subtitle}
      headerRight={
        <button
          onClick={refreshAll}
          disabled={isDashboardLoading}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-200 font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0"
        >
          <RefreshCw
            className={`w-4 h-4 ${isDashboardLoading ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      }
    >
      {renderContent()}
    </AdminLayout>
  );
};

export default Admin;
