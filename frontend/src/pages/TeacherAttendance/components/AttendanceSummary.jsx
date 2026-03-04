import React from "react";
import { Badge } from "../../../components/ui/badge";

const BADGE_VARIANT = { Present: "success", Late: "warning", Absent: "danger" };

const AttendanceSummary = ({ attendanceList, totalStudents, remaining }) => {
	const present = attendanceList.filter((a) => a.status === "Present").length;
	const late = attendanceList.filter((a) => a.status === "Late").length;
	const absent = totalStudents - present - late - remaining;

	const counters = [
		{ label: "Present", count: present, color: "text-green-400", bg: "bg-green-900/30 border-green-800" },
		{ label: "Late", count: late, color: "text-amber-400", bg: "bg-amber-900/30 border-amber-800" },
		{ label: "Absent", count: Math.max(0, absent), color: "text-red-400", bg: "bg-red-900/30 border-red-800" },
		{ label: "Remaining", count: remaining, color: "text-gray-400", bg: "bg-gray-800/50 border-gray-700" },
	];

	return (
		<div className="space-y-3">
			<div className="grid grid-cols-4 gap-2">
				{counters.map(({ label, count, color, bg }) => (
					<div key={label} className={`rounded-lg border ${bg} p-2 text-center`}>
						<div className={`text-2xl font-bold ${color}`}>{count}</div>
						<div className="text-xs text-gray-500 mt-0.5">{label}</div>
					</div>
				))}
			</div>

			{attendanceList.length > 0 && (
				<div className="rounded-lg border border-gray-800 bg-gray-900 divide-y divide-gray-800 max-h-52 overflow-y-auto">
					{attendanceList.map((a, i) => (
						<div key={i} className="flex items-center justify-between px-3 py-2">
							<div>
								<span className="text-sm text-amber-100">{a.student_name}</span>
								<span className="text-xs text-gray-600 ml-2">{a.timestamp}</span>
							</div>
							<div className="flex items-center gap-1.5">
								{a.late_minutes > 0 && (
									<span className="text-xs text-gray-500">+{a.late_minutes}m</span>
								)}
								<Badge variant={BADGE_VARIANT[a.status] || "secondary"}>{a.status}</Badge>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default AttendanceSummary;
