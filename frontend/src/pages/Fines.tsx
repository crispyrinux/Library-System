import { useEffect, useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { getFines, markFinePaid } from "@/lib/api";

type FineRow = {
  id: string;
  memberName: string;
  bookTitle: string;
  amount: number;
  fineDate: string;
  daysOverdue?: number; // hanya untuk yang belum lunas
  paidDate?: string; // hanya untuk yang sudah lunas
};

export default function Fines() {
  const [unpaidFines, setUnpaidFines] = useState<FineRow[]>([]);
  const [paidFines, setPaidFines] = useState<FineRow[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadFines();
  }, []);

  async function loadFines() {
    try {
      setLoading(true);

      const [unpaidRes, paidRes] = await Promise.all([
        getFines({ isPaid: false }),
        getFines({ isPaid: true }),
      ]);

      const unpaidData = (unpaidRes as any).data ?? unpaidRes;
      const paidData = (paidRes as any).data ?? paidRes;

      setUnpaidFines(
        (unpaidData as any[]).map((fine) => {
          const loan = fine.loan || {};
          const member = loan.member || {};
          const book = loan.book || {};

          // hitung keterlambatan dari due_date vs fine_date / hari ini (fallback)
          const due =
            loan.due_date || loan.dueDate
              ? new Date(loan.due_date || loan.dueDate)
              : null;
          const fineDate =
            fine.fine_date || fine.fineDate
              ? new Date(fine.fine_date || fine.fineDate)
              : null;
          const now = new Date();
          const base = due || fineDate || now;
          const diffMs = now.getTime() - base.getTime();
          const days = Math.max(1, Math.round(diffMs / (1000 * 60 * 60 * 24)));

          return {
            id: fine.fine_id || fine.id,
            memberName: member.name || "Nama tidak tersedia",
            bookTitle: book.title || "Judul tidak tersedia",
            amount: fine.amount,
            fineDate: (fine.fine_date || fine.fineDate || "").toString(),
            daysOverdue: days,
          } as FineRow;
        }),
      );

      setPaidFines(
        (paidData as any[]).map((fine) => {
          const loan = fine.loan || {};
          const member = loan.member || {};
          const book = loan.book || {};

          return {
            id: fine.fine_id || fine.id,
            memberName: member.name || "Nama tidak tersedia",
            bookTitle: book.title || "Judul tidak tersedia",
            amount: fine.amount,
            fineDate: (fine.fine_date || fine.fineDate || "").toString(),
            paidDate: (fine.paid_date || fine.paidDate || "").toString(),
          } as FineRow;
        }),
      );
    } catch (err: any) {
      console.error(err);
      toast.error("Gagal memuat data denda");
    } finally {
      setLoading(false);
    }
  }

  const handleMarkPaid = async (id: string) => {
    try {
      await markFinePaid(id);
      toast.success("Denda berhasil ditandai lunas!");
      await loadFines();
    } catch (err: any) {
      console.error(err);
      toast.error("Gagal menandai denda lunas");
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Manajemen Denda</h2>
        <p className="text-muted-foreground">
          Kelola denda keterlambatan pengembalian buku
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Denda</CardTitle>
          <CardDescription>
            Lacak status pembayaran denda anggota
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="unpaid" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="unpaid" className="gap-2">
                <AlertCircle className="h-4 w-4" />
                Belum Lunas
              </TabsTrigger>
              <TabsTrigger value="paid" className="gap-2">
                <CheckCircle className="h-4 w-4" />
                Sudah Lunas
              </TabsTrigger>
            </TabsList>

            <TabsContent value="unpaid" className="mt-4">
              {loading ? (
                <p>Memuat data...</p>
              ) : unpaidFines.length === 0 ? (
                <p>Tidak ada denda yang belum lunas.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama Peminjam</TableHead>
                      <TableHead>Judul Buku</TableHead>
                      <TableHead>Jumlah Denda</TableHead>
                      <TableHead>Tanggal Denda</TableHead>
                      <TableHead>Keterlambatan</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {unpaidFines.map((fine) => (
                      <TableRow key={fine.id}>
                        <TableCell className="font-medium">
                          {fine.memberName}
                        </TableCell>
                        <TableCell>{fine.bookTitle}</TableCell>
                        <TableCell className="font-semibold text-destructive">
                          {formatCurrency(fine.amount)}
                        </TableCell>
                        <TableCell>
                          {fine.fineDate
                            ? new Date(fine.fineDate).toLocaleDateString("id-ID")
                            : "-"}
                        </TableCell>
                        <TableCell>
                          <Badge variant="destructive">
                            {fine.daysOverdue} hari
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-2"
                            onClick={() => handleMarkPaid(fine.id)}
                          >
                            <CheckCircle className="h-4 w-4" />
                            Tandai Lunas
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>

            <TabsContent value="paid" className="mt-4">
              {loading ? (
                <p>Memuat data...</p>
              ) : paidFines.length === 0 ? (
                <p>Belum ada riwayat denda yang sudah lunas.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama Peminjam</TableHead>
                      <TableHead>Judul Buku</TableHead>
                      <TableHead>Jumlah Denda</TableHead>
                      <TableHead>Tanggal Denda</TableHead>
                      <TableHead>Tanggal Pembayaran</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paidFines.map((fine) => (
                      <TableRow key={fine.id}>
                        <TableCell className="font-medium">
                          {fine.memberName}
                        </TableCell>
                        <TableCell>{fine.bookTitle}</TableCell>
                        <TableCell className="font-semibold text-muted-foreground">
                          {formatCurrency(fine.amount)}
                        </TableCell>
                        <TableCell>
                          {fine.fineDate
                            ? new Date(fine.fineDate).toLocaleDateString("id-ID")
                            : "-"}
                        </TableCell>
                        <TableCell>
                          {fine.paidDate
                            ? new Date(fine.paidDate).toLocaleDateString("id-ID")
                            : "-"}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Lunas
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
