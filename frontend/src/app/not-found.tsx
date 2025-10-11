import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { AnyType } from "@/lib/types";
import { Construction } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";
import AdminLayout from "./(admin)/layout";

export default function NotFound() {
    const session = (cookies() as AnyType).get("access")?.value;
    return (
        <>
            {session ? (
                <AdminLayout>
                    <NotFoundComponent />
                </AdminLayout>
            ) : (
                <NotFoundComponent />
            )}
        </>
    );
}

function NotFoundComponent() {
    return (
        <div className="flex w-full items-center justify-center mt-20">
            <Card className="mx-auto max-w-sm">
                <CardHeader className="justify-center text-center pb-2">
                    <div className="relative mx-auto h-24 w-24 text-primary">
                        <Construction className="absolute inset-0 h-full w-full p-2" />
                    </div>
                    <CardTitle className="text-4xl font-bold mt-4">
                        404
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                    <p className="text-xl font-semibold mb-2">
                        Under Developement
                    </p>
                    <p className="text-muted-foreground">
                        Oops! The page you are looking for doesn&apos;t exist or
                        under developement
                    </p>
                </CardContent>
                <CardFooter className="justify-center pb-8">
                    <Button
                        variant="default"
                        asChild
                        className="transition-all duration-200 hover:scale-105"
                    >
                        <Link href={"/"}>Return Home</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
