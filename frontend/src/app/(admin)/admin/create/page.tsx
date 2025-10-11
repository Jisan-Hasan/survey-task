"use client";

import PageWrapper from "@/components/admin/page-wrapper";
import AdminUserForm from "../admin-form";

export default function Page() {
    return (
        <PageWrapper title="Create Admin">
            <AdminUserForm />
        </PageWrapper>
    );
}
