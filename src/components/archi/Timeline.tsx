import { type ProjectStage } from '@/data/mockData';
import { Check, Circle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimelineProps {
  stages: ProjectStage[];
}

const Timeline = ({ stages }: TimelineProps) => {
  return (
    <div className="relative">
      {stages.map((stage, index) => {
        const isLast = index === stages.length - 1;
        return (
          <div key={stage.id} className="flex gap-4 pb-8 last:pb-0">
            {/* Line & Icon */}
            <div className="flex flex-col items-center">
              <div className={cn(
                'w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-colors',
                stage.completed
                  ? 'bg-emerald-500 border-emerald-500 text-white'
                  : stage.current
                  ? 'bg-primary border-primary text-primary-foreground animate-pulse'
                  : 'bg-card border-border text-muted-foreground'
              )}>
                {stage.completed ? (
                  <Check className="w-4 h-4" />
                ) : stage.current ? (
                  <Clock className="w-4 h-4" />
                ) : (
                  <Circle className="w-4 h-4" />
                )}
              </div>
              {!isLast && (
                <div className={cn(
                  'w-0.5 flex-1 mt-2',
                  stage.completed ? 'bg-emerald-300' : 'bg-border'
                )} />
              )}
            </div>

            {/* Content */}
            <div className="pt-1.5 pb-2">
              <h4 className={cn(
                'text-sm font-medium',
                stage.completed ? 'text-foreground' : stage.current ? 'text-primary font-semibold' : 'text-muted-foreground'
              )}>
                {stage.name}
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                {new Date(stage.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
              </p>
              {stage.current && (
                <span className="inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                  Etapa atual
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Timeline;
