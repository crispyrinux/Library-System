import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Label } from "@/components/ui/label";
import { CalendarIcon, Plus, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

import { getLoans, createLoan, returnLoan } from "@/lib/api";

type ActiveLoanRow = {
  id: string;
  bookTitle: string;
  memberName: string;
  borrowDate: string;
  dueDate: string;
  daysRemaining: number;
};

type HistoryLoanRow = {
  id: string;
  bookTitle: string;
  memberName: string;
  borrowDate: string;
  dueDate: string;
  returnDate: string;
  status: string;
};

export default function Loans() {
  const [borrowDate, setBorrowDate] = useState<Date>(new Date());
  const [dueDate, setDueDate] = useState<Date>(
    new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
  );

  const [memberId, setMemberId] = useState("");
  const [bookId, setBookId] = useState("");

  const [activeLoans, setActiveLoans] = useState<ActiveLoanRow[]>([]);
  const [loanHistory, setLoanHistory] = useState<HistoryLoanRow[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadLoans();
  }, []);

  async function loadLoans() {
    try {
      setLoading(true);

      const [activeRes, allRes] = await Promise.all([
        getLoans({ activeOnly: true }),
        getLoans(),
      ]);

      const activeData = (activeRes as any).data ?? activeRes;
      const allData = (allRes as any).data ?? allRes;

      const now = new Date();

      setActiveLoans(
        (activeData as any[]).map((loan) => {
          const book = loan.book || {};
          const member = loan.member || {};

          const borrow =
            loan.borrow_date || loan.borrowDate
              ? new Date(loan.borrow_date || loan.borrowDate)
              : now;
          const due =
            loan.due_date || loan.dueDate
              ? new Date(loan.due_date || loan.dueDate)
              : now;

          const diffMs = due.getTime() - now.getTime();
          const days = Math.round(diffMs / (1000 * 60 * 60 * 24));

          return {
            id: loan.loan_id || loan.id,
            bookTitle: book.title || "Judul tidak tersedia",
            memberName: member.name || "Nama tidak tersedia",
            borrowDate: borrow.toLocaleDateString("id-ID"),
            dueDate: due.toLocaleDateString("id-ID"),
            daysRemaining: days,
          } as ActiveLoanRow;
        }),
      );

      setLoanHistory(
        (allData as any[])
          .filter((loan) => {
            // anggap "riwayat" = sudah dikembalikan
            return (
              loan.is_returned ||
              loan.return_date ||
              loan.returnDate
            );
          })
          .map((loan) => {
            const book = loan.book || {};
            const member = loan.member || {};

            const borrow =
              loan.borrow_date || loan.borrowDate
                ? new Date(loan.borrow_date || loan.borrowDate)
                : now;
            const due =
              loan.due_date || loan.dueDate
                ? new Date(loan.due_date || loan.dueDate)
                : now;
            const ret =
              loan.return_date || loan.returnDate
                ? new Date(loan.return_date || loan.returnDate)
                : now;

            const onTime = ret <= due;

            return {
              id: loan.loan_id || loan.id,
              bookTitle: book.title || "Judul tidak tersedia",
              memberName: member.name || "Nama tidak tersedia",
              borrowDate: borrow.toLocaleDateString("id-ID"),
              dueDate: due.toLocaleDateString("id-ID"),
              returnDate: ret.toLocaleDateString("id-ID"),
              status: onTime ? "Returned On Time" : "Returned Late",
            } as HistoryLoanRow;
          }),
      );
    } catch (err: any) {
      console.error(err);
      toast.error("Gagal memuat data peminjaman");
    } finally {
      setLoading(false);
    }
  }

  const handleCreateLoan = async () => {
    if (!memberId.trim() || !bookId.trim()) {
      toast.error("ID anggota dan ID buku wajib diisi");
      return;
    }

    try {
      await createLoan({
        member_id: memberId,
        book_id: bookId,
        // tanggal pinjam & jatuh tempo biasanya diatur di backend,
        // jadi di sini tidak dikirim. Date picker hanya untuk visual.
      });

      toast.success("Transaksi peminjaman berhasil dicatat!");
      setMemberId("");
      setBookId("");

      await loadLoans();
    } catch (err: any) {
      console.error(err);
      toast.error("Gagal mencatat peminjaman");
    }
  };

  const handleReturnBook = async (id: string) => {
    try {
      await returnLoan(id);
      toast.success("Buku berhasil dikembalikan!");
      await loadLoans();
    } catch (err: any) {
      console.error(err);
      toast.error("Gagal memproses pengembalian buku");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Manajemen Peminjaman</h2>
        <p className="text-muted-foreground">
          Catat transaksi peminjaman dan pengembalian buku
        </p>
      </div>

      {/* New Loan Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Catat Peminjaman Baru
          </CardTitle>
          <CardDescription>Masukkan informasi peminjaman buku</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="member">ID Anggota</Label>
              <Input
                id="member"
                placeholder="Masukkan ID anggota..."
                value={memberId}
                onChange={(e) => setMemberId(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="book">ID Buku</Label>
              <Input
                id="book"
                placeholder="Masukkan ID buku..."
                value={bookId}
                onChange={(e) => setBookId(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label>Tanggal Pinjam</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !borrowDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {borrowDate ? format(borrowDate, "PPP") : <span>Pilih tanggal</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={borrowDate}
                    onSelect={(date) => date && setBorrowDate(date)}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid gap-2">
              <Label>Tanggal Jatuh Tempo</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !dueDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, "PPP") : <span>Pilih tanggal</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={(date) => date && setDueDate(date)}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="mt-4">
            <Button onClick={handleCreateLoan} className="gap-2">
              <Plus className="h-4 w-4" />
              Simpan Transaksi
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Loans Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Peminjaman</CardTitle>
          <CardDescription>
            Kelola peminjaman aktif dan riwayat
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="active" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="active">Peminjaman Aktif</TabsTrigger>
              <TabsTrigger value="history">Riwayat</TabsTrigger>
            </TabsList>
            <TabsContent value="active" className="mt-4">
              {loading ? (
                <p>Memuat data...</p>
              ) : activeLoans.length === 0 ? (
                <p>Tidak ada peminjaman aktif.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Judul Buku</TableHead>
                      <TableHead>Peminjam</TableHead>
                      <TableHead>Tgl Pinjam</TableHead>
                      <TableHead>Tgl Jatuh Tempo</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeLoans.map((loan) => (
                      <TableRow key={loan.id}>
                        <TableCell className="font-medium">{loan.bookTitle}</TableCell>
                        <TableCell>{loan.memberName}</TableCell>
                        <TableCell>{loan.borrowDate}</TableCell>
                        <TableCell>{loan.dueDate}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              loan.daysRemaining >= 0 ? "outline" : "destructive"
                            }
                          >
                            {loan.daysRemaining >= 0
                              ? `${loan.daysRemaining} hari lagi`
                              : "Terlambat"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-2"
                            onClick={() => handleReturnBook(loan.id)}
                          >
                            <CheckCircle className="h-4 w-4" />
                            Kembalikan
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>
            <TabsContent value="history" className="mt-4">
              {loading ? (
                <p>Memuat data...</p>
              ) : loanHistory.length === 0 ? (
                <p>Belum ada riwayat peminjaman.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Judul Buku</TableHead>
                      <TableHead>Peminjam</TableHead>
                      <TableHead>Tgl Pinjam</TableHead>
                      <TableHead>Tgl Jatuh Tempo</TableHead>
                      <TableHead>Tgl Kembali</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loanHistory.map((loan) => (
                      <TableRow key={loan.id}>
                        <TableCell className="font-medium">{loan.bookTitle}</TableCell>
                        <TableCell>{loan.memberName}</TableCell>
                        <TableCell>{loan.borrowDate}</TableCell>
                        <TableCell>{loan.dueDate}</TableCell>
                        <TableCell>{loan.returnDate}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              loan.status === "Returned On Time"
                                ? "outline"
                                : "secondary"
                            }
                          >
                            {loan.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
