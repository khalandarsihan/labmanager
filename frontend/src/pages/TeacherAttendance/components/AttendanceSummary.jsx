import React from "react";
import { useTheme } from "../../../components/ui/ThemeContext";
import { Card, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";

const BADGE_VARIANT = { Present: "success", Late: "warning", Absent: "danger" };

const AttendanceSummary = ({ attendanceList, totalStudents, remaining }) => {
	const { useLightTheme, themeStyles } = useTheme();
	const present = attendanceList.filter((a) => a.status === "Present").length;
	const late = attendanceList.filter((a) => a.status === "Late").length;
	const absent = Math.max(0, totalStudents - present - late - remaining);

	const counters = [
		{
			label: "Present",
			count: present,
			color: "text-green-600",
			bg: useLightTheme ? "bg-green-50 border-green-200" : "bg-green-900/30 border-green-800",
		},
		{
			label: "Late",
			count: late,
			color: useLightTheme ? "text-amber-600" : "text-amber-400",
			bg: useLightTheme ? "bg-amber-50 border-amber-200" : "bg-amber-900/30 border-amber-800",
		},
		{
			label: "Absent",
			count: absent,
			color: "text-red-500",
			bg: useLightTheme ? "bg-red-50 border-red-200" : "bg-red-900/30 border-red-800",
		},
		{
			label: "Remaining",
			count: remaining,
			color: themeStyles.text.secondary,
			bg: useLightTheme ? "bg-gray-50 border-gray-200" : "bg-gray-800/50 border-gray-700",
		},
	];

	return (
		<div className="space-y-3">
			{/* Counter row */}
			<div className="grid grid-cols-4 gap-2">
				{counters.map(({ label, count, color, bg }) => (
					<div key={label} className={`rounded-lg border ${bg} p-2 text-center`}>
						<div className={`text-2xl font-bold ${color}`}>{count}</div>
						<div className={`text-xs mt-0.5 ${themeStyles.text.light}`}>{label}</div>
					</div>
				))}
			</div>

			{/* Scrollable scan list */}
			{attendanceList.length > 0 && (
				<Card className={`${themeStyles.card.bg} border ${themeStyles.card.border}`}>
					<CardContent className="p-0 max-h-52 overflow-y-auto divide-y ${
						useLightTheme ? 'divide-gray-100' : 'divide-gray-800'
					}">
						{attendanceList.map((a, i) => (
							<div key={i} className="flex items-center justify-between px-3 py-2">
								<div>
									<span className={`text-sm font-medium ${themeStyles.text.primary}`}>
										{a.student_name}
									</span>
									<span className={`text-xs ml-2 ${themeStyles.text.light}`}>
										{a.timestamp}
									</span>
								</div>
								<div className="flex items-center gap-1.5">
									{a.late_minutes > 0 && (
										<span className={`text-xs ${themeStyles.text.light}`}>
											+{a.late_minutes}m
										</span>
									)}
									<Badge variant={BADGE_VARIANT[a.status] || "secondary"}>
										{a.status}
									</Badge>
								</div>
							</div>
						))}
					</CardContent>
				</Card>
			)}
		</div>
	);
};

export default AttendanceSummary;
