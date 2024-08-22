import { Modal, Table, Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";

const DashOrganization = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [userOrganization, setUserOrganization] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [organizationIdToDelete, setOrganizationIdToDelete] = useState("");
  console.log(userOrganization);

  const fetchOrganization = async () => {
    try {
      const res = await fetch(`/api/organization/getorganizations?userId=${currentUser._id}`);
      const data = await res.json();

      if (res.ok) {
        setUserOrganization(data.organizations);
        if (data.organizations.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchOrganization();
  }, []);

  const handleShowMore = async () => {
    const startIndex = userOrganization.length;
    try {
      const res = await fetch(`/api/organizations/getorganizations?userId=${currentUser._id}&startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setUserOrganization((prev) => [...prev, ...data.organizations]);
        if (data.organizations.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteOrganization = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/organization/deleteorganization/${organizationIdToDelete}/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setUserOrganization((prev) => prev.filter((organization) => organization._id !== organizationIdToDelete));
      }
    } catch (error) {}
  };

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500 ">
      {userOrganization.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date Update</Table.HeadCell>
              <Table.HeadCell>Organization image</Table.HeadCell>
              <Table.HeadCell>user id</Table.HeadCell>
              <Table.HeadCell>INSTITUTION NAME</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>
                <span>Edit</span>
              </Table.HeadCell>
            </Table.Head>
            {userOrganization.map((organization) => (
              <Table.Body className="divide-y">
                <Table.Row className=" bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>{new Date(organization.updatedAt).toLocaleDateString()}</Table.Cell>
                  <Table.Cell>
                    <Link to={`/organization/${organization.slug}`}>
                      <img src={organization.image} alt={organization.namaLembaga} className="w-20 h-10 object-cover bg-gray-500" />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link className="font-medium text-gray-900 dark:text-white" to={`/organization/${organization.slug}`}>
                      {organization.userId}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link className="font-medium text-gray-900 dark:text-white" to={`/organization/${organization.slug}`}>
                      {organization.namaLembaga}
                    </Link>
                  </Table.Cell>

                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setOrganizationIdToDelete(organization._id);
                      }}
                      className="font-md text-red-500 hover:underline cursor-pointer"
                    >
                      Delete
                    </span>
                  </Table.Cell>

                  <Table.Cell>
                    <Link className="text-teal-500 hover:underline" to={`/update-organization/${organization._id}`}>
                      <span>Edit</span>
                    </Link>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {showMore && (
            <button onClick={handleShowMore} className="w-full text-teal-500 self-center text-sm py-7">
              Show more
            </button>
          )}
        </>
      ) : (
        <p>You have no organization yet!</p>
      )}
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">Are you sure you want to deleted this organization ?</h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteOrganization}>
                Yes, I'am sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DashOrganization;
