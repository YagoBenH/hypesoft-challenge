import { Card } from "@/components/ui/Card";

type Category = {
  category: string;
  total: number;
};

type ProductsCategory = {
  data: Category[];
};

export function ProdutosCategoria({ data }: ProductsCategory) {
  const maxValue = Math.max(...data.map((item) => item.total), 1);

  return (
    <Card>
      <h3 className="text-lg font-semibold">Produtos por Categoria</h3>
      <p className="mt-1 text-sm opacity-70">Distribuição de produtos entre as categorias</p>

      <div className="mt-4 grid gap-3">
        {data.map((item) => {
          const width = (item.total / maxValue) * 100;

          return (
            <div key={item.category}>
              <div className="mb-1 flex items-center justify-between text-xs opacity-80">
                <span>{item.category}</span>
                <span>{item.total}</span>
              </div>
              <div className="h-2 rounded-full bg-slate-200 dark:bg-zinc-800">
                <div className="h-2 rounded-full bg-violet-600" style={{ width: `${width}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
