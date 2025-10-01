import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import ProjectCard from "../components/ProjectCard";
import RateLimitedUI from "../components/RateLimitedUI";
import api from "../lib/axios";
import toast from "react-hot-toast";
import ProjectsNotFound from "../components/ProjectsNotFound";

const HomePage = () => {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchprojects = async () => {
      try {
        const res = await api.get("portal");
        setProjects(res.data);
        setIsRateLimited(false);
      } catch (error) {
        console.log("error fetching projects", error);
        console.log(error);
        if (error.response?.status === 429) {
          setIsRateLimited(true);
        } else {
          toast.error("failed to load projects");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchprojects();
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      {isRateLimited && <RateLimitedUI />}

      <div className="max-w-7xl mx-auto p-4 mt-6">
        {loading && (
          <div className="text-center text-primary py-10">
            loading projects...
          </div>
        )}

        {projects.length === 0 && !isRateLimited && !loading && (
          <ProjectsNotFound />
        )}

        {projects.length > 0 && !isRateLimited && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                setProjects={setProjects}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
