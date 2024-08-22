import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button, Spinner } from "flowbite-react";
import CallToAction from "../components/CallToAction";
import CommentSection from "../components/CommentSection";
import PostCard from "../components/PostCard";
import OrganizationCard from "../components/OrganizationCard";

const OrganizationPage = () => {
  const { organizationSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [organization, setOrganization] = useState(null);
  const [recentOrganization, setRecentOrganization] = useState(null);

  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/organization/getorganizations?slug=${organizationSlug}`);
        const data = await res.json();
        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }
        if (res.ok) {
          setOrganization(data.organizations[0]);
          setLoading(false);
          setError(false);
        }
      } catch (error) {
        setLoading(false);
        setError(true);
      }
    };
    fetchOrganization();
  }, [organizationSlug]);

  useEffect(() => {
    try {
      const fetchRecentOrganization = async () => {
        const res = await fetch(`/api/organization/getorganizations?limit=3`);
        const data = await res.json();
        if (res.ok) {
          setRecentOrganization(data.organizations);
        }
      };
      fetchRecentOrganization();
    } catch (error) {
      console.log(error.message);
    }
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );

  return (
    <main className="p-3 flex flex-col max-w6xl mx-auto min-h-screen">
      <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">{organization && organization.namaLembaga}</h1>

      <div className=" mx-auto w-full max-w-2xl">
        <div className="flex items-center justify-center h-screen p-4">
          <img src={organization && organization.image} alt={organization && organization.namaLembaga} className="w-[80vw] max-w-[500px] h-[80vw] max-h-[500px] object-cover rounded-full" />
        </div>
        <div className="flex justify-between items-center border-b border-slate-500 mx-auto w-full max-w-2xl text-xs p-2">
          <span>{organization && new Date(organization.createdAt).toLocaleDateString()}</span>
          <span className="italic">{organization && (organization.content.length / 1000).toFixed(0)} mins read</span>
        </div>
        <div className="border border-lime-500 rounded-lg p-4 mx-auto max-w-3xl mt-2">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center border border-lime-500 rounded-lg p-4">
              <label className="font-bold text-2xl w-full sm:w-1/4 lg:text-2xl text-left">DPO</label>
              <div className="flex flex-col w-full sm:w-3/4">
                <h5 className="text-2xl lg:text-2xl font-semibold text-left sm:text-center">{organization && organization.dpo}</h5>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center border border-lime-500 rounded-lg p-4">
              <label className="font-bold text-2xl w-full sm:w-1/4 lg:text-2xl text-left">Ketua</label>
              <div className="flex flex-col w-full sm:w-3/4">
                <h5 className="text-2xl lg:text-2xl font-semibold text-left sm:text-center">{organization && organization.ketua}</h5>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center border border-lime-500 rounded-lg p-4">
              <label className="font-bold text-2xl w-full sm:w-1/4 lg:text-2xl text-left">Wakil</label>
              <div className="flex flex-col w-full sm:w-3/4">
                <h5 className="text-2xl lg:text-2xl font-semibold text-left sm:text-center">{organization && organization.wakil}</h5>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center border border-lime-500 rounded-lg p-4">
              <label className="font-bold text-2xl w-full sm:w-1/4 lg:text-2xl text-left">Sekretaris</label>
              <div className="flex flex-col w-full sm:w-3/4">
                <h5 className="text-2xl lg:text-2xl font-semibold text-left sm:text-center">{organization && organization.sekretaris}</h5>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center border border-lime-500 rounded-lg p-4">
              <label className="font-bold text-2xl w-full sm:w-1/4 lg:text-2xl text-left">Bendahara</label>
              <div className="flex flex-col w-full sm:w-3/4">
                <h5 className="text-2xl lg:text-2xl font-semibold text-left sm:text-center">{organization && organization.bendahara}</h5>
              </div>
            </div>
          </div>
        </div>

        <div className="p-10 mx-w-2xl mx-auto w-full post-content" dangerouslySetInnerHTML={{ __html: organization && organization.content }}></div>
        <div className="max-w-4xl mx-auto w-full">
          <CallToAction />
        </div>
        {organization && <CommentSection organizationId={organization._id} />}
      </div>
      <div className="flex flex-col justify-center items-center mb-5">
        <h1 className="text-xl mt-5">Recent organization</h1>

        <div className="flex flex-wrap gap-5 mt-5 justify-center">{recentOrganization && recentOrganization.map((organization) => <OrganizationCard key={organization._id} organization={organization} />)}</div>
      </div>
    </main>
  );
};

export default OrganizationPage;
