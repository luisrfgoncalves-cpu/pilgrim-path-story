import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Copy, Check, Download, Smartphone, Monitor,
  AlertTriangle, RefreshCw, HelpCircle, ChevronDown, ChevronUp
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
  const [helpOpen, setHelpOpen] = useState(false);

  const accessLink = `${APP_URL}/auth`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(accessLink);
      setCopied(true);
      toast.success('Link copiado!');
      setTimeout(() => setCopied(false), 3000);
    } catch {
      toast.error('Erro ao copiar.');
    }
  };

  const handleDownload = () => {
    const txt = `
═══════════════════════════════════════
  O PEREGRINO — Dados de Acesso
═══════════════════════════════════════

📧 Email: ${buyerEmail || '(use o email da compra)'}
🔗 Link: ${accessLink}

COMO ACESSAR:
1. Abra o link acima no celular
2. Toque em "Criar Conta"
3. Use o MESMO email da compra
4. Crie uma senha (mín. 6 caracteres)
5. Pronto!

INSTALAR NO ANDROID (Chrome):
- 3 pontinhos (⋮) > "Instalar aplicativo"

INSTALAR NO IPHONE (Safari):
- Compartilhar (□↑) > "Adicionar à Tela de Início"

⚠️ iPhone: use SOMENTE o Safari!
⚠️ Use o MESMO email da compra!

Suporte: centrobiblicoonline@gmail.com
═══════════════════════════════════════
`;
    const blob = new Blob([txt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'O-Peregrino-Acesso.txt';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Arquivo baixado!');
  };

  return (
    <div
      className="min-h-screen relative flex flex-col items-center"
      style={{
        background: 'linear-gradient(135deg, hsl(30 20% 8%) 0%, hsl(30 25% 14%) 50%, hsl(35 30% 12%) 100%)',
      }}
    >
      {/* BG image overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url(${cidadeCelestial})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black/60" />

      <div className="relative z-10 w-full max-w-lg mx-auto px-4 py-8 space-y-8">

        {/* ── HEADER ── */}
        <div className="text-center space-y-6">
          <img src={logoImg} alt="O Peregrino" className="w-44 h-auto sm:w-52 mx-auto drop-shadow-2xl" />
          <h1 className="text-3xl sm:text-4xl font-bold leading-tight" style={{ color: 'hsl(40 70% 60%)' }}>
            Seu Acesso está Liberado!
          </h1>
          <img src={pilgrimStanding} alt="Peregrino" className="w-44 h-44 sm:w-48 sm:h-48 mx-auto object-cover drop-shadow-2xl rounded-2xl" />
          <p className="text-base sm:text-lg italic" style={{ color: 'hsl(38 40% 75%)' }}>
            Sua jornada rumo à Cidade Celestial começa agora.
          </p>
        </div>

        {/* ── COMO ACESSAR ── */}
        <div
          className="rounded-2xl p-6 space-y-5"
          style={{ background: 'hsl(30 15% 16% / 0.85)', backdropFilter: 'blur(10px)', border: '1px solid hsl(40 30% 25%)' }}
        >
          <h2 className="text-center text-lg font-bold" style={{ color: 'hsl(40 70% 60%)' }}>
            ✨ Como acessar seu App
          </h2>
          <p className="text-center text-sm" style={{ color: 'hsl(38 30% 65%)' }}>
            O seu acesso foi vinculado ao e-mail usado na compra da Kiwify. Não é necessário nenhum código de ativação.
          </p>

          {[
            { n: '1', title: 'Abra o App', desc: 'Clique no botão abaixo ou use o link enviado ao seu e-mail.' },
            { n: '2', title: 'Entre com seu E-mail', desc: `Use o e-mail da compra${buyerEmail ? ` (${buyerEmail})` : ''}. Se for seu primeiro acesso, clique em 'Criar Conta'.` },
            { n: '3', title: 'Defina sua Senha', desc: 'Escolha uma senha segura (mín. 6 caracteres) e guarde-a com carinho.' },
          ].map(({ n, title, desc }) => (
            <div key={n} className="flex items-start gap-4">
              <span
                className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
                style={{ background: 'hsl(40 60% 50% / 0.2)', color: 'hsl(40 70% 60%)' }}
              >
                {n}
              </span>
              <div>
                <p className="font-semibold text-sm" style={{ color: 'hsl(38 40% 85%)' }}>{title}</p>
                <p className="text-xs mt-0.5" style={{ color: 'hsl(30 15% 55%)' }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── CTA BUTTON ── */}
        <a href={accessLink} target="_blank" rel="noopener noreferrer" className="block">
          <div
            className="rounded-2xl p-5 text-center cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: 'linear-gradient(135deg, hsl(40 60% 45%) 0%, hsl(35 70% 35%) 100%)',
              boxShadow: '0 8px 30px hsl(40 60% 30% / 0.4)',
            }}
          >
            <p className="text-lg font-bold" style={{ color: 'hsl(30 20% 10%)' }}>
              🚀 ACESSAR O PEREGRINO AGORA
            </p>
            <p className="text-xs mt-1" style={{ color: 'hsl(30 20% 20%)' }}>
              Ir para tela inicial →
            </p>
          </div>
        </a>

        {/* ── COPIAR / BAIXAR ── */}
        <div className="flex gap-3">
          <button
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium transition-colors"
            style={{ background: 'hsl(30 15% 18%)', color: 'hsl(40 70% 60%)', border: '1px solid hsl(40 30% 25%)' }}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copiado!' : 'Copiar Link'}
          </button>
          <button
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium transition-colors"
            style={{ background: 'hsl(30 15% 18%)', color: 'hsl(38 40% 75%)', border: '1px solid hsl(40 30% 25%)' }}
          >
            <Download className="w-4 h-4" /> Baixar Instruções
          </button>
        </div>

        {/* ── INSTALAR NO CELULAR ── */}
        <div
          className="rounded-2xl p-6 space-y-5"
          style={{ background: 'hsl(30 15% 16% / 0.85)', backdropFilter: 'blur(10px)', border: '1px solid hsl(40 30% 25%)' }}
        >
          <h2 className="text-center text-lg font-bold" style={{ color: 'hsl(40 70% 60%)' }}>
            📲 Dica: Salve na Tela de Início
          </h2>
          <p className="text-center text-sm italic" style={{ color: 'hsl(38 30% 65%)' }}>
            Para uma experiência de aplicativo real, siga estes passos:
          </p>

          {/* iOS */}
          <div className="rounded-xl p-4 space-y-2" style={{ background: 'hsl(30 12% 20% / 0.6)' }}>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: 'hsl(0 0% 40% / 0.3)', color: 'hsl(0 0% 80%)' }}>iOS</span>
              <p className="text-sm font-semibold" style={{ color: 'hsl(38 40% 85%)' }}>iPhone / Safari</p>
            </div>
            <p className="text-xs" style={{ color: 'hsl(30 15% 55%)' }}>
              Toque no ícone de <strong style={{ color: 'hsl(38 40% 75%)' }}>Compartilhar</strong> (quadrado com seta) e escolha <strong style={{ color: 'hsl(38 40% 75%)' }}>"Adicionar à Tela de Início"</strong>.
            </p>
            <p className="text-xs" style={{ color: 'hsl(0 60% 60%)' }}>
              ⚠️ Use SOMENTE o Safari no iPhone!
            </p>
          </div>

          {/* Android */}
          <div className="rounded-xl p-4 space-y-2" style={{ background: 'hsl(30 12% 20% / 0.6)' }}>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: 'hsl(120 30% 30% / 0.3)', color: 'hsl(120 40% 70%)' }}>AND</span>
              <p className="text-sm font-semibold" style={{ color: 'hsl(38 40% 85%)' }}>Android / Chrome</p>
            </div>
            <p className="text-xs" style={{ color: 'hsl(30 15% 55%)' }}>
              Toque nos <strong style={{ color: 'hsl(38 40% 75%)' }}>três pontinhos</strong> no canto superior e selecione <strong style={{ color: 'hsl(38 40% 75%)' }}>"Adicionar à tela inicial"</strong>.
            </p>
          </div>
        </div>

        {/* ── PRECISA DE AJUDA ── */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: 'hsl(30 15% 16% / 0.85)', border: '1px solid hsl(40 30% 25%)' }}
        >
          <button
            onClick={() => setHelpOpen(!helpOpen)}
            className="w-full p-5 flex items-center justify-between"
          >
            <h2 className="text-base font-bold flex items-center gap-2" style={{ color: 'hsl(40 70% 60%)' }}>
              <HelpCircle className="w-5 h-5" /> 💡 Precisa de ajuda?
            </h2>
            {helpOpen ? <ChevronUp className="w-4 h-4" style={{ color: 'hsl(30 15% 50%)' }} /> : <ChevronDown className="w-4 h-4" style={{ color: 'hsl(30 15% 50%)' }} />}
          </button>
          {helpOpen && (
            <div className="px-5 pb-5 space-y-4">
              <p className="text-xs" style={{ color: 'hsl(38 30% 65%)' }}>
                Seu e-mail pode levar alguns minutos para ser processado pelo sistema. Se houver erro de autorização, aguarde 2 minutos e tente novamente.
              </p>
              {[
                { icon: <AlertTriangle className="w-4 h-4" style={{ color: 'hsl(0 60% 55%)' }} />, title: '"Email não autorizado"', sol: 'Verifique se digitou o MESMO email da compra. Aguarde 2 min se acabou de comprar.' },
                { icon: <AlertTriangle className="w-4 h-4" style={{ color: 'hsl(45 80% 50%)' }} />, title: '"Acesso já utilizado"', sol: 'Você já tem conta. Use "Entrar" ao invés de "Criar Conta".' },
                { icon: <Smartphone className="w-4 h-4" style={{ color: 'hsl(210 60% 60%)' }} />, title: 'App não instala', sol: 'Android: Chrome. iPhone: Safari. Limpe o cache e tente novamente.' },
                { icon: <RefreshCw className="w-4 h-4" style={{ color: 'hsl(40 60% 55%)' }} />, title: 'Esqueci a senha', sol: 'Na tela de login, toque em "Esqueceu a senha?" para recuperar via email.' },
              ].map(({ icon, title, sol }, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="mt-0.5">{icon}</div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'hsl(38 40% 85%)' }}>{title}</p>
                    <p className="text-xs" style={{ color: 'hsl(30 15% 55%)' }}>→ {sol}</p>
                  </div>
                </div>
              ))}
              <a href="mailto:centrobiblicoonline@gmail.com" className="block text-center">
                <Button variant="outline" size="sm" className="text-xs border-primary/30">
                  📧 Suporte via E-mail
                </Button>
              </a>
            </div>
          )}
        </div>

        {/* ── VERSÍCULO ── */}
        <div className="text-center pt-4 pb-8 space-y-4">
          <p className="text-sm italic" style={{ color: 'hsl(38 30% 55%)' }}>
            "Esforçai-vos por entrar pela porta estreita..."
          </p>
          <p className="text-xs" style={{ color: 'hsl(30 15% 45%)' }}>— Lucas 13:24</p>
          <img src={logoImg} alt="O Peregrino" className="w-10 h-10 mx-auto rounded-lg opacity-50" />
          <p className="text-xs" style={{ color: 'hsl(30 15% 40%)' }}>
            O Peregrino © {new Date().getFullYear()} — Centro Bíblico Online
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;
