"use client";
import PageWrapper from "@/components/admin/page-wrapper";
import { useParams } from "next/navigation";
import AdminUserForm from "../../admin-form";

export default function Page() {
    const params = useParams();

    return (
        <PageWrapper title="Update Admin User">
            <AdminUserForm id={params?.id as string} />
        </PageWrapper>
    );
}
