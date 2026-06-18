import { ApiHealthStatus } from "@/components/dev/ApiHealthStatus";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const showApiHealthCheck = true;
  return (
    <>
      {showApiHealthCheck && <ApiHealthStatus />}
      <PublicHeader />
      <main className="flex-1">{children}</main>
      <PublicFooter />
    </>
  );
}
