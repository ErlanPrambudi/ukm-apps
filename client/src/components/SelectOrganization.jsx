import { useEffect, useState } from "react";

const SelectOrganization = ({ onSelect }) => {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const res = await fetch("/api/organization/getorganizations");
        const data = await res.json();

        if (res.ok) {
          // Validasi bahwa data.organization adalah array
          if (Array.isArray(data.organizations)) {
            setOrganizations(data.organizations);
          } else {
            console.error("Data returned is not an array", data);
            setOrganizations([]); // Set ke array kosong jika data tidak valid
          }
        } else {
          console.error("Failed to fetch organization", data);
          setError("Failed to fetch organization");
        }
      } catch (error) {
        console.error("Error fetching organization", error);
        setError("Error fetching organization");
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizations();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <select onChange={(e) => onSelect(e.target.value)} className="form-select">
      <option value="">Select Lembaga</option>
      {organizations.map((organization) => (
        <option key={organization._id} value={organization._id}>
          {organization.namaLembaga}
        </option>
      ))}
    </select>
  );
};

export default SelectOrganization;
