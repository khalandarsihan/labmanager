import React, { useState, useEffect, useCallback } from "react";
import { useFrappePostCall } from "frappe-react-sdk";
import ClassHeader from "./components/ClassHeader";
import QRScanner from "./components/QRScanner";
import AttendanceSummary from "./components/AttendanceSummary";
import { Button } from "../../components/ui/button";
import { useToast } from "../../components/ui/toast";

const TeacherAttendancePage = () => {
	// phase: loading | no-class | ready | scanning | closed
	const [phase, setPhase] = useState("loading");
	const [slotData, setSlotData] = useState(null);
	const [classLog, setClassLog] = useState(null);
	const [attendanceList, setAttendanceList] = useState([]);
	const [closeSummary, setCloseSummary] = useState(null);
	const { toast, Toaster } = useToast();

	const { call: getSlot } = useFrappePostCall(
		"labmanager.attendance.api.get_current_timetable_slot"
	);
	const { call: createLog } = useFrappePostCall(
		"labmanager.attendance.api.create_class_log"
	);
	const { call: markAtt } = useFrappePostCall(
		"labmanager.attendance.api.mark_attendance"
	);
	const { call: closeLog } = useFrappePostCall(
		"labmanager.attendance.api.close_class_log"
	);

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
						title: "Invalid QR",
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
		<div className="min-h-screen bg-gray-950 text-amber-100">
			<Toaster />
			<div className="max-w-xl mx-auto p-4 space-y-4">
				{/* Page title */}
				<div className="text-center pt-4 pb-2">
					<h1 className="text-2xl font-bold text-amber-300">Teacher Attendance</h1>
					<p className="text-gray-500 text-sm">QR Scanner — TechEthica</p>
				</div>

				{/* Loading */}
				{phase === "loading" && (
					<div className="text-center py-16 text-gray-500">Loading timetable…</div>
				)}

				{/* No class */}
				{phase === "no-class" && (
					<div className="rounded-lg border border-gray-700 bg-gray-900 p-8 text-center space-y-2">
						<p className="text-amber-300 text-lg font-medium">No active class right now</p>
						{slotData?.message && <p className="text-gray-500 text-sm">{slotData.message}</p>}
					</div>
				)}

				{/* Class header shown for all active phases */}
				{(phase === "ready" || phase === "scanning" || phase === "closed") && slotData && (
					<ClassHeader slotData={slotData} classLog={classLog} />
				)}

				{/* Ready — start class */}
				{phase === "ready" && (
					<div className="text-center py-4">
						<Button
							onClick={handleStartClass}
							className="bg-amber-500 hover:bg-amber-600 text-gray-900 font-semibold px-10 py-3 text-base rounded-lg"
						>
							Start Class
						</Button>
					</div>
				)}

				{/* Scanning */}
				{phase === "scanning" && (
					<>
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
					</>
				)}

				{/* Closed — final summary */}
				{phase === "closed" && closeSummary && (
					<div className="rounded-lg border border-green-700/50 bg-green-950/20 p-6 space-y-4">
						<h2 className="text-xl font-semibold text-green-400 text-center">Class Completed</h2>
						<div className="grid grid-cols-2 gap-3 text-center">
							{[
								{ label: "Present", value: closeSummary.total_present, color: "text-green-400", bg: "bg-green-900/30" },
								{ label: "Absent", value: closeSummary.total_absent, color: "text-red-400", bg: "bg-red-900/30" },
								{ label: "Late", value: closeSummary.total_late, color: "text-amber-400", bg: "bg-amber-900/30" },
								{ label: "Duration (min)", value: closeSummary.duration_minutes, color: "text-gray-300", bg: "bg-gray-800/50" },
							].map(({ label, value, color, bg }) => (
								<div key={label} className={`rounded-lg ${bg} p-4`}>
									<div className={`text-3xl font-bold ${color}`}>{value}</div>
									<div className="text-sm text-gray-400 mt-1">{label}</div>
								</div>
							))}
						</div>
						<p className="text-center text-gray-600 text-xs">
							WhatsApp alerts queued for absent students' parents.
						</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default TeacherAttendancePage;
