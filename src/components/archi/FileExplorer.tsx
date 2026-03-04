import { useState } from 'react';
import { defaultFolders, mockFiles, type ProjectFile } from '@/data/filesMockData';
import { cn } from '@/lib/utils';
import {
  FolderOpen, Folder, ArrowLeft, LayoutGrid, List, Upload, FileText, Image, File,
  MoreVertical, Download, Eye, Trash2, Table2, HardHat, Ruler,
} from 'lucide-react';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const typeIcons: Record<string, React.ElementType> = {
  pdf: FileText,
  image: Image,
  dwg: Ruler,
  doc: FileText,
  spreadsheet: Table2,
  other: File,
};

const typeColors: Record<string, string> = {
  pdf: 'text-red-500 bg-red-50',
  image: 'text-violet-500 bg-violet-50',
  dwg: 'text-sky-500 bg-sky-50',
  doc: 'text-blue-500 bg-blue-50',
  spreadsheet: 'text-emerald-500 bg-emerald-50',
  other: 'text-muted-foreground bg-secondary',
};

const folderIcons: Record<string, React.ElementType> = {
  ruler: Ruler,
  image: Image,
  'file-text': FileText,
  'hard-hat': HardHat,
};

const FileExplorer = () => {
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [isDragOver, setIsDragOver] = useState(false);

  const files = currentFolder
    ? mockFiles.filter(f => f.folder === currentFolder)
    : [];

  const currentFolderData = defaultFolders.find(f => f.key === currentFolder);

  const handleDragEvents = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const renderFileIcon = (file: ProjectFile) => {
    const Icon = typeIcons[file.type] || File;
    return (
      <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0', typeColors[file.type] || typeColors.other)}>
        <Icon className="w-5 h-5" />
      </div>
    );
  };

  const renderActions = (file: ProjectFile) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-1.5 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
          <MoreVertical className="w-4 h-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem><Eye className="w-3.5 h-3.5 mr-2" /> Visualizar</DropdownMenuItem>
        <DropdownMenuItem><Download className="w-3.5 h-3.5 mr-2" /> Baixar</DropdownMenuItem>
        <DropdownMenuItem className="text-destructive focus:text-destructive"><Trash2 className="w-3.5 h-3.5 mr-2" /> Excluir</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  // ── Folder view ──
  if (!currentFolder) {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Pastas</h3>
          <button
            className="flex items-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors"
          >
            <Upload className="w-3.5 h-3.5" /> Upload
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {defaultFolders.map(folder => {
            const FIcon = folderIcons[folder.icon] || FolderOpen;
            const count = mockFiles.filter(f => f.folder === folder.key).length;
            return (
              <button
                key={folder.key}
                onClick={() => setCurrentFolder(folder.key)}
                className="bg-card border border-border rounded-xl p-4 hover:shadow-md hover:border-primary/30 transition-all text-left group"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <FIcon className="w-5 h-5" />
                </div>
                <p className="text-sm font-medium text-foreground truncate">{folder.label}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{count} arquivos</p>
              </button>
            );
          })}
        </div>

        {/* Dropzone */}
        <div
          className={cn(
            'border-2 border-dashed rounded-xl p-8 text-center transition-colors',
            isDragOver ? 'border-primary bg-primary/5' : 'border-border'
          )}
          onDragOver={e => { handleDragEvents(e); setIsDragOver(true); }}
          onDragLeave={e => { handleDragEvents(e); setIsDragOver(false); }}
          onDrop={e => { handleDragEvents(e); setIsDragOver(false); }}
        >
          <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Arraste arquivos aqui ou clique para enviar</p>
          <p className="text-[11px] text-muted-foreground mt-1">PDF, DWG, imagens até 50 MB</p>
        </div>
      </div>
    );
  }

  // ── File list / grid inside folder ──
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={() => setCurrentFolder(null)} className="p-1.5 rounded-md hover:bg-secondary transition-colors">
            <ArrowLeft className="w-4 h-4 text-muted-foreground" />
          </button>
          <Folder className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">{currentFolderData?.label}</h3>
          <span className="text-xs text-muted-foreground">({files.length})</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-secondary rounded-lg p-0.5">
            <button onClick={() => setViewMode('list')} className={cn('flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-all', viewMode === 'list' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground')}>
              <List className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => setViewMode('grid')} className={cn('flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-all', viewMode === 'grid' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground')}>
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors">
            <Upload className="w-3.5 h-3.5" /> Upload
          </button>
        </div>
      </div>

      {viewMode === 'list' ? (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="text-left text-[11px] font-medium text-muted-foreground px-4 py-2.5">Nome</th>
                <th className="text-left text-[11px] font-medium text-muted-foreground px-4 py-2.5 hidden sm:table-cell">Tamanho</th>
                <th className="text-left text-[11px] font-medium text-muted-foreground px-4 py-2.5 hidden md:table-cell">Enviado por</th>
                <th className="text-left text-[11px] font-medium text-muted-foreground px-4 py-2.5 hidden lg:table-cell">Data</th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody>
              {files.map(file => (
                <tr key={file.id} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {renderFileIcon(file)}
                      <span className="text-sm font-medium text-foreground truncate">{file.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground hidden sm:table-cell">{file.size}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground hidden md:table-cell">{file.uploadedBy}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground hidden lg:table-cell">{new Date(file.uploadedAt).toLocaleDateString('pt-BR')}</td>
                  <td className="px-2 py-3">{renderActions(file)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {files.map(file => (
            <div key={file.id} className="bg-card border border-border rounded-xl p-3 hover:shadow-md transition-shadow group relative">
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {renderActions(file)}
              </div>
              <div className={cn('w-full h-24 rounded-lg flex items-center justify-center mb-3', typeColors[file.type] || typeColors.other)}>
                {(() => { const Icon = typeIcons[file.type] || File; return <Icon className="w-10 h-10" />; })()}
              </div>
              <p className="text-xs font-medium text-foreground truncate">{file.name}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{file.size} · {file.uploadedBy}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileExplorer;
