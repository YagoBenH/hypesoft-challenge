"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { TextInput } from "@/components/ui/TextInput";

const productSchema = z.object({
  name: z.string().trim().min(1, "Informe o nome do produto"),
  description: z.string().trim().min(1, "Informe a descrição do produto"),
  price: z.coerce.number().positive("Informe um preço maior que zero"),
  category: z.string().trim().min(1, "Informe a categoria"),
  stock: z.coerce
    .number()
    .int("Informe um número inteiro")
    .min(0, "Estoque não pode ser negativo"),
});

type ProductInput = z.input<typeof productSchema>;
export type ProductValues = z.output<typeof productSchema>;

type ProductCard = {
  mode: "create" | "edit";
  initialValues?: ProductValues;
  onSubmit: (values: ProductValues) => void;
  onCancel: () => void;
};

const emptyValues: ProductValues = {
  name: "",
  description: "",
  category: "",
  price: 0,
  stock: 0,
};

export function ProductCard({
  mode,
  initialValues,
  onSubmit,
  onCancel,
}: ProductCard) {
  const { register,    handleSubmit,    reset,    formState: { errors, isValid },
  } = useForm<ProductInput, undefined, ProductValues>({
    resolver: zodResolver(productSchema),
    mode: "onChange",
    defaultValues: initialValues ?? emptyValues,
  });

  React.useEffect(() => {
    reset(initialValues ?? emptyValues);
  }, [initialValues, reset]);

  return (
    <Card>
      <h2 className="text-lg font-semibold">{mode === "edit" ? "Editar produto" : "Novo produto"}</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 grid gap-4 sm:grid-cols-2">
        <TextInput
          label="Nome"
          placeholder="Nome do produto"
          error={errors.name?.message}
          {...register("name")}
        />
        <TextInput
          label="Categoria"
          placeholder="Ex.: Eletrônicos"
          error={errors.category?.message}
          {...register("category")}
        />
        <TextInput
          label="Descrição"
          placeholder="Descrição do produto"
          className="sm:col-span-2"
          error={errors.description?.message}
          {...register("description")}
        />
        <TextInput
          label="Preço"
          type="number"
          step="0.01"
          min="0"
          error={errors.price?.message}
          {...register("price")}
        />
        <TextInput
          label="Quantidade em estoque"
          type="number"
          min="0"
          step="1"
          error={errors.stock?.message}
          {...register("stock")}
        />

        <div className="flex flex-wrap gap-3 sm:col-span-2">
          <Button type="submit" className="h-11 w-auto px-6" disabled={!isValid}>
            {mode === "edit" ? "Salvar alterações" : "Cadastrar produto"}
          </Button>
          <Button type="button" className="h-11 w-auto px-6" onClick={onCancel}>
            Cancelar
          </Button>
        </div>
      </form>
    </Card>
  );
}