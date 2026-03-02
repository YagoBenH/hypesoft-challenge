import { EstoqueBaixo } from "@/components/dashboard/EstoqueBaixo";
import { ProdutosCategoria } from "@/components/dashboard/ProdutosCategoria";
import { StatCard } from "@/components/dashboard/StatCard";
import type { Product } from "@/types/products";

const products: Product[] = [
  { id: "1", name: "Notebook Pro", category: "Eletrônicos", price: 4500, stock: 6 },
  { id: "2", name: "Mouse Gamer", category: "Periféricos", price: 180, stock: 22 },
  { id: "3", name: "Teclado Mecânico", category: "Periféricos", price: 320, stock: 8 },
  { id: "4", name: "Monitor 27", category: "Eletrônicos", price: 1600, stock: 12 },
  { id: "5", name: "Cadeira Office", category: "Móveis", price: 980, stock: 4 },
  { id: "6", name: "Mesa Stand", category: "Móveis", price: 1300, stock: 9 },
];


function formatCurrencyBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export default function DashboardPage() {
  const totalProducts = products.length;

  const Pricestock = products.reduce((total, product) => {
    return total + product.price;
  }, 0);

  const StockProducts = products
    .filter((product) => product.stock <= 20)
    .sort((productA, productB) => productA.stock - productB.stock);

  const productsByCategoryMap = products.reduce<Record<string, number>>((acc, product) => {
    acc[product.category] = (acc[product.category] ?? 0) + 1;
    return acc;
  }, {});

  const productsByCategory = Object.entries(productsByCategoryMap).map(([category, total]) => ({
    category,
    total,
  }));

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <h3 className="text-1xl font-normal">Visão geral do seu sistema de gestão de produtos</h3>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    <StatCard title="Total de produtos" value={String(totalProducts)} subtitle={`Em ${productsByCategory.length} categorias`}/>
        <StatCard title="Valor do estoque" value={formatCurrencyBRL(Pricestock)} subtitle="Valor total estimado" />
        <StatCard
          title="Estoque baixo"
          value={String(StockProducts.length)}
          subtitle={`Produtos com menos de 20 unidades em estoque: `}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ProdutosCategoria data={productsByCategory} />
        <EstoqueBaixo products={StockProducts} />
      </div>

      
    </section>
  );
}
