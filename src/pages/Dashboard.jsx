import React, { useState, useEffect } from "react";
import { Users, Briefcase, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

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
    {/* Trend is not in API yet, hiding or keeping static for now */}
    {/* {trend && (
      <div className="mt-4 flex items-center text-sm">
        <span className={trend > 0 ? "text-green-600" : "text-red-600"}>
          {trend > 0 ? "+" : ""}
          {trend}%
        </span>
        <span className="text-gray-500 ml-2">vs last month</span>
      </div>
    )} */}
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("http://localhost:8080/api/projects/dashboard");
        if (!response.ok) {
          throw new Error("Failed to fetch dashboard stats");
        }
        const data = await response.json();
        setStats(data);
      } catch (err) {
        console.error("Error fetching dashboard:", err);
        setError("대시보드 정보를 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        {error}
      </div>
    );
  }

  // Fallback if data is missing
  const projectCountByStatus = stats?.projectCountByStatus || { PROGRESS: 0, WAIT: 0, END: 0 };
  const totalProjects = stats?.totalProjects || 0;
  const totalDevelopers = stats?.totalDevelopers || 0;

  // Calculate a rough "utilization" or just show total developers
  // Since we don't have utilization % from API, we can just show counts.

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
          value={projectCountByStatus.PROGRESS}
          icon={Briefcase}
          color="bg-blue-500"
        />
        <StatCard
          title="전체 직원"
          value={totalDevelopers}
          icon={Users}
          color="bg-indigo-500"
        />
        <StatCard
          title="종료된 프로젝트"
          value={projectCountByStatus.END}
          icon={CheckCircle}
          color="bg-green-500"
        />
        <StatCard
          title="대기중 프로젝트"
          value={projectCountByStatus.WAIT}
          icon={AlertCircle}
          color="bg-yellow-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            프로젝트 상태 요약
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">진행중 (Progress)</span>
              <span className="font-bold text-blue-600">{projectCountByStatus.PROGRESS}건</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">대기중 (Wait)</span>
              <span className="font-bold text-yellow-600">{projectCountByStatus.WAIT}건</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">종료 (End)</span>
              <span className="font-bold text-green-600">{projectCountByStatus.END}건</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">인력 현황</h2>
          <div className="flex items-center justify-center h-64 text-gray-400">
            <div className="text-center">
              <Users className="w-12 h-12 mx-auto mb-2 opacity-20" />
              <p className="text-lg font-medium text-gray-600">총 {totalDevelopers}명의 개발자</p>
              <p className="text-sm">현재 시스템에 등록된 전체 인원입니다.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
