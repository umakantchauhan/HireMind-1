export type JobStatus = "Active" | "Expired" | "Draft";

export interface Job {
	id: number;
	title: string;
	company: string;
	skills: string[];
	location: string;
	expiryDate: string; // ISO string
	status: JobStatus;
	applications: number;
	description?: string;
	salaryRange?: string;
}

export interface JobActionHandlers {
	onView: (job: Job) => void;
	onEdit: (job: Job) => void;
	onCopyUrl: (job: Job) => void;
	onDelete: (job: Job) => void;
}


