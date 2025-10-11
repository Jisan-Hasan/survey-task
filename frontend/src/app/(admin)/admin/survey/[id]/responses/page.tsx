"use client";

import PageWrapper from "@/components/admin/page-wrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { GetQuery } from "@/lib/queries";
import { Calendar, Eye, User } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";

interface Choice {
    id: number;
    text: string;
    order: number;
}

interface AnswerChoice {
    id: number;
    choice: Choice;
}

interface Answer {
    id: number;
    question: number;
    text: string | null;
    selected_choice: Choice | null;
    answer_choices: AnswerChoice[];
}

interface Response {
    id: number;
    survey: number;
    submitted_at: string;
    answers: Answer[];
}

interface Question {
    id: number;
    text: string;
    question_type: "text" | "single" | "multiple";
    required: boolean;
    order: number;
}

interface Survey {
    id: number;
    title: string;
    description: string;
    questions: Question[];
}

export default function ResponsesPage() {
    const [selectedResponse, setSelectedResponse] = useState<Response | null>(
        null
    );
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const params = useParams();

    const { data: responsesData, isLoading: responsesLoading } = GetQuery(
        "surveys",
        {
            pathname: `${params?.id}/responses`,
        }
    );

    const { data: surveyData, isLoading: surveyLoading } = GetQuery("surveys", {
        pathname: params?.id as string,
    });

    const responses: Response[] = responsesData?.data || [];
    const survey: Survey = surveyData?.data;

    const handleViewDetails = (response: Response) => {
        setSelectedResponse(response);
        setIsDialogOpen(true);
    };

    const getQuestionText = (questionId: number): string => {
        if (!survey?.questions) return `Question ${questionId}`;
        const question = survey.questions.find((q) => q.id === questionId);
        return question?.text || `Question ${questionId}`;
    };

    const getQuestionType = (questionId: number): string => {
        if (!survey?.questions) return "text";
        const question = survey.questions.find((q) => q.id === questionId);
        return question?.question_type || "text";
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (responsesLoading || surveyLoading) {
        return (
            <PageWrapper title="Survey Responses">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-muted-foreground">
                            Loading responses...
                        </p>
                    </div>
                </div>
            </PageWrapper>
        );
    }

    return (
        <PageWrapper title="Survey Responses">
            <div className="space-y-6">
                {/* Survey Info */}
                {survey && (
                    <Card>
                        <CardHeader>
                            <CardTitle>{survey.title}</CardTitle>
                            <p className="text-sm text-muted-foreground">
                                {survey.description}
                            </p>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4 text-sm">
                                <Badge variant="secondary">
                                    {responses.length} Response
                                    {responses.length !== 1 ? "s" : ""}
                                </Badge>
                                <Badge variant="outline">
                                    {survey.questions.length} Question
                                    {survey.questions.length !== 1 ? "s" : ""}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Responses List */}
                {responses.length === 0 ? (
                    <Card>
                        <CardContent className="py-12">
                            <div className="text-center text-muted-foreground">
                                <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>No responses yet</p>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {responses.map((response) => (
                            <Card
                                key={response.id}
                                className="hover:shadow-lg transition-shadow"
                            >
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <User className="h-5 w-5" />
                                        Response #{response.id}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Calendar className="h-4 w-4" />
                                        {formatDate(response.submitted_at)}
                                    </div>
                                    <div className="text-sm">
                                        <Badge variant="secondary">
                                            {response.answers.length} Answer
                                            {response.answers.length !== 1
                                                ? "s"
                                                : ""}
                                        </Badge>
                                    </div>
                                    <Button
                                        onClick={() =>
                                            handleViewDetails(response)
                                        }
                                        className="w-full"
                                        variant="outline"
                                    >
                                        <Eye className="h-4 w-4 mr-2" />
                                        View Details
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Response Details Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            Response Details #{selectedResponse?.id}
                        </DialogTitle>
                        <DialogDescription>
                            Submitted on{" "}
                            {selectedResponse &&
                                formatDate(selectedResponse.submitted_at)}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 mt-4">
                        {selectedResponse?.answers.map((answer, index) => {
                            const questionType = getQuestionType(
                                answer.question
                            );
                            return (
                                <div
                                    key={answer.id}
                                    className="border rounded-lg p-4 space-y-3"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Badge
                                                    variant="outline"
                                                    className="text-xs"
                                                >
                                                    Q{index + 1}
                                                </Badge>
                                                <Badge
                                                    variant="secondary"
                                                    className="text-xs"
                                                >
                                                    {questionType}
                                                </Badge>
                                            </div>
                                            <h4 className="font-medium text-sm">
                                                {getQuestionText(
                                                    answer.question
                                                )}
                                            </h4>
                                        </div>
                                    </div>

                                    <div className="pl-4 border-l-2 border-primary/20">
                                        {/* Text Answer */}
                                        {answer.text && (
                                            <div className="text-sm">
                                                <span className="text-muted-foreground">
                                                    Answer:{" "}
                                                </span>
                                                <span className="font-medium">
                                                    {answer.text}
                                                </span>
                                            </div>
                                        )}

                                        {/* Single Choice Answer */}
                                        {answer.selected_choice && (
                                            <div className="text-sm">
                                                <span className="text-muted-foreground">
                                                    Selected:{" "}
                                                </span>
                                                <Badge variant="default">
                                                    {
                                                        answer.selected_choice
                                                            .text
                                                    }
                                                </Badge>
                                            </div>
                                        )}

                                        {/* Multiple Choice Answer */}
                                        {answer.answer_choices.length > 0 && (
                                            <div className="text-sm">
                                                <span className="text-muted-foreground block mb-2">
                                                    Selected:
                                                </span>
                                                <div className="flex flex-wrap gap-2">
                                                    {answer.answer_choices.map(
                                                        (ac) => (
                                                            <Badge
                                                                key={ac.id}
                                                                variant="default"
                                                            >
                                                                {ac.choice.text}
                                                            </Badge>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </DialogContent>
            </Dialog>
        </PageWrapper>
    );
}
