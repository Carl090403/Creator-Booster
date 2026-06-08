import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Mail, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Sidebar from '@/components/layout/Sidebar';

export default function ContactPage() {
  const navigate = useNavigate();
  
  const emailAddress = "agencenexium01@gmail.com"; // 💡 Mets ton vrai email ici
  const whatsAppNumber = "22942348240"; // 💡 Ton numéro WhatsApp complet avec indicatif (ex: 22997001122), sans le +
  
  const whatsappUrl = `https://wa.me/${whatsAppNumber}?text=Bonjour%20Creator%20Booster,%20j'ai%20une%20question%20concernant...`;

  const faqs = [
    {
      q: "Mes crédits n'apparaissent pas après mon achat, que faire ?",
      a: "Pas d'inquiétude ! Les paiements Chariow sont instantanés, mais il peut arriver qu'un léger délai de synchronisation de 1 à 2 minutes survienne. Si après ce délai votre solde n'a pas bougé, contactez-nous par WhatsApp ou par Email avec l'adresse utilisée lors du paiement."
    },
    {
      q: "Combien de crédits consomme une génération ?",
      a: "La consommation dépend de l'outil utilisé : Les hooks, scripts de base et idées de contenu consomment 1 crédit par génération. Les calendriers éditoriaux complets sur 30 jours demandent 2 crédits."
    },
    {
      q: "Puis-je modifier mes informations de profil ?",
      a: "Oui, vous pouvez ajuster vos préférences de plateforme et votre niche directement depuis les paramètres de votre compte pour orienter les futures suggestions de l'IA."
    }
  ];

  return (
    <div className="min-h-screen bg-[#0A0A14] text-white">
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/dashboard')}
              className="md:hidden"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <p className="text-sm text-[#94A3B8] mb-1">Support & Assistance</p>
              <h1 className="text-3xl font-bold">Contact & FAQ</h1>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            {/* Section FAQ */}
            <section className="space-y-4">
              <Card className="bg-[#12121F] border-[#1E1E3A]">
                <CardHeader className="flex flex-row items-center gap-3">
                  <HelpCircle className="w-5 h-5 text-[#7C3AED]" />
                  <CardTitle className="text-xl">Foire Aux Questions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {faqs.map((faq, index) => (
                    <details key={index} className="group border-b border-[#1E1E3A] pb-4 cursor-pointer">
                      <summary className="flex items-center justify-between font-medium text-white hover:text-[#7C3AED] list-none">
                        <span>{faq.q}</span>
                        <span className="transition group-open:rotate-180 text-[#94A3B8]">▼</span>
                      </summary>
                      <p className="text-sm text-[#94A3B8] mt-3 leading-relaxed pl-2 border-l-2 border-[#7C3AED]/40">
                        {faq.a}
                      </p>
                    </details>
                  ))}
                </CardContent>
              </Card>
            </section>

            {/* Section Canaux de Contact */}
            <section className="space-y-6">
              <Card className="bg-[#12121F] border-[#1E1E3A] p-6 text-center">
                <h3 className="text-xl font-bold mb-2">Besoin d'un support direct ?</h3>
                <p className="text-sm text-[#94A3B8] mb-6">
                  Notre équipe est disponible 7j/7 pour répondre à vos blocages techniques ou questions commerciales.
                </p>

                <div className="space-y-4">
                  {/* Bouton WhatsApp */}
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 w-full py-3 px-4 bg-[#25D366] hover:bg-[#20ba59] text-black font-bold rounded-xl transition-colors shadow-lg"
                  >
                    <MessageSquare className="w-5 h-5" />
                    Nous contacter sur WhatsApp
                  </a>

                  {/* Bouton Email */}
                  <a
                    href={`mailto:${emailAddress}`}
                    className="flex items-center justify-center gap-3 w-full py-3 px-4 bg-[#1E1E3A] hover:bg-[#2A2A4E] text-white border border-[#31315C] font-semibold rounded-xl transition-colors"
                  >
                    <Mail className="w-5 h-5 text-[#94A3B8]" />
                    Nous écrire par Email
                  </a>
                </div>

                <div className="mt-6 text-xs text-[#64748B]">
                  Pour toute demande d'assistance concernant un paiement, merci de fournir l'adresse email de votre compte Creator Booster.
                </div>
              </Card>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}