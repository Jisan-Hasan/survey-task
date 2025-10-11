"use client";

import PageWrapper from "@/components/admin/page-wrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { GetQuery } from "@/lib/queries";
import {
    CheckCircle2Icon,
    EyeIcon,
    PencilIcon,
    XCircleIcon,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";

export default function ViewSurveyPage() {
    const router = useRouter();
    const params = useParams();

    const { data, isLoading } = GetQuery("surveys", {
        pathname: params?.id as string,
    });

    const surveyData = data?.data || [];

    if (isLoading) {
        return (
            <PageWrapper title="Survey Details">
                <div className="flex items-center justify-center py-12">
                    <div className="text-center space-y-3">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
                        <p className="text-muted-foreground">
                            Loading survey details...
                        </p>
                    </div>
                </div>
            </PageWrapper>
        );
    }

    if (!surveyData) {
        return (
            <PageWrapper title="Survey Details">
                <div className="text-center py-12">
                    <p className="text-muted-foreground">Survey not found</p>
                    <Button onClick={() => router?.back()} className="mt-4">
                        Go Back
                    </Button>
                </div>
            </PageWrapper>
        );
    }

    const getQuestionTypeLabel = (type: string) => {
        switch (type) {
            case "text":
                return "Text Answer";
            case "single":
                return "Single Choice";
            case "multiple":
                return "Multiple Choice";
            default:
                return type;
        }
    };

    const getQuestionTypeColor = (type: string) => {
        switch (type) {
            case "text":
                return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
            case "single":
                return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
            case "multiple":
                return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
        }
    };

    const sortedQuestions = [...surveyData?.questions].sort(
        (a, b) => a?.order - b?.order
    );

    return (
        <PageWrapper title="Survey Details">
            <div className="space-y-6">
                {/* Header Actions */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <EyeIcon className="h-6 w-6 text-muted-foreground" />
                        <h1 className="text-2xl font-bold">Survey Details</h1>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => router?.back()}
                        >
                            Back
                        </Button>
                        <Button
                            onClick={() =>
                                router?.push(`/admin/survey/${params?.id}/edit`)
                            }
                        >
                            <PencilIcon />
                            Edit Survey
                        </Button>
                    </div>
                </div>

                {/* Survey Information Card */}
                <Card>
                    <CardHeader>
                        <div className="flex items-start justify-between">
                            <div className="space-y-1">
                                <CardTitle className="text-2xl">
                                    {surveyData?.title}
                                </CardTitle>
                                <CardDescription>
                                    {surveyData?.description}
                                </CardDescription>
                            </div>
                            <Badge
                                variant={
                                    surveyData?.is_active
                                        ? "default"
                                        : "secondary"
                                }
                                className="flex items-center gap-1"
                            >
                                {surveyData?.is_active ? (
                                    <>
                                        <CheckCircle2Icon className="h-3 w-3" />
                                        Active
                                    </>
                                ) : (
                                    <>
                                        <XCircleIcon className="h-3 w-3" />
                                        Inactive
                                    </>
                                )}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                                <p className="text-muted-foreground">
                                    Total Questions
                                </p>
                                <p className="text-lg font-semibold">
                                    {surveyData?.questions?.length}
                                </p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">
                                    Total Responses
                                </p>
                                <p className="text-lg font-semibold">
                                    {surveyData?.responses_count}
                                </p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">
                                    Created At
                                </p>
                                <p className="text-lg font-semibold">
                                    {new Date(
                                        surveyData?.created_at
                                    ).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Questions List */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">
                        Questions ({sortedQuestions?.length})
                    </h2>

                    {sortedQuestions?.length === 0 ? (
                        <Card>
                            <CardContent className="py-8 text-center text-muted-foreground">
                                No questions in this survey
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {sortedQuestions?.map((question, index) => (
                                <Card key={question?.id}>
                                    <CardHeader>
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1 space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                                                        {index + 1}
                                                    </span>
                                                    <CardTitle className="text-lg">
                                                        {question?.text}
                                                    </CardTitle>
                                                </div>
                                                <div className="flex items-center gap-2 ml-10">
                                                    <Badge
                                                        className={getQuestionTypeColor(
                                                            question?.question_type
                                                        )}
                                                    >
                                                        {getQuestionTypeLabel(
                                                            question?.question_type
                                                        )}
                                                    </Badge>
                                                    {question?.required && (
                                                        <Badge
                                                            variant="outline"
                                                            className="text-red-600 border-red-600"
                                                        >
                                                            Required
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </CardHeader>

                                    {question?.choices &&
                                        question?.choices?.length > 0 && (
                                            <>
                                                <Separator />
                                                <CardContent className="pt-6">
                                                    <p className="text-sm font-medium text-muted-foreground mb-3">
                                                        Answer Choices:
                                                    </p>
                                                    <div className="space-y-2">
                                                        {[...question?.choices]
                                                            .sort(
                                                                (a, b) =>
                                                                    a?.order -
                                                                    b?.order
                                                            )
                                                            .map(
                                                                (
                                                                    choice,
                                                                    choiceIndex
                                                                ) => (
                                                                    <div
                                                                        key={
                                                                            choice?.id
                                                                        }
                                                                        className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                                                                    >
                                                                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-background text-xs font-medium">
                                                                            {choiceIndex +
                                                                                1}
                                                                        </span>
                                                                        <span className="text-sm">
                                                                            {
                                                                                choice?.text
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                )
                                                            )}
                                                    </div>
                                                </CardContent>
                                            </>
                                        )}
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </PageWrapper>
    );
}
