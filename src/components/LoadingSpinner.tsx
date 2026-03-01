import { Loader2 } from "lucide-react";

export const LoadingSpinner = ({ text = "Processing" }: { text?: string }) => {
    return (
        <div className="flex items-center gap-3 py-1.5 px-0 max-w-fit">
            <Loader2 className="w-4 h-4 animate-spin text-neutral-500" />
            <span className="text-[14px] text-neutral-500">{text}</span>
        </div>
    );
};
