import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TemplateCard from '@/components/archi/TemplateCard';
import NewTemplateModal from '@/components/archi/NewTemplateModal';
import { useTemplates } from '@/hooks/usePurchasesAndTemplates';
import { categoryLabels, type TemplateCategory } from '@/data/templatesMockData';
import { LayoutTemplate, Building2, Globe, Loader2 } from 'lucide-react';

const categories: (TemplateCategory | 'all')[] = ['all', 'schedule', 'budget', 'checklist', 'contract'];

const TemplatesPage = () => {
  const { templates, loading, addTemplate, updateTemplate, duplicateTemplate } = useTemplates();
  const [category, setCategory] = useState<TemplateCategory | 'all'>('all');

  const filterByCategory = (items: typeof templates) =>
    category === 'all' ? items : items.filter(t => t.category === category);

  const officeTemplates = filterByCategory(templates.filter(t => !t.community));
  const communityTemplates = filterByCategory(templates.filter(t => t.community));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
            <LayoutTemplate className="w-6 h-6 text-primary" />
            Meus Templates
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Reutilize cronogramas, orçamentos e checklists</p>
        </div>
        <NewTemplateModal onAdd={addTemplate} />
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-[11px] font-medium border transition-colors ${
              category === cat
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-secondary text-muted-foreground border-border hover:text-foreground'
            }`}
          >
            {cat === 'all' ? 'Todos' : categoryLabels[cat]}
          </button>
        ))}
      </div>

      <Tabs defaultValue="office" className="space-y-4">
        <TabsList className="bg-secondary/50">
          <TabsTrigger value="office" className="text-xs gap-1.5">
            <Building2 className="w-3.5 h-3.5" /> Templates do Escritório ({officeTemplates.length})
          </TabsTrigger>
          <TabsTrigger value="community" className="text-xs gap-1.5">
            <Globe className="w-3.5 h-3.5" /> Comunidade ArchiUrban ({communityTemplates.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="office">
          {officeTemplates.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {officeTemplates.map(t => (
                <TemplateCard
                  key={t.id}
                  template={{
                    id: t.id, title: t.title, description: t.description || '',
                    category: t.category as TemplateCategory, icon: t.icon,
                    usageCount: t.usage_count, community: t.community,
                    createdAt: t.created_at,
                  }}
                  onUpdate={(data) => updateTemplate(t.id, data)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <LayoutTemplate className="w-10 h-10 mb-2" />
              <p className="text-sm">Nenhum template nesta categoria</p>
              <p className="text-xs mt-1">Use a aba "Comunidade" para duplicar templates prontos</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="community">
          {communityTemplates.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {communityTemplates.map(t => (
                <TemplateCard
                  key={t.id}
                  template={{
                    id: t.id, title: t.title, description: t.description || '',
                    category: t.category as TemplateCategory, icon: t.icon,
                    usageCount: t.usage_count, community: t.community,
                    createdAt: t.created_at,
                  }}
                  onDuplicate={() => duplicateTemplate(t)}
                  onUpdate={(data) => updateTemplate(t.id, data)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <Globe className="w-10 h-10 mb-2" />
              <p className="text-sm">Nenhum template da comunidade nesta categoria</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TemplatesPage;
