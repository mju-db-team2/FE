import React from 'react';
import { Search, Filter, Plus, MoreVertical } from 'lucide-react';

const Projects = () => {
    const projects = [
        { id: 5001, code: 'PJT-2024-001', name: '삼성전자 물류 시스템 고도화', client: '삼성전자', start: '2024-01-01', end: '2024-06-30', status: 'END' },
        { id: 5002, code: 'PJT-2024-002', name: '카카오페이 연동 모듈', client: '카카오', start: '2024-03-01', end: '2024-08-31', status: 'END' },
        { id: 5005, code: 'PJT-2025-001', name: '네이버 클라우드 마이그레이션', client: '네이버', start: '2025-01-01', end: '2025-06-30', status: 'PROGRESS' },
        { id: 5006, code: 'PJT-2025-002', name: '삼성전자 차세대 ERP', client: '삼성전자', start: '2025-02-01', end: '2025-08-31', status: 'PROGRESS' },
        { id: 5010, code: 'PJT-2025-006', name: 'SK 하이닉스 수율예측 시스템', client: 'SK 하이닉스', start: '2025-07-01', end: '2025-12-31', status: 'WAIT' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">프로젝트 관리</h1>
                    <p className="text-gray-500">전체 프로젝트 목록 및 상세 정보를 관리합니다.</p>
                </div>
                <button className="flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                    <Plus size={20} />
                    <span>신규 프로젝트</span>
                </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4 justify-between">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="프로젝트명, 고객사 검색..."
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
                                <th className="px-6 py-3">프로젝트 코드</th>
                                <th className="px-6 py-3">프로젝트명</th>
                                <th className="px-6 py-3">발주처</th>
                                <th className="px-6 py-3">기간</th>
                                <th className="px-6 py-3">상태</th>
                                <th className="px-6 py-3 text-right">관리</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {projects.map((project) => (
                                <tr key={project.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{project.code}</td>
                                    <td className="px-6 py-4 text-gray-900">{project.name}</td>
                                    <td className="px-6 py-4 text-gray-600">{project.client}</td>
                                    <td className="px-6 py-4 text-gray-600">
                                        {project.start} ~ {project.end}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${project.status === 'PROGRESS' ? 'bg-blue-100 text-blue-700' :
                                                project.status === 'END' ? 'bg-green-100 text-green-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {project.status}
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

                <div className="p-4 border-t border-gray-200 flex items-center justify-between text-sm text-gray-500">
                    <span>Showing 1 to 5 of 12 entries</span>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50" disabled>Previous</button>
                        <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Projects;
