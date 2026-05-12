
import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Sparkles, TrendingUp, PenTool, Lightbulb, Calendar, ArrowRight, Clock, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Sidebar from '@/components/layout/Sidebar';
import { useAppStore } from '@/stores/appStore';
import { DAILY_INSPIRATIONS, NICHES, PLATFORMS } from '@/config/constants';
import { geminiService } from '@/services/geminiService';

export default function DashboardPage() {
  const { user } = useAppStore();
  const [history, setHistory] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const inspiration = DAILY_INSPIRATIONS[new Date().getDate() % DAILY_INSPIRATIONS.length];
  
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await geminiService.getHistory(5);
        setHistory(data);
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

  const progressValue = 40; // Mock value
  const progressText = progressValue < 25 ? "C'est le moment de démarrer 🚀" : 
                       progressValue < 50 ? "Belle dynamique, continue ! 💪" :
                       progressValue < 80 ? "Tu es dans le rythme ! 🔥" : "Presque là, ne lâche rien ! ⚡";

  const getToolLabel = (id: string) => {
    return tools.find(t => t.id === id)?.title || id;
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
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-[#1E1E3A] border-[#2D2D5E] text-[#F1F5F9] px-3 py-1">
                {nicheLabel}
              </Badge>
              <Badge variant="outline" className="bg-[#1E1E3A] border-[#2D2D5E] text-[#F1F5F9] px-3 py-1">
                {platformLabel}
              </Badge>
            </div>
          </header>

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
                    <span className="font-bold">12/30</span>
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
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110`} style={{ backgroundColor: `${tool.color}20` }}>
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
                history?.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-[#12121F] border border-[#1E1E3A] hover:bg-[#1E1E3A] transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-[#1E1E3A] flex items-center justify-center">
                        <PenTool className="w-5 h-5 text-[#94A3B8]" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">{getToolLabel(item.tool)}</h4>
                        <p className="text-xs text-[#94A3B8]">{item.niche} • {new Date(item.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <Link to={`/tools/${item.tool}`}>
                      <Button variant="ghost" size="sm" className="text-[#7C3AED] hover:bg-[#7C3AED]/10">Revoir</Button>
                    </Link>
                  </div>
                ))
              ) : (
                <div className="text-center p-8 bg-[#12121F] rounded-xl border border-[#1E1E3A]">
                  <p className="text-[#94A3B8]">Aucun contenu généré pour le moment.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
