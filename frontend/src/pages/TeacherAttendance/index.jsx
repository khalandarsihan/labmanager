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

const STATUS_STYLE = {
	active:   { dot: "bg-green-500", label: "Active",    badge: "bg-green-100 text-green-700" },
	upcoming: { dot: "bg-amber-400",  label: "Upcoming",  badge: "bg-amber-100 text-amber-700" },
	past:     { dot: "bg-gray-400",   label: "Past",      badge: "bg-gray-100 text-gray-500"  },
};

function fmt(timeStr) {
	if (!timeStr) return "";
	return timeStr.slice(0, 5);
}

const TeacherAttendancePage = () => {
	// phase: loading | no-class | picking | ready | scanning | closed
	const [phase, setPhase]             = useState("loading");
	const [allSlots, setAllSlots]       = useState([]);
	const [slotData, setSlotData]       = useState(null);
	const [classLog, setClassLog]       = useState(null);
	const [attendanceList, setAttendanceList] = useState([]);
	const [liveStats, setLiveStats]     = useState({ present: 0, late: 0, absent: 0, total: 0 });
	const [closeSummary, setCloseSummary] = useState(null);
	const [latePrompt, setLatePrompt]   = useState(false);   // show reason dialog
	const [lateReason, setLateReason]   = useState("");
	const { toast, Toaster }            = useToast();
	const { useLightTheme, themeStyles } = useTheme();

	const { call: getTodaySlots } = useFrappePostCall("labmanager.attendance.api.get_today_slots");
	const { call: getSlotStudents } = useFrappePostCall("labmanager.attendance.api.get_slot_students");
	const { call: createLog }     = useFrappePostCall("labmanager.attendance.api.create_class_log");
	const { call: markAtt }       = useFrappePostCall("labmanager.attendance.api.mark_attendance");
	const { call: closeLog }      = useFrappePostCall("labmanager.attendance.api.close_class_log");
	const { call: fetchStats }    = useFrappePostCall("labmanager.attendance.api.get_class_attendance");

	useEffect(() => {
		getTodaySlots({})
			.then((r) => {
				const data = r.message;
				if (!data || !data.slots || data.slots.length === 0) {
					setPhase("no-class");
				} else {
					setAllSlots(data.slots);
					// Auto-select if only one slot
					if (data.slots.length === 1) {
						selectSlot(data.slots[0]);
					} else {
						setPhase("picking");
					}
				}
			})
			.catch(() => setPhase("no-class"));
	}, []);

	const selectSlot = useCallback((slot) => {
		// Fetch students for the chosen slot then move to ready
		getSlotStudents({ timetable_slot: slot.slot })
			.then((r) => {
				setSlotData({ ...slot, student_list: r.message || [] });
				setPhase("ready");
			})
			.catch(() => {
				setSlotData({ ...slot, student_list: [] });
				setPhase("ready");
			});
	}, [getSlotStudents]);

	const refreshStats = useCallback((log) => {
		fetchStats({ class_log: log })
			.then((r) => {
				if (r.message) {
					const { records, present, late, absent, total } = r.message;
					setLiveStats({ present, late, absent, total });
					setAttendanceList(
						records.map((rec) => ({
							student_name: rec.student_name,
							status: rec.status,
							late_minutes: rec.late_minutes || 0,
							timestamp: rec.entry_time || "",
						}))
					);
				}
			})
			.catch(() => {});
	}, [fetchStats]);

	// Called when teacher clicks "Start Class"
	const handleStartClass = useCallback(() => {
		if (slotData?.is_late) {
			// Teacher is late — ask for a reason before proceeding
			setLateReason("");
			setLatePrompt(true);
		} else {
			doStartClass("");
		}
	}, [slotData]);

	const doStartClass = useCallback((reason) => {
		setLatePrompt(false);
		createLog({ timetable_slot: slotData.slot, late_reason: reason })
			.then((r) => {
				if (r.message) {
					setClassLog(r.message);
					setPhase("scanning");
					refreshStats(r.message);
				}
			})
			.catch(() => {});
	}, [slotData, createLog, refreshStats]);

	const handleScan = useCallback((qrId) => {
		if (!classLog) return;
		const scan_time = new Date().toTimeString().slice(0, 8);
		markAtt({ class_log: classLog, qr_id: qrId, scan_time })
			.then((r) => {
				const result = r.message;
				if (result.already_marked) {
					toast({ title: "Already Marked", description: `${result.student_name} — ${result.status}`, variant: "default" });
				} else {
					toast({
						title: result.status === "Late" ? `Late +${result.late_minutes} min` : "Present ✓",
						description: result.student_name,
						variant: result.status === "Late" ? "default" : "success",
					});
					setLiveStats((prev) => ({
						...prev,
						present: prev.present + (result.status === "Present" ? 1 : 0),
						late:    prev.late    + (result.status === "Late"    ? 1 : 0),
						total:   prev.total + 1,
					}));
					setAttendanceList((prev) => [
						{ ...result, timestamp: new Date().toLocaleTimeString() },
						...prev,
					]);
				}
			})
			.catch((err) => {
				toast({ title: "Error", description: String(err?.message || "Unknown error"), variant: "destructive" });
			});
	}, [classLog, toast, markAtt]);

	const handleEndClass = useCallback(() => {
		if (!classLog) return;
		closeLog({ class_log: classLog })
			.then((r) => {
				if (r.message) { setCloseSummary(r.message); setPhase("closed"); }
			})
			.catch(() => {});
	}, [classLog, closeLog]);

	const totalStudents = slotData?.student_list?.length || 0;
	const remaining = Math.max(0, totalStudents - liveStats.present - liveStats.late);

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
							<p className={`text-sm ${themeStyles.text.light}`}>No classes are scheduled for you today.</p>
						</CardContent>
					</Card>
				)}

				{/* Slot picker */}
				{phase === "picking" && (
					<div className="space-y-3">
						<p className={`text-sm font-semibold mb-4 ${themeStyles.text.secondary}`}>
							Select a class to take attendance:
						</p>
						{allSlots.map((slot) => {
							const st = STATUS_STYLE[slot.status] || STATUS_STYLE.upcoming;
							return (
								<button
									key={slot.slot}
									onClick={() => selectSlot(slot)}
									className={`w-full text-left rounded-xl border p-4 flex items-center gap-4 transition-all hover:shadow-md
										${themeStyles.card.bg} ${themeStyles.card.border}`}
									style={{ cursor: "pointer" }}
								>
									{/* Status dot */}
									<div className={`w-3 h-3 rounded-full flex-shrink-0 ${st.dot}`} />

									{/* Subject + batch */}
									<div className="flex-1 min-w-0">
										<div className={`font-bold text-base truncate ${themeStyles.heading}`}>
											{slot.subject}
										</div>
										<div className={`text-sm truncate ${themeStyles.text.light}`}>
											{slot.batch}
										</div>
									</div>

									{/* Time + badge */}
									<div className="flex-shrink-0 text-right">
										<div className={`text-sm font-semibold ${themeStyles.text.secondary}`}>
											{fmt(slot.scheduled_start)}
											{slot.scheduled_end && ` – ${fmt(slot.scheduled_end)}`}
										</div>
										<span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${st.badge}`}>
											{st.label}
											{slot.status === "active" && slot.is_late && ` · ${slot.delay_minutes}m late`}
										</span>
									</div>
								</button>
							);
						})}
					</div>
				)}

				{/* Class header for active phases */}
				{(phase === "ready" || phase === "scanning" || phase === "closed") && slotData && (
					<>
						{/* Back to picker link */}
						{phase === "ready" && allSlots.length > 1 && (
							<button
								onClick={() => { setSlotData(null); setPhase("picking"); }}
								className={`text-sm mb-3 flex items-center gap-1 ${themeStyles.text.light} hover:underline`}
								style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
							>
								← Back to class list
							</button>
						)}
						<ClassHeader slotData={slotData} classLog={classLog} />
					</>
				)}

				{/* Ready — start class */}
				{phase === "ready" && (
					<div className="py-4">
						{slotData?.is_late && (
							<div className={`mb-4 rounded-xl px-4 py-3 text-sm flex items-start gap-2 ${
								useLightTheme ? "bg-amber-50 border border-amber-200 text-amber-800" : "bg-amber-900/30 border border-amber-700 text-amber-300"
							}`}>
								<span className="text-base flex-shrink-0">⚠️</span>
								<span>Class is starting <strong>{slotData.delay_minutes} min</strong> late. You will be asked for a reason.</span>
							</div>
						)}
						<div className="text-center">
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
					</div>
				)}

				{/* Late reason modal */}
				{latePrompt && (
					<div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: "rgba(0,0,0,0.5)" }}>
						<div className={`w-full max-w-lg rounded-t-2xl p-6 ${useLightTheme ? "bg-white" : "bg-gray-900"}`}>
							{/* Handle */}
							<div className="w-10 h-1 rounded-full bg-gray-300 mx-auto mb-5" />

							<h3 className={`text-base font-bold mb-1 ${themeStyles.heading}`}>Class started late</h3>
							<p className={`text-sm mb-4 ${themeStyles.text.light}`}>
								Please enter the reason. Students who arrive on time for the <em>actual</em> start will not be marked late.
							</p>

							<textarea
								autoFocus
								value={lateReason}
								onChange={(e) => setLateReason(e.target.value)}
								placeholder="e.g. Previous class ran over, traffic delay…"
								rows={3}
								className={`w-full rounded-xl border px-4 py-3 text-sm resize-none mb-4 ${
									useLightTheme
										? "border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400"
										: "border-gray-700 bg-gray-800 text-white placeholder-gray-500"
								}`}
							/>

							<div className="flex gap-3">
								<Button
									onClick={() => setLatePrompt(false)}
									variant="outline"
									className={`flex-1 ${themeStyles.card.border}`}
								>
									Cancel
								</Button>
								<Button
									onClick={() => doStartClass(lateReason)}
									disabled={!lateReason.trim()}
									className={`flex-1 font-semibold ${
										useLightTheme
											? "bg-purple-600 hover:bg-purple-700 text-white disabled:bg-gray-300"
											: "bg-amber-500 hover:bg-amber-600 text-gray-900 disabled:bg-gray-700 disabled:text-gray-500"
									}`}
								>
									Start Class
								</Button>
							</div>
						</div>
					</div>
				)}

				{/* Scanning */}
				{phase === "scanning" && (
					<div className="space-y-4">
						<QRScanner onScan={handleScan} />
						<AttendanceSummary
							attendanceList={attendanceList}
							present={liveStats.present}
							late={liveStats.late}
							absent={liveStats.absent}
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
							<CardTitle className={`text-center ${themeStyles.heading}`}>Class Completed</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-2 gap-3 text-center">
								{[
									{ label: "Present",       value: closeSummary.total_present,    color: "text-green-500",  bg: useLightTheme ? "bg-green-50 border-green-200"   : "bg-green-900/30 border-green-800"  },
									{ label: "Absent",        value: closeSummary.total_absent,     color: "text-red-500",    bg: useLightTheme ? "bg-red-50 border-red-200"     : "bg-red-900/30 border-red-800"    },
									{ label: "Late",          value: closeSummary.total_late,       color: useLightTheme ? "text-amber-600" : "text-amber-400", bg: useLightTheme ? "bg-amber-50 border-amber-200" : "bg-amber-900/30 border-amber-800" },
									{ label: "Duration (min)",value: closeSummary.duration_minutes, color: themeStyles.text.secondary, bg: useLightTheme ? "bg-gray-50 border-gray-200" : "bg-gray-800/50 border-gray-700" },
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
							{allSlots.length > 1 && (
								<div className="text-center pt-2">
									<Button
										onClick={() => { setSlotData(null); setClassLog(null); setCloseSummary(null); setAttendanceList([]); setLiveStats({ present: 0, late: 0, absent: 0, total: 0 }); setPhase("picking"); }}
										variant="outline"
										className={`${themeStyles.card.border}`}
									>
										Take next class
									</Button>
								</div>
							)}
						</CardContent>
					</Card>
				)}
			</div>
		</div>
	);
};

export default TeacherAttendancePage;
