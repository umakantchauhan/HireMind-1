"use client"

import React, { useMemo, useState } from "react"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles, X } from "lucide-react"
import dayjs from "dayjs"
import type { Job } from "./types"

const jobSchema = z.object({
	title: z.string().min(3, "Title must be at least 3 characters"),
	company: z.string().min(2, "Company is required"),
	skills: z.array(z.string()).min(1, "Select at least one skill"),
	location: z.string().min(2, "Location is required"),
	salaryRange: z.string().min(2, "Salary range is required"),
	expiryDate: z.string().refine((v) => dayjs(v, "YYYY-MM-DD", true).isValid(), "Select a valid date"),
	description: z.string().min(20, "Description should be at least 20 characters"),
})

export interface CreateJobFormValues extends z.infer<typeof jobSchema> {}

interface CreateJobFormProps {
	onCreate?: (job: Job) => void
	onSubmit?: (job: Job) => void
	initialValues?: Partial<Job>
	submitLabel?: string
}

export function CreateJobForm({ onCreate, onSubmit, initialValues, submitLabel }: CreateJobFormProps) {
	const [values, setValues] = useState<CreateJobFormValues>({
		title: "",
		company: "",
		skills: [],
		location: "",
		salaryRange: "",
		expiryDate: "",
		description: "",
	})
	const [errors, setErrors] = useState<Record<string, string>>({})

	const availableSkills = useMemo(
		() => [
			"JavaScript",
			"TypeScript",
			"React",
			"Next.js",
			"Node.js",
			"Tailwind CSS",
			"AWS",
			"Docker",
			"Kubernetes",
		],
		[]
	)

	function setField<K extends keyof CreateJobFormValues>(key: K, value: CreateJobFormValues[K]) {
		setValues((prev) => ({ ...prev, [key]: value }))
	}

	// Initialize from initialValues
	React.useEffect(() => {
		if (!initialValues) return
		setValues({
			title: initialValues.title ?? "",
			company: initialValues.company ?? "",
			skills: initialValues.skills ?? [],
			location: initialValues.location ?? "",
			salaryRange: initialValues.salaryRange ?? "",
			expiryDate: initialValues.expiryDate ? dayjs(initialValues.expiryDate).format("YYYY-MM-DD") : "",
			description: initialValues.description ?? "",
		})
	}, [initialValues])

	function toggleSkill(skill: string) {
		setValues((prev) => ({
			...prev,
			skills: prev.skills.includes(skill) ? prev.skills.filter((s) => s !== skill) : [...prev.skills, skill],
		}))
	}

	function generateWithAI() {
		const lorem =
			"We are seeking a motivated professional to join our team. You will design, build, and ship high-quality features, collaborate cross-functionally, and contribute to a culture of excellence. Strong communication and problem-solving skills are essential."
		setField("description", lorem)
	}

	function validate(): boolean {
		const parsed = jobSchema.safeParse(values)
		if (!parsed.success) {
			const formErrors: Record<string, string> = {}
			for (const issue of parsed.error.issues) {
				const key = issue.path[0] as string
				if (!formErrors[key]) formErrors[key] = issue.message
			}
			setErrors(formErrors)
			return false
		}
		setErrors({})
		return true
	}

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		if (!validate()) return
		const newJob: Job = {
			id: initialValues?.id ?? Date.now(),
			title: values.title,
			company: values.company,
			skills: values.skills,
			location: values.location,
			salaryRange: values.salaryRange,
			expiryDate: dayjs(values.expiryDate, "YYYY-MM-DD").toISOString(),
			status: initialValues?.status ?? "Active",
			applications: initialValues?.applications ?? 0,
			description: values.description,
		}
		if (onSubmit) {
			onSubmit(newJob)
		} else if (onCreate) {
			onCreate(newJob)
		}
		// reset only for create flows
		if (!initialValues) {
			setValues({ title: "", company: "", skills: [], location: "", salaryRange: "", expiryDate: "", description: "" })
		}
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<div className="space-y-2">
				<Label htmlFor="title">Job Title *</Label>
				<Input id="title" value={values.title} onChange={(e) => setField("title", e.target.value)} placeholder="e.g., Senior Software Engineer" required />
				{errors.title && <p className="text-xs text-red-600">{errors.title}</p>}
			</div>
			<div className="space-y-2">
				<Label htmlFor="company">Company Name *</Label>
				<Input id="company" value={values.company} onChange={(e) => setField("company", e.target.value)} placeholder="e.g., TechCorp Inc." required />
				{errors.company && <p className="text-xs text-red-600">{errors.company}</p>}
			</div>
			<div className="space-y-2">
				<Label>Required Skills *</Label>
				<div className="border rounded-md p-3 min-h-[100px] max-h-[200px] overflow-y-auto">
					<div className="grid grid-cols-2 md:grid-cols-3 gap-2">
						{availableSkills.map((skill) => (
							<button
								key={skill}
								type="button"
								onClick={() => toggleSkill(skill)}
								className={`px-3 py-1 rounded-full text-xs border transition-colors ${values.skills.includes(skill) ? "bg-primary text-primary-foreground border-primary" : "bg-background border-input hover:bg-accent"}`}
							>
								{skill}
							</button>
						))}
					</div>
				</div>
				{errors.skills && <p className="text-xs text-red-600">{errors.skills}</p>}
				{values.skills.length > 0 && (
					<div className="flex flex-wrap gap-1">
						{values.skills.map((skill) => (
							<span key={skill} className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
								{skill}
								<button type="button" onClick={() => toggleSkill(skill)} className="hover:bg-primary/20 rounded-full">
									<X className="h-3 w-3" />
								</button>
							</span>
						))}
					</div>
				)}
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="space-y-2">
					<Label htmlFor="location">Location *</Label>
					<Input id="location" value={values.location} onChange={(e) => setField("location", e.target.value)} placeholder="e.g., San Francisco, CA or Remote" required />
					{errors.location && <p className="text-xs text-red-600">{errors.location}</p>}
				</div>
				<div className="space-y-2">
					<Label htmlFor="salaryRange">Salary Range *</Label>
					<Input id="salaryRange" value={values.salaryRange} onChange={(e) => setField("salaryRange", e.target.value)} placeholder="e.g., $120,000 - $150,000" required />
					{errors.salaryRange && <p className="text-xs text-red-600">{errors.salaryRange}</p>}
				</div>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="space-y-2">
					<Label htmlFor="expiryDate">Application Deadline *</Label>
					<Input id="expiryDate" type="date" value={values.expiryDate} onChange={(e) => setField("expiryDate", e.target.value)} required />
					{errors.expiryDate && <p className="text-xs text-red-600">{errors.expiryDate}</p>}
				</div>
				<div className="space-y-2">
					<Label htmlFor="description">Job Description *</Label>
					<Textarea id="description" className="min-h-[120px]" value={values.description} onChange={(e) => setField("description", e.target.value)} placeholder="Describe the role, responsibilities, requirements, and benefits..." required />
					{errors.description && <p className="text-xs text-red-600">{errors.description}</p>}
					<div className="flex justify-center">
						<Button type="button" variant="outline" onClick={generateWithAI} className="flex items-center gap-2">
							<Sparkles className="h-4 w-4" />
							Generate with AI
						</Button>
					</div>
				</div>
			</div>
			<div className="flex justify-end gap-2">
				<Button type="submit">{submitLabel ?? (initialValues ? "Save Changes" : "Create Job Posting")}</Button>
			</div>
		</form>
	)
}


