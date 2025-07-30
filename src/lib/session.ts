import { NextResponse } from "next/server";
import { serialize } from "cookie";
import { cookies } from "next/headers";

export const setCookie = (
  res: NextResponse,
  name: string,
  value: string,
  maxAge: number,
  path = "/"
) => {
  res.headers.append(
    "Set-Cookie",
    serialize(name, value, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: path,
      maxAge: maxAge
    })
  );
};

export const deleteCookie = (res: NextResponse, name: string, path = "/") => {
  res.headers.append(
    "Set-Cookie",
    serialize(name, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: path,
      maxAge: 0
    })
  );
};

export const getCookie = async (name: string) => {
  return (await cookies()).get(name)?.value;
};
