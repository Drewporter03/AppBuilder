import { ArrowLeftIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate, Link } from "react-router";
import api from "../lib/axios";
import toast from "react-hot-toast";

const CreatePage = () => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleGenerateUI = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) {
      toast.error("Prompt is required");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("portal/capture", {
        description: prompt,
      });
      toast.success("Generated UI mockup!");
      navigate(`/project/${res.data._id}`);
    } catch (error) {
      console.log("Error Generating UI", error);
      toast.error("Failed to generate UI");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Link to={"/"} className="btn btn-ghost mb-6">
            <ArrowLeftIcon className="size-5" />
            Back To Projects.
          </Link>
          <div className="card bg-base-100">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-4">Generate UI Mockup</h2>
              <form onSubmit={handleGenerateUI}>
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">Prompt</span>
                  </label>
                  <textarea
                    placeholder="Describe your app..."
                    className="textarea textarea-bordered h-32"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                </div>
                <div className="card-actions justify-end">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? "Generating..." : "Generate UI"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePage;
