import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Zap, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { authService } from '@/services/authService';
import toast from 'react-hot-toast';

const forgotPasswordSchema = z.object({
  email: z.string().email('Email invalide'),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordValues) => {
    setIsLoading(true);
    try {
      await authService.sendPasswordResetEmail(data.email);
      toast.success('Email de réinitialisation envoyé. Vérifie ta boîte de réception.');
    } catch (error) {
      const err = error as { code?: string; message?: string };
      const message = err.code === 'auth/user-not-found'
        ? "Aucun compte trouvé pour cet email."
        : err.message || 'Erreur lors de l’envoi de l’email.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#7C3AED]/10 rounded-full blur-[96px]" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#06B6D4]/10 rounded-full blur-[96px]" />
      </div>

      <Card className="w-full max-w-md bg-[#12121F] border-[#1E1E3A] shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <Zap className="w-10 h-10 text-[#7C3AED] fill-[#7C3AED]" />
          </div>
          <CardTitle className="text-2xl font-bold">Mot de passe oublié</CardTitle>
          <CardDescription className="text-[#94A3B8]">
            Entrer ton email pour recevoir la procédure de réinitialisation.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email"
                {...register('email')}
                className="w-full"
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>
            <Button type="submit" disabled={isLoading} className="w-full h-12 rounded-xl font-bold">
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Envoyer le lien'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <p className="text-sm text-[#94A3B8] text-center">
            Retour à la <Link to="/login" className="text-[#7C3AED] hover:underline">connexion</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
