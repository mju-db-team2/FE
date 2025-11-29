import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Users,
  Calendar,
  MapPin,
  ChevronDown,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";

const ClubDetail = () => {
  const { id } = useParams();
  const clubId = Number(id);

  const formatDateTime = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    const pad = (n) => String(n).padStart(2, "0");
    if (Number.isNaN(d.getTime())) {
      return iso.replace("T", " ").slice(0, 16);
    }
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
      d.getDate()
    )} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const [club, setClub] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activities, setActivities] = useState([]);

  const MEMBERS_PAGE_SIZE = 10;
  const [memberPage, setMemberPage] = useState(1);

  const [expandedActivities, setExpandedActivities] = useState({});
  const toggleActivity = (aid) => {
    setExpandedActivities((prev) => ({ ...prev, [aid]: !prev[aid] }));
  };

  useEffect(() => {
    let aborted = false;
    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`http://localhost:8080/clubs/${clubId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) throw new Error(`서버 오류: ${res.status}`);
        const data = await res.json();
        if (aborted) return;
        const mappedClub = {
          id: data.clubId,
          name: data.clubName,
          leader: data.leaderName,
          membersCount: data.memberCount,
          status: data.clubStatus === "ACTIVE" ? "활성" : "휴면",
          createdAt: (data.createdAt || "").slice(0, 10),
        };
        const mappedMembers = (data.members || []).map((m) => ({
          empId: m.empNo,
          name: m.name,
          role: m.role === "LEADER" ? "동아리장" : "부원",
          dept: m.deptName,
          phone: "-", // API에 번호가 없으므로 기본값
        }));
        const mappedActivities = (data.activities || []).map((a) => {
          const statusLabel =
            a.status === 2 ? "완료" : a.status === 1 ? "진행" : "대기";
          const participants = Array.isArray(a.participants)
            ? a.participants
                .map((p) => (typeof p === "number" ? p : p.empNo))
                .filter((v) => typeof v === "number")
            : [];
          return {
            activityId: a.activityId,
            date: formatDateTime(a.activityDate || a.date),
            location: a.location,
            summary: a.summary,
            status: statusLabel,
            participants,
          };
        });
        setClub(mappedClub);
        setMembers(mappedMembers);
        setActivities(mappedActivities);
      } catch (e) {
        if (!aborted) setError(e.message || "알 수 없는 오류가 발생했습니다.");
      } finally {
        if (!aborted) setLoading(false);
      }
    };
    fetchDetail();
    return () => {
      aborted = true;
    };
  }, [clubId]);

  // 멤버 수가 바뀌면 페이지 보정
  const totalMemberPages = Math.max(
    1,
    Math.ceil(members.length / MEMBERS_PAGE_SIZE)
  );
  useEffect(() => {
    if (memberPage > totalMemberPages) {
      setMemberPage(1);
    }
  }, [members.length, totalMemberPages, memberPage]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 text-center text-gray-600">
          불러오는 중...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 text-center text-red-600">
          상세 정보를 불러오지 못했어요. {error}
        </div>
      </div>
    );
  }

  if (!club) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">동아리 상세</h1>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          존재하지 않는 동아리입니다.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/clubs"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> 목록으로
          </Link>
        </div>
        <div />
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">{club.name}</h1>
        <p className="text-gray-500 mt-1">
          리더 {club.leader} · 구성원 {members.length}명
          {club.createdAt && <> · 생성일 {club.createdAt}</>}
        </p>
        <div className="mt-3">
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              club.status === "활성"
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {club.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-gray-500" />
              <h2 className="text-lg font-bold text-gray-900">가입 멤버</h2>
            </div>
            <span className="text-sm text-gray-500">총 {members.length}명</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3">이름</th>
                  <th className="px-6 py-3">역할</th>
                  <th className="px-6 py-3">부서코드</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {members
                  .slice(
                    (memberPage - 1) * MEMBERS_PAGE_SIZE,
                    memberPage * MEMBERS_PAGE_SIZE
                  )
                  .map((m) => (
                    <tr key={m.empId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {m.name}
                      </td>
                      <td className="px-6 py-4 text-gray-700">{m.role}</td>
                      <td className="px-6 py-4 text-gray-600">{m.dept}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              총 {members.length}명 · {memberPage}/{totalMemberPages}페이지
            </div>
            <div className="flex items-center gap-2">
              <button
                className="px-3 py-1 rounded-lg border border-gray-300 text-sm disabled:opacity-40 bg-white hover:bg-gray-50"
                disabled={memberPage <= 1}
                onClick={() => setMemberPage((p) => Math.max(1, p - 1))}
              >
                이전
              </button>
              <button
                className="px-3 py-1 rounded-lg border border-gray-300 text-sm disabled:opacity-40 bg-white hover:bg-gray-50"
                disabled={memberPage >= totalMemberPages}
                onClick={() =>
                  setMemberPage((p) => Math.min(totalMemberPages, p + 1))
                }
              >
                다음
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-500" />
              <h2 className="text-lg font-bold text-gray-900">활동 내역</h2>
            </div>
            <span className="text-sm text-gray-500">
              총 {activities.length}건
            </span>
          </div>
          <div className="divide-y divide-gray-200">
            {activities.length === 0 && (
              <div className="p-6 text-sm text-gray-500">
                등록된 활동이 없습니다.
              </div>
            )}
            {activities.map((a) => {
              const isOpen = !!expandedActivities[a.activityId];
              const statusClass =
                a.status === "진행"
                  ? "bg-blue-100 text-blue-700"
                  : a.status === "완료"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-700";
              return (
                <div key={a.activityId} className="p-4">
                  <button
                    className="w-full flex items-start justify-between text-left"
                    onClick={() => toggleActivity(a.activityId)}
                  >
                    <div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>{a.date}</span>
                        <span className="mx-1">·</span>
                        <MapPin className="w-4 h-4" />
                        <span>{a.location}</span>
                      </div>
                      <div className="mt-1 font-medium text-gray-900">
                        {a.summary}
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${statusClass}`}
                        >
                          {a.status}
                        </span>
                        <span className="text-xs text-gray-500">
                          참여자 {a.participants.length}명
                        </span>
                      </div>
                    </div>
                    <div className="mt-1 text-gray-400">
                      {isOpen ? (
                        <ChevronDown size={18} />
                      ) : (
                        <ChevronRight size={18} />
                      )}
                    </div>
                  </button>
                  {isOpen && (
                    <div className="mt-3 pl-1">
                      <div className="text-xs text-gray-500 mb-1">참여자</div>
                      <div className="flex flex-wrap gap-2">
                        {a.participants.map((pid) => {
                          const p = members.find((mm) => mm.empId === pid);
                          return (
                            <span
                              key={pid}
                              className="px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs"
                            >
                              {p ? p.name : `EMP ${pid}`}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubDetail;
