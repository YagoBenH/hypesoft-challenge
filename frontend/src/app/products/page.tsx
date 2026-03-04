"use client";

import React from "react";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ProductCard,  type ProductValues,} from "@/components/products/ProductCard";
import { TextInput } from "@/components/ui/TextInput";
import type { Product } from "@/types/products";

const creatProducts: Product[] = [
  {
    id: "1",
    name: "Notebook Pro",
    description: "Notebook para uso corporativo",
    category: "Eletrônicos",
    price: 4500,
    stock: 6,
  },
  {
    id: "2",
    name: "Mouse Gamer",
    description: "Mouse ergonômico com alta precisão",
    category: "Periféricos",
    price: 180,
    stock: 22,
  },
  {
    id: "3",
    name: "Cadeira Office",
    description: "Cadeira com apoio lombar ajustável",
    category: "Móveis",
    price: 980,
    stock: 4,
  },
];

function formatCurrencyBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}


export default function ProductsPage() {
  const [products, setProducts] = React.useState<Product[]>(creatProducts);
  const [editingProductId, setEditingProductId] = React.useState<string | null>(null);
  const [showFormCard, setShowFormCard] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState("Todas");

  const editingProduct = React.useMemo(
    () => products.find((product) => product.id === editingProductId) ?? null,
    [products, editingProductId],
  );

  const categories = React.useMemo(() => {
    const allCategories = new Set(products.map((product) => product.category));
    return ["Todas", ...Array.from(allCategories).sort((a, b) => a.localeCompare(b))];
  }, [products]);

  const filteredProducts = React.useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return products.filter((product) => {
      const matchesName =
        normalizedSearch.length === 0 || product.name.toLowerCase().includes(normalizedSearch);
      const matchesCategory = categoryFilter === "Todas" || product.category === categoryFilter;

      return matchesName && matchesCategory;
    });
  }, [products, searchTerm, categoryFilter]);

  const handleSubmitProduct = (values: ProductValues) => {
    if (editingProductId) {
      setProducts((currentProducts) =>
        currentProducts.map((product) =>
          product.id === editingProductId ? { ...product, ...values } : product,
        ),
      );
      setEditingProductId(null);
      setShowFormCard(false);
      return;
    }

    const newProduct: Product = {
      id: crypto.randomUUID(),
      name: values.name,
      description: values.description,
      category: values.category,
      price: values.price,
      stock: values.stock,
    };

    setProducts((currentProducts) => [newProduct, ...currentProducts]);
    setShowFormCard(false);
  };

  const handleOpenCreate = () => {
    setEditingProductId(null);
    setShowFormCard(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProductId(product.id);
    setShowFormCard(true);
  };

  const handleDelete = (productId: string) => {
    setProducts((currentProducts) => currentProducts.filter((product) => product.id !== productId));

    if (editingProductId === productId) {
      setEditingProductId(null);
      setShowFormCard(false);
    }
  };

  const handleCloseFormCard = () => {
    setEditingProductId(null);
    setShowFormCard(false);
  };



  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Produtos</h1>
        <p className="text-sm opacity-80">Crie, edite, exclua e encontre produtos facilmente.</p>
        <div className="pt-2">
          <Button type="button" className="h-11 w-auto px-6" onClick={handleOpenCreate}>
            Cadastrar produto
          </Button>
        </div>
      </header>

      {showFormCard ? (
        <ProductCard
          mode={editingProduct ? "edit" : "create"}
          initialValues={editingProduct ?? undefined}
          onSubmit={handleSubmitProduct}
          onCancel={handleCloseFormCard}
        />
      ) : null}

      <Card>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <TextInput
            label="Buscar por nome"
            placeholder="Digite o nome do produto"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
          <label className="flex w-full flex-col gap-1 sm:max-w-xs">
            <span className="text-sm font-medium">Filtrar por categoria</span>
            <select
              className="w-full rounded-lg border border-(--foreground)/20 px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-(--foreground)/20"
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-6 overflow-x-auto">
          {filteredProducts.length === 0 ? (
            <Alert title="Nenhum produto encontrado">
              Ajuste a busca ou o filtro para visualizar itens.
            </Alert>
          ) : (
            <table className="w-full min-w-180 border-separate border-spacing-y-2">
              <thead>
                <tr className="text-left text-sm opacity-80">
                  <th className="px-3 py-2">Nome</th>
                  <th className="px-3 py-2">Descrição</th>
                  <th className="px-3 py-2">Categoria</th>
                  <th className="px-3 py-2">Preço</th>
                  <th className="px-3 py-2">Estoque</th>
                  <th className="px-3 py-2">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="rounded-lg border border-(--foreground)/10">
                    <td className="px-3 py-2 text-sm font-medium">{product.name}</td>
                    <td className="px-3 py-2 text-sm">{product.description}</td>
                    <td className="px-3 py-2 text-sm">{product.category}</td>
                    <td className="px-3 py-2 text-sm">{formatCurrencyBRL(product.price)}</td>
                    <td className="px-3 py-2 text-sm">{product.stock}</td>
                    <td className="px-3 py-2">
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          className="h-9 w-auto px-4 text-sm"
                          onClick={() => handleEdit(product)}
                        >
                          Editar
                        </Button>
                        <Button
                          type="button"
                          className="h-9 w-auto px-4 text-sm"
                          onClick={() => handleDelete(product.id)}
                        >
                          Excluir
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </section>
  );
}
