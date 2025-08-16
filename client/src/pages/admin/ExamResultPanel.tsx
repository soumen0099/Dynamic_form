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
                    <div className="grid gap-4">
                        {fields.map((field) => (
                            <div key={field.id} className="flex items-center gap-4 p-3 border rounded-lg bg-gray-50 dark:bg-gray-900">
                                <span className="font-semibold w-48">{field.label}</span>
                                {field.name === "course" || field.name === "courseName" || field.label.toLowerCase().includes("course") || field.label.toLowerCase().includes("subject") ? (
                                    <select className="border rounded px-2 py-1" defaultValue="">
                                        <option value="" disabled>Select course/subject</option>
                                        {courses.map((course: any) => (
                                            <option key={course.value} value={course.value}>{course.label}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <span className="text-gray-600 dark:text-gray-400">{field.description}</span>
                                )}
                            </div>
                        ))}
                    </div>
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
