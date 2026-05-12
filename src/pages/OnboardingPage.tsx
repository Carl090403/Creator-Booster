
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Check, ArrowRight, ArrowLeft, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { NICHES, PLATFORMS } from '@/config/constants';
import { useAppStore } from '@/stores/appStore';
import { authService } from '@/services/authService';
import toast from 'react-hot-toast';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { user, updateProfile } = useAppStore();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    niche: '',
    platform: 'both' as any,
  });

  const progress = (step / 3) * 100;

  const handleNext = async () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      try {
        const updatedUser = await authService.updateProfile({
          ...formData,
          onboarding_completed: true,
        });
        updateProfile(updatedUser);
        toast.success("Espace créateur prêt !");
        navigate('/dashboard');
      } catch (error) {
        toast.error("Une erreur est survenue.");
      }
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#7C3AED]/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#06B6D4]/10 rounded-full blur-[128px]" />
      </div>

      <div className="w-full max-w-2xl">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <Zap className="w-12 h-12 text-[#7C3AED] fill-[#7C3AED]" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Configure ton espace</h1>
          <p className="text-[#94A3B8]">Étape {step} sur 3</p>
          <Progress value={progress} className="h-2 mt-4 bg-[#1E1E3A] [&>div]:bg-gradient-to-r [&>div]:from-[#7C3AED] [&>div]:to-[#06B6D4]" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2">Comment tu t'appelles vraiment ?</h2>
                  <p className="text-[#94A3B8]">Ton prénom d'affichage dans l'application.</p>
                </div>
                <Input 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ton prénom"
                  className="h-14 text-lg bg-[#12121F] border-[#1E1E3A] focus:ring-[#7C3AED] text-center"
                />
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2">Dans quel domaine tu crées du contenu ?</h2>
                  <p className="text-[#94A3B8]">Cela aide l'IA à comprendre ton audience.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {NICHES.map((niche) => (
                    <Card 
                      key={niche.id}
                      onClick={() => setFormData({ ...formData, niche: niche.id })}
                      className={`p-6 cursor-pointer transition-all border-2 hover:border-[#7C3AED]/50 ${
                        formData.niche === niche.id ? 'bg-[#7C3AED]/10 border-[#7C3AED]' : 'bg-[#12121F] border-[#1E1E3A]'
                      }`}
                    >
                      <div className="text-3xl mb-3">{niche.icon}</div>
                      <h3 className="font-bold text-sm">{niche.label}</h3>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2">Sur quelle plateforme tu publies principalement ?</h2>
                  <p className="text-[#94A3B8]">L'IA adaptera le style et le format de chaque contenu.</p>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {PLATFORMS.map((platform) => (
                    <Card 
                      key={platform.id}
                      onClick={() => setFormData({ ...formData, platform: platform.id })}
                      className={`p-6 cursor-pointer transition-all border-2 flex items-center gap-6 hover:border-[#7C3AED]/50 ${
                        formData.platform === platform.id ? 'bg-[#7C3AED]/10 border-[#7C3AED]' : 'bg-[#12121F] border-[#1E1E3A]'
                      }`}
                    >
                      <div className="text-4xl">{platform.icon}</div>
                      <div className="text-left">
                        <h3 className="font-bold text-lg">{platform.label}</h3>
                        <p className="text-sm text-[#94A3B8]">{platform.description}</p>
                      </div>
                      {formData.platform === platform.id && (
                        <div className="ml-auto bg-[#7C3AED] rounded-full p-1">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-12 flex items-center justify-between gap-4">
          <Button 
            variant="ghost" 
            onClick={handleBack}
            disabled={step === 1}
            className="text-[#94A3B8] hover:text-[#F1F5F9]"
          >
            <ArrowLeft className="w-5 h-5 mr-2" /> Retour
          </Button>
          <Button 
            onClick={handleNext}
            disabled={(step === 1 && !formData.name) || (step === 2 && !formData.niche)}
            className="bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] hover:opacity-90 text-white border-none h-12 px-8 rounded-xl"
          >
            {step === 3 ? "Lancer mon espace créateur" : "Continuer"} <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
