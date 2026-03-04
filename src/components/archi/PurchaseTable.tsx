import { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/types';
import {
  type PurchaseStatus,
  purchaseStatusLabels, purchaseStatusColors,
} from '@/data/purchasesMockData';
import type { PurchaseRow } from '@/hooks/usePurchasesAndTemplates';

interface PurchaseTableProps {
  items: PurchaseRow[];
  onUpdateStatus?: (id: string, data: Partial<PurchaseRow>) => Promise<any>;
}

const PurchaseTable = ({ items, onUpdateStatus }: PurchaseTableProps) => {
  const [filterProject, setFilterProject] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSupplier, setFilterSupplier] = useState('all');

  const uniqueProjects = useMemo(() => Array.from(new Set(items.map(i => i.project_name).filter(Boolean))).sort(), [items]);
  const uniqueSuppliers = useMemo(() => Array.from(new Set(items.map(i => i.supplier).filter(Boolean))).sort(), [items]);

  const filtered = useMemo(() => {
    return items.filter(i => {
      if (filterProject !== 'all' && i.project_name !== filterProject) return false;
      if (filterStatus !== 'all' && i.status !== filterStatus) return false;
      if (filterSupplier !== 'all' && i.supplier !== filterSupplier) return false;
      return true;
    });
  }, [items, filterProject, filterStatus, filterSupplier]);

  const totalValue = filtered.reduce((s, i) => s + i.quantity * i.unit_price, 0);

  const statuses = Object.keys(purchaseStatusLabels) as PurchaseStatus[];

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Select value={filterProject} onValueChange={setFilterProject}>
          <SelectTrigger className="w-48 h-8 text-xs">
            <SelectValue placeholder="Obra/Projeto" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as Obras</SelectItem>
            {uniqueProjects.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
          </SelectContent>
        </Select>

        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-40 h-8 text-xs">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Status</SelectItem>
            {statuses.map(s => (
              <SelectItem key={s} value={s}>{purchaseStatusLabels[s]}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterSupplier} onValueChange={setFilterSupplier}>
          <SelectTrigger className="w-44 h-8 text-xs">
            <SelectValue placeholder="Fornecedor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Fornecedores</SelectItem>
            {uniqueSuppliers.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>

        <span className="ml-auto text-xs text-muted-foreground">
          {filtered.length} itens · Total: {formatCurrency(totalValue)}
        </span>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/30">
              <TableHead className="text-[11px] font-semibold w-24">Requisição</TableHead>
              <TableHead className="text-[11px] font-semibold">Material/Item</TableHead>
              <TableHead className="text-[11px] font-semibold">Obra</TableHead>
              <TableHead className="text-[11px] font-semibold text-right w-20">Qtd</TableHead>
              <TableHead className="text-[11px] font-semibold">Fornecedor</TableHead>
              <TableHead className="text-[11px] font-semibold text-right w-28">Vlr. Unit.</TableHead>
              <TableHead className="text-[11px] font-semibold text-right w-28">Vlr. Total</TableHead>
              <TableHead className="text-[11px] font-semibold w-32">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(item => (
              <TableRow key={item.id} className="hover:bg-accent/30 transition-colors">
                <TableCell className="text-xs font-mono text-muted-foreground">{item.req_id}</TableCell>
                <TableCell className="text-xs font-medium text-foreground">{item.material}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{item.project_name}</TableCell>
                <TableCell className="text-xs text-right">{item.quantity} {item.unit}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{item.supplier}</TableCell>
                <TableCell className="text-xs text-right font-medium">{formatCurrency(item.unit_price)}</TableCell>
                <TableCell className="text-xs text-right font-semibold">{formatCurrency(item.quantity * item.unit_price)}</TableCell>
                <TableCell>
                  {onUpdateStatus ? (
                    <Select
                      value={item.status}
                      onValueChange={v => onUpdateStatus(item.id, { status: v })}
                    >
                      <SelectTrigger className={cn('h-6 text-[10px] border-0 px-2 w-28', purchaseStatusColors[item.status as PurchaseStatus])}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statuses.map(s => (
                          <SelectItem key={s} value={s} className="text-xs">{purchaseStatusLabels[s]}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge variant="secondary" className={cn('text-[10px] font-medium', purchaseStatusColors[item.status as PurchaseStatus])}>
                      {purchaseStatusLabels[item.status as PurchaseStatus]}
                    </Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-sm text-muted-foreground py-12">
                  Nenhuma requisição encontrada
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PurchaseTable;
