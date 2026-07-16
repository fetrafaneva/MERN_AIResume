import {
  FilePenLineIcon,
  LoaderCircleIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  UploadCloud,
  UploadCloudIcon,
  XIcon,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import api from "../configs/api";
import toast from "react-hot-toast";
import pdfToText from "react-pdftotext";
import { login } from "../app/features/authSlice";
import ActivationNoticeModal from "../components/ActivationNoticeModal";

const Dashboard = () => {
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const colors = ["#9333ea", "#d97706", "#dc2626", "#0284c7", "#16a34a"];
  const [allResumes, setAllResumes] = useState([]);
  const [showCreateResume, setShowCreateResume] = useState(false);
  const [showUploadResume, setShowUploadResume] = useState(false);
  const [title, setTitle] = useState("");
  const [resume, setResume] = useState(null);
  const [editResumeId, setEditResumeId] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoadingResumes, setIsLoadingResumes] = useState(true);

  const [activationNotice, setActivationNotice] = useState(
    user?.activationNotice || null
  );

  const navigate = useNavigate();

  const loadAllResumes = async () => {
    setIsLoadingResumes(true);
    try {
      const { data } = await api.get(
        "/api/users/resumes",

        { headers: { Authorization: token } }
      );
      setAllResumes(data.resumes);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setIsLoadingResumes(false);
    }
  };

  const createResume = async (event) => {
    event.preventDefault();
    setIsCreating(true);
    try {
      const { data } = await api.post(
        "/api/resumes/create",
        { title },
        { headers: { Authorization: token } }
      );
      setAllResumes([...allResumes, data.resume]);
      setTitle("");
      setShowCreateResume(false);
      navigate(`/app/builder/${data.resume._id}`);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setIsCreating(false);
    }
  };

  const uploadResume = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const resumeText = await pdfToText(resume);
      const { data } = await api.post(
        "/api/ai/upload-resume",
        { title, resumeText },
        { headers: { Authorization: token } }
      );
      setTitle("");
      setResume(null);
      setShowUploadResume(false);
      navigate(`/app/builder/${data.resumeId}`);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
    setIsLoading(false);
  };

  const editTitle = async (event) => {
    try {
      event.preventDefault();
      const { data } = await api.put(
        `/api/resumes/update`,
        { resumeId: editResumeId, resumeData: { title } },
        {
          headers: { Authorization: token },
        }
      );
      setAllResumes(
        allResumes.map((resume) =>
          resume._id === editResumeId ? { ...resume, title } : resume
        )
      );
      setTitle("");
      setEditResumeId("");
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  const deleteResume = async (resumeId) => {
    try {
      const confirm = window.confirm(
        "Are you sure you want to delete this resume ?"
      );
      if (confirm) {
        const { data } = await api.delete(`/api/resumes/delete/${resumeId}`, {
          headers: { Authorization: token },
        });
        setAllResumes(allResumes.filter((resume) => resume._id !== resumeId));
        toast.success(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  const dismissNotice = async () => {
    try {
      const { data } = await api.post(
        "/api/users/dismiss-activation-notice",
        {},
        { headers: { Authorization: token } }
      );
      dispatch(login({ token, user: data.user }));
      setActivationNotice(null);
    } catch (error) {
      setActivationNotice(null); // on ferme quand même côté visuel
    }
  };

  useEffect(() => {
    loadAllResumes();
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50">
      {/* Background décoratif */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#f8fafc,#f1f5f9)]"></div>
        <div className="absolute top-[-10%] right-[-5%] size-96 rounded-full bg-amber-200/30 blur-[100px]"></div>
        <div className="absolute bottom-[-10%] left-[-5%] size-96 rounded-full bg-yellow-100/40 blur-[100px]"></div>
        <div
          className="absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #cbd5e1 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        ></div>
      </div>

      <div className=" max-w-7xl mx-auto px-4 py-8">
        <p className=" text-2xl font-medium mb-6 bg-gradient-to-r from-slate-600 to-slate-700 bg-clip-text text-transparent sm:hidden">
          Welcome, Claire
        </p>

        <div className="flex gap-4">
          <button
            onClick={() => setShowCreateResume(true)}
            className="w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-indigo-500 hover:shadow-lg transition-all duration-300 cursor-pointer"
          >
            <PlusIcon className=" size-11 transition-all duration-300 p-2.5 bg-gradient-to-br from-indigo-300 to-indigo-500 text-white rounded-full" />
            <p className=" text-sm group-hover:text-indigo-600 transition-all duration-300">
              Create Resume
            </p>
          </button>

          <button
            onClick={() => setShowUploadResume(true)}
            className="w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-purple-500 hover:shadow-lg transition-all duration-300 cursor-pointer"
          >
            <UploadCloudIcon className=" size-11 transition-all duration-300 p-2.5 bg-gradient-to-br from-purple-300 to-purple-500 text-white rounded-full" />
            <p className=" text-sm group-hover:text-purple-600 transition-all duration-300">
              Upload Existing
            </p>
          </button>
        </div>

        <hr className=" border-slate-300 my-6 sm:w-[305px]" />

        <div className="grid grid-cols-2 sm:flex flex-wrap gap-4">
          {isLoadingResumes
            ? Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="w-full sm:max-w-36 h-48 rounded-lg bg-slate-200/70 animate-pulse"
                />
              ))
            : allResumes.map((resume, index) => {
                const baseColor = colors[index % colors.length];
                return (
                  <button
                    onClick={() => navigate(`/app/builder/${resume._id}`)}
                    key={index}
                    className=" relative w-full sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 border group hover:shadow-lg transition-all duration-300 cursor-pointer"
                    style={{
                      background: `linear-gradient(135deg, ${baseColor}10, ${baseColor}40)`,
                      borderColor: baseColor + "40",
                    }}
                  >
                    <FilePenLineIcon
                      className=" size-7 group-hover:scale-105 transition-all"
                      style={{ color: baseColor }}
                    />
                    <p
                      className=" text-sm group-hover:scale-105 transition-all px-2 text-center"
                      style={{ color: baseColor }}
                    >
                      {resume.title}
                    </p>

                    <p
                      className=" absolute bottom-1 text-[11px] text-slate-400 group-hover:text-slate-500 transition-all duration-300 px-2 text-center"
                      style={{ color: baseColor + "90" }}
                    >
                      Updated on{" "}
                      {new Date(resume.updatedAt).toLocaleDateString()}
                    </p>

                    <div
                      onClick={(e) => e.stopPropagation()}
                      className=" absolute top-1 right-1 group-hover:flex items-center hidden"
                    >
                      <TrashIcon
                        onClick={() => deleteResume(resume._id)}
                        className=" size-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors"
                      />
                      <PencilIcon
                        onClick={() => {
                          setEditResumeId(resume._id);
                          setTitle(resume.title);
                        }}
                        className=" size-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors"
                      />
                    </div>
                  </button>
                );
              })}
        </div>

        {!isLoadingResumes && allResumes.length === 0 && (
          <p className="text-sm text-slate-400 mt-2">
            Vous n'avez pas encore de CV. Créez-en un pour commencer !
          </p>
        )}

        {showCreateResume && (
          <form
            onSubmit={createResume}
            onClick={() => !isCreating && setShowCreateResume(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className=" relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6"
            >
              <h2 className=" text-xl font-bold mb-4">Create a Resume</h2>
              <input
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                type="text"
                placeholder="Enter resume title"
                className=" w-full px-4 py-2 mb-4 focus:border-green-600 ring-green-600"
                required
                disabled={isCreating}
              />

              <button
                disabled={isCreating}
                className=" w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isCreating && (
                  <LoaderCircleIcon className=" animate-spin size-4 text-white" />
                )}
                {isCreating ? "Creating..." : "Create Resume"}
              </button>
              <XIcon
                className={`absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors ${
                  isCreating
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
                onClick={() => {
                  if (isCreating) return;
                  setShowCreateResume(false);
                  setTitle("");
                }}
              />
            </div>
          </form>
        )}

        {showUploadResume && (
          <form
            onSubmit={uploadResume}
            onClick={() => setShowUploadResume(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className=" relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6"
            >
              <h2 className=" text-xl font-bold mb-4">Upload Resume</h2>
              <input
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                type="text"
                placeholder="Enter resume title"
                className=" w-full px-4 py-2 mb-4 focus:border-green-600 ring-green-600"
                required
              />

              <div>
                <label
                  htmlFor="resume-input"
                  className="block text-sm text-slate-700"
                >
                  Select resume file
                  <div className="flex flex-col items-center justify-center gap-2 border group text-slate-400 border-slate-400 border-dashed rounded-md p-4 py-10 my-4 hover:border-green-500 hover:text-green-700 cursor-pointer transition-colors">
                    {resume ? (
                      <p className=" text-green-700">{resume.name}</p>
                    ) : (
                      <>
                        <UploadCloud className="size-14 stroke-1" />
                        <p>Upload resume</p>
                      </>
                    )}
                  </div>
                </label>

                <input
                  type="file"
                  id="resume-input"
                  accept=".pdf"
                  hidden
                  onChange={(e) => setResume(e.target.files[0])}
                />
              </div>

              <button
                disabled={isLoading}
                className=" w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                {isLoading && (
                  <LoaderCircleIcon className=" animate-spin size-4 text-white" />
                )}
                {isLoading ? "Uploading..." : "Upload Resume"}
              </button>
              <XIcon
                className=" absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
                onClick={() => {
                  setShowUploadResume(false);
                  setTitle("");
                }}
              />
            </div>
          </form>
        )}

        {editResumeId && (
          <form
            onSubmit={editTitle}
            onClick={() => setEditResumeId("")}
            className="fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className=" relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6"
            >
              <h2 className=" text-xl font-bold mb-4">Edit Resume Title</h2>
              <input
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                type="text"
                placeholder="Enter resume title"
                className=" w-full px-4 py-2 mb-4 focus:border-green-600 ring-green-600"
                required
              />

              <button className=" w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
                Update
              </button>
              <XIcon
                className=" absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
                onClick={() => {
                  setEditResumeId("");
                  setTitle("");
                }}
              />
            </div>
          </form>
        )}

        <ActivationNoticeModal
          notice={activationNotice}
          onClose={dismissNotice}
        />
      </div>
    </div>
  );
};

export default Dashboard;
