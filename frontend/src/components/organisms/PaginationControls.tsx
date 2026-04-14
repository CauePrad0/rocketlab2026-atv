import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/atoms/Button';
import { Card } from '@/components/atoms/Card';

interface PaginationControlsProps {
  currentPage: number;
  hasNextPage: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

export function PaginationControls({
  currentPage,
  hasNextPage,
  onPrevious,
  onNext,
}: PaginationControlsProps) {
  return (
    <Card className="mt-8 flex items-center justify-between gap-4 px-4 py-3 md:px-6">
      <Button variant="ghost" onClick={onPrevious} disabled={currentPage === 1}>
        <ChevronLeft size={18} />
        Anterior
      </Button>

      <span className="rounded-full bg-[var(--color-surface-muted)] px-4 py-2 text-sm font-semibold text-[var(--color-ink)]">
        Pagina {currentPage}
      </span>

      <Button variant="ghost" onClick={onNext} disabled={!hasNextPage}>
        Proxima
        <ChevronRight size={18} />
      </Button>
    </Card>
  );
}
