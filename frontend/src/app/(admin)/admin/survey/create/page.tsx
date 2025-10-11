"use client";

import PageWrapper from "@/components/admin/page-wrapper";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { GetQuery } from "@/lib/queries";
import { postRequest } from "@/lib/requests";
import { handleResponse } from "@/lib/utils";
import {
    closestCenter,
    DndContext,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { QuestionItem } from "./question-item";

type Choice = {
    id: string;
    text: string;
    order: number;
};

type Question = {
    id: string;
    question_type: "text" | "single" | "multiple";
    text: string;
    order: number;
    required: boolean;
    choices?: Choice[];
};

type SurveyFormData = {
    title: string;
    description: string;
    is_active: boolean;
};

export default function CreateSurveyPage() {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [validationErrors, setValidationErrors] = useState<string[]>([]);

    const { data } = GetQuery("surveys", { pathname: "9" });

    console.log(data?.data);

    const router = useRouter();

    const form = useForm<SurveyFormData>({
        defaultValues: {
            title: "",
            description: "",
            is_active: true,
        },
    });

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const addQuestion = () => {
        const newQuestion: Question = {
            id: `question-${Date.now()}`,
            question_type: "text",
            text: "",
            order: questions?.length + 1,
            required: false,
            choices: [],
        };
        setQuestions([...questions, newQuestion]);
        setValidationErrors([]); // Clear errors when adding new question
    };

    const updateQuestion = (id: string, updates: Partial<Question>) => {
        setQuestions(
            questions?.map((q) => (q?.id === id ? { ...q, ...updates } : q))
        );
    };

    const deleteQuestion = (id: string) => {
        setQuestions(questions?.filter((q) => q?.id !== id));
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active?.id !== over?.id) {
            setQuestions((items) => {
                const oldIndex = items?.findIndex(
                    (item) => item?.id === active?.id
                );
                const newIndex = items?.findIndex(
                    (item) => item?.id === over?.id
                );
                const reordered = arrayMove(items, oldIndex, newIndex);

                // Update order property
                return reordered?.map((item, index) => ({
                    ...item,
                    order: index + 1,
                }));
            });
        }
    };

    const validateSurvey = (): string[] => {
        const errors: string[] = [];

        // Validate questions
        if (questions?.length === 0) {
            errors?.push("At least one question is required");
        }

        questions?.forEach((question, index) => {
            // Validate question text
            if (!question?.text?.trim()) {
                errors?.push(
                    `Question ${index + 1}: Question text is required`
                );
            }

            // Validate choices for single/multiple choice questions
            if (
                question?.question_type === "single" ||
                question?.question_type === "multiple"
            ) {
                if (!question?.choices || question?.choices?.length < 2) {
                    errors?.push(
                        `Question ${
                            index + 1
                        }: At least 2 choices are required for ${
                            question?.question_type
                        } choice questions`
                    );
                } else {
                    // Validate each choice has text
                    question?.choices?.forEach((choice, choiceIndex) => {
                        if (!choice?.text?.trim()) {
                            errors?.push(
                                `Question ${index + 1}, Choice ${
                                    choiceIndex + 1
                                }: Choice text is required`
                            );
                        }
                    });
                }
            }
        });

        return errors;
    };

    const onSubmit = async (data: SurveyFormData) => {
        const errors = validateSurvey();

        if (errors?.length > 0) {
            setValidationErrors(errors);
            // Scroll to top to show errors
            window?.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        setValidationErrors([]);

        const payload = {
            ...data,
            questions: questions?.map((q) => ({
                question_type: q?.question_type,
                text: q?.text,
                order: q?.order,
                required: q?.required,
                ...(q?.choices && q?.choices?.length > 0
                    ? {
                          choices: q?.choices?.map((c) => ({
                              text: c?.text,
                              order: c?.order,
                          })),
                      }
                    : {}),
            })),
        };

        console.log("Survey payload:", JSON.stringify(payload, null, 2));

        const response = await postRequest("surveys", payload);

        const status = handleResponse(response);

        if (status) {
            router?.back();
        }
    };

    return (
        <PageWrapper title="Create Survey">
            <Form {...form}>
                <form
                    onSubmit={form?.handleSubmit(onSubmit)}
                    className="space-y-8"
                >
                    {validationErrors?.length > 0 && (
                        <div className="bg-destructive/10 border border-destructive rounded-lg p-4">
                            <h3 className="font-semibold text-destructive mb-2">
                                Please fix the following errors:
                            </h3>
                            <ul className="list-disc list-inside space-y-1">
                                {validationErrors?.map((error, index) => (
                                    <li
                                        key={index}
                                        className="text-sm text-destructive"
                                    >
                                        {error}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Survey Details */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold">
                            Survey Details
                        </h2>

                        <FormField
                            control={form?.control}
                            name="title"
                            rules={{ required: "Title is required" }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter survey title"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form?.control}
                            name="description"
                            rules={{ required: "Description is required" }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Enter survey description"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form?.control}
                            name="is_active"
                            render={({ field }) => (
                                <FormItem className="flex items-center gap-2 space-y-0">
                                    <FormControl>
                                        <Checkbox
                                            checked={field?.value}
                                            onCheckedChange={field?.onChange}
                                        />
                                    </FormControl>
                                    <FormLabel className="!mt-0 cursor-pointer">
                                        Active Survey
                                    </FormLabel>
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Questions Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold">Questions</h2>
                            <Button
                                type="button"
                                onClick={addQuestion}
                                size="sm"
                                variant="outline"
                            >
                                <PlusIcon />
                                Add Question
                            </Button>
                        </div>

                        {questions?.length === 0 ? (
                            <div className="border-2 border-dashed rounded-lg p-8 text-center">
                                <p className="text-muted-foreground">
                                    No questions yet. Click Add Question to get
                                    started.
                                </p>
                            </div>
                        ) : (
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={handleDragEnd}
                            >
                                <SortableContext
                                    items={questions?.map((q) => q?.id)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    <div className="space-y-4">
                                        {questions?.map((question) => (
                                            <QuestionItem
                                                key={question?.id}
                                                question={question}
                                                onUpdate={updateQuestion}
                                                onDelete={deleteQuestion}
                                            />
                                        ))}
                                    </div>
                                </SortableContext>
                            </DndContext>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button type="button" variant="outline">
                            Cancel
                        </Button>
                        <Button type="submit">Create Survey</Button>
                    </div>
                </form>
            </Form>
        </PageWrapper>
    );
}
