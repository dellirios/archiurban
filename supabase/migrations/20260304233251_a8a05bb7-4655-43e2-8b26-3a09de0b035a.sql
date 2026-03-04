
-- Seed community templates (tenant_id = 'archiurban-community' so they're visible to all via community=true policy)
INSERT INTO public.templates (tenant_id, title, description, category, icon, usage_count, community) VALUES
  ('archiurban-community', 'Cronograma - Reforma Residencial até 80m²', 'Cronograma completo com 12 etapas para reforma residencial. Inclui demolição, alvenaria, elétrica, hidráulica, acabamentos e limpeza final.', 'schedule', 'CalendarDays', 127, true),
  ('archiurban-community', 'Cronograma - Construção Casa Térrea', 'Template de 18 etapas para construção de casa térrea, da fundação à entrega das chaves.', 'schedule', 'CalendarDays', 89, true),
  ('archiurban-community', 'Cronograma - Projeto Comercial (Loja)', 'Template otimizado para projetos comerciais com foco em prazo reduzido e mínima interferência na operação.', 'schedule', 'CalendarDays', 54, true),
  ('archiurban-community', 'Orçamento Detalhado por Etapa (BDI)', 'Planilha de orçamento com BDI calculado automaticamente por etapa de obra. Inclui mão de obra e materiais.', 'budget', 'Calculator', 203, true),
  ('archiurban-community', 'Orçamento Rápido - Reforma Apartamento', 'Modelo simplificado para estimativa rápida de reformas residenciais com valores médios de mercado.', 'budget', 'Calculator', 156, true),
  ('archiurban-community', 'Orçamento - Projeto de Interiores', 'Orçamento focado em mobiliário, marcenaria, iluminação e acabamentos para projetos de design de interiores.', 'budget', 'Calculator', 78, true),
  ('archiurban-community', 'Checklist de Vistoria Pré-Entrega', 'Checklist com 50+ itens para vistoria final antes da entrega ao cliente. Cobre estrutura, acabamentos, instalações e documentação.', 'checklist', 'ClipboardCheck', 312, true),
  ('archiurban-community', 'Checklist de Instalações Elétricas (NBR 5410)', 'Verificação completa de pontos elétricos, quadro de distribuição e aterramento conforme norma NBR 5410.', 'checklist', 'ClipboardCheck', 198, true),
  ('archiurban-community', 'Checklist de Instalações Hidráulicas', 'Checklist de verificação de pontos hidráulicos, teste de pressão, esgoto e drenagem pluvial.', 'checklist', 'ClipboardCheck', 145, true),
  ('archiurban-community', 'Checklist de Segurança do Trabalho (NR-18)', 'Itens de verificação obrigatória conforme NR-18 para canteiros de obra. EPI, sinalização e proteções coletivas.', 'checklist', 'ClipboardCheck', 167, true),
  ('archiurban-community', 'Contrato de Prestação de Serviço de Arquitetura', 'Modelo jurídico revisado para contratos de projeto arquitetônico. Inclui escopo, cronograma, honorários e responsabilidades.', 'contract', 'FileText', 234, true),
  ('archiurban-community', 'Contrato de Acompanhamento de Obra', 'Modelo de contrato para serviço de acompanhamento técnico e fiscalização de obra.', 'contract', 'FileText', 98, true),
  ('archiurban-community', 'Contrato de Design de Interiores', 'Contrato específico para projetos de interiores com cláusulas de aprovação de materiais e fornecedores.', 'contract', 'FileText', 67, true),
  ('archiurban-community', 'Termo de Recebimento de Obra', 'Documento de aceite formal do cliente na entrega da obra, com lista de pendências e prazo de garantia.', 'contract', 'FileText', 189, true);
