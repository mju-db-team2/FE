import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Briefcase, Users, User, ArrowLeft, Loader2, UserPlus } from "lucide-react";

// Role ID to Name mapping
const getRoleName = (roleId) => {
  const roleMap = {
    601: "PM",
    602: "PL",
    603: "AA",
    604: "TA",
    605: "DA",
    606: "BA",
    607: "Developer"
  };
  return roleMap[roleId] || `Role ${roleId}`;
};

const ProjectDetail = () => {
  const { id } = useParams();
  const projectId = Number(id);

  const [projectData, setProjectData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statistics, setStatistics] = useState(null);

  // Assignment modal state (must be at top to avoid React Hooks violation)
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    developerId: "",
    roleId: "",
    startDate: "",
    endDate: "",
    allocation: 1.0
  });

  useEffect(() => {
    const fetchProjectDetail = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch Status
        const statusResponse = await fetch(`http://localhost:8080/api/projects/${projectId}/status`);
        if (!statusResponse.ok) throw new Error("Failed to fetch project details");
        const statusData = await statusResponse.json();
        setProjectData(statusData);

        // Fetch Statistics
        const statsResponse = await fetch(`http://localhost:8080/api/projects/${projectId}/statistics`);
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStatistics(statsData);
        }
      } catch (err) {
        console.error("Error fetching project data:", err);
        setError("프로젝트 정보를 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    if (projectId) {
      fetchProjectDetail();
    }
  }, [projectId]);

  const handleAssignDeveloper = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/api/projects/assignments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId: projectId,
          ...newAssignment
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to assign developer");
      }

      // Refresh project data
      const statusResponse = await fetch(`http://localhost:8080/api/projects/${projectId}/status`);
      const statusData = await statusResponse.json();
      setProjectData(statusData);

      // Refresh statistics
      const statsResponse = await fetch(`http://localhost:8080/api/projects/${projectId}/statistics`);
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStatistics(statsData);
      }

      setIsAssignModalOpen(false);
      setNewAssignment({
        developerId: "",
        roleId: "",
        startDate: "",
        endDate: "",
        allocation: 1.0
      });
      alert("직원이 성공적으로 배정되었습니다.");
    } catch (err) {
      console.error("Error assigning developer:", err);
      alert("직원 배정에 실패했습니다.");
    }
  };

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
        <button
          onClick={() => setIsAssignModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <UserPlus size={20} />
          <span>직원 배정</span>
        </button>
      </div>

      {/* Assign Developer Modal */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">프로젝트 인원 배정</h2>
            <form onSubmit={handleAssignDeveloper} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">직원 ID (Developer ID)</label>
                <input
                  type="number"
                  required
                  value={newAssignment.developerId}
                  onChange={(e) => setNewAssignment({ ...newAssignment, developerId: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="예: 1001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">역할 ID (Role ID)</label>
                <input
                  type="number"
                  required
                  value={newAssignment.roleId}
                  onChange={(e) => setNewAssignment({ ...newAssignment, roleId: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="예: 601 (PM), 602 (PL)"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">투입 시작일</label>
                  <input
                    type="date"
                    required
                    value={newAssignment.startDate}
                    onChange={(e) => setNewAssignment({ ...newAssignment, startDate: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">투입 종료일</label>
                  <input
                    type="date"
                    required
                    value={newAssignment.endDate}
                    onChange={(e) => setNewAssignment({ ...newAssignment, endDate: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">참여율 (Allocation 0.0 ~ 1.0)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="1"
                  required
                  value={newAssignment.allocation}
                  onChange={(e) => setNewAssignment({ ...newAssignment, allocation: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setIsAssignModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  배정하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold text-gray-900">{projectInfo.projectName}</h1>
        <div className="mt-2 flex items-center gap-4 text-gray-600">
          <div className="flex items-center gap-1">
            <Briefcase size={16} />
            <span>{projectInfo.projectCode}</span>
          </div>
          {projectInfo.clientName && (
            <div className="flex items-center gap-1">
              <User size={16} />
              <span>발주처: {projectInfo.clientName}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusClass}`}>
              {projectInfo.status}
            </span>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      {statistics && statistics.roleStats && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">역할별 투입 현황</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {statistics.roleStats.map((stat, idx) => {
              const avgAllocation = stat.totalAllocation / stat.headcount;
              return (
                <div key={idx} className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-700">{getRoleName(stat.roleId)}</span>
                    <span className="text-xs bg-white border px-2 py-0.5 rounded-full text-gray-500">
                      {stat.headcount}명
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-primary-600 h-2.5 rounded-full"
                      style={{ width: `${(avgAllocation * 100).toFixed(0)}%` }}
                    ></div>
                  </div>
                  <div className="text-right mt-1 text-xs text-gray-500">
                    평균 참여율: {(avgAllocation * 100).toFixed(1)}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

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
                <th className="px-6 py-3">직원명</th>
                <th className="px-6 py-3">부서/직급</th>
                <th className="px-6 py-3">역할</th>
                <th className="px-6 py-3">투입 기간</th>
                <th className="px-6 py-3">참여율</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {assignments.length > 0 ? (
                assignments.map((assign, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      <div>{assign.developerName || `개발자 ${assign.developerId}`}</div>
                      <div className="text-xs text-gray-500 mt-0.5">ID: {assign.developerId}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      <div>{assign.departmentName || "-"}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{assign.positionName || "-"}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{getRoleName(assign.roleId)}</td>
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
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
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
