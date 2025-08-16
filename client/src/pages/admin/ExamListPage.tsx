
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import axios from "axios";

const ExamListPage: React.FC = () => {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchExams = async () => {
            try {
                setLoading(true);
                setError("");
                // Fetch exams from dynamic form collection
                const response = await axios.get("http://localhost:4070/api/v1/students/type/examResult");
                // response.data.data is array of dynamic form entries
                const examsData = Array.isArray(response.data.data) ? response.data.data : [];
                console.log("Fetched exams:", examsData);
                // Parse fieldsData for each exam
                const parsedExams = examsData.map((exam: any) => {
                    const getField = (name: string) => {
                        const field = exam.fieldsData?.find((f: any) => f.name === name);
                        return field ? field.value : "";
                    };
                    return {
                        id: exam._id,
                        name: getField("examName"),
                        type: getField("examType"),
                        date: getField("examDate"),
                        paper: getField("examPaper"),
                        totalMarks: getField("totalMarks"),
                        passingMarks: getField("passingMarks"),
                        venue: getField("examVenue"),
                        status: "Created", // You can add more logic for status if needed
                    };
                });
                setExams(parsedExams);
            } catch (err) {
                setError("Failed to fetch exams");
            } finally {
                setLoading(false);
            }
        };
        fetchExams();
    }, []);

    return (
        <div className="max-w-6xl mx-auto py-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl font-bold">Previous Exams</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-8 text-gray-500">Loading...</div>
                    ) : error ? (
                        <div className="text-center py-8 text-red-500">{error}</div>
                    ) : !Array.isArray(exams) || exams.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">No exams have been created yet. Please create an exam to see it listed here.</div>
                    ) : (
                        <table className="min-w-full border text-sm">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="border px-4 py-2 text-left">Exam Name</th>
                                    <th className="border px-4 py-2 text-left">Type</th>
                                    <th className="border px-4 py-2 text-left">Date</th>
                                    <th className="border px-4 py-2 text-left">Exam Paper</th>
                                    <th className="border px-4 py-2 text-left">Total Marks</th>
                                    <th className="border px-4 py-2 text-left">Passing Marks</th>
                                    <th className="border px-4 py-2 text-left">Venue</th>
                                    <th className="border px-4 py-2 text-left">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {exams.map((exam: any) => (
                                    <tr key={exam.id} className="hover:bg-gray-50">
                                        <td className="border px-4 py-2">{exam.name}</td>
                                        <td className="border px-4 py-2">{exam.type}</td>
                                        <td className="border px-4 py-2">{exam.date}</td>
                                        <td className="border px-4 py-2">
                                            {exam.paper ? (
                                                <a href={exam.paper} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Download</a>
                                            ) : "-"}
                                        </td>
                                        <td className="border px-4 py-2">{exam.totalMarks}</td>
                                        <td className="border px-4 py-2">{exam.passingMarks}</td>
                                        <td className="border px-4 py-2">{exam.venue}</td>
                                        <td className="border px-4 py-2">{exam.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default ExamListPage;
