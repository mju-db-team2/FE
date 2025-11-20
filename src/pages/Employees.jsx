import React from 'react';
import { Search, Filter, UserPlus, MoreVertical, Mail, Phone } from 'lucide-react';

const Employees = () => {
    const employees = [
        { id: 101, name: '김개발', dept: 'DX솔루션 1팀', position: '대리', email: 'kim.dev@company.com', phone: '010-1111-1111', status: '재직' },
        { id: 102, name: '이피엘', dept: 'DX솔루션 1팀', position: '과장', email: 'lee.pl@company.com', phone: '010-2222-2222', status: '재직' },
        { id: 103, name: '박피엠', dept: 'DX솔루션 1팀', position: '팀장', email: 'park.pm@company.com', phone: '010-3333-3333', status: '재직' },
        { id: 107, name: '한휴직', dept: 'DX솔루션 1팀', position: '과장', email: 'han.leave@company.com', phone: '010-7777-7777', status: '휴직' },
        { id: 110, name: '나연구', dept: 'AI 연구소', position: '팀장', email: 'na.rnd@company.com', phone: '010-0101-0101', status: '퇴사' },
    ];

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
                <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4 justify-between">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="이름, 부서, 직급 검색..."
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
                                <th className="px-6 py-3">이름</th>
                                <th className="px-6 py-3">부서</th>
                                <th className="px-6 py-3">직급</th>
                                <th className="px-6 py-3">연락처</th>
                                <th className="px-6 py-3">상태</th>
                                <th className="px-6 py-3 text-right">관리</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {employees.map((emp) => (
                                <tr key={emp.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-xs">
                                                {emp.name[0]}
                                            </div>
                                            <span className="font-medium text-gray-900">{emp.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{emp.dept}</td>
                                    <td className="px-6 py-4 text-gray-600">{emp.position}</td>
                                    <td className="px-6 py-4 text-gray-600">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2 text-xs">
                                                <Mail size={12} /> {emp.email}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs">
                                                <Phone size={12} /> {emp.phone}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${emp.status === '재직' ? 'bg-green-100 text-green-700' :
                                                emp.status === '휴직' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-red-100 text-red-700'
                                            }`}>
                                            {emp.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-gray-400 hover:text-gray-600">
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

export default Employees;
