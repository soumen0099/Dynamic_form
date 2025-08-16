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
                    <form className="grid gap-4">
                        {fields.map((field) => {
                            if (field.inputType === "select" && field.name === "course") {
                                // Course select
                                return (
                                    <div key={field.id} className="flex items-center gap-4 p-3 border rounded-lg bg-gray-50 dark:bg-gray-900">
                                        <span className="font-semibold w-48">{field.label}</span>
                                        <select className="border rounded px-2 py-1" defaultValue="">
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
                                        <select className="border rounded px-2 py-1" defaultValue="">
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
                                        <input type="date" className="border rounded px-2 py-1" />
                                    </div>
                                );
                            }
                            if (field.inputType === "number") {
                                return (
                                    <div key={field.id} className="flex items-center gap-4 p-3 border rounded-lg bg-gray-50 dark:bg-gray-900">
                                        <span className="font-semibold w-48">{field.label}</span>
                                        <input type="number" className="border rounded px-2 py-1" placeholder={field.label} />
                                    </div>
                                );
                            }
                            if (field.inputType === "file") {
                                // Exam paper upload
                                return (
                                    <div key={field.id} className="flex items-center gap-4 p-3 border rounded-lg bg-gray-50 dark:bg-gray-900">
                                        <span className="font-semibold w-48">{field.label}</span>
                                        <input type="file" className="border rounded px-2 py-1" accept=".pdf,.doc,.docx,.jpg,.png" />
                                    </div>
                                );
                            }
                            // Default: text
                            return (
                                <div key={field.id} className="flex items-center gap-4 p-3 border rounded-lg bg-gray-50 dark:bg-gray-900">
                                    <span className="font-semibold w-48">{field.label}</span>
                                    <input type="text" className="border rounded px-2 py-1" placeholder={field.label} />
                                </div>
                            );
                        })}
                    </form>
                    <div className="flex justify-end mt-6">
                        <Button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 font-semibold">
                            <Plus className="h-5 w-5 mr-2" /> Create New Exam
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ExamResultPanel;
