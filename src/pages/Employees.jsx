import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  UserPlus,
  MoreVertical,
  Mail,
  Phone,
  Check,
  Briefcase,
  X,
} from "lucide-react";

const Employees = () => {
  // Mock Data matching EmployeeDetailResponse DTO structure
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

  // Helper maps
  const DEPARTMENTS = { 1: "DX솔루션 1팀", 2: "AI 연구소" };
  const POSITIONS = { 1: "사원", 2: "대리", 3: "과장", 4: "팀장" };
  const STATUSES = { 1: "재직", 2: "휴직", 3: "퇴사" };
  const STATUS_STYLES = {
    1: "bg-green-100 text-green-700",
    2: "bg-yellow-100 text-yellow-700",
    3: "bg-red-100 text-red-700",
  };

  // Extract all unique skills for the filter list
  const allSkills = useMemo(() => {
    const skills = new Set();
    employeesData.forEach((emp) => {
      emp.skills.forEach((s) => skills.add(s.skillName));
    });
    return Array.from(skills).sort();
  }, []);

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]); // Multi-select
  const [minExpYears, setMinExpYears] = useState(0);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Toggle skill selection
  const toggleSkill = (skillName) => {
    setSelectedSkills((prev) =>
      prev.includes(skillName)
        ? prev.filter((s) => s !== skillName)
        : [...prev, skillName]
    );
  };

  // Get color intensity based on experience years (GitHub contribution style)
  // Updated to match "Status" badge aesthetics (rounded-full, font-medium, softer colors)
  const getSkillColorClass = (years) => {
    const baseClasses = "px-2.5 py-1 text-xs font-medium rounded-full border transition-colors";

    if (years >= 10) return `${baseClasses} bg-indigo-100 text-indigo-800 border-indigo-200`; // Expert
    if (years >= 6) return `${baseClasses} bg-blue-100 text-blue-800 border-blue-200`; // Senior
    if (years >= 3) return `${baseClasses} bg-sky-100 text-sky-800 border-sky-200`; // Mid
    if (years >= 1) return `${baseClasses} bg-slate-100 text-slate-700 border-slate-200`; // Junior
    return `${baseClasses} bg-gray-50 text-gray-600 border-gray-100`; // Entry
  };

  // Filtering Logic
  const filteredEmployees = employeesData.filter((emp) => {
    // 1. Basic Search
    const deptName = DEPARTMENTS[emp.deptId] || "";
    const basicMatch =
      emp.employeeName.includes(searchTerm) ||
      deptName.includes(searchTerm) ||
      emp.employeeEmail.includes(searchTerm);

    if (!basicMatch) return false;

    // 2. Skill Filter (AND Condition) & Experience Filter
    if (selectedSkills.length > 0) {
      // Check if employee has ALL selected skills
      const hasAllSkills = selectedSkills.every((selectedSkill) => {
        const empSkill = emp.skills.find(
          (s) => s.skillName === selectedSkill
        );
        // If employee doesn't have the skill, fail
        if (!empSkill) return false;

        // If employee has the skill, check experience requirement
        if (minExpYears > 0 && empSkill.expYears < minExpYears) {
          return false;
        }
        return true;
      });

      if (!hasAllSkills) return false;
    } else {
      // If no skill selected but experience filter is set, check if ANY skill meets criteria
      // (Optional behavior, but logical)
      if (minExpYears > 0) {
        const hasAnySkillWithExp = emp.skills.some(s => s.expYears >= minExpYears);
        if (!hasAnySkillWithExp) return false;
      }
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

            {/* Filter Toggle Button */}
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${isFilterOpen || selectedSkills.length > 0
                  ? "bg-primary-50 border-primary-200 text-primary-700"
                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
            >
              <Filter size={20} />
              <span>기술 필터</span>
              {selectedSkills.length > 0 && (
                <span className="ml-1 px-2 py-0.5 bg-primary-600 text-white text-xs rounded-full">
                  {selectedSkills.length}
                </span>
              )}
            </button>
          </div>

          {/* Expanded Filter Panel */}
          {(isFilterOpen || selectedSkills.length > 0) && (
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-4 animate-in fade-in slide-in-from-top-2">
              {/* Skill Selection */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">보유 기술 선택 (다중 선택 가능)</span>
                  {selectedSkills.length > 0 && (
                    <button
                      onClick={() => setSelectedSkills([])}
                      className="text-xs text-gray-500 hover:text-red-600 flex items-center gap-1"
                    >
                      <X size={12} /> 초기화
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {allSkills.map((skill) => (
                    <button
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      className={`px-3 py-1.5 text-sm rounded-full border transition-all ${selectedSkills.includes(skill)
                          ? "bg-primary-600 text-white border-primary-600 shadow-sm"
                          : "bg-white text-gray-600 border-gray-200 hover:border-primary-300 hover:bg-primary-50"
                        }`}
                    >
                      {skill}
                      {selectedSkills.includes(skill) && <Check size={12} className="inline ml-1" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Experience Slider */}
              <div className="flex items-center gap-4 pt-2 border-t border-gray-200">
                <div className="flex items-center gap-2 text-gray-700 min-w-[100px]">
                  <Briefcase size={18} />
                  <span className="text-sm font-medium">최소 경력</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="1"
                  value={minExpYears}
                  onChange={(e) => setMinExpYears(Number(e.target.value))}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                />
                <span className="text-sm font-bold text-primary-700 min-w-[60px] text-right">
                  {minExpYears}년 +
                </span>
              </div>
            </div>
          )}
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
                      <div className="flex flex-wrap gap-2 max-w-xs">
                        {emp.skills.map((skill) => (
                          <span
                            key={skill.skillId}
                            className={getSkillColorClass(skill.expYears)}
                            title={`${skill.skillName}: ${skill.expYears}년 경력`}
                          >
                            {skill.skillName}
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
