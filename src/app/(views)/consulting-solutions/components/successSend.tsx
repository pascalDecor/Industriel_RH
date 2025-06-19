"use client";

import Button from "@/components/ui/button";
import { imagePathFinder } from "@/utils/imagePathFinder";
import { redirect } from "next/navigation";
import Image from 'next/image';

export default function SuccessSend() {
    return <div className="mx-auto mb-0 p-5 rounded-2xl bg-blue-200 text-center">
        <Image src={imagePathFinder.check} alt="Successfully sent your request" className="mx-auto w-30 mb-3" />
        <h2 className="text-3xl font-semibold text mb-2 text-gray-800">
            Successfully sent your request!
        </h2>
        <p className="text-gray-800 mb-7">
            We'll get back to you as soon as possible.
        </p>
        <Button className="mx-auto mb-3 !rounded-full" onClick={() => redirect("/")}>
            Back to Home page
        </Button>
    </div>
}