import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams, Link } from "react-router";
import api from "../lib/axios";
import { LoaderCircleIcon, ArrowLeftIcon, Trash2Icon } from "lucide-react";

const ProjectDetailPage = () => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await api.get(`portal/${id}`);
        setProject(res.data.project);
      } catch (error) {
        toast.error("Failed To Fetch Project");
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  const handlePromptChange = (e) => {
    setProject((p) => ({ ...p, prompt: e.target.value }));
  };

  const handleTitleChange = (e) => {
    setProject((p) => ({ ...p, title: e.target.value }));
  };

  const handleSave = async () => {
    if (!project) return;
    setSaving(true);
    try {
      const res = await api.put(`portal/${id}`, { title: project.title });
      setProject(res.data);
      toast.success("Title saved");
    } catch (error) {
      console.error("Save title error", error);
      toast.error("Failed to save title");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this project?"))
      return;

    try {
      await api.delete(`/portal/${id}`);
      toast.success("Project deleted");
      navigate("/");
    } catch (error) {
      console.log("Error deleting the project:", error);
      toast.error("Failed to delete project");
    }
  };

  const handleGenerateUI = async () => {
    if (!project) return;
    setGenerating(true);
    try {
      await api.put(`portal/${id}`, { prompt: project.prompt });

      const res = await api.put(`portal/${id}/ui`);
      setProject(res.data);

      toast.success("New UI Mockup Generated!");
    } catch (error) {
      console.error("Generate UI error", error);
      toast.error("Error Generating UI");
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const res = await api.get(`portal/${id}/download`, {
        responseType: "blob",
      });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = "file.html";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error", error);
      toast.error("Failed to download");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <LoaderCircleIcon className="animate-spin size-10" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Link to="/" className="btn btn-ghost">
              <ArrowLeftIcon className="h-5 w-5" />
              Back to Projects
            </Link>
            <button
              onClick={handleDelete}
              className="btn btn-error btn-outline"
            >
              <Trash2Icon className="h-5 w-5" />
              Delete Project
            </button>
          </div>

          <div className="card bg-base-100 mb-6">
            <div className="card-body">
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Title</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  value={project?.title ?? ""}
                  onChange={handleTitleChange}
                />
              </div>

              <div className="card-actions justify-end">
                <button
                  className="btn btn-secondary"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Title"}
                </button>
              </div>

              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Prompt</span>
                </label>
                <textarea
                  className="textarea textarea-bordered h-32"
                  value={project?.prompt ?? ""}
                  onChange={handlePromptChange}
                />
              </div>

              <div className="card-actions justify-end">
                <button
                  className="btn btn-primary"
                  onClick={handleGenerateUI}
                  disabled={generating}
                >
                  {generating ? "Generating..." : "Generate UI Mockup"}
                </button>
              </div>
            </div>
          </div>

          {project && (
            <div className="card bg-base-100 mb-6">
              <div className="card-body">
                <h3>Extracted Requirements</h3>
                <p>
                  <strong>App Name:</strong> {project.appName}
                </p>
                <p>
                  <strong>Entities:</strong> {project.entities?.join(", ")}
                </p>
                <p>
                  <strong>Roles:</strong> {project.roles?.join(", ")}
                </p>
                <p>
                  <strong>Features:</strong> {project.features?.join(", ")}
                </p>

                {project.uiMockup && (
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="mb-0">Generated UI Mockup</h3>
                      <div className="flex gap-2">
                        <button
                          className="btn btn-secondary"
                          onClick={handleDownload}
                          disabled={downloading}
                        >
                          {downloading ? "Downloading..." : "Download HTML"}
                        </button>
                      </div>
                    </div>

                    <iframe
                      title="UI Mockup"
                      srcDoc={project.uiMockup.replace(
                        /href=(["'])\/(?!\/|https?:)([^"'#>]+)(["'])/g,
                        "href=$1#$2$3"
                      )}
                      sandbox=""
                      style={{
                        width: "100%",
                        height: "600px",
                        border: "1px solid #ccc",
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
