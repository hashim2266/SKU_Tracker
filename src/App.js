import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  LayoutDashboard, TrendingUp, CheckCircle2, AlertCircle,
  Save, Edit3, BarChart3, FileText, ShieldCheck,
  Building2, Search, MessageSquareQuote,
  Megaphone, XCircle, Calendar, RefreshCw, X,
  ChevronDown, Award, Target, Percent
} from 'lucide-react';
import { RadialBarChart, RadialBar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import './App.css';

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

const SECTIONS = [
  "Seksyen Kualiti, Majlis & Protokol (SKMP)",
  "Seksyen Pentadbiran & Kewangan (SPK)",
  "Unit Perpustakaan (LIB)",
  "Seksyen Pembangunan & Aset (SPAK)",
  "Unit Pembantu Operasi (PO)"
];

const SECTION_SHORT = {
  "Seksyen Kualiti, Majlis & Protokol (SKMP)": "SKMP",
  "Seksyen Pentadbiran & Kewangan (SPK)": "SPK",
  "Unit Perpustakaan (LIB)": "LIB",
  "Seksyen Pembangunan & Aset (SPAK)": "SPAK",
  "Unit Pembantu Operasi (PO)": "PO"
};

const INITIAL_DATA = [
  // SKMP
  { sku_name: "Mengurus Majlis Rasmi", sub_sku_name: "Peratus urusan penyediaan Kertas Cadangan penganjuran (14 hari bekerja).", unit: "Peratus", target: 100, actual: 0, percentage: 0, section: "Seksyen Kualiti, Majlis & Protokol (SKMP)" },
  { sku_name: "Mengurus Majlis Rasmi", sub_sku_name: "Peratus penyediaan Buku Program majlis rasmi dalam tempoh 7 hari bekerja sebelum majlis.", unit: "Peratus", target: 100, actual: 0, percentage: 0, section: "Seksyen Kualiti, Majlis & Protokol (SKMP)" },
  { sku_name: "Mengurus Majlis Rasmi", sub_sku_name: "Peratus maklum balas terhadap aduan/rungutan penganjuran majlis dalam tempoh 3 hari bekerja.", unit: "Peratus", target: 100, actual: 0, percentage: 0, section: "Seksyen Kualiti, Majlis & Protokol (SKMP)" },
  { sku_name: "Pengurusan Kualiti", sub_sku_name: "Peratus pelaksanaan Audit Dalaman MS ISO 9001:2015 mengikut jadual.", unit: "Peratus", target: 100, actual: 0, percentage: 0, section: "Seksyen Kualiti, Majlis & Protokol (SKMP)" },
  { sku_name: "Pengurusan Kualiti", sub_sku_name: "Peratus tindakan pembetulan NCR diselesaikan dalam tempoh yang ditetapkan.", unit: "Peratus", target: 100, actual: 0, percentage: 0, section: "Seksyen Kualiti, Majlis & Protokol (SKMP)" },
  { sku_name: "Pengurusan Protokol", sub_sku_name: "Peratus pelaksanaan latihan protokol dan etiket untuk kakitangan.", unit: "Peratus", target: 80, actual: 0, percentage: 0, section: "Seksyen Kualiti, Majlis & Protokol (SKMP)" },
  // SPK
  { sku_name: "Pengurusan Kewangan", sub_sku_name: "Peratus penyediaan laporan kewangan bulanan mengikut jadual.", unit: "Peratus", target: 100, actual: 0, percentage: 0, section: "Seksyen Pentadbiran & Kewangan (SPK)" },
  { sku_name: "Pengurusan Kewangan", sub_sku_name: "Peratus pembayaran baucer diselesaikan dalam tempoh 7 hari bekerja.", unit: "Peratus", target: 95, actual: 0, percentage: 0, section: "Seksyen Pentadbiran & Kewangan (SPK)" },
  { sku_name: "Pengurusan Pentadbiran", sub_sku_name: "Peratus surat rasmi diproses dalam tempoh 3 hari bekerja.", unit: "Peratus", target: 100, actual: 0, percentage: 0, section: "Seksyen Pentadbiran & Kewangan (SPK)" },
  { sku_name: "Pengurusan Pentadbiran", sub_sku_name: "Peratus rekod pentadbiran dikemaskini setiap bulan.", unit: "Peratus", target: 100, actual: 0, percentage: 0, section: "Seksyen Pentadbiran & Kewangan (SPK)" },
  { sku_name: "Pengurusan Aset", sub_sku_name: "Peratus aset yang didaftarkan dalam sistem pengurusan aset.", unit: "Peratus", target: 100, actual: 0, percentage: 0, section: "Seksyen Pentadbiran & Kewangan (SPK)" },
  // LIB
  { sku_name: "Perkhidmatan Perpustakaan", sub_sku_name: "Peratus permohonan peminjaman buku dilayan dalam tempoh 1 hari bekerja.", unit: "Peratus", target: 100, actual: 0, percentage: 0, section: "Unit Perpustakaan (LIB)" },
  { sku_name: "Perkhidmatan Perpustakaan", sub_sku_name: "Peratus bahan rujukan baharu yang dikatalog dalam tempoh 7 hari bekerja.", unit: "Peratus", target: 90, actual: 0, percentage: 0, section: "Unit Perpustakaan (LIB)" },
  { sku_name: "Pengurusan Koleksi", sub_sku_name: "Peratus buku yang dikembalikan disemak dan disusun semula dalam tempoh 2 hari bekerja.", unit: "Peratus", target: 100, actual: 0, percentage: 0, section: "Unit Perpustakaan (LIB)" },
  { sku_name: "Pengurusan Koleksi", sub_sku_name: "Peratus inventori koleksi perpustakaan dikemaskini setiap suku tahun.", unit: "Peratus", target: 100, actual: 0, percentage: 0, section: "Unit Perpustakaan (LIB)" },
  // SPAK
  { sku_name: "Pengurusan Projek Pembangunan", sub_sku_name: "Peratus projek pembangunan dilaksanakan mengikut jadual.", unit: "Peratus", target: 85, actual: 0, percentage: 0, section: "Seksyen Pembangunan & Aset (SPAK)" },
  { sku_name: "Pengurusan Projek Pembangunan", sub_sku_name: "Peratus laporan kemajuan projek diserahkan tepat pada masa.", unit: "Peratus", target: 100, actual: 0, percentage: 0, section: "Seksyen Pembangunan & Aset (SPAK)" },
  { sku_name: "Penyelenggaraan Aset", sub_sku_name: "Peratus aduan kerosakan aset diselesaikan dalam tempoh 3 hari bekerja.", unit: "Peratus", target: 90, actual: 0, percentage: 0, section: "Seksyen Pembangunan & Aset (SPAK)" },
  { sku_name: "Penyelenggaraan Aset", sub_sku_name: "Peratus penyelenggaraan berjadual dilaksanakan mengikut pelan.", unit: "Peratus", target: 100, actual: 0, percentage: 0, section: "Seksyen Pembangunan & Aset (SPAK)" },
  // PO
  { sku_name: "Perkhidmatan Operasi", sub_sku_name: "Peratus permintaan perkhidmatan operasi dilayan dalam tempoh yang ditetapkan.", unit: "Peratus", target: 95, actual: 0, percentage: 0, section: "Unit Pembantu Operasi (PO)" },
  { sku_name: "Perkhidmatan Operasi", sub_sku_name: "Peratus aduan pelanggan diselesaikan dalam tempoh 2 hari bekerja.", unit: "Peratus", target: 100, actual: 0, percentage: 0, section: "Unit Pembantu Operasi (PO)" },
  { sku_name: "Kebersihan & Keselamatan", sub_sku_name: "Peratus pemeriksaan kebersihan premis dilaksanakan mengikut jadual.", unit: "Peratus", target: 100, actual: 0, percentage: 0, section: "Unit Pembantu Operasi (PO)" },
];

function getColor(pct) {
  const p = parseFloat(pct);
  if (p >= 90) return '#16a34a';
  if (p >= 70) return '#d97706';
  return '#dc2626';
}

function getBg(pct) {
  const p = parseFloat(pct);
  if (p >= 90) return 'bg-green-50 border-green-200';
  if (p >= 70) return 'bg-amber-50 border-amber-200';
  return 'bg-red-50 border-red-200';
}

function StatusBadge({ pct }) {
  const p = parseFloat(pct);
  if (p >= 90) return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700"><CheckCircle2 size={11} />Mencapai</span>;
  if (p >= 70) return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700"><AlertCircle size={11} />Sederhana</span>;
  return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700"><XCircle size={11} />Rendah</span>;
}

export default function App() {
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
  const [formData, setFormData] = useState({ actual: 0 });
  const [sectionMenuOpen, setSectionMenuOpen] = useState(false);

  const fetchData = useCallback(async () => {
    const { data, error } = await supabase.from('kpis').select('*').order('section').order('sku_name');
    if (!error && data) {
      if (data.length === 0) {
        await supabase.from('kpis').insert(INITIAL_DATA);
        const { data: seeded } = await supabase.from('kpis').select('*').order('section').order('sku_name');
        if (seeded) setKpis(seeded);
      } else {
        setKpis(data);
      }
    }
  }, []);

  const fetchRemarks = useCallback(async () => {
    const { data } = await supabase.from('config').select('content').eq('id', 'remarks').maybeSingle();
    if (data?.content) {
      setRemarks(data.content);
      setRemarksInput(data.content.text || "");
    }
  }, []);

  useEffect(() => {
    Promise.all([fetchData(), fetchRemarks()]).finally(() => setLoading(false));

    const kpiChannel = supabase
      .channel('kpis_rt')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'kpis' }, (payload) => {
        if (payload.eventType === 'UPDATE') {
          setKpis(prev => prev.map(k => k.id === payload.new.id ? payload.new : k));
        } else if (payload.eventType === 'INSERT') {
          setKpis(prev => [...prev, payload.new]);
        }
      })
      .subscribe();

    const configChannel = supabase
      .channel('config_rt')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'config' }, (payload) => {
        if (payload.new.id === 'remarks') {
          setRemarks(payload.new.content);
          setRemarksInput(payload.new.content.text || "");
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(kpiChannel);
      supabase.removeChannel(configChannel);
    };
  }, [fetchData, fetchRemarks]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!isEditing) return;
    const kpi = kpis.find(k => k.id === isEditing);
    if (!kpi) return;
    const raw = ((parseFloat(formData.actual) / parseFloat(kpi.target)) * 100);
    const newPct = Math.min(raw, 100).toFixed(2);
    const { error } = await supabase.from('kpis').update({
      actual: parseFloat(formData.actual),
      percentage: parseFloat(newPct),
      updated_at: new Date().toISOString()
    }).eq('id', isEditing);
    if (!error) {
      setSaveStatus('Rekod Berjaya Disimpan!');
      setIsEditing(null);
      setTimeout(() => setSaveStatus(null), 2500);
    }
  };

  const handleSaveRemarks = async () => {
    const newRemarks = { text: remarksInput, updatedAt: new Date().toISOString() };
    await supabase.from('config').upsert({ id: 'remarks', content: newRemarks });
    setIsEditingRemarks(false);
    setSaveStatus('Amanat Dikemaskini!');
    setTimeout(() => setSaveStatus(null), 2500);
  };

  const filteredKpis = useMemo(() =>
    kpis.filter(k =>
      k.section === activeSection &&
      (k.sku_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
       k.sub_sku_name?.toLowerCase().includes(searchQuery.toLowerCase()))
    ), [kpis, activeSection, searchQuery]);

  const stats = useMemo(() => SECTIONS.map(s => {
    const items = kpis.filter(k => k.section === s);
    const avg = items.length ? items.reduce((a, c) => a + parseFloat(c.percentage || 0), 0) / items.length : 0;
    const achieved = items.filter(k => parseFloat(k.percentage) >= 90).length;
    return { name: s, short: SECTION_SHORT[s], count: items.length, avg: avg.toFixed(1), achieved };
  }), [kpis]);

  const globalAvg = useMemo(() => {
    if (!kpis.length) return 0;
    return (kpis.reduce((a, c) => a + parseFloat(c.percentage || 0), 0) / kpis.length).toFixed(1);
  }, [kpis]);

  const totalAchieved = useMemo(() => kpis.filter(k => parseFloat(k.percentage) >= 90).length, [kpis]);
  const totalLow = useMemo(() => kpis.filter(k => parseFloat(k.percentage) < 70).length, [kpis]);

  const chartData = useMemo(() => stats.map(s => ({ name: s.short, avg: parseFloat(s.avg), fill: getColor(s.avg) })), [stats]);

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-slate-50">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-sm font-semibold text-slate-500 tracking-widest uppercase">Memuatkan Sistem SKU 2026</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      {/* Top bar */}
      <header className="bg-blue-900 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-700 rounded-lg p-2">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h1 className="font-bold text-base leading-tight">Sistem Pemantauan SKU</h1>
              <p className="text-blue-300 text-xs">Bahagian Tadbir Urus 2026</p>
            </div>
          </div>
          <nav className="flex items-center gap-1">
            {[
              { id: 'dashboard', icon: LayoutDashboard, label: 'Papan Pemuka' },
              { id: 'kpi', icon: BarChart3, label: 'KPI' },
              { id: 'remarks', icon: MessageSquareQuote, label: 'Amanat' },
            ].map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setView(id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  view === id ? 'bg-white text-blue-900' : 'text-blue-200 hover:bg-blue-800'
                }`}
              >
                <Icon size={14} />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Save status toast */}
      {saveStatus && (
        <div className="fixed top-16 right-4 z-50 bg-green-600 text-white px-4 py-2.5 rounded-lg shadow-xl text-sm font-semibold flex items-center gap-2 animate-pulse">
          <CheckCircle2 size={16} /> {saveStatus}
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 py-6">

        {/* DASHBOARD VIEW */}
        {view === 'dashboard' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Papan Pemuka Prestasi</h2>
                <p className="text-slate-500 text-sm flex items-center gap-1 mt-0.5"><Calendar size={13} /> {new Date().toLocaleDateString('ms-MY', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
              <button onClick={() => { setLoading(true); fetchData().finally(() => setLoading(false)); }} className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-700 border border-slate-200 rounded-lg px-3 py-1.5 bg-white hover:bg-blue-50 transition-all">
                <RefreshCw size={13} /> Muat Semula
              </button>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Purata Global', value: `${globalAvg}%`, icon: Percent, color: 'bg-blue-600', bg: 'from-blue-50 to-blue-100' },
                { label: 'Jumlah KPI', value: kpis.length, icon: Target, color: 'bg-slate-600', bg: 'from-slate-50 to-slate-100' },
                { label: 'KPI Mencapai', value: totalAchieved, icon: Award, color: 'bg-green-600', bg: 'from-green-50 to-green-100' },
                { label: 'KPI Rendah', value: totalLow, icon: AlertCircle, color: 'bg-red-600', bg: 'from-red-50 to-red-100' },
              ].map(({ label, value, icon: Icon, color, bg }) => (
                <div key={label} className={`bg-gradient-to-br ${bg} rounded-xl p-4 border border-white shadow-sm`}>
                  <div className={`${color} text-white rounded-lg p-2 w-fit mb-3`}><Icon size={16} /></div>
                  <p className="text-2xl font-black text-slate-800">{value}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            {/* Section performance cards */}
            <div>
              <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-3">Prestasi Seksyen</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {stats.map(s => (
                  <div
                    key={s.name}
                    onClick={() => { setActiveSection(s.name); setView('kpi'); }}
                    className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 cursor-pointer transition-all group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <span className="text-xs font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">{s.short}</span>
                        <p className="text-xs text-slate-500 mt-1.5 leading-snug">{s.name}</p>
                      </div>
                      <TrendingUp size={16} className="text-slate-300 group-hover:text-blue-500 transition-colors mt-1" />
                    </div>
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-3xl font-black" style={{ color: getColor(s.avg) }}>{s.avg}%</p>
                        <p className="text-xs text-slate-400">{s.achieved}/{s.count} mencapai</p>
                      </div>
                      <div className="w-16 h-16">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadialBarChart innerRadius="60%" outerRadius="100%" data={[{ value: parseFloat(s.avg), fill: getColor(s.avg) }]} startAngle={90} endAngle={-270}>
                            <RadialBar dataKey="value" cornerRadius={4} background={{ fill: '#f1f5f9' }} />
                          </RadialBarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    <div className="mt-3 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${s.avg}%`, background: getColor(s.avg) }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bar chart */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2"><BarChart3 size={15} /> Perbandingan Prestasi Seksyen</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip formatter={(v) => [`${v}%`, 'Purata']} contentStyle={{ borderRadius: 8, fontSize: 12, border: '1px solid #e2e8f0' }} />
                  <Bar dataKey="avg" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Remarks preview */}
            {remarks.text && (
              <div className="bg-blue-900 text-white rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Megaphone size={16} className="text-blue-300" />
                  <span className="text-xs font-bold uppercase tracking-widest text-blue-300">Amanat Pengarah</span>
                </div>
                <p className="text-sm leading-relaxed">{remarks.text}</p>
                {remarks.updatedAt && <p className="text-xs text-blue-400 mt-2">{new Date(remarks.updatedAt).toLocaleDateString('ms-MY', { year: 'numeric', month: 'long', day: 'numeric' })}</p>}
              </div>
            )}
          </div>
        )}

        {/* KPI VIEW */}
        {view === 'kpi' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex-1">
                <h2 className="text-xl font-bold text-slate-800">Rekod KPI</h2>
                <p className="text-slate-500 text-sm">Kemaskini pencapaian KPI seksyen</p>
              </div>
              <div className="relative">
                <button
                  onClick={() => setSectionMenuOpen(v => !v)}
                  className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:border-blue-400 transition-all shadow-sm"
                >
                  <Building2 size={14} />
                  <span className="max-w-[180px] truncate">{SECTION_SHORT[activeSection]}</span>
                  <ChevronDown size={14} />
                </button>
                {sectionMenuOpen && (
                  <div className="absolute right-0 mt-1 bg-white rounded-xl shadow-xl border border-slate-200 z-30 min-w-[280px] py-1">
                    {SECTIONS.map(s => (
                      <button
                        key={s}
                        onClick={() => { setActiveSection(s); setSectionMenuOpen(false); setSearchQuery(''); }}
                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 transition-colors ${activeSection === s ? 'text-blue-700 font-semibold bg-blue-50' : 'text-slate-700'}`}
                      >
                        <span className="font-bold text-xs text-blue-500 mr-2">{SECTION_SHORT[s]}</span>{s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Section stat bar */}
            {(() => {
              const s = stats.find(st => st.name === activeSection);
              return s ? (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-5 py-4 flex flex-wrap gap-6 items-center">
                  <div><p className="text-2xl font-black" style={{ color: getColor(s.avg) }}>{s.avg}%</p><p className="text-xs text-slate-400">Purata Seksyen</p></div>
                  <div><p className="text-2xl font-black text-slate-700">{s.count}</p><p className="text-xs text-slate-400">Jumlah KPI</p></div>
                  <div><p className="text-2xl font-black text-green-600">{s.achieved}</p><p className="text-xs text-slate-400">Mencapai ≥90%</p></div>
                  <div className="flex-1 min-w-[120px]">
                    <div className="bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${s.avg}%`, background: getColor(s.avg) }}></div>
                    </div>
                  </div>
                </div>
              ) : null;
            })()}

            {/* Search */}
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Cari KPI..."
                className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"><X size={14} /></button>}
            </div>

            {/* KPI list */}
            <div className="space-y-3">
              {filteredKpis.length === 0 && (
                <div className="text-center py-16 text-slate-400">
                  <FileText size={40} className="mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Tiada rekod ditemui</p>
                </div>
              )}
              {filteredKpis.map(kpi => (
                <div key={kpi.id} className={`bg-white border rounded-xl shadow-sm transition-all ${isEditing === kpi.id ? 'border-blue-400 ring-2 ring-blue-100' : 'border-slate-200 hover:border-slate-300'}`}>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-blue-700 mb-0.5">{kpi.sku_name}</p>
                        <p className="text-sm text-slate-700 leading-snug">{kpi.sub_sku_name}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <StatusBadge pct={kpi.percentage} />
                        {isEditing !== kpi.id && (
                          <button
                            onClick={() => { setIsEditing(kpi.id); setFormData({ actual: kpi.actual }); }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                          >
                            <Edit3 size={15} />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-4">
                      <div className="flex-1">
                        <div className="flex justify-between text-xs text-slate-400 mb-1">
                          <span>Pencapaian</span>
                          <span className="font-bold" style={{ color: getColor(kpi.percentage) }}>{parseFloat(kpi.percentage).toFixed(1)}%</span>
                        </div>
                        <div className="bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(parseFloat(kpi.percentage), 100)}%`, background: getColor(kpi.percentage) }}
                          ></div>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs text-slate-400">Sasaran: </span>
                        <span className="text-xs font-bold text-slate-700">{kpi.target}%</span>
                      </div>
                    </div>

                    <div className="mt-2 flex gap-4 text-xs text-slate-500">
                      <span>Aktual: <strong className="text-slate-700">{kpi.actual}</strong></span>
                      <span>Unit: <strong className="text-slate-700">{kpi.unit}</strong></span>
                      {kpi.updated_at && <span className="ml-auto text-slate-400">{new Date(kpi.updated_at).toLocaleDateString('ms-MY')}</span>}
                    </div>
                  </div>

                  {/* Inline edit form */}
                  {isEditing === kpi.id && (
                    <div className="border-t border-blue-100 bg-blue-50 px-4 py-3">
                      <form onSubmit={handleUpdate} className="flex items-center gap-3">
                        <label className="text-xs font-semibold text-blue-700">Nilai Aktual:</label>
                        <input
                          type="number"
                          min={0}
                          max={kpi.target * 10}
                          step="0.01"
                          value={formData.actual}
                          onChange={e => setFormData({ actual: e.target.value })}
                          className="border border-blue-300 rounded-lg px-3 py-1.5 text-sm w-28 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          autoFocus
                        />
                        <button type="submit" className="bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 hover:bg-blue-800 transition-colors">
                          <Save size={13} /> Simpan
                        </button>
                        <button type="button" onClick={() => setIsEditing(null)} className="text-slate-500 hover:text-slate-700 px-2 py-1.5 text-xs">
                          Batal
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* REMARKS VIEW */}
        {view === 'remarks' && (
          <div className="space-y-4 max-w-2xl">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Amanat Pengarah</h2>
              <p className="text-slate-500 text-sm">Mesej & arahan daripada pengurusan</p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              {!isEditingRemarks ? (
                <>
                  {remarks.text ? (
                    <>
                      <div className="flex items-center gap-2 mb-3">
                        <Megaphone size={16} className="text-blue-600" />
                        <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Amanat Terkini</span>
                      </div>
                      <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">{remarks.text}</p>
                      {remarks.updatedAt && (
                        <p className="text-xs text-slate-400 mt-3 flex items-center gap-1">
                          <Calendar size={11} /> Dikemaskini: {new Date(remarks.updatedAt).toLocaleDateString('ms-MY', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-slate-400 text-sm py-4 text-center">Tiada amanat lagi.</p>
                  )}
                  <button
                    onClick={() => setIsEditingRemarks(true)}
                    className="mt-4 flex items-center gap-1.5 text-sm font-medium text-blue-700 hover:text-blue-900 border border-blue-200 rounded-lg px-3 py-2 hover:bg-blue-50 transition-all"
                  >
                    <Edit3 size={14} /> {remarks.text ? 'Kemaskini Amanat' : 'Tambah Amanat'}
                  </button>
                </>
              ) : (
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Amanat Pengarah</label>
                  <textarea
                    value={remarksInput}
                    onChange={e => setRemarksInput(e.target.value)}
                    rows={6}
                    placeholder="Taip amanat di sini..."
                    className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                  <div className="flex gap-2">
                    <button onClick={handleSaveRemarks} className="bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-1.5 hover:bg-blue-800 transition-colors">
                      <Save size={14} /> Simpan
                    </button>
                    <button onClick={() => { setIsEditingRemarks(false); setRemarksInput(remarks.text || ""); }} className="text-slate-600 px-4 py-2 rounded-lg text-sm border border-slate-200 hover:bg-slate-50 transition-colors">
                      Batal
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Bottom nav for mobile */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex z-40">
        {[
          { id: 'dashboard', icon: LayoutDashboard, label: 'Pemuka' },
          { id: 'kpi', icon: BarChart3, label: 'KPI' },
          { id: 'remarks', icon: MessageSquareQuote, label: 'Amanat' },
        ].map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setView(id)}
            className={`flex-1 flex flex-col items-center py-2.5 text-xs font-medium transition-colors ${
              view === id ? 'text-blue-700' : 'text-slate-400'
            }`}
          >
            <Icon size={20} className="mb-0.5" />
            {label}
          </button>
        ))}
      </nav>
    </div>
  );
}
