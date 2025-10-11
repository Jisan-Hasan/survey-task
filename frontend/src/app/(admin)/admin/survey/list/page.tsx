import { surveyColumns } from "@/columns/survey-columns";
import PageWrapper from "@/components/admin/page-wrapper";
import TableComponent from "@/components/common/table-component";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function page() {
    return (
        <PageWrapper
            title="Survey List"
            action={
                <Link href="/admin/survey/create">
                    <Button>Create Survey</Button>
                </Link>
            }
        >
            <TableComponent columns={surveyColumns} url="surveys" />
        </PageWrapper>
    );
}
