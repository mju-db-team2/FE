import React, { useState } from "react";
import { Search, Filter, Star, FileText } from "lucide-react";

const Evaluations = () => {
  const [activeTab, setActiveTab] = useState("ALL");

  const evaluations = [
    {
      id: 1,
      type: "PM",
      evaluator: "김개발",
      evaluatee: "이피엘",
      date: "2024-07-01",
      score: 9.2,
      comment: "이피엘 과장은 PL로서 팀을 잘 이끌고...",
    },
    {
      id: 3,
      type: "PEER",
      evaluator: "이피엘",
      evaluatee: "김개발",
      date: "2024-07-02",
      score: 9.2,
      comment: "김개발 대리는 기술적으로 배울 점이...",
    },
    {
      id: 5,
      type: "CLIENT",
      evaluator: "고객사(삼성전자)",
      evaluatee: "김개발",
      date: "2024-07-05",
      score: 9.2,
      comment: "프로젝트 관리 능력 탁월",
    },
  ];

  const tabs = [
    { id: "ALL", label: "전체" },
    { id: "PM", label: "PM 평가" },
    { id: "PEER", label: "동료 평가" },
    { id: "CLIENT", label: "고객 평가" },
  ];

  const filteredEvaluations =
    activeTab === "ALL"
      ? evaluations
      : evaluations.filter((e) => e.type === activeTab);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">평가 관리</h1>
          <p className="text-gray-500">
            프로젝트 수행 인력에 대한 평가 내역을 관리합니다.
          </p>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
          <FileText size={20} />
          <span>평가 등록</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4 justify-between bg-gray-50">
          <div className="relative flex-1 max-w-md">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="평가 대상자, 평가자 검색..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
              <Filter size={20} />
              <span>필터</span>
            </button>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredEvaluations.map((evalItem) => (
            <div
              key={evalItem.id}
              className="p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      evalItem.type === "PM"
                        ? "bg-purple-100 text-purple-700"
                        : evalItem.type === "PEER"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {evalItem.type}
                  </span>
                  <span className="text-sm text-gray-500">{evalItem.date}</span>
                </div>
                <div className="flex items-center gap-1 text-yellow-500 font-bold">
                  <Star size={16} fill="currentColor" />
                  <span>{evalItem.score}</span>
                </div>
              </div>

              <div className="mb-2">
                <span className="font-medium text-gray-900">
                  {evalItem.evaluatee}
                </span>
                <span className="text-gray-500 mx-2">←</span>
                <span className="text-gray-600">{evalItem.evaluator}</span>
              </div>

              <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-lg">
                "{evalItem.comment}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Evaluations;
