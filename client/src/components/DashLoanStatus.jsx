import { Table, Modal, Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { FiEdit, FiTrash } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const DashLoanStatus = () => {
  const [loanStatuses, setLoanStatuses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [statusIdToDelete, setStatusIdToDelete] = useState(null);
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
  const navigate = useNavigate();

  useEffect(() => {
    fetchLoanStatuses();
  }, []);

  const fetchLoanStatuses = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/status-pengembalian`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      const json = await res.json();
      if (Array.isArray(json)) {
        setLoanStatuses(json);
      } else {
        console.warn("⚠️ Data status peminjaman kosong atau format tidak sesuai!", json);
        setLoanStatuses([]);
      }
    } catch (error) {
      console.error("❌ Error fetching loan statuses:", error);
    }
  };

  const handleDelete = async () => {
    if (!statusIdToDelete) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/status-pengembalian/${statusIdToDelete}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (!res.ok) {
        throw new Error(`Gagal menghapus status peminjaman! Status: ${res.status}`);
      }

      setShowModal(false);
      fetchLoanStatuses(); // Refresh data setelah menghapus
    } catch (error) {
      console.error("❌ Error deleting loan status:", error);
      alert("Terjadi kesalahan saat menghapus status peminjaman.");
    }
  };

  return (
    <div className="p-4 overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4">Daftar Status Peminjaman</h2>
      {loanStatuses.length > 0 ? (
        <Table hoverable className="shadow-md">
          <Table.Head>
            <Table.HeadCell>Status Peminjaman</Table.HeadCell>
            <Table.HeadCell>Delete</Table.HeadCell>
            <Table.HeadCell>Update</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {loanStatuses.map((status) => (
              <Table.Row key={status.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell className="text-black dark:text-white font-semibold">{status.status}</Table.Cell>
                <Table.Cell>
                  <span
                    onClick={() => {
                      setShowModal(true);
                      setStatusIdToDelete(status.id);
                    }}
                    className="font-md text-red-500 hover:underline cursor-pointer"
                  >
                    <FiTrash size={18} />
                  </span>
                </Table.Cell>
                <Table.Cell>
                  <button onClick={() => navigate(`/update-loan-status/${status.id}`)} className="text-blue-500 hover:text-blue-700">
                    <FiEdit size={18} />
                  </button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      ) : (
        <p className="text-gray-500">Tidak ada status peminjaman ditemukan.</p>
      )}

      {/* MODAL KONFIRMASI DELETE */}
      <Modal show={showModal} size="md" onClose={() => setShowModal(false)}>
        <Modal.Header>Konfirmasi Hapus</Modal.Header>
        <Modal.Body>
          <p className="text-gray-600">Apakah Anda yakin ingin menghapus status peminjaman ini?</p>
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

export default DashLoanStatus;
