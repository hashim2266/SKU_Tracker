import React, { useState, useEffect, useMemo } from 'react';
import {         
  LayoutDashboard,         
  TrendingUp,         
  CheckCircle2,         
  AlertCircle,        
  ChevronRight,        
  Save,        
  Edit3,        
  BarChart3,        
  FileText,        
  ShieldCheck,        
  Settings,        
  BookOpen,        
  Truck,        
  Building2,        
  Activity,        
  UserCheck,        
  Search,        
  Layers,        
  MessageSquareQuote,        
  Megaphone,        
  XCircle,        
  Database,        
  Calendar,        
  Lock        
} from 'lucide-react';

/**
 * SUPABASE CONFIGURATION
 * Fill with your Supabase project URL & Anon key.
 */
const SUPABASE_URL = ""; 
const SUPABASE_ANON_KEY = "";

const SECTIONS = [
  "Seksyen Kualiti, Majlis & Protokol (SKMP)",
  "Seksyen Pentadbiran & Kewangan (SPK)",
  "Unit Perpustakaan (LIB)",
  "Seksyen Pembangunan & Aset (SPAK)",
  "Unit Pembantu Operasi (PO)"
];

// Initial pre-seeded data sample (shortened for brevity)
const INITIAL_FULL_DATA = [
  { sku_name: "Mengurus Majlis Rasmi", sub_sku_name: "Peratus urusan penyediaan Kertas Cadangan penganjuran (14 hari bekerja).", unit: "Peratus", target: 100, actual: 0, section: "Seksyen Kualiti, Majlis & Protokol (SKMP)" },
  // ... (your full initial data)
];

