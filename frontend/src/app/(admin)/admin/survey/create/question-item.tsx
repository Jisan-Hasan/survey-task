"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVerticalIcon, PlusIcon, TrashIcon } from "lucide-react";
import { ChoiceItem } from "./choice-item";

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

interface QuestionItemProps {
    question: Question;
    onUpdate: (id: string, updates: Partial<Question>) => void;
    onDelete: (id: string) => void;
}

export function QuestionItem({
    question,
    onUpdate,
    onDelete,
}: QuestionItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: question?.id });

    const style = {
        transform: CSS?.Transform?.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const addChoice = () => {
        const choices = question?.choices || [];
        const newChoice: Choice = {
            id: `choice-${Date.now()}`,
            text: "",
            order: choices?.length + 1,
        };
        onUpdate(question?.id, { choices: [...choices, newChoice] });
    };

    const updateChoice = (choiceId: string, text: string) => {
        const choices = question?.choices || [];
        onUpdate(question?.id, {
            choices: choices?.map((c) =>
                c?.id === choiceId ? { ...c, text } : c
            ),
        });
    };

    const deleteChoice = (choiceId: string) => {
        const choices = question?.choices || [];
        onUpdate(question?.id, {
            choices: choices?.filter((c) => c?.id !== choiceId),
        });
    };

    const handleChoiceDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        const choices = question?.choices || [];

        if (over && active?.id !== over?.id) {
            const oldIndex = choices?.findIndex(
                (item) => item?.id === active?.id
            );
            const newIndex = choices?.findIndex(
                (item) => item?.id === over?.id
            );
            const reordered = arrayMove(choices, oldIndex, newIndex);

            // Update order property
            const updatedChoices = reordered?.map((item, index) => ({
                ...item,
                order: index + 1,
            }));

            onUpdate(question?.id, { choices: updatedChoices });
        }
    };

    const handleTypeChange = (type: "text" | "single" | "multiple") => {
        const updates: Partial<Question> = { question_type: type };

        // Initialize choices for single/multiple types if they don't exist
        if (
            (type === "single" || type === "multiple") &&
            !question.choices?.length
        ) {
            updates.choices = [
                { id: `choice-${Date.now()}-1`, text: "", order: 1 },
                { id: `choice-${Date.now()}-2`, text: "", order: 2 },
            ];
        }

        onUpdate(question.id, updates);
    };

    const showChoices =
        question.question_type === "single" ||
        question.question_type === "multiple";

    const hasEmptyQuestionText = !question.text.trim();
    // const hasEmptyChoices =
    //     showChoices && question.choices?.some((c) => !c.text.trim());
    const hasInsufficientChoices =
        showChoices && (!question.choices || question.choices.length < 2);

    return (
        <Card ref={setNodeRef} style={style}>
            <CardContent className="p-4">
                <div className="flex gap-3">
                    {/* Drag Handle */}
                    <button
                        className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground mt-2"
                        {...attributes}
                        {...listeners}
                    >
                        <GripVerticalIcon className="size-5" />
                    </button>

                    {/* Question Content */}
                    <div className="flex-1 space-y-4">
                        {/* Question Header */}
                        <div className="flex gap-3 items-start">
                            <div className="flex-1 space-y-3">
                                {/* Question text with validation */}
                                <div>
                                    <Input
                                        placeholder="Enter question text"
                                        value={question.text}
                                        onChange={(e) =>
                                            onUpdate(question.id, {
                                                text: e.target.value,
                                            })
                                        }
                                        className={
                                            hasEmptyQuestionText
                                                ? "border-destructive"
                                                : ""
                                        }
                                    />
                                    {hasEmptyQuestionText && (
                                        <p className="text-xs text-destructive mt-1">
                                            Question text is required
                                        </p>
                                    )}
                                </div>

                                <div className="flex gap-3 items-center">
                                    <Select
                                        value={question.question_type}
                                        onValueChange={handleTypeChange}
                                    >
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="text">
                                                Text Answer
                                            </SelectItem>
                                            <SelectItem value="single">
                                                Single Choice
                                            </SelectItem>
                                            <SelectItem value="multiple">
                                                Multiple Choice
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>

                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <Checkbox
                                            checked={question.required}
                                            onCheckedChange={(checked) =>
                                                onUpdate(question.id, {
                                                    required:
                                                        checked as boolean,
                                                })
                                            }
                                        />
                                        <span className="text-sm">
                                            Required
                                        </span>
                                    </label>
                                </div>
                            </div>

                            <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                onClick={() => onDelete(question.id)}
                                className="text-destructive hover:text-destructive"
                            >
                                <TrashIcon />
                            </Button>
                        </div>

                        {/* Choices Section */}
                        {showChoices && (
                            <div className="pl-4 border-l-2 space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">
                                        Choices
                                    </span>
                                    <Button
                                        type="button"
                                        onClick={addChoice}
                                        size="sm"
                                        variant="ghost"
                                    >
                                        <PlusIcon />
                                        Add Choice
                                    </Button>
                                </div>

                                {/* Validation message for insufficient choices */}
                                {hasInsufficientChoices && (
                                    <p className="text-xs text-destructive">
                                        At least 2 choices are required
                                    </p>
                                )}

                                {question.choices &&
                                question.choices.length > 0 ? (
                                    <DndContext
                                        sensors={sensors}
                                        collisionDetection={closestCenter}
                                        onDragEnd={handleChoiceDragEnd}
                                    >
                                        <SortableContext
                                            items={question.choices.map(
                                                (c) => c.id
                                            )}
                                            strategy={
                                                verticalListSortingStrategy
                                            }
                                        >
                                            <div className="space-y-2">
                                                {question.choices.map(
                                                    (choice) => (
                                                        <ChoiceItem
                                                            key={choice.id}
                                                            choice={choice}
                                                            questionType={
                                                                question.question_type
                                                            }
                                                            onUpdate={
                                                                updateChoice
                                                            }
                                                            onDelete={
                                                                deleteChoice
                                                            }
                                                        />
                                                    )
                                                )}
                                            </div>
                                        </SortableContext>
                                    </DndContext>
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        No choices yet. Click Add Choice to add
                                        options.
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
