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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, Search, Edit, Trash2, CheckCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

import { getBooks, createBook, updateBook, deleteBook } from "@/lib/api";

type Book = {
  book_id: string;
  title: string;
  author: string;
  publication_year?: number;
  genre?: string;
  is_available: boolean;
};

const GENRES = ["Computer Science", "Programming", "Fiction", "Non-Fiction", "History", "Horror"];

export default function Books() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterGenre, setFilterGenre] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  // form state
  const [formTitle, setFormTitle] = useState("");
  const [formAuthor, setFormAuthor] = useState("");
  const [formYear, setFormYear] = useState("");
  const [formGenre, setFormGenre] = useState("");

  async function loadBooks() {
    try {
      setLoading(true);
      const res = await getBooks({ page: 1, limit: 100 });
      const data = (res as any).data ?? res;
      setBooks(data as Book[]);
    } catch (err: any) {
      console.error(err);
      toast.error("Gagal memuat data buku");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBooks();
  }, []);

  const openCreateDialog = () => {
    setEditingBook(null);
    setFormTitle("");
    setFormAuthor("");
    setFormYear("");
    setFormGenre("");
    setIsDialogOpen(true);
  };

  const openEditDialog = (book: Book) => {
    setEditingBook(book);
    setFormTitle(book.title);
    setFormAuthor(book.author);
    setFormYear(book.publication_year ? String(book.publication_year) : "");
    setFormGenre(book.genre || "");
    setIsDialogOpen(true);
  };

  const handleSaveBook = async () => {
    if (!formTitle.trim() || !formAuthor.trim()) {
      toast.error("Judul dan penulis wajib diisi");
      return;
    }

    try {
      if (editingBook) {
        // UPDATE
        await updateBook(editingBook.book_id, {
          title: formTitle.trim(),
          author: formAuthor.trim(),
          genre: formGenre || undefined,
          publication_year: formYear ? Number(formYear) : undefined,
        });
        toast.success("Buku berhasil diperbarui!");
      } else {
        // CREATE
        await createBook({
          title: formTitle.trim(),
          author: formAuthor.trim(),
          genre: formGenre || undefined,
          publication_year: formYear ? Number(formYear) : undefined,
        });
        toast.success("Buku berhasil ditambahkan!");
      }

      setIsDialogOpen(false);
      await loadBooks();
    } catch (err: any) {
      console.error(err);
      toast.error(
        editingBook ? "Gagal memperbarui buku" : "Gagal menambahkan buku",
      );
    }
  };

  const handleDeleteBook = async (id: string) => {
    if (!confirm("Yakin ingin menghapus buku ini?")) return;

    try {
      await deleteBook(id);
      toast.success("Buku berhasil dihapus!");
      await loadBooks();
    } catch (err: any) {
      console.error(err);
      toast.error("Gagal menghapus buku");
    }
  };

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        book.title.toLowerCase().includes(q) ||
        book.author.toLowerCase().includes(q);

      const matchGenre =
        filterGenre === "all" || (book.genre || "") === filterGenre;

      const matchStatus =
        filterStatus === "all" ||
        (filterStatus === "available" && book.is_available) ||
        (filterStatus === "borrowed" && !book.is_available);

      return matchSearch && matchGenre && matchStatus;
    });
  }, [books, searchQuery, filterGenre, filterStatus]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Manajemen Buku</h2>
          <p className="text-muted-foreground">
            Kelola katalog buku perpustakaan
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={openCreateDialog}>
              <Plus className="h-4 w-4" />
              Tambah Buku
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingBook ? "Edit Buku" : "Tambah Buku Baru"}
              </DialogTitle>
              <DialogDescription>
                Masukkan informasi buku yang akan {editingBook ? "diperbarui" : "ditambahkan"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Judul Buku</Label>
                <Input
                  id="title"
                  placeholder="Masukkan judul buku"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="author">Penulis</Label>
                <Input
                  id="author"
                  placeholder="Masukkan nama penulis"
                  value={formAuthor}
                  onChange={(e) => setFormAuthor(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="year">Tahun Terbit</Label>
                <Input
                  id="year"
                  type="number"
                  placeholder="2024"
                  value={formYear}
                  onChange={(e) => setFormYear(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="genre">Genre</Label>
                <Select
                  value={formGenre || undefined}
                  onValueChange={setFormGenre}
                >
                  <SelectTrigger id="genre">
                    <SelectValue placeholder="Pilih genre" />
                  </SelectTrigger>
                  <SelectContent>
                    {GENRES.map((genre) => (
                      <SelectItem key={genre} value={genre}>
                        {genre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Batal
              </Button>
              <Button onClick={handleSaveBook}>
                {editingBook ? "Simpan Perubahan" : "Simpan"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Buku</CardTitle>
          <CardDescription>
            Cari dan filter buku berdasarkan kategori
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari berdasarkan judul atau penulis..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterGenre} onValueChange={setFilterGenre}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Semua Genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Genre</SelectItem>
                {GENRES.map((genre) => (
                  <SelectItem key={genre} value={genre}>
                    {genre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Semua Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="available">Tersedia</SelectItem>
                <SelectItem value="borrowed">Dipinjam</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Judul Buku</TableHead>
                <TableHead>Penulis</TableHead>
                <TableHead>Tahun Terbit</TableHead>
                <TableHead>Genre</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6}>Memuat data...</TableCell>
                </TableRow>
              ) : filteredBooks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6}>Tidak ada buku</TableCell>
                </TableRow>
              ) : (
                filteredBooks.map((book) => (
                  <TableRow key={book.book_id}>
                    <TableCell className="font-medium">{book.title}</TableCell>
                    <TableCell>{book.author}</TableCell>
                    <TableCell>{book.publication_year ?? "-"}</TableCell>
                    <TableCell>{book.genre || "-"}</TableCell>
                    <TableCell>
                      {book.is_available ? (
                        <Badge variant="outline" className="gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Tersedia
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="gap-1">
                          <XCircle className="h-3 w-3" />
                          Dipinjam
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(book)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteBook(book.book_id)}
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
