import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useSearchParams } from 'react-router-dom';
import { Sparkles, TrendingUp, PenTool, Lightbulb, Calendar, ArrowRight, Clock, Loader2, Zap, CheckCircle, AlertCircle, X, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Sidebar from '@/components/layout/Sidebar';
import { useAppStore } from '@/stores/appStore';
import { authService } from '@/services/authService';
import { DAILY_INSPIRATIONS, NICHES, PLATFORMS } from '@/config/constants';
import { geminiService } from '@/services/geminiService';
import { useCredits } from '@/hooks/useCredits';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const [searchParams] = useSearchParams();
  const { user, updateProfile } = useAppStore();
  const [history, setHistory] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [monthlyCount, setMonthlyCount] = useState(0);
  const [inspiration, setInspiration] = useState(DAILY_INSPIRATIONS[0]);
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'pending' | 'failed' | null>(null);
  const [paymentMessage, setPaymentMessage] = useState('');
  
  // 💡 État pour stocker l'élément de l'historique en cours de consultation
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  const { isLowBalance, remainingText } = useCredits(user?.credits || 0);

  const getEncouragementMessage = (count: number) => {
    if (count === 0) return "Premier pas ! Lance-toi dès maintenant 🚀";
    if (count === 1) return "Tu as commencé ! Continue sur cette lancée 🔥";
    if (count < 10) return `${count}/30 - Belle dynamique, continue ! 💪`;
    if (count < 20) return `${count}/30 - Tu es dans le rythme ! 🎯`;
    if (count < 30) return `${count}/30 - Presque là, ne lâche rien ! ⚡`;
    return "🎉 Objectif accompli pour le mois ! Félicitations !";
  };
  
  useEffect(() => {
    if (searchParams.get('payment') === 'success') {
      toast.success('Crédits ajoutés à votre compte !');
      authService.getProfile().then((updatedUser) => {
        if (updatedUser) {
          updateProfile({ credits: updatedUser.credits });
        }
      });
      setPaymentStatus('success');
      setPaymentMessage('Crédits ajoutés à votre compte !');
      window.history.replaceState({}, document.title, '/dashboard');
    }
  }, [searchParams, updateProfile]);
  
  useEffect(() => {
    const randomInspiration = DAILY_INSPIRATIONS[Math.floor(Math.random() * DAILY_INSPIRATIONS.length)];
    setInspiration(randomInspiration);
    
    const fetchHistory = async () => {
      try {
        const data = await geminiService.getHistory(5);
        setHistory(data);
        
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        
        const allGenerations = await geminiService.getMonthlyCount(currentMonth, currentYear);
        setMonthlyCount(allGenerations);
      } catch (error) {
        console.error("Failed to fetch history:", error);
      } finally {
        setIsLoadingHistory(false);
      }
    };
    fetchHistory();
  }, []);

  const nicheLabel = NICHES.find(n => n.id === user?.niche)?.label || user?.niche;
  const platformLabel = PLATFORMS.find(p => p.id === user?.platform)?.label || user?.platform;

  const tools = [
    { id: 'hooks', title: 'Hooks Viraux', desc: 'Génère 10 accroches qui stoppent le scroll.', icon: PenTool, color: '#7C3AED' },
    { id: 'script', title: 'Scripts Vidéo', desc: 'Des scripts structurés pour TikTok et Facebook.', icon: PenTool, color: '#06B6D4' },
    { id: 'ideas', title: 'Banque d\'Idées', desc: '20 idées de contenus originaux pour ta niche.', icon: Lightbulb, color: '#F59E0B' },
    { id: 'calendar', title: 'Calendrier 30 Jours', desc: 'Ton plan d\'action complet pour le mois.', icon: Calendar, color: '#10B981' },
  ];

  const progressValue = Math.min((monthlyCount / 30) * 100, 100);
  const progressText = getEncouragementMessage(monthlyCount);

  const getToolLabel = (id: string) => {
    return tools.find(t => t.id === id)?.title || id;
  };

  // 💡 Fonction d'extraction et de rendu propre des données stockées dans l'historique
  const renderHistoryContent = (item: any) => {
    const data = item.outputData || item.output_data_string || item.output_data;
    if (!data) return <p className="text-gray-400">Aucune donnée disponible pour cette génération.</p>;

    // Scénario A : C'est le calendrier textuel linéaire (Chaîne brute)
    if (item.tool === 'calendar' && typeof data === 'string') {
      return (
        <pre className="whitespace-pre-wrap font-sans text-gray-200 leading-relaxed text-sm bg-[#0A0A14] p-4 rounded-xl border border-[#1E1E3A]">
          {data}
        </pre>
      );
    }

    // Scénario B : Données au format JSON (Hooks, Scripts, Idées)
    try {
      const parsed = typeof data === 'string' ? JSON.parse(data) : data;
      
      if (parsed.hooks) {
        return (
          <div className="space-y-3">
            {parsed.hooks.map((h: any, idx: number) => (
              <div key={idx} className="p-3 rounded-lg bg-[#0A0A14] border border-[#1E1E3A]">
                <p className="text-[#7C3AED] font-semibold text-sm">Accroche {idx + 1} : {h.hook}</p>
                {h.framework && <p className="text-xs text-gray-400 mt-1">Structure : {h.framework}</p>}
              </div>
            ))}
          </div>
        );
      }

      if (parsed.ideas) {
        return (
          <div className="space-y-3">
            {parsed.ideas.map((id: any, idx: number) => (
              <div key={idx} className="p-3 rounded-lg bg-[#0A0A14] border border-[#1E1E3A]">
                <p className="text-[#F59E0B] font-semibold text-sm">{id.title}</p>
                <p className="text-xs text-gray-300 mt-1">{id.description}</p>
              </div>
            ))}
          </div>
        );
      }

      if (parsed.sections) {
        return (
          <div className="space-y-4">
            {parsed.sections.map((sec: any, idx: number) => (
              <div key={idx} className="p-3 rounded-lg bg-[#0A0A14] border border-[#1E1E3A]">
                <span className="text-xs font-bold uppercase text-[#06B6D4]">{sec.label || `Séquence ${idx + 1}`}</span>
                <p className="text-sm text-gray-200 mt-1 font-medium">{sec.content}</p>
                {sec.visual_note && <p className="text-xs text-gray-400 italic mt-1">Note visuelle : {sec.visual_note}</p>}
              </div>
            ))}
          </div>
        );
      }

      return <pre className="text-xs text-gray-400 overflow-x-auto">{JSON.stringify(parsed, null, 2)}</pre>;
    } catch {
      return <p className="text-sm text-gray-200 whitespace-pre-wrap">{String(data)}</p>;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0A0A14]">
      <Sidebar />
      
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Header */}
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Bonjour {user?.name} 👋</h1>
              <p className="text-[#94A3B8]">{new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <Badge variant="outline" className="bg-[#1E1E3A] border-[#2D2D5E] text-[#F1F5F9] px-3 py-1">
                {remainingText}
              </Badge>
              {isLowBalance && (
                <Badge variant="outline" className="bg-[#F59E0B]/20 border-[#F59E0B] text-[#F59E0B] px-3 py-1">
                  Solde faible — Rechargez
                </Badge>
              )}
              <Badge variant="outline" className="bg-[#1E1E3A] border-[#2D2D5E] text-[#F1F5F9] px-3 py-1">
                {nicheLabel}
              </Badge>
              <Badge variant="outline" className="bg-[#1E1E3A] border-[#2D2D5E] text-[#F1F5F9] px-3 py-1">
                {platformLabel}
              </Badge>
            </div>
          </header>

          {/* Payment Status Alerts */}
          {paymentStatus === 'success' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-[#10B981]/20 border border-[#10B981] rounded-lg flex items-start gap-3"
            >
              <CheckCircle className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-[#10B981]">Paiement réussi!</h4>
                <p className="text-sm text-[#10B981]/80">{paymentMessage}</p>
              </div>
            </motion.div>
          )}

          {paymentStatus === 'failed' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-[#EF4444]/20 border border-[#EF4444] rounded-lg flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-[#EF4444] flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-[#EF4444]">Erreur de paiement</h4>
                <p className="text-sm text-[#EF4444]/80">{paymentMessage}</p>
              </div>
            </motion.div>
          )}

          {/* Inspiration Card */}
          <Card className="bg-gradient-to-r from-[#7C3AED]/20 via-[#4F46E5]/10 to-[#06B6D4]/20 border-[#7C3AED]/30 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Sparkles className="w-24 h-24 text-white" />
            </div>
            <CardContent className="p-8">
              <div className="flex items-center gap-2 text-[#7C3AED] mb-4">
                <Sparkles className="w-5 h-5" />
                <span className="text-sm font-bold uppercase tracking-wider">Inspiration du jour</span>
              </div>
              <p className="text-xl md:text-2xl font-medium mb-4 italic">
                "{inspiration.quote || inspiration.hook}"
              </p>
              {inspiration.author && <p className="text-[#94A3B8]">— {inspiration.author}</p>}
              {inspiration.stat && (
                <div className="flex items-center gap-2 text-[#06B6D4]">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">{inspiration.stat}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Credits Card */}
          <Card className="bg-gradient-to-r from-[#06B6D4]/20 to-[#10B981]/20 border-[#06B6D4]/30 overflow-hidden">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#06B6D4]/20 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-[#06B6D4]" />
                </div>
                <div>
                  <p className="text-sm text-[#94A3B8]">Crédits disponibles</p>
                  <p className="text-3xl font-bold">{user?.credits || 0}</p>
                </div>
              </div>
              <Link to="/pricing">
                <Button className="bg-[#06B6D4] hover:bg-[#0891B2] text-white font-semibold">
                  Recharger
                </Button>
              </Link>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Progress Card */}
            <Card className="lg:col-span-1 bg-[#12121F] border-[#1E1E3A]">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#7C3AED]" />
                  Progression mensuelle
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#94A3B8]">Objectif 30 contenus/mois</span>
                    <span className="font-bold">{monthlyCount}/30</span>
                  </div>
                  <Progress value={progressValue} className="h-3 bg-[#1E1E3A] [&>div]:bg-gradient-to-r [&>div]:from-[#7C3AED] [&>div]:to-[#06B6D4]" />
                </div>
                <p className="text-sm text-[#94A3B8] font-medium bg-[#1E1E3A] p-3 rounded-lg border border-[#2D2D5E]">
                  {progressText}
                </p>
              </CardContent>
            </Card>

            {/* Tools Grid */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {tools.map((tool) => (
                <Link key={tool.id} to={`/tools/${tool.id}`}>
                  <Card className="h-full bg-[#12121F] border-[#1E1E3A] hover:border-[#7C3AED]/50 transition-all group cursor-pointer">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110" style={{ backgroundColor: `${tool.color}20` }}>
                        <tool.icon className="w-6 h-6" style={{ color: tool.color }} />
                      </div>
                      <h3 className="font-bold text-lg mb-2">{tool.title}</h3>
                      <p className="text-sm text-[#94A3B8] mb-4">{tool.desc}</p>
                      <div className="flex items-center text-xs font-bold text-[#7C3AED] group-hover:translate-x-1 transition-transform">
                        OUVRIR L'OUTIL <ArrowRight className="w-4 h-4 ml-1" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent History */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#94A3B8]" />
                Historique récent
              </h2>
              <Button variant="link" className="text-[#7C3AED]">Voir tout</Button>
            </div>
            <div className="space-y-4">
              {isLoadingHistory ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="w-8 h-8 text-[#7C3AED] animate-spin" />
                </div>
              ) : history?.length > 0 ? (
                history.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-[#12121F] border border-[#1E1E3A] hover:bg-[#1E1E3A] transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-[#1E1E3A] flex items-center justify-center">
                        <PenTool className="w-5 h-5 text-[#94A3B8]" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">{getToolLabel(item.tool)}</h4>
                        <p className="text-xs text-[#94A3B8]">
                          {item.niche || 'Générique'} • {item.created_at ? new Date(item.created_at).toLocaleDateString() : new Date(item.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {/* 💡 Remplacement du comportement par une ouverture de modale locale instantanée */}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-[#7C3AED] hover:bg-[#7C3AED]/10 flex items-center gap-1"
                      onClick={() => setSelectedItem(item)}
                    >
                      <Eye className="w-4 h-4" /> Revoir
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center p-8 bg-[#12121F] rounded-xl border border-[#1E1E3A]">
                  <p className="text-[#94A3B8]">Aucun contenu généré pour le moment.</p>
                </div>
              )}
            </div>
          </section>

          {/* 💡 Panneau de prévisualisation de l'élément sélectionné (AnimatePresence) */}
          <AnimatePresence>
            {selectedItem && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-[#12121F] border border-[#1E1E3A] w-full max-w-2xl rounded-2xl max-h-[80vh] flex flex-col overflow-hidden shadow-2xl"
                >
                  <div className="p-6 border-b border-[#1E1E3A] flex items-center justify-between bg-[#1E1E3A]/40">
                    <div>
                      <Badge className="bg-[#7C3AED]/20 text-[#7C3AED] border-[#7C3AED]/30 mb-1 capitalize">
                        {selectedItem.tool}
                      </Badge>
                      <h3 className="text-xl font-bold">Travail archivé</h3>
                    </div>
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10" onClick={() => setSelectedItem(null)}>
                      <X className="w-5 h-5" />
                    </Button>
                  </div>

                  <div className="p-6 overflow-y-auto flex-1 space-y-4">
                    <div className="flex flex-wrap gap-4 text-xs text-[#94A3B8]">
                      <div><span className="font-semibold text-white">Niche:</span> {selectedItem.niche || 'Générique'}</div>
                      <div><span className="font-semibold text-white">Plateforme:</span> {selectedItem.platform || 'Toutes'}</div>
                      <div><span className="font-semibold text-white">Date:</span> {new Date(selectedItem.created_at || selectedItem.createdAt).toLocaleString()}</div>
                    </div>
                    
                    <div className="mt-4 border-t border-[#1E1E3A] pt-4">
                      {renderHistoryContent(selectedItem)}
                    </div>
                  </div>

                  <div className="p-4 border-t border-[#1E1E3A] bg-[#1E1E3A]/20 flex justify-end">
                    <Button className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white" onClick={() => setSelectedItem(null)}>
                      Fermer la vue
                    </Button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

        </div>
      </main>
    </div>
  );
}