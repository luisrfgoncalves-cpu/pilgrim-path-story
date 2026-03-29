import { useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Check, Copy, Download, Smartphone, Apple, ChevronDown, ChevronUp,
  Mail, Lock, Shield, AlertTriangle, RefreshCw, HelpCircle, ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';
import logoImg from '@/assets/logo-peregrino.png';
import pilgrimStanding from '@/assets/pilgrim-standing.png';
import cidadeCelestial from '@/assets/scenes/cidade-celestial.jpg';

const APP_URL = 'https://operegrino.lovable.app';

const ThankYouPage = () => {
  const [searchParams] = useSearchParams();
  const buyerEmail = searchParams.get('email') || '';
  const [copied, setCopied] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>('android');
  const contentRef = useRef<HTMLDivElement>(null);

  const accessLink = buyerEmail ? `${APP_URL}/auth` : `${APP_URL}/auth`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(accessLink);
      setCopied(true);
      toast.success('Link copiado!');
      setTimeout(() => setCopied(false), 3000);
    } catch {
      toast.error('Erro ao copiar. Selecione e copie manualmente.');
    }
  };

  const handleDownloadPDF = () => {
    const content = `
═══════════════════════════════════════════════
   O PEREGRINO — Suas Informações de Acesso
═══════════════════════════════════════════════

Parabéns pela sua aquisição! 🎉

📧 Seu email de acesso: ${buyerEmail || '(use o email da compra)'}

🔗 Link de acesso ao app:
${accessLink}

═══════════════════════════════════════════════
   COMO INSTALAR O APP NO SEU CELULAR
═══════════════════════════════════════════════

📱 ANDROID (Chrome):
1. Abra o link acima no navegador Chrome
2. Toque nos 3 pontinhos (⋮) no canto superior direito
3. Selecione "Instalar aplicativo" ou "Adicionar à tela inicial"
4. Confirme a instalação
5. O app aparecerá na sua tela inicial como um app normal

🍎 IPHONE (Safari):
1. Abra o link acima no Safari (NÃO use Chrome no iPhone)
2. Toque no botão de compartilhar (□↑) na barra inferior
3. Role para baixo e toque em "Adicionar à Tela de Início"
4. Dê um nome e toque em "Adicionar"
5. O app aparecerá na sua tela inicial

═══════════════════════════════════════════════
   PRIMEIRO ACESSO
═══════════════════════════════════════════════

1. Abra o app instalado
2. Toque em "Criar Conta"
3. Digite o MESMO email usado na compra: ${buyerEmail || '(email da compra)'}
4. Crie uma senha de sua preferência (mínimo 6 caracteres)
5. Pronto! Você está dentro da jornada!

⚠️  IMPORTANTE:
• Use EXATAMENTE o mesmo email da compra
• A senha é de sua escolha — guarde-a bem
• Após o primeiro login, você não precisará fazer login novamente
• Se desinstalar e reinstalar, use o mesmo email e senha
• Se esquecer a senha, use "Esqueceu a senha?" na tela de login

═══════════════════════════════════════════════
   PROBLEMAS COMUNS
═══════════════════════════════════════════════

❌ "Email não autorizado"
→ Verifique se digitou o MESMO email usado na compra da Kiwify

❌ "Acesso já utilizado"  
→ Você já criou uma conta. Use "Entrar" ao invés de "Criar Conta"

❌ App não aparece para instalar
→ Android: Use o Chrome. iPhone: Use o Safari
→ Limpe o cache do navegador e tente novamente

❌ Esqueci minha senha
→ Na tela de login, toque em "Esqueceu a senha?"
→ Um email de recuperação será enviado

📞 Suporte: centrobiblicoonline@gmail.com
═══════════════════════════════════════════════
`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'O-Peregrino-Acesso.txt';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Arquivo baixado com sucesso!');
  };

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: `url(${cidadeCelestial})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/90 to-background" />

      <div ref={contentRef} className="relative z-10 max-w-lg mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <img src={logoImg} alt="O Peregrino" className="w-20 h-20 mx-auto rounded-2xl shadow-lg" />
          <div>
            <h1 className="text-2xl font-bold text-primary">🎉 Parabéns, Peregrino!</h1>
            <p className="text-foreground/80 mt-2 text-base">
              Sua jornada rumo à Cidade Celestial começa agora!
            </p>
          </div>
          <img
            src={pilgrimStanding}
            alt="O Peregrino"
            className="w-32 h-32 mx-auto object-contain drop-shadow-2xl"
          />
        </div>

        {/* Access Info Card */}
        <Card className="border-primary/30 bg-card/80 backdrop-blur">
          <CardContent className="p-5 space-y-4">
            <h2 className="text-lg font-bold text-primary flex items-center gap-2">
              <Shield className="w-5 h-5" /> Seus Dados de Acesso
            </h2>

            {buyerEmail && (
              <div className="bg-secondary/50 rounded-lg p-3 space-y-1">
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Mail className="w-3 h-3" /> Seu email de acesso
                </p>
                <p className="text-foreground font-semibold text-sm break-all">{buyerEmail}</p>
              </div>
            )}

            <div className="bg-secondary/50 rounded-lg p-3 space-y-2">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <ExternalLink className="w-3 h-3" /> Link de acesso ao app
              </p>
              <p className="text-primary font-mono text-xs break-all">{accessLink}</p>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleCopy} className="flex-1 text-xs">
                  {copied ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                  {copied ? 'Copiado!' : 'Copiar Link'}
                </Button>
                <Button size="sm" variant="outline" onClick={handleDownloadPDF} className="flex-1 text-xs">
                  <Download className="w-3 h-3 mr-1" /> Baixar Instruções
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* First Access Steps */}
        <Card className="border-border bg-card/80 backdrop-blur">
          <CardContent className="p-5 space-y-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary" /> Primeiro Acesso
            </h2>
            <div className="space-y-3">
              {[
                { step: '1', text: 'Abra o link acima no navegador do seu celular' },
                { step: '2', text: 'Instale o app (veja instruções abaixo)' },
                { step: '3', text: 'Abra o app e toque em "Criar Conta"' },
                { step: '4', text: `Use o email: ${buyerEmail || 'o mesmo da compra'}` },
                { step: '5', text: 'Crie uma senha de sua preferência (mín. 6 caracteres)' },
                { step: '6', text: 'Pronto! Sua jornada começou! 🙏' },
              ].map(({ step, text }) => (
                <div key={step} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center">
                    {step}
                  </span>
                  <p className="text-foreground/90 text-sm pt-0.5">{text}</p>
                </div>
              ))}
            </div>
            <div className="bg-primary/10 rounded-lg p-3 mt-2">
              <p className="text-xs text-primary font-medium">
                ✨ Após o primeiro login, você NÃO precisará fazer login novamente!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Installation Instructions - Android */}
        <Card className="border-border bg-card/80 backdrop-blur">
          <CardContent className="p-0">
            <button
              onClick={() => toggleSection('android')}
              className="w-full p-5 flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-green-400" />
                <h2 className="text-base font-bold text-foreground">📱 Android (Chrome)</h2>
              </div>
              {openSection === 'android' ? (
                <ChevronUp className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
            {openSection === 'android' && (
              <div className="px-5 pb-5 space-y-3">
                {[
                  'Abra o link no navegador Chrome',
                  'Toque nos 3 pontinhos (⋮) no canto superior direito',
                  'Selecione "Instalar aplicativo" ou "Adicionar à tela inicial"',
                  'Confirme a instalação',
                  'O app aparecerá na sua tela inicial como um app normal!',
                ].map((text, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-green-400 font-bold text-sm mt-0.5">{i + 1}.</span>
                    <p className="text-foreground/80 text-sm">{text}</p>
                  </div>
                ))}
                <div className="bg-green-400/10 rounded-lg p-3">
                  <p className="text-xs text-green-300">
                    💡 Se aparecer um banner "Instalar O Peregrino" na parte inferior da tela, basta tocar nele!
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Installation Instructions - iPhone */}
        <Card className="border-border bg-card/80 backdrop-blur">
          <CardContent className="p-0">
            <button
              onClick={() => toggleSection('iphone')}
              className="w-full p-5 flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-2">
                <Apple className="w-5 h-5 text-foreground/80" />
                <h2 className="text-base font-bold text-foreground">🍎 iPhone (Safari)</h2>
              </div>
              {openSection === 'iphone' ? (
                <ChevronUp className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
            {openSection === 'iphone' && (
              <div className="px-5 pb-5 space-y-3">
                <div className="bg-destructive/10 rounded-lg p-3 mb-2">
                  <p className="text-xs text-destructive font-medium">
                    ⚠️ IMPORTANTE: No iPhone, use SOMENTE o Safari! Chrome/Firefox não permitem instalar apps no iOS.
                  </p>
                </div>
                {[
                  'Abra o link no Safari',
                  'Toque no botão de compartilhar (□↑) na barra inferior',
                  'Role para baixo e toque em "Adicionar à Tela de Início"',
                  'Dê um nome e toque em "Adicionar"',
                  'O app aparecerá na sua tela inicial!',
                ].map((text, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-foreground/60 font-bold text-sm mt-0.5">{i + 1}.</span>
                    <p className="text-foreground/80 text-sm">{text}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Troubleshooting */}
        <Card className="border-border bg-card/80 backdrop-blur">
          <CardContent className="p-0">
            <button
              onClick={() => toggleSection('problems')}
              className="w-full p-5 flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-primary" />
                <h2 className="text-base font-bold text-foreground">❓ Problemas Comuns</h2>
              </div>
              {openSection === 'problems' ? (
                <ChevronUp className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
            {openSection === 'problems' && (
              <div className="px-5 pb-5 space-y-4">
                {[
                  {
                    icon: <AlertTriangle className="w-4 h-4 text-destructive" />,
                    title: '"Email não autorizado"',
                    solution: 'Verifique se digitou EXATAMENTE o mesmo email usado na compra da Kiwify. Letras maiúsculas/minúsculas importam!',
                  },
                  {
                    icon: <AlertTriangle className="w-4 h-4 text-yellow-400" />,
                    title: '"Acesso já utilizado"',
                    solution: 'Você já criou uma conta com esse email. Vá para "Entrar" ao invés de "Criar Conta" e use o email e senha que cadastrou.',
                  },
                  {
                    icon: <Smartphone className="w-4 h-4 text-blue-400" />,
                    title: 'App não aparece para instalar',
                    solution: 'Android: use o Chrome. iPhone: use o Safari. Limpe o cache do navegador e tente novamente.',
                  },
                  {
                    icon: <RefreshCw className="w-4 h-4 text-primary" />,
                    title: 'Esqueci minha senha',
                    solution: 'Na tela de login, toque em "Esqueceu a senha?". Um email de recuperação será enviado para o seu email de cadastro.',
                  },
                  {
                    icon: <Smartphone className="w-4 h-4 text-green-400" />,
                    title: 'Desinstalei o app, como reinstalar?',
                    solution: 'Basta abrir o link novamente e instalar. Use o mesmo email e senha que cadastrou no primeiro acesso.',
                  },
                ].map(({ icon, title, solution }, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex items-center gap-2">
                      {icon}
                      <p className="text-sm font-semibold text-foreground">{title}</p>
                    </div>
                    <p className="text-xs text-muted-foreground pl-6">→ {solution}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* CTA to open app */}
        <div className="space-y-3 pt-2">
          <a href={accessLink} target="_blank" rel="noopener noreferrer" className="block">
            <Button className="w-full h-14 text-base font-bold shadow-lg">
              🚀 Acessar O Peregrino Agora
            </Button>
          </a>
          <p className="text-center text-xs text-muted-foreground">
            Dúvidas? Entre em contato: centrobiblicoonline@gmail.com
          </p>
        </div>

        {/* Footer */}
        <div className="text-center pt-4 pb-8">
          <img src={logoImg} alt="O Peregrino" className="w-10 h-10 mx-auto rounded-lg opacity-60" />
          <p className="text-xs text-muted-foreground mt-2">
            O Peregrino © {new Date().getFullYear()} — Centro Bíblico Online
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;
