
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Zap, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { authService } from '@/services/authService';
import { useAppStore } from '@/stores/appStore';
import toast from 'react-hot-toast';

const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const { setUser } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });

  const getLoginErrorMessage = (error: unknown) => {
    const err = error as { code?: string; message?: string };
    switch (err.code) {
      case 'auth/user-not-found':
        return "Aucun compte trouvé pour cet email.";
      case 'auth/wrong-password':
        return "Mot de passe incorrect.";
      case 'auth/too-many-requests':
        return "Trop de tentatives. Réessaie plus tard.";
      case 'auth/operation-not-allowed':
        return "L'authentification email/mot de passe n'est pas activée dans Firebase.";
      default:
        return err.message || "Email ou mot de passe incorrect.";
    }
  };

  const onSubmit = async (data: LoginValues) => {
    setIsLoading(true);
    try {
      const user = await authService.loginWithEmailPassword(data.email, data.password);
      setUser(user);
      toast.success("Bon retour parmi nous !");
      if (user.onboarding_completed) {
        navigate('/dashboard');
      } else {
        navigate('/onboarding');
      }
    } catch (error) {
      toast.error(getLoginErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const onGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const user = await authService.loginWithGoogle();
      setUser(user);
      toast.success("Connexion Google réussie !");
      if (user.onboarding_completed) {
        navigate('/dashboard');
      } else {
        navigate('/onboarding');
      }
    } catch (error) {
      const err = error as { code?: string; message?: string };
      toast.error(err.message || "Erreur lors de la connexion Google.");
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
          <CardTitle className="text-2xl font-bold">Connexion</CardTitle>
          <CardDescription className="text-[#94A3B8]">
            Connecte-toi avec ton email ou Google
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
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Mot de passe"
                {...register('password')}
                className="w-full"
              />
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>
            <Button type="submit" disabled={isLoading} className="w-full h-12 rounded-xl font-bold">
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Se connecter'}
            </Button>
          </form>

          <div className="flex justify-between text-sm text-[#94A3B8]">
            <Link to="/forgot-password" className="text-[#7C3AED] hover:underline">Mot de passe oublié ?</Link>
          </div>

          <div className="flex items-center gap-2 text-sm text-[#94A3B8]">
            <span className="flex-1 h-px bg-[#334155]" />
            <span>ou</span>
            <span className="flex-1 h-px bg-[#334155]" />
          </div>

          <Button 
            onClick={onGoogleSignIn}
            disabled={isLoading}
            className="w-full bg-white text-black hover:bg-gray-100 h-12 rounded-xl flex items-center justify-center gap-3 font-bold"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" />
                </svg>
                Se connecter avec Google
              </>
            )}
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <p className="text-sm text-[#94A3B8] text-center">
            Pas encore de compte ? <Link to="/signup" className="text-[#7C3AED] hover:underline">S'inscrire</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
