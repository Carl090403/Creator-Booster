
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Zap, ArrowRight, CheckCircle2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { NICHES } from '@/config/constants';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-[#1E1E3A] bg-[#0A0A14]/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-8 h-8 text-[#7C3AED] fill-[#7C3AED]" />
            <span className="text-xl font-bold tracking-tight">Creator Booster IA</span>
            <Badge variant="outline" className="ml-2 border-[#7C3AED]/50 text-[#7C3AED] text-[10px] hidden sm:inline-flex">
              by NexiumAgency
            </Badge>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#94A3B8]">
            <Link to="/guide" className="hover:text-[#F1F5F9] transition-colors">Guide</Link>
            <Link to="/login" className="hover:text-[#F1F5F9] transition-colors">Connexion</Link>
            <Button asChild className="bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] hover:opacity-90 text-white border-none rounded-xl">
              <Link to="/signup">Commencer gratuitement</Link>
            </Button>
          </nav>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Zap className="w-6 h-6" />
          </Button>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#7C3AED]/20 rounded-full blur-[128px]" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#06B6D4]/20 rounded-full blur-[128px]" />
          </div>
          
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="mb-6 bg-[#7C3AED]/10 text-[#7C3AED] border-[#7C3AED]/20 hover:bg-[#7C3AED]/20 px-4 py-1">
                L'IA au service des créateurs africains 🌍
              </Badge>
              <h1 className="text-4xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-b from-white to-[#94A3B8] bg-clip-text text-transparent">
                Crée 30 contenus viraux <br /> par mois avec l'IA
              </h1>
              <p className="text-lg md:text-xl text-[#94A3B8] max-w-2xl mx-auto mb-10 leading-relaxed">
                Le seul outil pensé pour les créateurs TikTok et Facebook d'Afrique francophone. 
                Génère des hooks, des scripts et des idées adaptés à ta culture.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" asChild className="w-full sm:w-auto h-14 px-8 text-lg bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] hover:opacity-90 text-white border-none rounded-xl shadow-lg shadow-[#7C3AED]/20">
                  <Link to="/signup" className="flex items-center gap-2">
                    Commencer gratuitement <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="w-full sm:w-auto h-14 px-8 text-lg border-[#1E1E3A] bg-[#12121F] hover:bg-[#1E1E3A] rounded-xl">
                  <Link to="/guide">Voir le guide</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Niches Section */}
        <section className="py-20 bg-[#12121F]/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Adapté à toutes les niches</h2>
              <p className="text-[#94A3B8]">Peu importe ton domaine, l'IA connaît tes codes.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {NICHES.map((niche) => (
                <Badge key={niche.id} variant="secondary" className="bg-[#1E1E3A] text-[#F1F5F9] hover:bg-[#2D2D5E] px-4 py-2 text-sm rounded-full border-none transition-all hover:scale-105">
                  <span className="mr-2">{niche.icon}</span> {niche.label}
                </Badge>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Ils dominent déjà leur niche</h2>
              <p className="text-[#94A3B8]">Rejoins des milliers de créateurs qui utilisent Creator Booster IA.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: "Moussa K.", niche: "Business", result: "+50k abonnés en 2 mois", text: "Les hooks sont incroyables. Je ne passe plus des heures à réfléchir à mon accroche." },
                { name: "Awa D.", niche: "Lifestyle", result: "1M de vues sur TikTok", text: "L'IA comprend vraiment le parler africain. C'est naturel et ça percute direct." },
                { name: "Jean-Paul M.", niche: "Motivation", result: "Engagement x3 sur Facebook", text: "Le calendrier de 30 jours m'a sauvé. Je publie enfin tous les jours sans stress." },
              ].map((t, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -5 }}
                  className="p-8 rounded-2xl bg-[#12121F] border border-[#1E1E3A] relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Star className="w-12 h-12 text-[#7C3AED]" />
                  </div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#06B6D4] flex items-center justify-center text-xl font-bold">
                      {t.name[0]}
                    </div>
                    <div>
                      <h4 className="font-bold">{t.name}</h4>
                      <p className="text-xs text-[#94A3B8]">{t.niche} • {t.result}</p>
                    </div>
                  </div>
                  <p className="text-[#94A3B8] italic leading-relaxed">"{t.text}"</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#0A0A14] border-t border-[#1E1E3A] py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-6 h-6 text-[#7C3AED] fill-[#7C3AED]" />
                <span className="text-lg font-bold">Creator Booster IA</span>
              </div>
              <p className="text-[#94A3B8] text-sm mb-4">
                L'IA au service des créateurs africains. <br />
                Propulsé par NexiumAgency.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Liens rapides</h4>
              <ul className="space-y-2 text-sm text-[#94A3B8]">
                <li><Link to="/dashboard" className="hover:text-[#F1F5F9]">Dashboard</Link></li>
                <li><Link to="/guide" className="hover:text-[#F1F5F9]">Guide Créateur</Link></li>
                <li><Link to="/tools/hooks" className="hover:text-[#F1F5F9]">Générateur de Hooks</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Légal</h4>
              <ul className="space-y-2 text-sm text-[#94A3B8]">
                <li><Link to="#" className="hover:text-[#F1F5F9]">Confidentialité</Link></li>
                <li><Link to="#" className="hover:text-[#F1F5F9]">CGU</Link></li>
                <li><Link to="#" className="hover:text-[#F1F5F9]">Contact</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-[#1E1E3A] text-center text-sm text-[#94A3B8]">
            <p>© 2026 NexiumAgency. Tous droits réservés. Fait avec ❤️ pour l'Afrique.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
