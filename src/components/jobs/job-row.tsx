"use client"

import { Building, MapPin, Calendar } from "lucide-react"
import dayjs from "dayjs"
import { Job } from "./types"
import { JobActions } from "./job-actions"

interface JobRowProps {
	job: Job
	onView: (job: Job) => void
	onEdit: (job: Job) => void
	onCopyUrl: (job: Job) => void
	onDelete: (job: Job) => void
}

function getStatusColor(status: Job["status"]) {
	return status === "Active"
		? "bg-green-100 text-green-700"
		: status === "Draft"
		? "bg-yellow-100 text-yellow-700"
		: "bg-red-100 text-red-700"
}

export function JobRow({ job, onView, onEdit, onCopyUrl, onDelete }: JobRowProps) {
	return (
		<tr className="border-b hover:bg-muted/30">
			<td className="p-4">
				<div>
					<p className="font-medium">{job.title}</p>
					<p className="text-sm text-muted-foreground">{job.applications} applications</p>
				</div>
			</td>
			<td className="p-4">
				<div className="flex items-center space-x-2">
					<Building className="h-4 w-4 text-muted-foreground" />
					<span className="font-medium">{job.company}</span>
				</div>
			</td>
			<td className="p-4">
				<div className="flex flex-wrap gap-1">
					{job.skills.slice(0, 3).map((skill, index) => (
						<span key={index} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
							{skill}
						</span>
					))}
					{job.skills.length > 3 && (
						<span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
							+{job.skills.length - 3} more
						</span>
					)}
				</div>
			</td>
			<td className="p-4">
				<div className="flex items-center space-x-1">
					<MapPin className="h-3 w-3 text-muted-foreground" />
					<span className="text-sm">{job.location}</span>
				</div>
			</td>
			<td className="p-4">
				<div className="flex items-center space-x-1">
					<Calendar className="h-3 w-3 text-muted-foreground" />
					<span className="text-sm">{dayjs(job.expiryDate).format("DD/MM/YYYY")}</span>
				</div>
			</td>
			<td className="p-4">
				<span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(job.status)}`}>{job.status}</span>
			</td>
			<td className="p-4">
				<JobActions job={job} onView={onView} onEdit={onEdit} onCopyUrl={onCopyUrl} onDelete={onDelete} />
			</td>
		</tr>
	)
}


