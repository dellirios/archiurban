import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Loader2, LogIn, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { toast.error('Preencha todos os campos.'); return; }
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      const { data: hasRole } = await supabase.rpc('has_role', { _user_id: data.user.id, _role: 'super_admin' });
      if (!hasRole) { await supabase.auth.signOut(); toast.error('Acesso negado. Apenas super administradores.'); setLoading(false); return; }
      toast.success('Login efetuado com sucesso!');
      navigate('/admin/dashboard');
    } catch (err: any) { toast.error(err.message || 'Erro ao fazer login'); }
    finally { setLoading(false); }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { toast.error('Insira o email.'); return; }
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setResetSent(true);
      toast.success('Email de recuperação enviado!');
    } catch (err: any) { toast.error(err.message || 'Erro ao enviar email'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="bg-card border border-border rounded-2xl p-8 shadow-lg space-y-6">
          <div className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Shield className="w-7 h-7 text-primary" />
            </div>
            <div className="text-center">
              <h1 className="text-lg font-semibold text-foreground">Admin ArchiUrban</h1>
              <p className="text-xs text-muted-foreground mt-1">
                {forgotMode ? 'Recuperar senha de administrador' : 'Acesso restrito a super administradores'}
              </p>
            </div>
          </div>

          {forgotMode ? (
            resetSent ? (
              <div className="text-center space-y-4">
                <p className="text-sm text-foreground">Email de recuperação enviado para <span className="font-semibold">{email}</span>.</p>
                <p className="text-xs text-muted-foreground">Verifique a sua caixa de entrada e siga as instruções.</p>
                <Button variant="outline" size="sm" className="gap-1.5" onClick={() => { setForgotMode(false); setResetSent(false); }}>
                  <ArrowLeft className="w-3.5 h-3.5" /> Voltar ao login
                </Button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs">Email do administrador</Label>
                  <Input id="email" type="email" placeholder="admin@exemplo.com" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" className="h-10" />
                </div>
                <Button type="submit" className="w-full h-10 gap-2" disabled={loading}>
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Enviando...</> : 'Enviar link de recuperação'}
                </Button>
                <button type="button" onClick={() => setForgotMode(false)} className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-1">
                  <ArrowLeft className="w-3 h-3" /> Voltar ao login
                </button>
              </form>
            )
          ) : (
            <>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs">Email</Label>
                  <Input id="email" type="email" placeholder="admin@exemplo.com" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" className="h-10" />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-xs">Senha</Label>
                    <button type="button" onClick={() => setForgotMode(true)} className="text-[11px] text-primary hover:underline">Esqueceu a senha?</button>
                  </div>
                  <div className="relative">
                    <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" className="h-10 pr-10" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <Button type="submit" className="w-full h-10 gap-2" disabled={loading}>
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Autenticando...</> : <><LogIn className="w-4 h-4" /> Entrar</>}
                </Button>
              </form>
            </>
          )}

          <p className="text-[10px] text-muted-foreground text-center">Painel protegido por autenticação Supabase</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
