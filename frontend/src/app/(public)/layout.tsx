import Header from "@/components/common/header";

export default async function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Header />
            {children}
            {/* <Footer /> */}
        </>
    );
}
