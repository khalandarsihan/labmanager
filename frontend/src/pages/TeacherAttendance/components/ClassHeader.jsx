import React from "react";
import { useTheme } from "../../../components/ui/ThemeContext";
import { Card, CardContent } from "../../../components/ui/card";

const ClassHeader = ({ slotData, classLog }) => {
	const { useLightTheme, themeStyles } = useTheme();
	const start = slotData.scheduled_start?.slice(0, 5);
	const end = slotData.scheduled_end?.slice(0, 5);

	return (
		<Card className={`${themeStyles.card.bg} border ${themeStyles.card.border} mb-4`}>
			<CardContent className="pt-4 pb-4 space-y-3">
				<div className="flex justify-between items-start">
					<div>
						<h2 className={`text-lg font-semibold ${themeStyles.heading}`}>
							{slotData.subject}
						</h2>
						<p className={`text-sm ${themeStyles.text.secondary}`}>
							Batch: {slotData.batch}
						</p>
					</div>
					<div className={`text-right text-sm ${themeStyles.text.secondary}`}>
						<div>{start} – {end}</div>
						{classLog && (
							<div className={`text-xs mt-1 ${themeStyles.text.light}`}>{classLog}</div>
						)}
					</div>
				</div>

				{slotData.is_late && (
					<div className={`rounded-md px-3 py-2 text-sm ${
						useLightTheme
							? "bg-amber-50 border border-amber-200 text-amber-700"
							: "bg-amber-900/30 border border-amber-700/50 text-amber-300"
					}`}>
						⚠ Class started {slotData.delay_minutes} minute
						{slotData.delay_minutes !== 1 ? "s" : ""} late
					</div>
				)}

				{!slotData.is_active && (
					<div className={`rounded-md px-3 py-2 text-sm ${
						useLightTheme
							? "bg-blue-50 border border-blue-200 text-blue-700"
							: "bg-blue-900/30 border border-blue-700/50 text-blue-300"
					}`}>
						Next class — starts at {start}
					</div>
				)}
			</CardContent>
		</Card>
	);
};

export default ClassHeader;
