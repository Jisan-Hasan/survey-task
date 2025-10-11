"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { GetQuery } from "@/lib/queries";
import { Calendar, FileText, Users } from "lucide-react";
import { useRouter } from "next/navigation";

interface Choice {
    id: number;
    text: string;
    order: number;
}

interface Question {
    id: number;
    text: string;
    question_type: "text" | "single" | "multiple";
    required: boolean;
    order: number;
    choices: Choice[];
}

interface Survey {
    id: number;
    title: string;
    description: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    questions: Question[];
    responses_count: number;
}

export default function SurveyList() {
    const router = useRouter();
    const { data, isLoading } = GetQuery("surveys", {
        pathname: "public-list",
    });

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
                        <p className="mt-4 text-muted-foreground">
                            Loading surveys...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const surveys: Survey[] = data?.data?.results || [];

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">Available Surveys</h1>
                <p className="text-muted-foreground">
                    Participate in surveys and share your valuable feedback
                </p>
            </div>

            {surveys.length === 0 ? (
                <Card className="text-center py-12">
                    <CardContent>
                        <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">
                            No surveys available
                        </h3>
                        <p className="text-muted-foreground">
                            There are no active surveys at the moment. Please
                            check back later.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {surveys.map((survey) => (
                        <Card
                            key={survey.id}
                            className="flex flex-col hover:shadow-lg transition-shadow"
                        >
                            <CardHeader>
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <CardTitle className="text-xl line-clamp-2">
                                        {survey.title}
                                    </CardTitle>
                                    {survey.is_active && (
                                        <Badge
                                            variant="default"
                                            className="shrink-0"
                                        >
                                            Active
                                        </Badge>
                                    )}
                                </div>
                                <CardDescription className="line-clamp-3">
                                    {survey.description}
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="flex-1">
                                <div className="space-y-2 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <FileText className="h-4 w-4" />
                                        <span>
                                            {survey.questions.length} questions
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4" />
                                        <span>
                                            {survey.responses_count} responses
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        <span>
                                            Created{" "}
                                            {new Date(
                                                survey.created_at
                                            ).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>

                            <CardFooter>
                                <Button
                                    className="w-full"
                                    onClick={() =>
                                        router.push(`/participate/${survey.id}`)
                                    }
                                    disabled={!survey.is_active}
                                >
                                    {survey.is_active
                                        ? "Participate Now"
                                        : "Survey Closed"}
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
