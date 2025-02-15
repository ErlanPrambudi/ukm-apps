import { Table, Modal, Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { FiTrash, FiEdit } from "react-icons/fi";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const DashUsers = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/users`, {
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

      if (json.data && Array.isArray(json.data.content)) {
        setUsers(json.data.content);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleDelete = async () => {
    if (!userIdToDelete) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/users/${userIdToDelete}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (!res.ok) {
        throw new Error(`Gagal menghapus pengguna! Status: ${res.status}`);
      }

      setShowModal(false);
      fetchUsers(); // Refresh data setelah menghapus
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Terjadi kesalahan saat menghapus pengguna.");
    }
  };

  return (
    <div className="p-4 overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4">Daftar Pengguna</h2>
      {users.length > 0 ? (
        <Table hoverable className="shadow-md">
          <Table.Head>
            <Table.HeadCell className="p-2">Nama</Table.HeadCell>
            <Table.HeadCell className="p-2">Username</Table.HeadCell>
            <Table.HeadCell className="p-2">Email</Table.HeadCell>
            <Table.HeadCell className="p-2">Alamat</Table.HeadCell>
            <Table.HeadCell className="p-2">No HP</Table.HeadCell>
            <Table.HeadCell className="p-2">Nama Akses</Table.HeadCell>
            <Table.HeadCell className="p-2">Tanggal Lahir</Table.HeadCell>
            <Table.HeadCell className="p-2">Delete</Table.HeadCell>
            <Table.HeadCell className="p-2">Update</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {users.map((user) => (
              <Table.Row key={user.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell className="p-2">{user.nama}</Table.Cell>
                <Table.Cell className="p-2">{user.username}</Table.Cell>
                <Table.Cell className="p-2 max-w-[150px] truncate">{user.email}</Table.Cell>
                <Table.Cell className="p-2">{user.alamat}</Table.Cell>
                <Table.Cell className="p-2">{user.noHp}</Table.Cell>
                <Table.Cell className="p-2">{user.namaAkses}</Table.Cell>
                <Table.Cell className="p-2">{user.tanggalLahir ? user.tanggalLahir : "N/A"}</Table.Cell>
                <Table.Cell className="p-2">
                  <span
                    onClick={() => {
                      setShowModal(true);
                      setUserIdToDelete(user.id);
                    }}
                    className="font-md text-red-500 hover:underline cursor-pointer"
                  >
                    <FiTrash size={18} />
                  </span>
                </Table.Cell>
                <Table.Cell>
                  <button onClick={() => navigate(`/update-user/${user.id}`)} className="text-blue-500 hover:text-blue-700">
                    <FiEdit size={18} />
                  </button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      ) : (
        <p className="text-gray-500">Tidak ada pengguna ditemukan.</p>
      )}

      {/* MODAL KONFIRMASI DELETE */}
      <Modal show={showModal} size="md" onClose={() => setShowModal(false)}>
        <Modal.Header>Konfirmasi Hapus</Modal.Header>
        <Modal.Body>
          <p className="text-gray-600">Apakah Anda yakin ingin menghapus pengguna ini?</p>
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

export default DashUsers;
