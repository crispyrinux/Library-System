import { useEffect, useMemo, useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Search, Edit, Trash2, History } from "lucide-react";
import { toast } from "sonner";

import {
  getMembers,
  createMember,
  updateMember,
  deleteMember,
} from "@/lib/api";

type Member = {
  member_id: string;
  name: string;
  email: string;
  phone?: string;
  membership_date?: string;
};

export default function Members() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);

  const [editingMember, setEditingMember] = useState<Member | null>(null);

  // form state
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");

  async function loadMembers() {
    try {
      setLoading(true);
      const res = await getMembers();
      const data = Array.isArray(res) ? res : (res as any).data;
      setMembers(data as Member[]);
    } catch (err: any) {
      console.error(err);
      toast.error("Gagal memuat data anggota");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMembers();
  }, []);

  const openCreateDialog = () => {
    setEditingMember(null);
    setFormName("");
    setFormEmail("");
    setFormPhone("");
    setIsDialogOpen(true);
  };

  const openEditDialog = (member: Member) => {
    setEditingMember(member);
    setFormName(member.name);
    setFormEmail(member.email);
    setFormPhone(member.phone || "");
    setIsDialogOpen(true);
  };

  const handleSaveMember = async () => {
    if (!formName.trim() || !formEmail.trim()) {
      toast.error("Nama dan email wajib diisi");
      return;
    }

    try {
      if (editingMember) {
        await updateMember(editingMember.member_id, {
          name: formName.trim(),
          email: formEmail.trim(),
          phone: formPhone || undefined,
        });
        toast.success("Anggota berhasil diperbarui!");
      } else {
        await createMember({
          name: formName.trim(),
          email: formEmail.trim(),
          phone: formPhone || undefined,
        });
        toast.success("Anggota berhasil ditambahkan!");
      }

      setIsDialogOpen(false);
      await loadMembers();
    } catch (err: any) {
      console.error(err);
      toast.error(
        editingMember ? "Gagal memperbarui anggota" : "Gagal menambahkan anggota",
      );
    }
  };

  const handleDeleteMember = async (id: string) => {
    if (!confirm("Yakin ingin menghapus anggota ini?")) return;

    try {
      await deleteMember(id);
      toast.success("Anggota berhasil dihapus!");
      await loadMembers();
    } catch (err: any) {
      console.error(err);
      toast.error("Gagal menghapus anggota");
    }
  };

  const handleViewHistory = (id: string) => {
    toast.info("Fitur riwayat peminjaman akan segera tersedia!");
  };

  const filteredMembers = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return members.filter((member) => {
      return (
        member.name.toLowerCase().includes(q) ||
        member.email.toLowerCase().includes(q)
      );
    });
  }, [members, searchQuery]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Manajemen Anggota</h2>
          <p className="text-muted-foreground">
            Kelola data anggota perpustakaan
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={openCreateDialog}>
              <Plus className="h-4 w-4" />
              Tambah Anggota
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingMember ? "Edit Anggota" : "Tambah Anggota Baru"}
              </DialogTitle>
              <DialogDescription>
                Masukkan informasi anggota yang akan{" "}
                {editingMember ? "diperbarui" : "didaftarkan"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input
                  id="name"
                  placeholder="Masukkan nama lengkap"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">No. Telepon</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="08123456789"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Batal
              </Button>
              <Button onClick={handleSaveMember}>
                {editingMember ? "Simpan Perubahan" : "Simpan"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Anggota</CardTitle>
          <CardDescription>
            Cari anggota berdasarkan nama atau email
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari berdasarkan nama atau email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>No. Telepon</TableHead>
                <TableHead>Tanggal Bergabung</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5}>Memuat data...</TableCell>
                </TableRow>
              ) : filteredMembers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5}>Tidak ada anggota</TableCell>
                </TableRow>
              ) : (
                filteredMembers.map((member) => (
                  <TableRow key={member.member_id}>
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>{member.phone || "-"}</TableCell>
                    <TableCell>
                      {member.membership_date
                        ? new Date(member.membership_date).toLocaleDateString(
                            "id-ID",
                          )
                        : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(member)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewHistory(member.member_id)}
                        >
                          <History className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteMember(member.member_id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
