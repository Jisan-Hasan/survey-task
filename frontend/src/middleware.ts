import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { AnyType } from "./lib/types";

const publicRoutes = ["/", "/participate"];
const authRoutes = ["/login"];

export default async function middleware(req: NextRequest) {
    const currentRoute = req.nextUrl.pathname;

    const isPublicRoute =
        publicRoutes.includes(currentRoute) ||
        currentRoute.startsWith("/participate/");

    const isAuthRoute = authRoutes.includes(currentRoute);

    const access = await (cookies() as AnyType).get("access")?.value;

    if (!isPublicRoute && !isAuthRoute && !access) {
        return NextResponse.redirect(new URL("/login", req.nextUrl));
    }

    if (isAuthRoute && access) {
        return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
