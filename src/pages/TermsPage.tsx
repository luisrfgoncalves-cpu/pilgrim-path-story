import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, FileText } from 'lucide-react';

const TermsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-card/90 backdrop-blur-sm border-b border-border px-4 py-3">
        <div className="flex items-center gap-3 max-w-2xl mx-auto">
          <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-secondary transition-colors">
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <h1 className="font-display text-lg text-foreground">Termos e Privacidade</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-5 py-8 space-y-8">
        {/* Termos de Uso */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            <h2 className="font-display text-xl text-foreground">Termos de Uso</h2>
          </div>
          <div className="prose prose-sm text-foreground/85 space-y-3">
            <p><strong>Última atualização:</strong> {new Date().toLocaleDateString('pt-BR')}</p>
            <p>Ao utilizar o aplicativo "O Peregrino — Jornada Interativa", você concorda com estes termos.</p>
            
            <h3 className="font-display text-base text-foreground mt-6">1. Sobre o Aplicativo</h3>
            <p>O Peregrino é um jogo narrativo interativo inspirado na obra clássica de John Bunyan. O aplicativo é oferecido "como está", sem garantias de disponibilidade contínua.</p>
            
            <h3 className="font-display text-base text-foreground mt-6">2. Conta e Acesso</h3>
            <p>O uso básico do aplicativo não requer criação de conta. Para funcionalidades online (salvamento na nuvem, comunidade, multiplayer online), é necessário criar uma conta com e-mail válido.</p>
            
            <h3 className="font-display text-base text-foreground mt-6">3. Conteúdo</h3>
            <p>Todo o conteúdo narrativo, imagens e áudio são de propriedade dos criadores do aplicativo. O uso é pessoal e intransferível. É proibida a reprodução, distribuição ou modificação sem autorização.</p>
            
            <h3 className="font-display text-base text-foreground mt-6">4. Progresso e Dados</h3>
            <p>O progresso do jogo é salvo localmente no dispositivo e, quando disponível, na nuvem. Não nos responsabilizamos por perda de dados causada por exclusão do cache do navegador, troca de dispositivo sem backup, ou falhas de conexão.</p>
            
            <h3 className="font-display text-base text-foreground mt-6">5. Conduta do Usuário</h3>
            <p>Ao usar o multiplayer e comunidade, o usuário se compromete a manter conduta respeitosa. Contas que violem esta regra podem ser suspensas.</p>
            
            <h3 className="font-display text-base text-foreground mt-6">6. Modificações</h3>
            <p>Reservamo-nos o direito de modificar estes termos a qualquer momento. Alterações significativas serão comunicadas dentro do aplicativo.</p>
          </div>
        </section>

        <div className="h-px bg-border" />

        {/* Política de Privacidade */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <h2 className="font-display text-xl text-foreground">Política de Privacidade</h2>
          </div>
          <div className="prose prose-sm text-foreground/85 space-y-3">
            <p><strong>Última atualização:</strong> {new Date().toLocaleDateString('pt-BR')}</p>
            
            <h3 className="font-display text-base text-foreground mt-6">1. Dados Coletados</h3>
            <p>Coletamos apenas os dados necessários para o funcionamento do aplicativo:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>E-mail (quando você cria uma conta)</li>
              <li>Nome de exibição (escolhido por você)</li>
              <li>Progresso do jogo (capítulos visitados, decisões, atributos)</li>
              <li>Dados de uso anônimos (páginas visitadas, tempo de sessão)</li>
            </ul>
            
            <h3 className="font-display text-base text-foreground mt-6">2. Como Usamos seus Dados</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Salvar e restaurar seu progresso entre dispositivos</li>
              <li>Personalizar sua experiência no jogo</li>
              <li>Melhorar o aplicativo com base em dados anônimos de uso</li>
              <li>Funcionalidades de comunidade (perfil público opcional)</li>
            </ul>
            
            <h3 className="font-display text-base text-foreground mt-6">3. Armazenamento</h3>
            <p>Seus dados são armazenados de forma segura:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Localmente:</strong> no localStorage e IndexedDB do seu navegador</li>
              <li><strong>Na nuvem:</strong> via Supabase (infraestrutura segura com criptografia)</li>
            </ul>
            
            <h3 className="font-display text-base text-foreground mt-6">4. Compartilhamento</h3>
            <p>Não vendemos, alugamos ou compartilhamos seus dados pessoais com terceiros, exceto quando exigido por lei.</p>
            
            <h3 className="font-display text-base text-foreground mt-6">5. Seus Direitos</h3>
            <p>Você pode a qualquer momento:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Acessar seus dados dentro do aplicativo</li>
              <li>Exportar seu progresso como arquivo JSON</li>
              <li>Solicitar exclusão da sua conta e dados</li>
            </ul>
            
            <h3 className="font-display text-base text-foreground mt-6">6. Cookies</h3>
            <p>O aplicativo utiliza armazenamento local (localStorage, IndexedDB) para funcionamento. Não utilizamos cookies de rastreamento de terceiros.</p>
            
            <h3 className="font-display text-base text-foreground mt-6">7. Contato</h3>
            <p>Para dúvidas sobre privacidade, entre em contato pelo e-mail disponível na página do aplicativo na plataforma de distribuição.</p>
          </div>
        </section>

        <div className="pb-8" />
      </main>
    </div>
  );
};

export default TermsPage;
