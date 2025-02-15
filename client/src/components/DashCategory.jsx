import { Table, Modal, Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { FiEdit, FiTrash } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const DashCategory = () => {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [categoryIdToDelete, setCategoryIdToDelete] = useState(null);
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/kategori`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      const json = await res.json();
      // console.log("🔍 API Response:", json);

      if (json.data && Array.isArray(json.data.content)) {
        setCategories(json.data.content);
        // console.log("✅ Categories State:", json.data.content);
      } else if (json.data && Array.isArray(json.data)) {
        setCategories(json.data);
        // console.log("✅ Categories State (Alternative Format):", json.data);
      } else {
        console.warn("⚠️ Data kategori kosong atau format tidak sesuai!");
        setCategories([]);
      }
    } catch (error) {
      console.error("❌ Error fetching categories:", error);
    }
  };

  const handleDelete = async () => {
    if (!categoryIdToDelete) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/kategori/${categoryIdToDelete}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (!res.ok) {
        throw new Error(`Gagal menghapus kategori! Status: ${res.status}`);
      }

      setShowModal(false);
      fetchCategories(); // Refresh data setelah menghapus
    } catch (error) {
      console.error("❌ Error deleting category:", error);
      alert("Terjadi kesalahan saat menghapus kategori.");
    }
  };

  return (
    <div className="p-4 overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4">Daftar Kategori</h2>
      {categories.length > 0 ? (
        <Table hoverable className="shadow-md">
          <Table.Head>
            <Table.HeadCell>Nama Kategori</Table.HeadCell>
            <Table.HeadCell>Delete</Table.HeadCell>
            <Table.HeadCell>Update</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {categories.map((category) => (
              <Table.Row key={category.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell className="text-black dark:text-white font-semibold">
                  {category.namaKategori || category.nama} {/* Cek dua kemungkinan */}
                </Table.Cell>
                <Table.Cell>
                  <span
                    onClick={() => {
                      setShowModal(true);
                      setCategoryIdToDelete(category.id);
                    }}
                    className="font-md text-red-500 hover:underline cursor-pointer"
                  >
                    <FiTrash size={18} />
                  </span>
                </Table.Cell>
                <Table.Cell>
                  <button onClick={() => navigate(`/update-category/${category.id}`)} className="text-blue-500 hover:text-blue-700">
                    <FiEdit size={18} />
                  </button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      ) : (
        <p className="text-gray-500">Tidak ada kategori ditemukan.</p>
      )}

      {/* MODAL KONFIRMASI DELETE */}
      <Modal show={showModal} size="md" onClose={() => setShowModal(false)}>
        <Modal.Header>Konfirmasi Hapus</Modal.Header>
        <Modal.Body>
          <p className="text-gray-600">Apakah Anda yakin ingin menghapus kategori ini?</p>
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
    </div>
  );
};

export default DashCategory;
