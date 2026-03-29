import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStoryProgress } from '@/hooks/useStoryProgress';
import { ScrollText } from 'lucide-react';

const ResultPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { goToChapter } = useStoryProgress();
  const [show, setShow] = useState(false);

  const { consequence, nextChapterId } = (location.state as { consequence: string; nextChapterId: string }) || {};

  useEffect(() => {
    if (!consequence || !nextChapterId) {
      navigate('/');
      return;
    }
    const t1 = setTimeout(() => setShow(true), 100);
    const t2 = setTimeout(() => {
      goToChapter(nextChapterId);
      navigate('/cena', { replace: true });
    }, 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [consequence, nextChapterId, goToChapter, navigate]);

  if (!consequence) return null;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-8">
      <div className={`text-center max-w-sm transition-all duration-700 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <ScrollText className="w-10 h-10 text-gold mx-auto mb-6" />
        <p className="narrative-text text-foreground italic text-lg leading-relaxed">{consequence}</p>
        <div className="mt-8 flex items-center gap-3 justify-center">
          <div className="h-px w-8 bg-primary/20" />
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <div className="h-px w-8 bg-primary/20" />
        </div>
        <p className="text-xs text-muted-foreground mt-4">Avançando...</p>
      </div>
    </div>
  );
};

export default ResultPage;
