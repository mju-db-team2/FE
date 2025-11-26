import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Briefcase, Users, User, ArrowLeft, Loader2 } from "lucide-react";

const ProjectDetail = () => {
  const { id } = useParams();
  const projectId = Number(id);

  const [projectData, setProjectData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjectDetail = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:8080/api/projects/${projectId}/status`);
        if (!response.ok) {
          throw new Error("Failed to fetch project details");
        }
        const data = await response.json();
        setProjectData(data);
      } catch (err) {
        console.error("Error fetching project detail:", err);
        setError("프로젝트 상세 정보를 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    if (projectId) {
      fetchProjectDetail();
    }
  }, [projectId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (error || !projectData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">프로젝트 상세</h1>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 text-red-500">
          {error || "존재하지 않는 프로젝트입니다."}
        </div>
        <Link
          to="/projects"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> 목록으로 돌아가기
        </Link>
      </div>
    );
  }

  const { projectInfo, assignments } = projectData;

  const statusClass =
    projectInfo.status === "PROGRESS"
      ? "bg-blue-100 text-blue-700"
      : projectInfo.status === "END"
        ? "bg-green-100 text-green-700"
        : "bg-yellow-100 text-yellow-700";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/projects"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> 목록으로
          </Link>
        </div>
        <div />
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">{projectInfo.projectName}</h1>
        <div className="mt-2 text-gray-600 text-sm flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1">
            <Briefcase className="w-4 h-4" /> {projectInfo.projectCode}
          </span>
          {/* Client info removed as it's not in API */}
          <span>
            {projectInfo.startDate} ~ {projectInfo.endDate}
          </span>
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${statusClass}`}
          >
            {projectInfo.status}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-gray-500" />
            <h2 className="text-lg font-bold text-gray-900">
              프로젝트 인원 및 역할
            </h2>
          </div>
          <span className="text-sm text-gray-500">총 {assignments.length}명</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
              <tr>
                <th className="px-6 py-3">직원 ID (Developer ID)</th>
                <th className="px-6 py-3">역할 ID (Role ID)</th>
                <th className="px-6 py-3">투입 기간</th>
                <th className="px-6 py-3">참여율</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {assignments.length > 0 ? (
                assignments.map((assign, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {assign.developerId}
                    </td>
                    <td className="px-6 py-4 text-gray-700">{assign.roleId}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {assign.startDate} ~ {assign.endDate}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {(assign.allocation * 100).toFixed(0)}%
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                    배정된 인원이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
