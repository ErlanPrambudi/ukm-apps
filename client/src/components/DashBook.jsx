import { Table, Modal, Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { FiDelete, FiEdit, FiTrash } from "react-icons/fi";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import DashCategory from "./DashCategory";

const DashBook = () => {
  const [books, setBooks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [bookIdToDelete, setBookIdToDelete] = useState(null);
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/buku`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const json = await res.json();

      //   console.log("Response JSON:", json); // 🔥 Tambahkan log ini
      if (json.data && Array.isArray(json.data.content)) {
        setBooks(json.data.content);
      } else {
        setBooks([]);
      }
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const handleDelete = async () => {
    if (!bookIdToDelete) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/buku/${bookIdToDelete}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (!res.ok) {
        throw new Error(`Gagal menghapus buku! Status: ${res.status}`);
      }

      setShowModal(false);
      fetchBooks(); // Refresh data setelah menghapus
    } catch (error) {
      console.error("Error deleting book:", error);
      alert("Terjadi kesalahan saat menghapus buku.");
    }
  };

  return (
    <div className="p-4 overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4">Daftar Buku</h2>
      {books.length > 0 ? (
        <Table hoverable className="shadow-md">
          <Table.Head>
            <Table.HeadCell>Tahun Terbit</Table.HeadCell>
            <Table.HeadCell>Judul Buku</Table.HeadCell>
            <Table.HeadCell>Penulis</Table.HeadCell>
            <Table.HeadCell>Penerbit</Table.HeadCell>
            <Table.HeadCell>Kategori</Table.HeadCell>
            <Table.HeadCell>Stok</Table.HeadCell>
            <Table.HeadCell>Delete</Table.HeadCell>
            <Table.HeadCell>Update</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {books.map((book) => (
              <Table.Row key={book.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell>{book.tahunTerbit}</Table.Cell>
                <Table.Cell>{book.judul}</Table.Cell>
                <Table.Cell>{book.penulis}</Table.Cell>
                <Table.Cell>{book.penerbit}</Table.Cell>
                <Table.Cell>{book.namaKategori}</Table.Cell>
                <Table.Cell>{book.stok}</Table.Cell>
                <Table.Cell>
                  <span
                    onClick={() => {
                      setShowModal(true);
                      setBookIdToDelete(book.id);
                    }}
                    className="font-md text-red-500 hover:underline cursor-pointer"
                  >
                    <FiTrash size={18} />
                  </span>
                </Table.Cell>
                <Table.Cell>
                  <button onClick={() => navigate(`/update-book/${book.id}`)} className="text-blue-500 hover:text-blue-700">
                    <FiEdit size={18} />
                  </button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      ) : (
        <p className="text-gray-500">Tidak ada buku ditemukan.</p>
      )}

      {/* MODAL KONFIRMASI DELETE */}
      <Modal show={showModal} size="md" onClose={() => setShowModal(false)}>
        <Modal.Header>Konfirmasi Hapus</Modal.Header>
        <Modal.Body>
          <p className="text-gray-600">Apakah Anda yakin ingin menghapus buku ini?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button color="failure" onClick={handleDelete}>
            Ya, Hapus
          </Button>
          <Button color="gray" onClick={() => setShowModal(false)}>
            Batal
          </Button>
        </Modal.Footer>
      </Modal>
      <DashCategory />
    </div>
  );
};

export default DashBook;
