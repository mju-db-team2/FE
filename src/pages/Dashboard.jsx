import React from "react";
import { Users, Briefcase, CheckCircle, AlertCircle } from "lucide-react";

const StatCard = ({ title, value, icon: Icon, color, trend }) => (
  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
    {trend && (
      <div className="mt-4 flex items-center text-sm">
        <span className={trend > 0 ? "text-green-600" : "text-red-600"}>
          {trend > 0 ? "+" : ""}
          {trend}%
        </span>
        <span className="text-gray-500 ml-2">vs last month</span>
      </div>
    )}
  </div>
);

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">대시보드</h1>
        <p className="text-gray-500">
          프로젝트 및 인력 현황을 한눈에 확인하세요.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="진행중 프로젝트"
          value="12"
          icon={Briefcase}
          color="bg-blue-500"
          trend={8}
        />
        <StatCard
          title="전체 직원"
          value="100"
          icon={Users}
          color="bg-indigo-500"
          trend={2}
        />
        <StatCard
          title="프로젝트 투입률"
          value="85%"
          icon={CheckCircle}
          color="bg-green-500"
          trend={5}
        />
        <StatCard
          title="이슈 발생"
          value="3"
          icon={AlertCircle}
          color="bg-red-500"
          trend={-12}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            최근 프로젝트 현황
          </h2>
          <div className="space-y-4">
            {[
              {
                name: "삼성전자 차세대 ERP",
                client: "삼성전자",
                status: "PROGRESS",
                progress: 75,
              },
              {
                name: "네이버 AI 검색엔진 개선",
                client: "네이버",
                status: "PROGRESS",
                progress: 45,
              },
              {
                name: "현대차 자율주행 관제",
                client: "현대자동차",
                status: "WAIT",
                progress: 0,
              },
              {
                name: "카카오뱅크 챗봇 개발",
                client: "카카오",
                status: "END",
                progress: 100,
              },
            ].map((project, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <h3 className="font-medium text-gray-900">{project.name}</h3>
                  <p className="text-sm text-gray-500">{project.client}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary-500 rounded-full"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      project.status === "PROGRESS"
                        ? "bg-blue-100 text-blue-700"
                        : project.status === "END"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {project.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">인력 가동률</h2>
          <div className="flex items-center justify-center h-64 text-gray-400">
            {/* Chart placeholder */}
            <div className="text-center">
              <Users className="w-12 h-12 mx-auto mb-2 opacity-20" />
              <p>차트 영역 (Recharts 연동 예정)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
