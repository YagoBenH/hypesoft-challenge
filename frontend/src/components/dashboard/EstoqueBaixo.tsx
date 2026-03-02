import { Card } from "@/components/ui/Card";
import type { Product } from "@/types/products";

type StockList = {
  products: Product[];
};

export function EstoqueBaixo({ products }: StockList) {
  return (
    <Card>
      <h3 className="text-lg font-semibold">Estoque baixo</h3>
      <p className="mt-1 text-sm opacity-70">Produtos com menos de 10 unidades em estoque</p>

      <div className="mt-4 grid gap-2">
        {products.length === 0 ? (
          <p className="text-sm opacity-80">Nenhum produto com estoque baixo.</p>
        ) : (
          products.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between rounded-xl border border-white/20 px-3 py-2"
            >
              <div>
                <p className="text-sm font-medium">{product.name}</p>
                <p className="text-xs opacity-70">{product.category}</p>
              </div>
              <span className="text-sm font-semibold">{product.stock} unidades</span>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}