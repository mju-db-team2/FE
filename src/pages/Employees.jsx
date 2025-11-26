import React, { useState, useMemo, useEffect } from "react";
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
  Loader2,
} from "lucide-react";

const Employees = () => {
  // State for API data
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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
    // Add default skills to ensure filter options exist even if employee list is empty or filtered out
    ["Java", "Python", "Spring Boot", "React", "MySQL", "JPA", "AWS", "Oracle", "JavaScript"].forEach(s => skills.add(s));

    employees.forEach((emp) => {
      emp.skills.forEach((s) => skills.add(s.skillName));
    });
    return Array.from(skills).sort();
  }, [employees]);

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]); // Multi-select
  const [minExpYears, setMinExpYears] = useState(0);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Fetch Employees from API
  const fetchEmployees = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // API call to local server
      const response = await fetch("http://localhost:8080/employees/filter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          skillNames: selectedSkills.length > 0 ? selectedSkills : [],
          minExpYears: minExpYears,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch employees");
      }

      const data = await response.json();
      setEmployees(data);
    } catch (err) {
      console.error("Error fetching employees:", err);
      setError("데이터를 불러오는데 실패했습니다. 서버 상태를 확인해주세요.");
      setEmployees([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load and filter change effect
  useEffect(() => {
    fetchEmployees();
  }, [selectedSkills, minExpYears]);

  // Toggle skill selection
  const toggleSkill = (skillName) => {
    setSelectedSkills((prev) =>
      prev.includes(skillName)
        ? prev.filter((s) => s !== skillName)
        : [...prev, skillName]
    );
  };

  // Get color intensity based on experience years (GitHub contribution style)
  const getSkillColorClass = (years) => {
    const baseClasses = "px-2.5 py-1 text-xs font-medium rounded-full border transition-colors";

    if (years >= 10) return `${baseClasses} bg-indigo-100 text-indigo-800 border-indigo-200`; // Expert
    if (years >= 6) return `${baseClasses} bg-blue-100 text-blue-800 border-blue-200`; // Senior
    if (years >= 3) return `${baseClasses} bg-sky-100 text-sky-800 border-sky-200`; // Mid
    if (years >= 1) return `${baseClasses} bg-slate-100 text-slate-700 border-slate-200`; // Junior
    return `${baseClasses} bg-gray-50 text-gray-600 border-gray-100`; // Entry
  };

  // Client-side filtering for Search Term (Name, Dept, Email)
  // The API handles skills and experience, but basic search is often client-side for speed
  // or can be added to API if supported. Here we filter the *result* from API.
  const filteredEmployees = employees.filter((emp) => {
    const deptName = DEPARTMENTS[emp.deptId] || "";
    const basicMatch =
      emp.employeeName.includes(searchTerm) ||
      deptName.includes(searchTerm) ||
      emp.employeeEmail.includes(searchTerm);

    return basicMatch;
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
                <div className="flex-1 relative h-6 flex items-center">
                  <div
                    className="absolute w-full h-2 rounded-lg bg-gradient-to-r from-gray-200 via-primary-300 to-indigo-600"
                  ></div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="1"
                    value={minExpYears}
                    onChange={(e) => setMinExpYears(Number(e.target.value))}
                    className="w-full absolute h-2 opacity-0 cursor-pointer z-10"
                  />
                  <div
                    className="absolute h-4 w-4 bg-white border-2 border-primary-600 rounded-full shadow-md pointer-events-none transition-all"
                    style={{ left: `${(minExpYears / 10) * 100}%`, transform: `translateX(-${(minExpYears / 10) * 100}%)` }}
                  ></div>
                </div>
                <span className={`text-sm font-bold min-w-[60px] text-right transition-colors ${minExpYears >= 6 ? "text-indigo-800" : minExpYears >= 3 ? "text-primary-600" : "text-gray-500"
                  }`}>
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
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
                      <span>데이터를 불러오는 중입니다...</span>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-red-500">
                    {error}
                  </td>
                </tr>
              ) : filteredEmployees.length > 0 ? (
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
                        <span className="text-gray-900 font-medium">{DEPARTMENTS[emp.deptId] || "미배정"}</span>
                        <span className="text-xs">{POSITIONS[emp.positionId] || "직급없음"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2 max-w-xs">
                        {emp.skills.map((skill, idx) => (
                          <span
                            key={idx}
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
