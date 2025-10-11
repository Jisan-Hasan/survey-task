import { userColumns } from "@/columns/user-columns";
import PageWrapper from "@/components/admin/page-wrapper";
import TableComponent from "@/components/common/table-component";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function page() {
    return (
        <PageWrapper
            title="Admin User List"
            action={
                <Link href="/admin/create">
                    <Button>Create Admin</Button>
                </Link>
            }
        >
            <TableComponent columns={userColumns} url="users" />
        </PageWrapper>
    );
}
