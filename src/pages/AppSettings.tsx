const AppSettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Configurações</h1>
        <p className="text-sm text-muted-foreground mt-1">Gerencie as configurações do seu escritório</p>
      </div>
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium text-foreground">Nome do Escritório</label>
            <input
              type="text"
              defaultValue="Studio Arcos"
              className="mt-1.5 w-full max-w-md px-4 py-2.5 text-sm bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">E-mail de Contato</label>
            <input
              type="email"
              defaultValue="contato@studioarcos.com"
              className="mt-1.5 w-full max-w-md px-4 py-2.5 text-sm bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Telefone</label>
            <input
              type="tel"
              defaultValue="(11) 3456-7890"
              className="mt-1.5 w-full max-w-md px-4 py-2.5 text-sm bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <button className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppSettings;
