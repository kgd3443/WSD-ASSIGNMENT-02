// src/hooks/useHorizontalWheel.ts
import { useEffect } from "react";
import type { RefObject } from "react";

export function useHorizontalWheel(ref: RefObject<HTMLElement>) {
    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const onWheel = (e: WheelEvent) => {
            // 트랙패드 가로 스크롤은 그대로 허용
            if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

            // Shift + wheel은 기본 가로 스크롤 유지
            if (e.shiftKey) return;

            e.preventDefault();
            el.scrollLeft += e.deltaY;
        };

        el.addEventListener("wheel", onWheel, { passive: false });

        return () => {
            el.removeEventListener("wheel", onWheel);
        };
    }, [ref]);
}
