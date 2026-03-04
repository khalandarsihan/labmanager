import React, { useState, useEffect, useCallback } from "react";
import { useFrappePostCall } from "frappe-react-sdk";
import { useTheme } from "../../components/ui/ThemeContext";
import BackgroundPattern from "../../components/ui/BackgroundPattern";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { useToast } from "../../components/ui/toast";
import ClassHeader from "./components/ClassHeader";
import QRScanner from "./components/QRScanner";
import AttendanceSummary from "./components/AttendanceSummary";

const TeacherAttendancePage = () => {
	// phase: loading | no-class | ready | scanning | closed
	const [phase, setPhase] = useState("loading");
	const [slotData, setSlotData] = useState(null);
	const [classLog, setClassLog] = useState(null);
	const [attendanceList, setAttendanceList] = useState([]);
	const [closeSummary, setCloseSummary] = useState(null);
	const { toast, Toaster } = useToast();
	const { useLightTheme, themeStyles } = useTheme();

	const { call: getSlot } = useFrappePostCall("labmanager.attendance.api.get_current_timetable_slot");
	const { call: createLog } = useFrappePostCall("labmanager.attendance.api.create_class_log");
	const { call: markAtt } = useFrappePostCall("labmanager.attendance.api.mark_attendance");
	const { call: closeLog } = useFrappePostCall("labmanager.attendance.api.close_class_log");

	useEffect(() => {
		getSlot({})
			.then((r) => {
				const data = r.message;
				if (!data || !data.slot) {
					setSlotData(data || null);
					setPhase("no-class");
				} else {
					setSlotData(data);
					setPhase("ready");
				}
			})
			.catch(() => setPhase("no-class"));
	}, []);

	const handleStartClass = useCallback(() => {
		createLog({ timetable_slot: slotData.slot })
			.then((r) => {
				if (r.message) {
					setClassLog(r.message);
					setPhase("scanning");
				}
			})
			.catch(() => {});
	}, [slotData, createLog]);

	const handleScan = useCallback(
		(qrId) => {
			if (!classLog) return;
			const scan_time = new Date().toTimeString().slice(0, 8);
			markAtt({ class_log: classLog, qr_id: qrId, scan_time })
				.then((r) => {
					const result = r.message;
					if (result.already_marked) {
						toast({
							title: "Already Marked",
							description: `${result.student_name} — ${result.status}`,
							variant: "default",
						});
					} else {
						toast({
							title: result.status === "Late" ? `Late +${result.late_minutes} min` : "Present ✓",
							description: result.student_name,
							variant: result.status === "Late" ? "default" : "success",
						});
						setAttendanceList((prev) => [
							{ ...result, timestamp: new Date().toLocaleTimeString() },
							...prev,
						]);
					}
				})
				.catch((err) => {
					toast({
						title: "Error",
						description: String(err?.message || "Unknown error"),
						variant: "destructive",
					});
				});
		},
		[classLog, toast, markAtt]
	);

	const handleEndClass = useCallback(() => {
		if (!classLog) return;
		closeLog({ class_log: classLog })
			.then((r) => {
				if (r.message) {
					setCloseSummary(r.message);
					setPhase("closed");
				}
			})
			.catch(() => {});
	}, [classLog, closeLog]);

	const totalStudents = slotData?.student_list?.length || 0;
	const markedCount = attendanceList.length;
	const remaining = Math.max(0, totalStudents - markedCount);

	return (
		<div className={`relative min-h-screen overflow-x-hidden ${themeStyles.background}`}>
			<BackgroundPattern />
			<Toaster />

			<div className="container mx-auto px-4 py-8 relative z-10 max-w-2xl">
				{/* Page title */}
				<div className="text-center mb-6">
					<h1 className={`text-3xl font-bold ${themeStyles.heading}`}>Teacher Attendance</h1>
					<p className={`text-sm mt-1 ${themeStyles.text.light}`}>QR Scanner — TechEthica</p>
				</div>

				{/* Loading */}
				{phase === "loading" && (
					<p className={`text-center py-16 ${themeStyles.text.light}`}>Loading timetable…</p>
				)}

				{/* No class */}
				{phase === "no-class" && (
					<Card className={`${themeStyles.card.bg} border ${themeStyles.card.border}`}>
						<CardContent className="py-10 text-center space-y-2">
							<p className={`text-lg font-medium ${themeStyles.heading}`}>No active class right now</p>
							{slotData?.message && (
								<p className={`text-sm ${themeStyles.text.light}`}>{slotData.message}</p>
							)}
						</CardContent>
					</Card>
				)}

				{/* Class header for active phases */}
				{(phase === "ready" || phase === "scanning" || phase === "closed") && slotData && (
					<ClassHeader slotData={slotData} classLog={classLog} />
				)}

				{/* Ready — start class */}
				{phase === "ready" && (
					<div className="text-center py-4">
						<Button
							onClick={handleStartClass}
							className={`px-10 py-3 text-base rounded-lg font-semibold transition-colors ${
								useLightTheme
									? "bg-purple-600 hover:bg-purple-700 text-white"
									: "bg-amber-500 hover:bg-amber-600 text-gray-900"
							}`}
						>
							Start Class
						</Button>
					</div>
				)}

				{/* Scanning */}
				{phase === "scanning" && (
					<div className="space-y-4">
						<QRScanner onScan={handleScan} />
						<AttendanceSummary
							attendanceList={attendanceList}
							totalStudents={totalStudents}
							remaining={remaining}
						/>
						<div className="text-center pb-4">
							<Button
								onClick={handleEndClass}
								className="bg-red-600 hover:bg-red-700 text-white font-semibold px-10 py-3 rounded-lg"
							>
								End Class
							</Button>
						</div>
					</div>
				)}

				{/* Closed — final summary */}
				{phase === "closed" && closeSummary && (
					<Card className={`${themeStyles.card.bg} border ${themeStyles.card.border}`}>
						<CardHeader>
							<CardTitle className={`text-center ${themeStyles.heading}`}>
								Class Completed
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-2 gap-3 text-center">
								{[
									{ label: "Present", value: closeSummary.total_present, color: "text-green-500", bg: useLightTheme ? "bg-green-50 border-green-200" : "bg-green-900/30 border-green-800" },
									{ label: "Absent",  value: closeSummary.total_absent,  color: "text-red-500",   bg: useLightTheme ? "bg-red-50 border-red-200"   : "bg-red-900/30 border-red-800"   },
									{ label: "Late",    value: closeSummary.total_late,    color: useLightTheme ? "text-amber-600" : "text-amber-400", bg: useLightTheme ? "bg-amber-50 border-amber-200" : "bg-amber-900/30 border-amber-800" },
									{ label: "Duration (min)", value: closeSummary.duration_minutes, color: themeStyles.text.secondary, bg: useLightTheme ? "bg-gray-50 border-gray-200" : "bg-gray-800/50 border-gray-700" },
								].map(({ label, value, color, bg }) => (
									<div key={label} className={`rounded-lg border ${bg} p-4`}>
										<div className={`text-3xl font-bold ${color}`}>{value}</div>
										<div className={`text-sm mt-1 ${themeStyles.text.light}`}>{label}</div>
									</div>
								))}
							</div>
							<p className={`text-center text-xs ${themeStyles.text.light}`}>
								WhatsApp alerts queued for absent students' parents.
							</p>
						</CardContent>
					</Card>
				)}
			</div>
		</div>
	);
};

export default TeacherAttendancePage;
