
import Sidebar from '@/components/layout/Sidebar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, TrendingUp, Layout, Clock, MessageSquare } from 'lucide-react';

export default function GuidePage() {
  const sections = [
    {
      title: "La règle des 3 premières secondes ⚡",
      icon: Zap,
      content: "Les 3 premières secondes de ta vidéo (ou les 2 premières lignes de ton post) décident de tout. L'algorithme TikTok mesure si les gens regardent jusqu'à la fin. Facebook mesure si les gens cliquent sur 'Voir plus'. Dans les deux cas, tu as moins de 3 secondes pour convaincre. Ton hook doit créer immédiatement une tension, une curiosité ou une promesse forte que seule la suite peut résoudre. Sans ça, peu importe la qualité de ce qui suit."
    },
    {
      title: "Pourquoi les hooks déterminent tes vues 🎯",
      icon: TrendingUp,
      content: "L'algorithme ne distribue pas ton contenu parce qu'il est bon. Il le distribue parce que les gens restent. Un taux de rétention élevé = l'algorithme pousse ton contenu à plus de monde = croissance exponentielle. C'est un cercle vertueux que tout commence par le hook. Un bon hook peut transformer une vidéo ordinaire en contenu viral. Un mauvais hook peut tuer une vidéo excellente avant qu'elle soit vue."
    },
    {
      title: "Comment structurer une vidéo courte 📐",
      icon: Layout,
      content: "La structure qui fonctionne : Hook → Problème relatable → Solution claire → Preuve ou histoire → Call to action. Cette structure ne laisse aucune sortie à l'audience. Le problème crée de l'identification. La solution crée de l'espoir. La preuve crée la confiance. Le CTA transforme un spectateur passif en follower engagé."
    },
    {
      title: "À quelle fréquence publier 📅",
      icon: Clock,
      content: "1 vidéo par jour pendant 30 jours sur TikTok. 1 post par jour sur Facebook. Ce n'est pas négociable au début. L'algorithme récompense la régularité avant la perfection. Les 30 premiers jours sont les plus difficiles et les plus importants. C'est pendant cette période que tu trouves ton style, que l'algorithme te comprend, et que les premiers vrais followers arrivent. Après 30 jours de consistance, tu peux commencer à optimiser la qualité."
    },
    {
      title: "Comment améliorer ta rétention 📈",
      icon: MessageSquare,
      content: "Parle vite et coupe tous les silences au montage. Ajoute des sous-titres animés — 80% des gens regardent sans son. Commence chaque phrase par un mot fort. Pose une question au milieu de ta vidéo pour garder l'attention. Termine par une question ouverte dans les commentaires pour booster l'engagement. Sur Facebook, laisse des sauts de ligne, utilise des emojis stratégiquement et pose UNE seule question à la fin."
    }
  ];

  return (
    <div className="flex min-h-screen bg-[#0A0A14]">
      <Sidebar />
      
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-8">
          <header className="text-center space-y-4">
            <Badge variant="outline" className="border-[#7C3AED]/50 text-[#7C3AED]">Guide NexiumAgency</Badge>
            <h1 className="text-3xl md:text-4xl font-bold">Comment créer des vidéos qui retiennent l'attention</h1>
            <p className="text-[#94A3B8] text-lg">Le guide essentiel pour tout créateur sérieux.</p>
          </header>

          <div className="space-y-6">
            {sections.map((section, i) => (
              <Card key={i} className="bg-[#12121F] border-[#1E1E3A]">
                <CardContent className="p-8 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#7C3AED]/10 flex items-center justify-center">
                      <section.icon className="w-6 h-6 text-[#7C3AED]" />
                    </div>
                    <h2 className="text-xl font-bold">{section.title}</h2>
                  </div>
                  <p className="text-[#94A3B8] leading-relaxed text-lg">
                    {section.content}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <footer className="text-center py-12 border-t border-[#1E1E3A]">
            <p className="text-[#94A3B8]">© 2026 NexiumAgency. Tous droits réservés.</p>
          </footer>
        </div>
      </main>
    </div>
  );
}
