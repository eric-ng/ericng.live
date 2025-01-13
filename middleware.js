import { NextResponse } from "next/server";
import { authMiddleware, redirectToLogin } from "next-firebase-auth-edge";
import { clientConfig, serverConfig } from "@/auth/config";

const PUBLIC_PATHS = ['/walktripper/register', '/walktripper/login'];

export async function middleware(request) {
    return authMiddleware(request, {
        loginPath: "/api/login",
        logoutPath: "/api/logout",
        apiKey: clientConfig.apiKey,
        cookieName: serverConfig.cookieName,
        cookieSignatureKeys: serverConfig.cookieSignatureKeys,
        cookieSerializeOptions: serverConfig.cookieSerializeOptions,
        serviceAccount: serverConfig.serviceAccount,
        handleValidToken: async ({token, decodedToken}, headers) => {
            if (PUBLIC_PATHS.includes(request.nextUrl.pathname)) {
                return NextResponse.redirect(new URL(`${process.env.SERVER}/walktripper`));
            }
            return NextResponse.next({
                request: {
                    headers,
                }
            });
        },
        handleInvalidToken: async (reason) => {
            console.log(`Invalid: ${reason}`);
            return redirectToLogin(request, {
                path: '/walktripper/login', 
                publicPaths: PUBLIC_PATHS
            });
        },
        handleError: async (error) => {
            console.log(`Error: ${error}`);
            return redirectToLogin(request, {
                path: '/walktripper/login', 
                publicPaths: PUBLIC_PATHS
            });
        },
    });
}

export const config = {
    matcher: [
        "/((?!_next|api|porfo|about|walktripper|.*\\.|$).*)",
        "/walktripper",
        "/api/login",
        "/api/logout",
    ],
};