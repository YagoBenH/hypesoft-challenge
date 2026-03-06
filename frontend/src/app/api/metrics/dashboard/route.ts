import { NextResponse } from "next/server";
import type { Product } from "@/types/products";

const mockProducts: Product[] = [
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

export async function GET(req: Request) {
  const auth = req.headers.get("authorization") ?? "";
  if (!auth.toLowerCase().startsWith("bearer ")) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(mockProducts, {
    status: 200,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
