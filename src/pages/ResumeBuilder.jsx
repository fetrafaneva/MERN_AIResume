import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { dummyResumeData } from "../assets/assets";
import {
  ArrowLeftIcon,
  Briefcase,
  FileText,
  FolderIcon,
  GraduationCap,
  User,
} from "lucide-react";
import { useEffect } from "react";

const ResumeBuilder = () => {
  const { resumeId } = useParams();

  const [resumeData, setResumeData] = useState({
    _id: "",
    title: "",
    personal_info: {},
    professional_summary: "",
    experience: [],
    education: [],
    project: [],
    skills: [],
    template: "classic",
    accent_color: "#3B82F6",
    public: false,
  });

  const loadExistingResume = async () => {
    const resume = dummyResumeData.find((resume) => resume._id === resumeId);
    if (resume) {
      setResumeData(resume);
      document.title = resume.title;
    }
  };

  const sections = [
    { id: "personal", name: "Personal Info", icon: User },
    { id: "summary", name: "summary", icon: FileText },
    { id: "experience", name: "Experience", icon: Briefcase },
    { id: "education", name: "Education", icon: GraduationCap },
    { id: "projects", name: "Projects", icon: FolderIcon },
  ];

  useEffect(() => {
    loadExistingResume();
  }, []);

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Link
          to={"/app"}
          className="inline-flex gap-2 items-center text-slate-500 hover:text-slate-700 transition-all"
        >
          <ArrowLeftIcon className="size-4" /> Back to Dashboard
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="grid lg:grid-cols-12 gap-8">
          {/** Left Panel - Form */}
          <div className=""></div>

          {/** Right Panel - Preview */}
          <div className=""></div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