export default function SKUMonitor() {
  const [supabaseClient, setSupabaseClient] = useState(null);
  const [kpis, setKpis] = useState([]);
  const [remarks, setRemarks] = useState({ text: "", updatedAt: "" });
  const [remarksInput, setRemarksInput] = useState("");
  const [activeSection, setActiveSection] = useState(SECTIONS[0]);
  const [isEditing, setIsEditing] = useState(null);
  const [isEditingRemarks, setIsEditingRemarks] = useState(false);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('dashboard');
  const [saveStatus, setSaveStatus] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDemo, setIsDemo] = useState(true);
  const [formData, setFormData] = useState({ sku_name: '', sub_sku_name: '', unit: 'Peratus', target: 0, actual: 0 });

  // Load Supabase from CDN dynamically
  useEffect(() => {
    const scriptId = 'supabase-sdk';
    if (document.getElementById(scriptId)) return;

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js';
    script.async = true;

    script.onload = () => {
      if (window.supabase && SUPABASE_URL && SUPABASE_ANON_KEY) {
        try {
          const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
          setSupabaseClient(client);
          setIsDemo(false);
        } catch (e) {
          console.warn("Supabase initialization failed:", e);
        }
      }
      setLoading(false);
    };

    script.onerror = () => {
      console.error("Failed to load Supabase SDK. Running in Demo Mode.");
      setLoading(false);
    };

    document.head.appendChild(script);
  }, []);

  // Initialize app and set up real-time subscriptions
  useEffect(() => {
    if (!supabaseClient) return;

    const initApp = async () => {
      try {
        const { data: { session } } = await supabaseClient.auth.getSession();
        if (!session) await supabaseClient.auth.signInAnonymously();
        await fetchData();
        await fetchRemarks();
      } catch (err) {
        console.error("Auth error:", err);
      }
    };

    initApp();

    // Real-time listener for KPIs - update only changed KPI
    const kpiChannel = supabaseClient
      .channel('kpis_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'kpis' }, (payload) => {
        const updatedKpi = payload.new;
        setKpis(prevKpis => {
          let found = false;
          const newKpis = prevKpis.map(kpi => {
            if (kpi.id === updatedKpi.id) {
              found = true;
              return updatedKpi; // Replace with new data
            }
            return kpi;
          });
          if (!found) {
            newKpis.push(updatedKpi); // Add new KPI if it's new
          }
          return newKpis;
        });
      })
      .subscribe();

    // Real-time listener for Config remarks - update directly
    const configChannel = supabaseClient
      .channel('config_changes')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'config' }, (payload) => {
        setRemarks(payload.new.content);
        setRemarksInput(payload.new.content.text);
      })
      .subscribe();

    return () => {
      supabaseClient.removeChannel(kpiChannel);
      supabaseClient.removeChannel(configChannel);
    };
  }, [supabaseClient]);

  const fetchData = async () => {
    if (!supabaseClient) return;
    const { data, error } = await supabaseClient.from('kpis').select('*');
    if (!error && data && data.length > 0) {
      setKpis(data);
    } else if (!error && data && data.length === 0) {
      await supabaseClient.from('kpis').insert(INITIAL_FULL_DATA);
      fetchData();
    }
  };

  const fetchRemarks = async () => {
    if (!supabaseClient) return;
    const { data } = await supabaseClient.from('config').select('content').eq('id', 'remarks').maybeSingle();
    if (data && data.content) {
      setRemarks(data.content);
      setRemarksInput(data.content.text);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!isEditing) return;

    const p = ((formData.actual / formData.target) * 100).toFixed(2);
    const newPercentage = Math.min(parseFloat(p), 100).toFixed(2);

    if (isDemo) {
      setKpis(prev => prev.map(k => k.id === isEditing ? { ...k, actual: formData.actual, percentage: newPercentage } : k));
      setSaveStatus('Rekod Disimpan (Demo)!');
      setIsEditing(null);
      setTimeout(() => setSaveStatus(null), 2000);
      return;
    }

    const { error } = await supabaseClient.from('kpis').update({
      actual: formData.actual,
      percentage: newPercentage,
      updated_at: new Date().toISOString()
    }).eq('id', isEditing);

    if (!error) {
      setSaveStatus('Rekod Berjaya Disimpan!');
      setIsEditing(null);
      setTimeout(() => setSaveStatus(null), 2000);
    }
  };

  const handleSaveRemarks = async () => {
    const newRemarks = { text: remarksInput, updatedAt: new Date().toISOString() };
    if (isDemo) {
      setRemarks(newRemarks);
      setIsEditingRemarks(false);
      setSaveStatus('Amanat Dikemaskini (Demo)!');
      setTimeout(() => setSaveStatus(null), 2000);
      return;
    }
    await supabaseClient.from('config').update({ content: newRemarks }).eq('id', 'remarks');
    setIsEditingRemarks(false);
  };

  const filteredKpis = useMemo(() => {
    return kpis.filter(k =>
      k.section === activeSection &&
      (k.sku_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
       k.sub_sku_name?.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [kpis, activeSection, searchQuery]);

  const stats = useMemo(() => SECTIONS.map(s => {
    const items = kpis.filter(k => k.section === s);
    const avg = items.length ? items.reduce((a, c) => a + parseFloat(c.percentage || 0), 0) / items.length : 0;
    return { name: s, count: items.length, avg: avg.toFixed(2) };
  }), [kpis]);

  const globalAvg = useMemo(() => {
    const total = kpis.reduce((a, c) => a + parseFloat(c.percentage || 0), 0);
    return (total / (kpis.length || 1)).toFixed(2);
  }, [kpis]);

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-slate-50">
      <Activity className="text-indigo-600 animate-spin mb-4" size={60} />
      <p className="font-black text-xs uppercase tracking-[0.4em] text-slate-400">Menyusun Sistem SKU 2026.</p>
    </div>
  );

  // ... Your existing JSX for rendering the UI here (omitted for brevity, unchanged)

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-20 selection:bg-indigo-100">
      {isDemo && (
        <div className="bg-amber-600 text-white p-3 text-center text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-4 sticky top-0 z-[60] shadow-md">
          <Lock size={14} /> Pangkalan Data Belum Disambungkan • Menjalankan Mod Simulasi
        </div>
      )}
      {/* Navigation and Main content here (keep your original JSX) */}
    </div>
  );
}