'use server'

import { Product } from "@/types/products"

export async function getDashboard(accessToken: string): Promise<Product[]> {
  if (!accessToken) throw new Error("Token de acesso não encontrado");

  const url = `${process.env.API_URL}/metrics/dashboard`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const body = await response.json();

  if (!response.ok) {
    throw new Error(body.message || "Erro pegar métricas para o dashboard");
  }

  return body as Product[];
}