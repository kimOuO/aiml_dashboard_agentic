import { useRouter } from "next/navigation";
import { useCallback } from "react";

export const useBackNavigation = () => {
    const router = useRouter();
    const handleBackClick = useCallback(()=>{
        router.back();
    },[router])

    return handleBackClick;
}