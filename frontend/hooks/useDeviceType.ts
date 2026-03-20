"use client";
import { useState, useEffect } from "react";

type DeviceType = "mobile" | "tablet" | "desktop";

export function useDeviceType(): DeviceType {
    const [deviceType, setDeviceType] = useState<DeviceType>("desktop");

    useEffect(() => {
        function update() {
            const w = window.innerWidth;
            if (w < 640) setDeviceType("mobile");
            else if (w < 1024) setDeviceType("tablet");
            else setDeviceType("desktop");
        }
        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, []);

    return deviceType;
}
