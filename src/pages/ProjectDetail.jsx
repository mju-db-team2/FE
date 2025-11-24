import React, { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Briefcase, Users, User, ArrowLeft } from "lucide-react";

const ProjectDetail = () => {
  const { id } = useParams();
  const projectId = Number(id);

  const projects = useMemo(
    () => [
      {
        id: 5001,
        code: "PJT-2024-001",
        name: "삼성전자 물류 시스템 고도화",
        client: "삼성전자",
        start: "2024-01-01",
        end: "2024-06-30",
        status: "END",
      },
      {
        id: 5002,
        code: "PJT-2024-002",
        name: "카카오페이 연동 모듈",
        client: "카카오",
        start: "2024-03-01",
        end: "2024-08-31",
        status: "END",
      },
      {
        id: 5005,
        code: "PJT-2025-001",
        name: "네이버 클라우드 마이그레이션",
        client: "네이버",
        start: "2025-01-01",
        end: "2025-06-30",
        status: "PROGRESS",
      },
      {
        id: 5006,
        code: "PJT-2025-002",
        name: "삼성전자 차세대 ERP",
        client: "삼성전자",
        start: "2025-02-01",
        end: "2025-08-31",
        status: "PROGRESS",
      },
      {
        id: 5010,
        code: "PJT-2025-006",
        name: "SK 하이닉스 수율예측 시스템",
        client: "SK 하이닉스",
        start: "2025-07-01",
        end: "2025-12-31",
        status: "WAIT",
      },
    ],
    []
  );

  const teamByProject = useMemo(
    () => ({
      5001: [
        { name: "박피엠", role: "PM" },
        { name: "이피엘", role: "PL" },
        { name: "김개발", role: "FE" },
        { name: "정해커", role: "BE" },
      ],
      5002: [
        { name: "이피엘", role: "PM" },
        { name: "최엔지", role: "FE" },
        { name: "한백엔", role: "BE" },
      ],
      5005: [
        { name: "박피엠", role: "PM" },
        { name: "김개발", role: "FE" },
        { name: "정해커", role: "BE" },
        { name: "나연구", role: "AI" },
      ],
      5006: [
        { name: "오수비", role: "PM" },
        { name: "이피엘", role: "PL" },
        { name: "김개발", role: "FE" },
        { name: "한백엔", role: "BE" },
      ],
      5010: [
        { name: "박피엠", role: "PM" },
        { name: "정해커", role: "BE" },
        { name: "나연구", role: "AI" },
      ],
    }),
    []
  );

  const project = projects.find((p) => p.id === projectId);
  const team = teamByProject[projectId] ?? [];

  if (!project) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">프로젝트 상세</h1>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          존재하지 않는 프로젝트입니다.
        </div>
      </div>
    );
  }

  const statusClass =
    project.status === "PROGRESS"
      ? "bg-blue-100 text-blue-700"
      : project.status === "END"
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
        <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
        <div className="mt-2 text-gray-600 text-sm flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1">
            <Briefcase className="w-4 h-4" /> {project.code}
          </span>
          <span className="inline-flex items-center gap-1">
            <User className="w-4 h-4" /> 발주처 {project.client}
          </span>
          <span>
            {project.start} ~ {project.end}
          </span>
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${statusClass}`}
          >
            {project.status}
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
          <span className="text-sm text-gray-500">총 {team.length}명</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
              <tr>
                <th className="px-6 py-3">이름</th>
                <th className="px-6 py-3">역할</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {team.map((m, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {m.name}
                  </td>
                  <td className="px-6 py-4 text-gray-700">{m.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
