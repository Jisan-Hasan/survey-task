import { Skeleton } from "../ui/skeleton";

export default function GridSkeleton() {
    return (
        <div className="flex flex-col gap-2 border p-4 rounded-lg">
            {Array.from({ length: 10 }).map((_, index) => (
                <Skeleton
                    className="w-full h-[30px] bg-gray-500/10"
                    key={index}
                />
            ))}
        </div>
    );
}
