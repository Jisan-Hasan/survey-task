"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
    CircleIcon,
    GripVerticalIcon,
    SquareIcon,
    TrashIcon,
} from "lucide-react";

type Choice = {
    id: string;
    text: string;
    order: number;
};

interface ChoiceItemProps {
    choice: Choice;
    questionType: "single" | "multiple" | "text";
    onUpdate: (id: string, text: string) => void;
    onDelete: (id: string) => void;
}

export function ChoiceItem({
    choice,
    questionType,
    onUpdate,
    onDelete,
}: ChoiceItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: choice?.id });

    const style = {
        transform: CSS?.Transform?.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const Icon = questionType === "single" ? CircleIcon : SquareIcon;

    const hasEmptyText = !choice?.text?.trim();

    return (
        <div ref={setNodeRef} style={style} className="space-y-1">
            <div className="flex items-center gap-2 bg-muted/50 rounded-md p-2">
                <button
                    className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
                    {...attributes}
                    {...listeners}
                >
                    <GripVerticalIcon className="size-4" />
                </button>

                <Icon className="size-4 text-muted-foreground" />

                <Input
                    placeholder="Enter choice text"
                    value={choice?.text}
                    onChange={(e) => onUpdate(choice?.id, e?.target?.value)}
                    className={`flex-1 h-8 ${
                        hasEmptyText ? "border-destructive" : ""
                    }`}
                />

                <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => onDelete(choice?.id)}
                    className="text-destructive hover:text-destructive"
                >
                    <TrashIcon className="size-4" />
                </Button>
            </div>

            {hasEmptyText && (
                <p className="text-xs text-destructive pl-10">
                    Choice text is required
                </p>
            )}
        </div>
    );
}
