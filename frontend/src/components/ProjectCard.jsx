import { PenSquareIcon, Trash2Icon } from "lucide-react";
import { Link } from "react-router";
import { formatDate } from "../lib/utils";
import api from "../lib/axios";
import toast from "react-hot-toast";

const ProjectCard = ({ project, setProjects }) => {
  const handleDelete = async (e, id) => {
    e.preventDefault();
    if (!window.confirm("Are you sure you want to delete this project?"))
      return;
    try {
      await api.delete(`portal/${id}`);
      toast.success("Project Deleted Successfully");
      setProjects((prev) => prev.filter((p) => p._id !== id));
    } catch (error) {
      toast.error("Failed To Delete The Note");
      console.log(error);
    }
  };

  return (
    <Link
      to={`/project/${project._id}`}
      className="card bg-base-100 hover:shadow-lg transition-all duration-200 border-t-4 border-solid border-[#d07957]"
    >
      <div className="card-body">
        <h3 className="card-title text-base-content">{project.title}</h3>
        <p className="text-base-content/70 line-clamp-3">{project.prompt}</p>
        <div className="card-actions justify-between items-center mt-4">
          <span className="text-sm text-base-content/60">
            {formatDate(new Date(project.createdAt))}
          </span>
          <div className="flex items-center gap-1">
            <button
              className="btn btn-ghost btn-xs text-error"
              onClick={(e) => handleDelete(e, project._id)}
            >
              <Trash2Icon className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;
