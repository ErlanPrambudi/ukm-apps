import { useEffect, useState } from "react";
import OrganizationCard from "../components/OrganizationCard";
import { useSelector } from "react-redux";

const Organization = () => {
  const [organizations, setOrganizations] = useState([]); // Gabungkan recentorganization dan userorganization
  const { currentUser } = useSelector((state) => state.user);
  const [showMore, setShowMore] = useState(true);

  // Fetch initial organization data on component mount
  useEffect(() => {
    try {
      const fetchOrganizations = async () => {
        const res = await fetch(`/api/organization/getorganizations`);
        const data = await res.json();
        if (res.ok) {
          setOrganizations(data.organizations);
          // Hide "Show more" button if fewer than 9 items are loaded initially
          if (data.organizations.length < 9) {
            setShowMore(false);
          }
        }
      };
      fetchOrganizations();
    } catch (error) {
      console.log(error);
    }
  }, []);

  // Fetch more organization data when "Show more" is clicked
  const handleShowMore = async () => {
    const startIndex = organizations.length;
    try {
      const res = await fetch(`/api/organization/getorganizations?userId=${currentUser._id}&startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setOrganizations((prev) => [...prev, ...data.organizations]);
        // Hide "Show more" if the returned data is less than 9
        if (data.organizations.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7">
      {organizations.length > 0 && (
        <div className="flex flex-col gap-6">
          <h2 className="text-2xl font-semibold text-center">Recent Organization</h2>
          <div className="flex flex-wrap gap-5 mt-5 justify-center">
            {organizations.map((organization) => (
              <OrganizationCard key={organization._id} organization={organization} />
            ))}
          </div>
        </div>
      )}
      {showMore && (
        <button onClick={handleShowMore} className="w-full text-teal-500 self-center text-sm py-7">
          Show more
        </button>
      )}
    </div>
  );
};

export default Organization;
