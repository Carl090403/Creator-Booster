import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Sidebar from '@/components/layout/Sidebar';
import { useAppStore } from '@/stores/appStore';

// Type strict pour les identifiants de pack
type PackId = 'starter' | 'createur' | 'pro';

const PRICING_PACKS = [
  {
    id: 'starter' as PackId,
    title: 'Pack Starter',
    price: 3000,
    credits: 50,
    description: 'Idéal pour démarrer rapidement avec des contenus puissants.',
  },
  {
    id: 'createur' as PackId,
    title: 'Pack Créateur',
    price: 7000,
    credits: 150,
    description: 'Le pack recommandé pour des créateurs réguliers.',
    popular: true,
  },
  {
    id: 'pro' as PackId,
    title: 'Pack Pro',
    price: 14000,
    credits: 350,
    description: 'La meilleure autonomie pour vos publications mensuelles.',
  },
];

// 🔗 LIENS VERS LES PAGES PRODUITS CHARIOW
const CHARIOW_PRODUCT_URLS: Record<PackId, string> = {
  starter: 'https://dotqipmz.mychariow.shop/prd_gv95mbx7',
  createur: 'https://dotqipmz.mychariow.shop/prd_y6upez7f',
  pro: 'https://dotqipmz.mychariow.shop/prd_huuxea9m',
};

export default function PricingPage() {
  const navigate = useNavigate();
  const { user } = useAppStore();
  
  // 💡 CORRECTION ANTI-TRADUCTION : On ne stocke que l'ID technique ('starter' | 'createur' | 'pro')
  const [selectedPackId, setSelectedPackId] = useState<PackId>('createur');

  // Récupération dynamique des données du pack sélectionné à des fins d'affichage
  const selectedPack = PRICING_PACKS.find((p) => p.id === selectedPackId) || PRICING_PACKS[1];

  const handleCheckout = () => {
    if (!user) {
      toast.error('Utilisateur non connecté.');
      return;
    }

    const targetUrl = CHARIOW_PRODUCT_URLS[selectedPackId];

    if (!targetUrl || targetUrl.includes('ton-lien-page')) {
      toast.error('La page de ce produit n’est pas encore configurée.');
      return;
    }

    // Redirection vers ta page produit personnalisée sur Chariow dans un nouvel onglet
    window.open(targetUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#0A0A14] text-white">
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
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
              <p className="text-sm text-[#94A3B8] mb-1">Monétisation par crédits</p>
              <h1 className="text-3xl font-bold">Tarifs & Packs</h1>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <section className="space-y-6">
              <Card className="bg-[#12121F] border-[#1E1E3A]">
                <CardHeader>
                  <CardTitle className="text-xl">Vos options</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[#94A3B8] leading-7">
                    Choisissez un pack de crédits pour continuer à générer du contenu. Chaque génération consomme des crédits selon le type d'outil, et votre solde est actualisé automatiquement après un paiement réussi.
                  </p>
                </CardContent>
              </Card>

              <div className="grid gap-4 sm:grid-cols-2">
                {PRICING_PACKS.map((pack) => (
                  <Card
                    key={pack.id}
                    onClick={() => setSelectedPackId(pack.id)}
                    className={`cursor-pointer border-2 transition-all ${
                      selectedPackId === pack.id 
                        ? 'border-[#7C3AED] bg-[#1F1B3A]' 
                        : 'border-[#1E1E3A] bg-[#12121F] hover:border-[#7C3AED]/70'
                    }`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <div>
                          <h2 className="text-lg font-semibold">{pack.title}</h2>
                          <p className="text-sm text-[#94A3B8] mt-1">{pack.credits} crédits</p>
                        </div>
                        {pack.popular && (
                          <Badge className="bg-[#f59e0b] text-black">Recommandé</Badge>
                        )}
                      </div>
                      <p className="text-4xl font-bold mb-3">{pack.price.toLocaleString('fr-FR')} FCFA</p>
                      <p className="text-sm text-[#cbd5e1]">{pack.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <section className="space-y-6">
              <Card className="bg-[#12121F] border-[#1E1E3A] p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#7C3AED]/20 text-[#7C3AED]">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-[#94A3B8]">Solde actuel</p>
                    <p className="text-3xl font-bold">{user?.credits ?? 0} crédits</p>
                  </div>
                </div>
                <div className="space-y-4 text-sm text-[#cbd5e1]">
                  <p><span className="font-semibold">Pack sélectionné :</span> {selectedPack.title}</p>
                  <p><span className="font-semibold">Montant :</span> {selectedPack.price.toLocaleString('fr-FR')} FCFA</p>
                  <p><span className="font-semibold">Crédits :</span> {selectedPack.credits}</p>
                </div>
                <Button
                  onClick={handleCheckout}
                  className="mt-6 w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white"
                >
                  Acheter ce pack
                </Button>
              </Card>

              <Card className="bg-[#0F172A] border-[#1E293B] p-6">
                <h3 className="text-lg font-semibold mb-3">Comment ça marche ?</h3>
                <ul className="space-y-3 text-sm text-[#cbd5e1]">
                  <li>• Le paiement est traité par <strong>Chariow</strong> en toute sécurité.</li>
                  <li>• Après votre achat, vous êtes automatiquement redirigé vers votre tableau de bord.</li>
                  <li>• Les crédits sont ajoutés à votre compte <strong>de manière instantanée</strong>.</li>
                  <li>• Vous pouvez ensuite générer votre contenu  immédiatement.</li>
                </ul>
              </Card>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}