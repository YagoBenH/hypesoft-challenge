'use client';

import { useEffect, useState } from "react";
import { EstoqueBaixo } from "@/components/dashboard/EstoqueBaixo";
import { ProdutosCategoria } from "@/components/dashboard/ProdutosCategoria";
import { StatCard } from "@/components/dashboard/StatCard";
import type { Product } from "@/types/products";
import { getDashboard } from "@/services/dashboard/dashbboard";
import { useAuth } from "@/hooks/useAuth";


function formatCurrencyBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export default function DashboardPage() {
  const auth = useAuth();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (!auth.initialized) return;
    if (!auth.token) return;
    const token = auth.token;

    async function fetchDashboardData() {
      try {
        const data = await getDashboard(token);
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Erro", error);
        setProducts([]);
      }
    }
     
    fetchDashboardData();
  }, [auth.initialized, auth.token]);

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
