import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PageWrapper({
    title,
    action,
    children,
    className,
}: {
    title?: string;
    action?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <Card>
            {(title || action) && (
                <CardHeader
                    className={
                        className
                            ? `${className} flex flex-row items-center pb-0`
                            : "flex flex-row justify-between items-center pb-0"
                    }
                >
                    {title && <CardTitle>{title}</CardTitle>}
                    {action}
                </CardHeader>
            )}
            <CardContent className="">{children}</CardContent>
        </Card>
    );
}
