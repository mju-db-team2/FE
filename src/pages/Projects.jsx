import React, { useMemo, useState, useEffect } from "react";
import { Search, Filter, Plus, MoreVertical, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Projects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState("ALL");
  const [isInitialView, setIsInitialView] = useState(true);

  const tabs = useMemo(
    () => [
      { id: "ALL", label: "전체" },
      { id: "PROGRESS", label: "진행" },
      { id: "WAIT", label: "대기" },
      { id: "END", label: "종료" },
    ],
    []
  );

  // Fetch Projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("http://localhost:8080/api/projects");
        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }
        const data = await response.json();
        setProjects(data);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError("프로젝트 목록을 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const filteredProjects = useMemo(() => {
    if (activeTab === "ALL") return projects;
    return projects.filter((p) => p.status === activeTab);
  }, [projects, activeTab]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    clientId: 201, // Default client ID as we don't have a client list API
    projectCode: "",
    projectName: "",
    startDate: "",
    endDate: "",
    status: "WAIT"
  });

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProject),
      });

      if (!response.ok) {
        throw new Error("Failed to create project");
      }

      // Refresh project list
      await fetchProjects();
      setIsCreateModalOpen(false);
      // Reset form
      setNewProject({
        clientId: 201,
        projectCode: "",
        projectName: "",
        startDate: "",
        endDate: "",
        status: "WAIT"
      });
      alert("프로젝트가 성공적으로 생성되었습니다.");
    } catch (err) {
      console.error("Error creating project:", err);
      alert("프로젝트 생성에 실패했습니다.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">프로젝트 관리</h1>
          <p className="text-gray-500">진행 중인 프로젝트 현황을 모니터링합니다.</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus size={20} />
          <span>신규 프로젝트</span>
        </button>
      </div>

      {/* Create Project Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">신규 프로젝트 생성</h2>
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">프로젝트 코드</label>
                <input
                  type="text"
                  required
                  value={newProject.projectCode}
                  onChange={(e) => setNewProject({ ...newProject, projectCode: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="PRJ-XXX-000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">프로젝트명</label>
                <input
                  type="text"
                  required
                  value={newProject.projectName}
                  onChange={(e) => setNewProject({ ...newProject, projectName: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="프로젝트 이름"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">시작일</label>
                  <input
                    type="date"
                    required
                    value={newProject.startDate}
                    onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">종료일</label>
                  <input
                    type="date"
                    required
                    value={newProject.endDate}
                    onChange={(e) => setNewProject({ ...newProject, endDate: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">상태</label>
                <select
                  value={newProject.status}
                  onChange={(e) => setNewProject({ ...newProject, status: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="WAIT">대기 (WAIT)</option>
                  <option value="PROGRESS">진행 (PROGRESS)</option>
                  <option value="END">종료 (END)</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  생성하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsInitialView(false);
                }}
                className={`px-6 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.id
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="프로젝트명 검색..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
              <Filter size={20} />
              <span>필터</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
              <tr>
                <th className="px-6 py-3">프로젝트 코드</th>
                <th className="px-6 py-3">프로젝트명</th>
                <th className="px-6 py-3">발주처</th>
                <th className="px-6 py-3">기간</th>
                <th className="px-6 py-3">상태</th>
                <th className="px-6 py-3 text-right">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
                      <span>프로젝트 목록을 불러오는 중입니다...</span>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-red-500">
                    {error}
                  </td>
                </tr>
              ) : filteredProjects.length > 0 ? (
                filteredProjects.map((project) => {
                  const displayEnd =
                    isInitialView && project.status !== "END"
                      ? "현재"
                      : project.endDate; // API field is endDate
                  const statusClass =
                    project.status === "PROGRESS"
                      ? "bg-blue-100 text-blue-700"
                      : project.status === "END"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700";
                  return (
                    <tr
                      key={project.projectId} // API field is projectId
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => navigate(`/projects/${project.projectId}`)}
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {project.projectCode}
                      </td>
                      <td className="px-6 py-4 text-gray-900">{project.projectName}</td>
                      <td className="px-6 py-4 text-gray-600">{project.clientName || "-"}</td>
                      <td className="px-6 py-4 text-gray-600">
                        {project.startDate} ~ {displayEnd}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${statusClass}`}
                        >
                          {project.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          className="text-gray-400 hover:text-gray-600"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical size={20} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    등록된 프로젝트가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-gray-200 flex items-center justify-between text-sm text-gray-500">
          <span>Showing {filteredProjects.length} entries</span>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50"
              disabled
            >
              Previous
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;
