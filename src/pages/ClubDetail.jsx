import React, { useMemo, useState } from "react";
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

  // Mock base club info (aligned with list)
  const clubs = useMemo(
    () => [
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
    ],
    []
  );

  const club = clubs.find((c) => c.id === clubId);

  // Mock members (from CLUB_ROLE)
  const membersByClub = useMemo(
    () => ({
      9001: [
        {
          empId: 101,
          name: "김개발",
          role: "동아리장",
          dept: "DX솔루션 1팀",
          phone: "010-1111-1111",
        },
        {
          empId: 102,
          name: "이피엘",
          role: "부원",
          dept: "DX솔루션 1팀",
          phone: "010-2222-2222",
        },
        {
          empId: 103,
          name: "박피엠",
          role: "부원",
          dept: "DX솔루션 1팀",
          phone: "010-3333-3333",
        },
      ],
      9002: [
        {
          empId: 104,
          name: "최엔지",
          role: "동아리장",
          dept: "플랫폼팀",
          phone: "010-4444-4444",
        },
        {
          empId: 105,
          name: "정해커",
          role: "부원",
          dept: "백엔드팀",
          phone: "010-5555-5555",
        },
      ],
      9003: [
        {
          empId: 106,
          name: "오수비",
          role: "동아리장",
          dept: "인프라팀",
          phone: "010-6666-6666",
        },
      ],
      9004: [
        {
          empId: 110,
          name: "나연구",
          role: "동아리장",
          dept: "AI 연구소",
          phone: "010-0101-0101",
        },
        {
          empId: 101,
          name: "김개발",
          role: "부원",
          dept: "DX솔루션 1팀",
          phone: "010-1111-1111",
        },
      ],
    }),
    []
  );

  // Mock activities (from CLUB_ACTIVITY) with participants (ACTIVITY_PARTICIPANT)
  const activitiesByClub = useMemo(
    () => ({
      9001: [
        {
          activityId: 1,
          date: "2025-09-10 19:00",
          location: "세미나실 A",
          summary: "React 상태 관리 비교: Redux vs Zustand",
          status: "완료",
          participants: [101, 102, 103],
        },
        {
          activityId: 2,
          date: "2025-10-03 19:00",
          location: "온라인(Google Meet)",
          summary: "테이블 컴포넌트 접근성 개선 아이디어",
          status: "진행",
          participants: [101, 102],
        },
      ],
      9002: [
        {
          activityId: 3,
          date: "2025-09-01 20:00",
          location: "세미나실 B",
          summary: "DP/Greedy 실전 문제 풀이",
          status: "완료",
          participants: [104, 105],
        },
      ],
      9003: [],
      9004: [
        {
          activityId: 4,
          date: "2025-11-01 18:30",
          location: "연구실 402",
          summary: "LLM Prompt Engineering 실험 공유",
          status: "진행",
          participants: [110, 101],
        },
      ],
    }),
    []
  );

  const members = membersByClub[clubId] ?? [];
  const activities = activitiesByClub[clubId] ?? [];

  const [expandedActivities, setExpandedActivities] = useState({});
  const toggleActivity = (aid) => {
    setExpandedActivities((prev) => ({ ...prev, [aid]: !prev[aid] }));
  };

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
          리더 {club.leader} · 구성원 {members.length}명 · 생성일{" "}
          {club.createdAt}
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
                  <th className="px-6 py-3">부서</th>
                  <th className="px-6 py-3">연락처</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {members.map((m) => (
                  <tr key={m.empId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {m.name}
                    </td>
                    <td className="px-6 py-4 text-gray-700">{m.role}</td>
                    <td className="px-6 py-4 text-gray-600">{m.dept}</td>
                    <td className="px-6 py-4 text-gray-600">{m.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
