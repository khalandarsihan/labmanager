import React from "react";

const ClassHeader = ({ slotData, classLog }) => {
	const start = slotData.scheduled_start?.slice(0, 5);
	const end = slotData.scheduled_end?.slice(0, 5);

	return (
		<div className="rounded-lg border border-gray-700 bg-gray-900 p-4 space-y-3">
			<div className="flex justify-between items-start">
				<div>
					<h2 className="text-lg font-semibold text-amber-300">{slotData.subject}</h2>
					<p className="text-sm text-gray-400">Batch: {slotData.batch}</p>
				</div>
				<div className="text-right text-sm text-gray-400">
					<div>
						{start} – {end}
					</div>
					{classLog && <div className="text-xs text-gray-600 mt-1">{classLog}</div>}
				</div>
			</div>

			{slotData.is_late && (
				<div className="rounded-md bg-amber-900/30 border border-amber-700/50 px-3 py-2 text-sm text-amber-300">
					⚠ Class started {slotData.delay_minutes} minute
					{slotData.delay_minutes !== 1 ? "s" : ""} late
				</div>
			)}

			{!slotData.is_active && (
				<div className="rounded-md bg-blue-900/30 border border-blue-700/50 px-3 py-2 text-sm text-blue-300">
					Next class — starts at {start}
				</div>
			)}
		</div>
	);
};

export default ClassHeader;
