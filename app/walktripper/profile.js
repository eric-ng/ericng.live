import { getTokens } from "next-firebase-auth-edge";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { clientConfig, serverConfig } from "@/auth/config";

export default async function Profile() {
    const cooks = await cookies();
    const tokens = await getTokens(cooks, {
        apiKey: clientConfig.apiKey,
        cookieName: serverConfig.cookieName,
        cookieSignatureKeys: serverConfig.cookieSignatureKeys,
        serviceAccount: serverConfig.serviceAccount,
    });

    if (!tokens) {
        return (
            <div className="flex gap-1 divide-x divide-solid">
                <div className="px-2">
                    <a href="/walktripper/register">Signup</a>
                </div>
                <div className="px-2">
                    <a href="/walktripper/login">Login</a>
                </div>
            </div>
        );
    }

    return (
        <div className="flex gap-1">
            Hi, <strong>{tokens?.decodedToken.email}</strong>
            <div className="text-sm">
                (<a className="text-sky-400 hover:underline" href="/walktripper/logout">Logout</a>)
            </div>
        </div>
    );
}