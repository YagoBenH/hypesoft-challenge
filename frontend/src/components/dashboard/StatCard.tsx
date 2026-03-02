import { Card } from "@/components/ui/Card";

type StatCardProps = {
  title: string;
  value: string;
  subtitle?: string;
};

export function StatCard({ title, value, subtitle }: StatCardProps) {
  return (
    <Card>
      <h3 className="text-sm opacity-80">{title}</h3>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
      {subtitle ? <p className="mt-1 text-xs opacity-70">{subtitle}</p> : null}
    </Card>
  );
}