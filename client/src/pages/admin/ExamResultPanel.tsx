import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BookOpen, Plus } from "lucide-react";
import { defaultExamResultFields } from "@/pages/superAdmin/constants";
import { getAllCourseAPI } from "@/API/services/courseService";

const ExamResultPanel: React.FC = () => {
    console.log("ExamResultPanel rendered");
    const examResultFields = useSelector((state: RootState) => state.superAdmin.examResultFields);
    const [fields, setFields] = useState(examResultFields.length > 0 ? examResultFields : defaultExamResultFields);
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        setFields(examResultFields.length > 0 ? examResultFields : defaultExamResultFields);
    }, [examResultFields]);

    useEffect(() => {
        // Fetch courses from backend using getAllCourseAPI (static import)
        getAllCourseAPI()
            .then((res: any) => {
                const courseOptions = Array.isArray(res.data.data)
                    ? res.data.data.map((course: any) => ({
                        value: course._id,
                        label: course.name
                    }))
                    : [];
                setCourses(courseOptions);
                console.log(courseOptions)
            })
            .catch(() => {
                setCourses([]);
            });
    }, []);

    // Form state
    const [formData, setFormData] = useState<any>({});
    const [fileData, setFileData] = useState<File | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // Handle input change
    const handleChange = (field: any, value: any) => {
        setFormData((prev: any) => ({ ...prev, [field.name]: value }));
    };
    const handleFileChange = (field: any, file: File | null) => {
        setFileData(file);
        setFormData((prev: any) => ({ ...prev, [field.name]: file }));
    };

    // Submit handler
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const data = new FormData();
            fields.forEach((field) => {
                if (field.inputType === "file") {
                    if (fileData) data.append(field.name, fileData);
                } else {
                    data.append(field.name, formData[field.name] || "");
                }
            });
            // Add formType for backend
            data.append("formType", "exam");
            // POST to backend
            const res = await fetch("/api/v1/dynamic-forms", {
                method: "POST",
                body: data,
            });
            if (!res.ok) throw new Error("Failed to create exam");
            setFormData({});
            setFileData(null);
            alert("Exam created successfully!");
            // No redirect, just show success message
        } catch (err) {
            alert("Error creating exam");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                        <BookOpen className="h-6 w-6" /> Exam & Result Management
                    </CardTitle>
                    <Separator />
                </CardHeader>
                <CardContent>
                    <form className="grid gap-4" onSubmit={handleSubmit} encType="multipart/form-data">
                        {fields.map((field) => {
                            if (field.inputType === "select" && field.name === "course") {
                                // Course select
                                return (
                                    <div key={field.id} className="flex items-center gap-4 p-3 border rounded-lg bg-gray-50 dark:bg-gray-900">
                                        <span className="font-semibold w-48">{field.label}</span>
                                        <select className="border rounded px-2 py-1" value={formData[field.name] || ""} onChange={e => handleChange(field, e.target.value)} required>
                                            <option value="" disabled>Select course/subject</option>
                                            {courses.map((course: any) => (
                                                <option key={course.value} value={course.value}>{course.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                );
                            }
                            if (field.inputType === "select" && field.options && field.options.length > 0) {
                                // Other select (e.g. examType)
                                return (
                                    <div key={field.id} className="flex items-center gap-4 p-3 border rounded-lg bg-gray-50 dark:bg-gray-900">
                                        <span className="font-semibold w-48">{field.label}</span>
                                        <select className="border rounded px-2 py-1" value={formData[field.name] || ""} onChange={e => handleChange(field, e.target.value)} required>
                                            <option value="" disabled>Select {field.label.toLowerCase()}</option>
                                            {field.options.map((opt) => (
                                                <option key={opt} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                    </div>
                                );
                            }
                            if (field.inputType === "date") {
                                return (
                                    <div key={field.id} className="flex items-center gap-4 p-3 border rounded-lg bg-gray-50 dark:bg-gray-900">
                                        <span className="font-semibold w-48">{field.label}</span>
                                        <input type="date" className="border rounded px-2 py-1" value={formData[field.name] || ""} onChange={e => handleChange(field, e.target.value)} required />
                                    </div>
                                );
                            }
                            if (field.inputType === "number") {
                                return (
                                    <div key={field.id} className="flex items-center gap-4 p-3 border rounded-lg bg-gray-50 dark:bg-gray-900">
                                        <span className="font-semibold w-48">{field.label}</span>
                                        <input type="number" className="border rounded px-2 py-1" placeholder={field.label} value={formData[field.name] || ""} onChange={e => handleChange(field, e.target.value)} required />
                                    </div>
                                );
                            }
                            if (field.inputType === "file") {
                                // Exam paper upload
                                return (
                                    <div key={field.id} className="flex items-center gap-4 p-3 border rounded-lg bg-gray-50 dark:bg-gray-900">
                                        <span className="font-semibold w-48">{field.label}</span>
                                        <input type="file" className="border rounded px-2 py-1" accept=".pdf,.doc,.docx,.jpg,.png" onChange={e => handleFileChange(field, e.target.files?.[0] || null)} required />
                                    </div>
                                );
                            }
                            // Default: text
                            return (
                                <div key={field.id} className="flex items-center gap-4 p-3 border rounded-lg bg-gray-50 dark:bg-gray-900">
                                    <span className="font-semibold w-48">{field.label}</span>
                                    <input type="text" className="border rounded px-2 py-1" placeholder={field.label} value={formData[field.name] || ""} onChange={e => handleChange(field, e.target.value)} required />
                                </div>
                            );
                        })}
                        <div className="flex justify-end mt-6">
                            <Button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 font-semibold" type="submit" disabled={submitting}>
                                <Plus className="h-5 w-5 mr-2" /> {submitting ? "Creating..." : "Create New Exam"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default ExamResultPanel;
