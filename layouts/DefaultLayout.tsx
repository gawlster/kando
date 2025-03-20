import { Head } from "./head";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 h-screen">
      <Head />
      <div>Header and other stuff</div>
      <main className="h-full p-4">{children}</main>
    </div>
  );
}
