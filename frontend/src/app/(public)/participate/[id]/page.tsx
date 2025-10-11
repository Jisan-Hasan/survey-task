"use client";

import type React from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { GetQuery } from "@/lib/queries";
import { postRequest } from "@/lib/requests";
import { handleResponse } from "@/lib/utils";
import { AlertCircle, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

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
    questions: Question[];
}

interface Answer {
    question: number;
    text?: string;
    selected_choice?: number;
    selected_choices?: number[];
}

export default function ParticipatePage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [answers, setAnswers] = useState<Record<number, Answer>>({});
    const [errors, setErrors] = useState<Record<number, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    // Simulating GetQuery - replace with actual implementation
    const { data, isLoading } = GetQuery("surveys", {
        pathname: `details/${id}`,
    });
    const survey: Survey | null = data?.data || null;

    const handleTextAnswer = (questionId: number, text: string) => {
        setAnswers((prev) => ({
            ...prev,
            [questionId]: { question: questionId, text },
        }));
        // Clear error when user starts typing
        if (errors[questionId]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[questionId];
                return newErrors;
            });
        }
    };

    const handleSingleChoice = (questionId: number, choiceId: number) => {
        setAnswers((prev) => ({
            ...prev,
            [questionId]: { question: questionId, selected_choice: choiceId },
        }));
        // Clear error when user selects
        if (errors[questionId]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[questionId];
                return newErrors;
            });
        }
    };

    const handleMultipleChoice = (
        questionId: number,
        choiceId: number,
        checked: boolean
    ) => {
        setAnswers((prev) => {
            const currentAnswer = prev[questionId];
            const currentChoices = currentAnswer?.selected_choices || [];

            const newChoices = checked
                ? [...currentChoices, choiceId]
                : currentChoices.filter((id) => id !== choiceId);

            return {
                ...prev,
                [questionId]: {
                    question: questionId,
                    selected_choices: newChoices,
                },
            };
        });
        // Clear error when user selects
        if (errors[questionId]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[questionId];
                return newErrors;
            });
        }
    };

    const validateForm = (): boolean => {
        if (!survey) return false;

        const newErrors: Record<number, string> = {};

        survey.questions.forEach((question) => {
            if (question.required) {
                const answer = answers[question.id];

                if (!answer) {
                    newErrors[question.id] = "This question is required";
                } else if (
                    question.question_type === "text" &&
                    !answer.text?.trim()
                ) {
                    newErrors[question.id] = "Please provide an answer";
                } else if (
                    question.question_type === "single" &&
                    !answer.selected_choice
                ) {
                    newErrors[question.id] = "Please select an option";
                } else if (
                    question.question_type === "multiple" &&
                    (!answer.selected_choices ||
                        answer.selected_choices.length === 0)
                ) {
                    newErrors[question.id] =
                        "Please select at least one option";
                }
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const payload = {
                answers: Object.values(answers),
            };

            console.log("Submitting response:", payload);

            const response = await postRequest("surveys", payload, {
                pathname: `${params?.id}/answers`,
            });

            const status = handleResponse(response);

            if (status) {
                setSubmitSuccess(true);
            }

            // Redirect after 2 seconds
            setTimeout(() => {
                router.push("/");
            }, 2000);
        } catch (error) {
            console.error("Error submitting response:", error);
            alert("Failed to submit response. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
                        <p className="mt-4 text-muted-foreground">
                            Loading survey...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (!survey) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
                            <h3 className="text-lg font-semibold mb-2">
                                Survey not found
                            </h3>
                            <p className="text-muted-foreground mb-4">
                                The survey you&apos;re looking for doesn&apos;t
                                exist or has been removed.
                            </p>
                            <Button onClick={() => router.push("/")}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Home
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (submitSuccess) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Card className="max-w-2xl mx-auto">
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <CheckCircle2 className="mx-auto h-16 w-16 text-green-500 mb-4" />
                            <h3 className="text-2xl font-bold mb-2">
                                Thank You!
                            </h3>
                            <p className="text-muted-foreground mb-4">
                                Your response has been submitted successfully.
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Redirecting you back to surveys...
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const sortedQuestions = [...survey.questions].sort(
        (a, b) => a.order - b.order
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-3xl mx-auto">
                <Button
                    variant="ghost"
                    onClick={() => router.push("/")}
                    className="mb-6"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Home
                </Button>

                <Card className="mb-6">
                    <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <CardTitle className="text-3xl mb-2">
                                    {survey.title}
                                </CardTitle>
                                <CardDescription className="text-base">
                                    {survey.description}
                                </CardDescription>
                            </div>
                            {survey.is_active && (
                                <Badge variant="default" className="shrink-0">
                                    Active
                                </Badge>
                            )}
                        </div>
                    </CardHeader>
                </Card>

                {Object.keys(errors).length > 0 && (
                    <Alert variant="destructive" className="mb-6">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            Please answer all required questions before
                            submitting.
                        </AlertDescription>
                    </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {sortedQuestions.map((question, index) => {
                        const sortedChoices = [...question.choices].sort(
                            (a, b) => a.order - b.order
                        );
                        const hasError = !!errors[question.id];

                        return (
                            <Card
                                key={question.id}
                                className={hasError ? "border-destructive" : ""}
                            >
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-start gap-2">
                                        <span className="text-muted-foreground shrink-0">
                                            {index + 1}.
                                        </span>
                                        <span className="flex-1">
                                            {question.text}
                                            {question.required && (
                                                <span className="text-destructive ml-1">
                                                    *
                                                </span>
                                            )}
                                        </span>
                                        <Badge
                                            variant="outline"
                                            className="shrink-0"
                                        >
                                            {question.question_type ===
                                                "text" && "Text"}
                                            {question.question_type ===
                                                "single" && "Single Choice"}
                                            {question.question_type ===
                                                "multiple" && "Multiple Choice"}
                                        </Badge>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {question.question_type === "text" && (
                                        <div className="space-y-2">
                                            <Textarea
                                                placeholder="Enter your answer..."
                                                value={
                                                    answers[question.id]
                                                        ?.text || ""
                                                }
                                                onChange={(e) =>
                                                    handleTextAnswer(
                                                        question.id,
                                                        e.target.value
                                                    )
                                                }
                                                className={
                                                    hasError
                                                        ? "border-destructive"
                                                        : ""
                                                }
                                                rows={4}
                                            />
                                            {hasError && (
                                                <p className="text-sm text-destructive">
                                                    {errors[question.id]}
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {question.question_type === "single" && (
                                        <div className="space-y-2">
                                            <RadioGroup
                                                value={
                                                    answers[
                                                        question.id
                                                    ]?.selected_choice?.toString() ||
                                                    ""
                                                }
                                                onValueChange={(value) =>
                                                    handleSingleChoice(
                                                        question.id,
                                                        Number.parseInt(value)
                                                    )
                                                }
                                            >
                                                {sortedChoices.map((choice) => (
                                                    <div
                                                        key={choice.id}
                                                        className="flex items-center space-x-2"
                                                    >
                                                        <RadioGroupItem
                                                            value={choice.id.toString()}
                                                            id={`choice-${choice.id}`}
                                                        />
                                                        <Label
                                                            htmlFor={`choice-${choice.id}`}
                                                            className="cursor-pointer font-normal"
                                                        >
                                                            {choice.text}
                                                        </Label>
                                                    </div>
                                                ))}
                                            </RadioGroup>
                                            {hasError && (
                                                <p className="text-sm text-destructive">
                                                    {errors[question.id]}
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {question.question_type === "multiple" && (
                                        <div className="space-y-2">
                                            <div className="space-y-3">
                                                {sortedChoices.map((choice) => (
                                                    <div
                                                        key={choice.id}
                                                        className="flex items-center space-x-2"
                                                    >
                                                        <Checkbox
                                                            id={`choice-${choice.id}`}
                                                            checked={
                                                                answers[
                                                                    question.id
                                                                ]?.selected_choices?.includes(
                                                                    choice.id
                                                                ) || false
                                                            }
                                                            onCheckedChange={(
                                                                checked
                                                            ) =>
                                                                handleMultipleChoice(
                                                                    question.id,
                                                                    choice.id,
                                                                    checked as boolean
                                                                )
                                                            }
                                                        />
                                                        <Label
                                                            htmlFor={`choice-${choice.id}`}
                                                            className="cursor-pointer font-normal"
                                                        >
                                                            {choice.text}
                                                        </Label>
                                                    </div>
                                                ))}
                                            </div>
                                            {hasError && (
                                                <p className="text-sm text-destructive">
                                                    {errors[question.id]}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })}

                    <div className="flex gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.push("/surveys")}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1"
                        >
                            {isSubmitting ? "Submitting..." : "Submit Response"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
