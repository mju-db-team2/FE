import React from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, Plus, MoreVertical } from "lucide-react";

const Clubs = () => {
  const clubs = [
    {
      id: 9001,
      name: "FE 스터디",
      leader: "김개발",
      members: 18,
      status: "활성",
      createdAt: "2024-03-01",
    },
    {
      id: 9002,
      name: "알고리즘 동아리",
      leader: "이피엘",
      members: 25,
      status: "활성",
      createdAt: "2024-05-12",
    },
    {
      id: 9003,
      name: "축구 동호회",
      leader: "박피엠",
      members: 16,
      status: "휴면",
      createdAt: "2023-10-05",
    },
    {
      id: 9004,
      name: "AI 리서치",
      leader: "나연구",
      members: 12,
      status: "활성",
      createdAt: "2025-02-10",
    },
  ];
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">동아리 관리</h1>
          <p className="text-gray-500">
            사내 동아리/스터디를 등록하고 구성원을 관리합니다.
          </p>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
          <Plus size={20} />
          <span>신규 동아리</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="동아리명, 리더 검색..."
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
                <th className="px-6 py-3">동아리명</th>
                <th className="px-6 py-3">리더</th>
                <th className="px-6 py-3">인원</th>
                <th className="px-6 py-3">상태</th>
                <th className="px-6 py-3">생성일</th>
                <th className="px-6 py-3 text-right">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {clubs.map((club) => (
                <tr
                  key={club.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/clubs/${club.id}`)}
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {club.name}
                  </td>
                  <td className="px-6 py-4 text-gray-700">{club.leader}</td>
                  <td className="px-6 py-4 text-gray-600">{club.members}명</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        club.status === "활성"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {club.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{club.createdAt}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      className="text-gray-400 hover:text-gray-600"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Clubs;
