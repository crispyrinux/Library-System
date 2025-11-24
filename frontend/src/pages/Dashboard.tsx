import { useEffect, useState } from "react";
import { StatCard } from "@/components/StatCard";
import {
  BookOpen,
  Users,
  FileText,
  DollarSign,
  Plus,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

import { getBooks, getMembers, getLoans, getFines } from "@/lib/api";

type OverdueLoanRow = {
  id: string;
  bookTitle: string;
  memberName: string;
  dueDate: string;
  daysOverdue: number;
};

export default function Dashboard() {
  const navigate = useNavigate();

  const [totalBooks, setTotalBooks] = useState(0);
  const [totalMembers, setTotalMembers] = useState(0);
  const [activeLoans, setActiveLoans] = useState(0);
  const [unpaidFines, setUnpaidFines] = useState(0);
  const [overdueLoans, setOverdueLoans] = useState<OverdueLoanRow[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        const [booksRes, membersRes, loansRes, finesRes] = await Promise.all([
          getBooks({ page: 1, limit: 1 }), // kita cuma perlu total
          getMembers(),
          getLoans({ activeOnly: true }),
          getFines({ isPaid: false }),
        ]);

        // books: { data, total, ... }
        setTotalBooks((booksRes as any).total ?? (booksRes as any).data?.length ?? 0);

        // members: bisa array langsung atau { data: [...] }
        const membersData = Array.isArray(membersRes)
          ? membersRes
          : (membersRes as any).data ?? [];
        setTotalMembers(membersData.length);

        // loans: { data, total, ... }
        const loansData = (loansRes as any).data ?? [];
        setActiveLoans((loansRes as any).total ?? loansData.length);

        // fines: { data, total, ... }
        const finesData = (finesRes as any).data ?? [];
        setUnpaidFines(finesData.length);

        // hitung overdue dari loans
        const now = new Date();
        const overdue: OverdueLoanRow[] = loansData
          .filter((loan: any) => {
            if (loan.is_returned || loan.returnedAt || loan.returned_at) {
              return false;
            }
            const due =
              loan.dueDate || loan.due_date
                ? new Date(loan.dueDate || loan.due_date)
                : null;
            if (!due) return false;
            return due < now;
          })
          .slice(0, 5) // tampilkan 5 teratas
          .map((loan: any) => {
            const due =
              loan.dueDate || loan.due_date
                ? new Date(loan.dueDate || loan.due_date)
                : new Date();
            const diffMs = now.getTime() - due.getTime();
            const days = Math.max(1, Math.round(diffMs / (1000 * 60 * 60 * 24)));
            return {
              id: loan.loan_id || loan.id,
              bookTitle:
                loan.book?.title || loan.bookTitle || "Judul tidak tersedia",
              memberName:
                loan.member?.name || loan.memberName || "Nama tidak tersedia",
              dueDate: due.toLocaleDateString("id-ID"),
              daysOverdue: days,
            };
          });

        setOverdueLoans(overdue);
      } catch (err: any) {
        console.error(err);
        toast.error("Gagal memuat data dashboard");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Overview sistem perpustakaan Anda
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Buku"
          value={totalBooks}
          icon={BookOpen}
          description="Buku dalam katalog"
        />
        <StatCard
          title="Total Anggota"
          value={totalMembers}
          icon={Users}
          description="Anggota terdaftar"
        />
        <StatCard
          title="Sedang Dipinjam"
          value={activeLoans}
          icon={FileText}
          description="Peminjaman aktif"
        />
        <StatCard
          title="Denda Belum Lunas"
          value={unpaidFines}
          icon={DollarSign}
          description="Perlu ditindaklanjuti"
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Aksi Cepat</CardTitle>
          <CardDescription>
            Shortcut untuk tugas yang sering dilakukan
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button onClick={() => navigate("/loans")} className="gap-2">
            <Plus className="h-4 w-4" />
            Catat Peminjaman Baru
          </Button>
          <Button
            onClick={() => navigate("/members")}
            variant="outline"
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Tambah Anggota
          </Button>
          <Button
            onClick={() => navigate("/books")}
            variant="outline"
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Tambah Buku
          </Button>
        </CardContent>
      </Card>

      {/* Overdue Loans Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <div>
              <CardTitle>Terlambat Pengembalian</CardTitle>
              <CardDescription>
                Peminjaman yang melewati jatuh tempo
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Memuat data...</p>
          ) : overdueLoans.length === 0 ? (
            <p>Tidak ada peminjaman yang terlambat.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Judul Buku</TableHead>
                  <TableHead>Peminjam</TableHead>
                  <TableHead>Jatuh Tempo</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {overdueLoans.map((loan) => (
                  <TableRow key={loan.id}>
                    <TableCell className="font-medium">
                      {loan.bookTitle}
                    </TableCell>
                    <TableCell>{loan.memberName}</TableCell>
                    <TableCell>{loan.dueDate}</TableCell>
                    <TableCell>
                      <Badge variant="destructive">
                        Terlambat {loan.daysOverdue} hari
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
