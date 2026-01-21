module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/app/api/onboarding/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/server.js [app-route] (ecmascript)");
;
function getTokenFromCookie(cookie) {
    const match = cookie.match(/session_token=([^;]+)/);
    return match ? match[1] : null;
}
async function POST(req) {
    const cookie = req.headers.get("cookie") || "";
    const token = getTokenFromCookie(cookie);
    const decodedToken = token ? decodeURIComponent(token) : null;
    // Debug: log incoming request
    console.log("[API] /api/onboarding called");
    console.log("Method:", req.method);
    console.log("Headers:", Object.fromEntries(req.headers.entries()));
    // Try to parse FormData
    let formData = null;
    let jsonData = null;
    let files = [];
    try {
        if (req.headers.get("content-type")?.includes("multipart/form-data")) {
            formData = await req.formData();
            for (const [key, value] of formData.entries()){
                if (key === "data" && typeof value === "string") {
                    jsonData = JSON.parse(value);
                    console.log("Payload data:", jsonData);
                } else if (key === "documents[]" && value instanceof File) {
                    files.push({
                        name: value.name,
                        size: value.size,
                        type: value.type
                    });
                }
            }
            console.log("Uploaded files:", files);
        } else {
            const body = await req.text();
            jsonData = JSON.parse(body);
            console.log("Payload data:", jsonData);
        }
    } catch (err) {
        console.error("Error parsing request body:", err);
    }
    const headers = {
        "Content-Type": req.headers.get("content-type") || "application/json"
    };
    if (decodedToken) {
        headers["Authorization"] = `Bearer ${decodedToken}`;
    }
    let forwardBody = null;
    let forwardHeaders = {
        ...headers
    };
    if (formData) {
        // Reconstruct FormData for forwarding
        forwardBody = new FormData();
        for (const [key, value] of formData.entries()){
            forwardBody.append(key, value);
        }
        // Remove Content-Type so fetch sets correct boundary
        delete forwardHeaders["Content-Type"];
    } else if (jsonData) {
        forwardBody = JSON.stringify(jsonData);
    }
    // Forward request to Laravel
    let res;
    try {
        console.log("[API] Forwarding to Laravel...");
        console.log(`[API] Target URL: ${("TURBOPACK compile-time value", "http://127.0.0.1:8000")}/api/onboarding`);
        console.log("[API] Headers being sent:", forwardHeaders);
        console.log("[API] Body type:", forwardBody instanceof FormData ? "FormData" : typeof forwardBody);
        const controller = new AbortController();
        const timeoutId = setTimeout(()=>{
            console.log("[API] Request timeout after 30 seconds");
            controller.abort();
        }, 30000) // 30 second timeout
        ;
        const startTime = Date.now();
        res = await fetch(`${("TURBOPACK compile-time value", "http://127.0.0.1:8000")}/api/onboarding`, {
            method: "POST",
            headers: forwardHeaders,
            credentials: "include",
            body: forwardBody,
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        const elapsed = Date.now() - startTime;
        console.log(`[API] Laravel responded with status ${res.status} in ${elapsed}ms`);
    } catch (fetchErr) {
        console.error("[API] Failed to reach Laravel backend:", fetchErr);
        console.error("[API] Error name:", fetchErr.name);
        console.error("[API] Error message:", fetchErr.message);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            status: false,
            message: fetchErr.name === "AbortError" ? "Request timeout - Laravel server not responding" : `Cannot connect to Laravel backend: ${fetchErr.message}`,
            error: "Backend connection failed"
        }, {
            status: 503
        });
    }
    const contentType = res.headers.get("content-type") || "";
    const responseText = await res.text();
    console.log("[API] Laravel onboarding response status:", res.status);
    console.log("[API] Laravel onboarding response body:", responseText);
    if (!res.ok) {
        // Try to return JSON error if possible, otherwise include raw text
        if (contentType.includes("application/json")) {
            try {
                const jsonErr = JSON.parse(responseText);
                console.log("[API] Returning parsed error JSON:", jsonErr);
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(jsonErr, {
                    status: res.status
                });
            } catch (parseErr) {
                console.error("[API] Failed to parse error JSON:", parseErr);
            // fallthrough to text
            }
        }
        console.log("[API] Returning error as plain text");
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            status: false,
            message: responseText || "Unknown error",
            error: responseText || "Unknown error"
        }, {
            status: res.status
        });
    }
    // Success: parse JSON if possible, otherwise return text as a JSON message
    if (contentType.includes("application/json")) {
        try {
            const data = JSON.parse(responseText);
            console.log("[API] Returning success JSON:", data);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(data);
        } catch  {
        // fall through to send as message
        }
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        status: true,
        message: responseText
    }, {
        status: res.status
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__889ce57c._.js.map