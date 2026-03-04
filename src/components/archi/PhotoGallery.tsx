import { type ProjectPhoto } from '@/lib/types';

interface PhotoGalleryProps {
  photos: ProjectPhoto[];
}

const PhotoGallery = ({ photos }: PhotoGalleryProps) => {
  if (photos.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 border-2 border-dashed border-border rounded-xl">
        <p className="text-sm text-muted-foreground">Nenhuma foto disponível ainda</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {photos.map(photo => (
        <div key={photo.id} className="group relative overflow-hidden rounded-xl border border-border">
          <img
            src={photo.url}
            alt={photo.caption}
            className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <p className="text-sm font-medium text-white">{photo.caption}</p>
            <p className="text-xs text-white/70 mt-0.5">
              {new Date(photo.date).toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PhotoGallery;
