import PageWrapper from "@/components/admin/page-wrapper";
import { Wrench } from "lucide-react";

const page = () => {
    return (
        <PageWrapper title="Dashboard & Summary">
            <div className="flex flex-col items-center justify-center py-10 space-y-3 min-h-[70vh]">
                <Wrench className="w-8 h-8 text-gray-400" />
                <p className="text-lg font-semibold text-gray-600 dark:text-gray-400">
                    Under development
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                    Check back soon for updates!
                </p>
            </div>
        </PageWrapper>
    );
};

export default page;
