import { Save, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/atoms/Button';
import { Card } from '@/components/atoms/Card';
import { IconButton } from '@/components/atoms/IconButton';
import { TextInput } from '@/components/atoms/TextInput';
import type { ProdutoFormValues } from '@/types';

interface ProductFormModalProps {
  onClose: () => void;
  onSubmit: (values: ProdutoFormValues) => Promise<void>;
  initialValues?: ProdutoFormValues;
  mode?: 'create' | 'edit';
}

const emptyFormValues: ProdutoFormValues = {
  nome_produto: '',
  categoria_produto: '',
  peso_produto_gramas: '',
  comprimento_centimetros: '',
  altura_centimetros: '',
  largura_centimetros: '',
};

export function ProductFormModal({
  onClose,
  onSubmit,
  initialValues = emptyFormValues,
  mode = 'create',
}: ProductFormModalProps) {
  const [formValues, setFormValues] = useState<ProdutoFormValues>(initialValues);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormValues(initialValues);
  }, [initialValues]);

  const updateField = (field: keyof ProdutoFormValues, value: string) => {
    setFormValues((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      await onSubmit(formValues);
      setFormValues(initialValues);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 py-8 backdrop-blur-sm">
      <Card className="relative w-full max-w-2xl p-6 md:p-8">
        <IconButton className="absolute right-5 top-5" onClick={onClose}>
          <X size={22} />
        </IconButton>

        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)]">
            {mode === 'create' ? 'Cadastro' : 'Atualizacao'}
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-[var(--color-ink)]">
            {mode === 'create' ? 'Novo produto' : 'Editar produto'}
          </h2>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <TextInput
            label="Nome do produto"
            value={formValues.nome_produto}
            onChange={(event) => updateField('nome_produto', event.target.value)}
            required
          />
          <TextInput
            label="Categoria"
            value={formValues.categoria_produto}
            onChange={(event) => updateField('categoria_produto', event.target.value)}
            required
          />

          <div className="grid gap-4 md:grid-cols-2">
            <TextInput
              label="Peso (g)"
              type="number"
              inputMode="decimal"
              value={formValues.peso_produto_gramas}
              onChange={(event) => updateField('peso_produto_gramas', event.target.value)}
            />
            <TextInput
              label="Largura (cm)"
              type="number"
              inputMode="decimal"
              value={formValues.largura_centimetros}
              onChange={(event) => updateField('largura_centimetros', event.target.value)}
            />
            <TextInput
              label="Altura (cm)"
              type="number"
              inputMode="decimal"
              value={formValues.altura_centimetros}
              onChange={(event) => updateField('altura_centimetros', event.target.value)}
            />
            <TextInput
              label="Comprimento (cm)"
              type="number"
              inputMode="decimal"
              value={formValues.comprimento_centimetros}
              onChange={(event) => updateField('comprimento_centimetros', event.target.value)}
            />
          </div>

          <div className="flex flex-col gap-3 pt-4 md:flex-row">
            <Button variant="secondary" onClick={onClose} fullWidth>
              Cancelar
            </Button>
            <Button type="submit" fullWidth disabled={loading}>
              <Save size={18} />
              {loading ? 'Salvando...' : mode === 'create' ? 'Salvar produto' : 'Atualizar produto'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
