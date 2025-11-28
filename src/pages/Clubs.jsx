import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, Plus, MoreVertical } from "lucide-react";

const Clubs = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let aborted = false;
    const fetchClubs = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("http://localhost:8080/clubs", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) {
          throw new Error(`서버 오류: ${res.status}`);
        }
        const data = await res.json();
        if (aborted) return;
        // 서버 응답 -> 화면 모델 매핑
        const mapped = (Array.isArray(data) ? data : []).map((d) => ({
          id: d.clubId,
          name: d.clubName,
          leader: d.leaderName,
          members: d.memberCount,
          status: d.clubStatus === "ACTIVE" ? "활성" : "휴면",
          createdAt: (d.createdAt || "").slice(0, 10),
        }));
        setClubs(mapped);
      } catch (e) {
        if (!aborted) setError(e.message || "알 수 없는 오류가 발생했습니다.");
      } finally {
        if (!aborted) setLoading(false);
      }
    };
    fetchClubs();
    return () => {
      aborted = true;
    };
  }, []);

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
          {loading ? (
            <div className="p-6 text-center text-gray-600">불러오는 중...</div>
          ) : error ? (
            <div className="p-6 text-center text-red-600">
              목록을 불러오지 못했어요. {error}
            </div>
          ) : clubs.length === 0 ? (
            <div className="p-6 text-center text-gray-600">
              데이터가 없습니다.
            </div>
          ) : (
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
                    <td className="px-6 py-4 text-gray-600">
                      {club.members}명
                    </td>
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
                    <td className="px-6 py-4 text-gray-600">
                      {club.createdAt}
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
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Clubs;
