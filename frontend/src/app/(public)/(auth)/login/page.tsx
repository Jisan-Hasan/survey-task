import LoginForm from "@/components/auth/login-form";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default async function Page() {
    return (
        <Card className="mx-auto max-w-sm">
            <CardHeader>
                <CardTitle className="text-xl">Login</CardTitle>
                <CardDescription>
                    Enter credentials below to login to your account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <LoginForm />
                {/* <div className="mt-4 text-center text-sm">
                    <Link
                        href="/forgot-password"
                        className="ml-auto inline-block text-sm underline"
                    >
                        Forgot your password?
                    </Link>
                </div> */}
            </CardContent>
        </Card>
    );
}
