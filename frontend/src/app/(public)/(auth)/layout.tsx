export default async function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <div className="w-full lg:grid lg:grid-cols-2">
                <div className="flex h-screen w-full items-center justify-center px-4">
                    {children}
                </div>
            </div>
        </>
    );
}
