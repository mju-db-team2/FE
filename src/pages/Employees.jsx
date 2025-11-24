import React, { useState } from "react";
import {
  Search,
  Filter,
  UserPlus,
  MoreVertical,
  Mail,
  Phone,
  Code,
  Briefcase,
} from "lucide-react";

const Employees = () => {
  // Mock Data matching EmployeeDetailResponse DTO structure
  // Using ID mappings for Dept, Position, Status to simulate real backend data
  const employeesData = [
    {
      empNo: 101,
      employeeName: "김개발",
      deptId: 1,
      positionId: 2,
      statusId: 1,
      employeeEmail: "kim.dev@company.com",
      employeePhone: "010-1111-1111",
      skills: [
        { skillId: 1, skillName: "Java", profLevel: 4, expYears: 5, isPrimary: true },
        { skillId: 2, skillName: "Spring Boot", profLevel: 3, expYears: 3, isPrimary: false },
        { skillId: 3, skillName: "React", profLevel: 2, expYears: 1, isPrimary: false },
      ],
    },
    {
      empNo: 102,
      employeeName: "이피엘",
      deptId: 1,
      positionId: 3,
      statusId: 1,
      employeeEmail: "lee.pl@company.com",
      employeePhone: "010-2222-2222",
      skills: [
        { skillId: 4, skillName: "Python", profLevel: 5, expYears: 7, isPrimary: true },
        { skillId: 5, skillName: "Django", profLevel: 4, expYears: 5, isPrimary: false },
      ],
    },
    {
      empNo: 103,
      employeeName: "박피엠",
      deptId: 1,
      positionId: 4,
      statusId: 1,
      employeeEmail: "park.pm@company.com",
      employeePhone: "010-3333-3333",
      skills: [
        { skillId: 6, skillName: "Project Management", profLevel: 5, expYears: 10, isPrimary: true },
        { skillId: 7, skillName: "JIRA", profLevel: 5, expYears: 8, isPrimary: false },
      ],
    },
    {
      empNo: 107,
      employeeName: "한휴직",
      deptId: 1,
      positionId: 2,
      statusId: 2,
      employeeEmail: "han.leave@company.com",
      employeePhone: "010-7777-7777",
      skills: [
        { skillId: 1, skillName: "Java", profLevel: 3, expYears: 4, isPrimary: true },
      ],
    },
    {
      empNo: 110,
      employeeName: "나연구",
      deptId: 2,
      positionId: 4,
      statusId: 3,
      employeeEmail: "na.rnd@company.com",
      employeePhone: "010-0101-0101",
      skills: [
        { skillId: 4, skillName: "Python", profLevel: 5, expYears: 8, isPrimary: true },
        { skillId: 8, skillName: "TensorFlow", profLevel: 4, expYears: 6, isPrimary: false },
        { skillId: 9, skillName: "PyTorch", profLevel: 4, expYears: 5, isPrimary: false },
      ],
    },
  ];

  // Helper maps for IDs (In a real app, these might come from other APIs)
  const DEPARTMENTS = { 1: "DX솔루션 1팀", 2: "AI 연구소" };
  const POSITIONS = { 1: "사원", 2: "대리", 3: "과장", 4: "팀장" };
  const STATUSES = { 1: "재직", 2: "휴직", 3: "퇴사" };
  const STATUS_STYLES = {
    1: "bg-green-100 text-green-700",
    2: "bg-yellow-100 text-yellow-700",
    3: "bg-red-100 text-red-700",
  };

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [skillFilter, setSkillFilter] = useState("");
  const [minExpYears, setMinExpYears] = useState(0);

  // Filtering Logic
  const filteredEmployees = employeesData.filter((emp) => {
    // 1. Basic Search (Name, Email, Dept Name)
    const deptName = DEPARTMENTS[emp.deptId] || "";
    const basicMatch =
      emp.employeeName.includes(searchTerm) ||
      deptName.includes(searchTerm) ||
      emp.employeeEmail.includes(searchTerm);

    if (!basicMatch) return false;

    // 2. Skill Filter
    if (skillFilter) {
      const hasSkill = emp.skills.some((skill) =>
        skill.skillName.toLowerCase().includes(skillFilter.toLowerCase())
      );
      if (!hasSkill) return false;
    }

    // 3. Experience Filter
    if (minExpYears > 0) {
      const qualifyingSkills = emp.skills.filter((skill) => {
        // If skill filter is active, only consider matching skills
        if (skillFilter) {
          return skill.skillName.toLowerCase().includes(skillFilter.toLowerCase());
        }
        return true;
      });

      const hasEnoughExp = qualifyingSkills.some((skill) => skill.expYears >= minExpYears);
      if (!hasEnoughExp) return false;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">인력 관리</h1>
          <p className="text-gray-500">직원 목록 및 상세 정보를 관리합니다.</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
          <UserPlus size={20} />
          <span>직원 등록</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Filter Section */}
        <div className="p-4 border-b border-gray-200 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            {/* Basic Search */}
            <div className="relative flex-1 max-w-md">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="이름, 부서 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Skill Filter */}
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <div className="relative flex-1">
                <Code
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="기술 스택 (예: Java)"
                  value={skillFilter}
                  onChange={(e) => setSkillFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
          </div>

          {/* Experience Slider */}
          <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
            <div className="flex items-center gap-2 text-gray-700 min-w-[100px]">
              <Briefcase size={18} />
              <span className="text-sm font-medium">최소 경력</span>
            </div>
            <input
              type="range"
              min="0"
              max="15"
              step="1"
              value={minExpYears}
              onChange={(e) => setMinExpYears(Number(e.target.value))}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
            />
            <span className="text-sm font-bold text-primary-700 min-w-[60px] text-right">
              {minExpYears}년 이상
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
              <tr>
                <th className="px-6 py-3">이름</th>
                <th className="px-6 py-3">부서/직급</th>
                <th className="px-6 py-3">보유 기술 (Skills)</th>
                <th className="px-6 py-3">연락처</th>
                <th className="px-6 py-3">상태</th>
                <th className="px-6 py-3 text-right">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((emp) => (
                  <tr key={emp.empNo} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-xs">
                          {emp.employeeName[0]}
                        </div>
                        <span className="font-medium text-gray-900">
                          {emp.employeeName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <div className="flex flex-col">
                        <span className="text-gray-900 font-medium">{DEPARTMENTS[emp.deptId]}</span>
                        <span className="text-xs">{POSITIONS[emp.positionId]}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {emp.skills.map((skill) => (
                          <span
                            key={skill.skillId}
                            className={`px-2 py-0.5 text-xs rounded-full border ${skill.isPrimary
                                ? "bg-primary-50 text-primary-700 border-primary-200 font-medium"
                                : "bg-gray-50 text-gray-600 border-gray-200"
                              }`}
                          >
                            {skill.skillName} <span className="text-[10px] opacity-75">({skill.expYears}년)</span>
                          </span>
                        ))}
                        {emp.skills.length === 0 && (
                          <span className="text-gray-400 text-xs">-</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-xs">
                          <Mail size={12} /> {emp.employeeEmail}
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <Phone size={12} /> {emp.employeePhone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${STATUS_STYLES[emp.statusId] || "bg-gray-100 text-gray-700"
                          }`}
                      >
                        {STATUSES[emp.statusId] || "미정"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreVertical size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    검색 조건에 맞는 직원이 없습니다.
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

export default Employees;
