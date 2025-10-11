import { Skeleton } from "../ui/skeleton";
import { TableCell, TableRow } from "../ui/table";

export default function TableSkeleton({ columns }: { columns: number }) {
    return (
        <>
            {Array.from({ length: 10 }).map((_, indexRow) => (
                <TableRow key={indexRow}>
                    {Array.from({ length: columns }).map((_, indexCell) => (
                        <TableCell key={indexCell}>
                            <Skeleton className="w-1/2 h-[20px] bg-gray-500/10 rounded-full" />
                        </TableCell>
                    ))}
                </TableRow>
            ))}
        </>
    );
}
