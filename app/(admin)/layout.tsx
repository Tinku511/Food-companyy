import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen bg-[#FAF6EE]">
      <AdminSidebar userName={session.user.name ?? 'Admin'} userEmail={session.user.email ?? ''} />
      <main className="flex-1 overflow-auto lg:ml-64">
        <div className="min-h-screen px-4 py-8 sm:px-8">{children}</div>
      </main>
    </div>
  );
}
