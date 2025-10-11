"use client";

import { useAuth } from "@/providers/auth-provider";

export default function LogoComponent({
    width,
    className,
}: {
    width: number;
    className?: string;
}) {
    const { user } = useAuth();
    console.log(width);

    return <div className={className}>{user?.id}</div>;
}
