
"use client";

import Button from "@/components/ui/button";
import FloatingLabelSelect from "@/components/ui/select";
import FloatingLabelInput from "@/components/ui/input";
import FileUpload from "@/components/ui/inputFile";
import { AsyncBuilder } from "@/components/ui/asyncBuilder";
import { LoadingSpinner } from "@/lib/load.helper";
import { Civility } from "@/models/civility";
import { HttpService } from "@/utils/http.services";
import { useActionState, useRef, useState } from "react";
import { Hire } from "@/models/hire";
import { addHire } from "@/app/actions/hire";
import InputError from "@/components/ui/inputError";
import MultiSelect from "@/components/ui/multiSelect";
import { Sector } from "@/models/sector";
const EditorJSComponent = dynamic(() => import("@/components/ui/editorJS"), { ssr: false });
import SuccessSend from "./successSend";
import dynamic from "next/dynamic";


export default function HiringRequest() {

    const [state, action, pending] = useActionState(addHire, undefined);

    const [hire, setHire] = useState(Hire.fromJSON({} as any));

    const inputDocumentSupportRef = useRef<HTMLInputElement>(null);

    const handleUploadDocumentSupport = async (e: File) => {
        if (e) {

            if (inputDocumentSupportRef.current) {
                const dt = new DataTransfer();
                dt.items.add(e);
                inputDocumentSupportRef.current.files = dt.files;
            }
        }
    };

    return <section className="mx-auto w-lvw mb-0 p-10 bg-gray-200 text-center">
        <h2 className="text-3xl font-semibold text my-10 text-gray-800">
            Tell us what you need, we'll take care of the rest!
        </h2>
        {state === true ?
            <SuccessSend />
            :
            <div className="bg-blue-100 rounded-3xl p-10 border max-w-5xl mx-auto border-gray-300 shadow-lg mb-10">
                <h2 className="text-xl font-medium text-center mb-10 text-gray-600">
                    Submit your hiring Request
                </h2>
                <form action={action} className="grid grid-cols-12 gap-4 w-full ">
                    <div className="col-span-12 text-left">
                        <AsyncBuilder
                            promise={async () => { return HttpService.index<Civility>({ url: '/civilities', fromJson: (json: any) => Civility.fromJSON(json), }) }}
                            loadingComponent={<LoadingSpinner color="#0F766E"></LoadingSpinner>}
                            hasData={(data) =>
                                <FloatingLabelSelect
                                    error={state?.errors && state?.errors.civilityId && state.errors.civilityId.join(', ')}
                                    label="Civility"
                                    name="civility"
                                    onChange={(e) => { setHire(hire.update({ civilityId: e.target.value })) }}
                                    options={data.data.map((s) => ({ value: s.id, label: s.libelle }))} />
                            }
                        />
                    </div>
                    <div className="col-span-6 text-left">
                        <FloatingLabelInput
                            type="text"
                            label="Name*"
                            name="name"
                            value={hire.lastName}
                            error={state?.errors && state?.errors.lastName && state.errors.lastName.join(', ')}
                            onChange={(e) => { setHire(hire.update({ lastName: e.target.value })) }}
                            className="px-4 py-2 border w-full bg-white text-gray-600 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="col-span-6 text-left">
                        <FloatingLabelInput
                            type="text"
                            label="First name*"
                            name="firstName"
                            value={hire.firstName}
                            error={state?.errors && state?.errors.firstName && state.errors.firstName.join(', ')}
                            onChange={(e) => { setHire(hire.update({ firstName: e.target.value })) }}
                            className="px-4 py-2 border w-full bg-white text-gray-600 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="col-span-6 text-left">
                        <FloatingLabelInput
                            type="number"
                            label="Phone*"
                            name="phone"
                            value={hire.phone}
                            error={state?.errors && state?.errors.phone && state.errors.phone.join(', ')}
                            onChange={(e) => { setHire(hire.update({ phone: e.target.value })) }}
                            className="px-4 py-2 border w-full bg-white text-gray-600 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="col-span-6 text-left">
                        <FloatingLabelInput
                            type="email"
                            label="Email*"
                            name="email"
                            value={hire.email}
                            error={state?.errors && state?.errors.email && state.errors.email.join(', ')}
                            onChange={(e) => { setHire(hire.update({ email: e.target.value })) }}
                            className="px-4 py-2 border w-full bg-white text-gray-600 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    <div className="col-span-6 text-left">
                        <input type="text" hidden value={hire.sectors && hire.sectors.map((s) => s.id).join(',')} name="sectors"
                            onChange={(e) => setHire(hire.update({ sectors: hire.sectors }))} />
                        <AsyncBuilder
                            promise={async () => { return HttpService.index<Sector>({ url: '/sectors?limit=50', fromJson: (json: any) => Sector.fromJSON(json), }) }}
                            loadingComponent={<LoadingSpinner color="#0F766E"></LoadingSpinner>}
                            hasData={(data) => <MultiSelect
                                className="!bg-white !p-0"
                                placeholder='Sélectionner les Secteurs'
                                items={data.data.map((s) => ({ value: s.id, label: s.libelle }))}
                                onChange={(e) => setHire(hire.update({ sectors: e.map((e) => Sector.fromJSON({ id: e.value, libelle: e.label })) }))
                                }
                            />
                            }
                        />
                        <InputError messages={state?.errors?.sectors} inputName="sectors" />
                    </div>
                    <div className="col-span-6 text-left">
                        <FloatingLabelInput
                            type="number"
                            label="Number of positions to be filled*"
                            required
                            name="number_of_positions"
                            value={JSON.stringify(hire.number_of_positions)}
                            error={state?.errors && state?.errors.number_of_positions && state.errors.number_of_positions.join(', ')}
                            onChange={(e) => { setHire(hire.update({ number_of_positions: parseInt(e.target.value) })) }}
                            className="px-4 py-2 border w-full bg-white text-gray-600 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>



                    <div className="col-span-6 text-left">
                        <FloatingLabelInput
                            type="text"
                            label="Company name*"
                            name="company_name"
                            value={hire.company_name}
                            error={state?.errors && state?.errors.company_name && state.errors.company_name.join(', ')}
                            onChange={(e) => { setHire(hire.update({ company_name: e.target.value })) }}
                            className="px-4 py-2 border w-full bg-white text-gray-600 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    <div className="col-span-6 text-left">
                        <FloatingLabelInput
                            type="url"
                            label="Company website"
                            name="company_website"
                            value={hire.company_website}
                            error={state?.errors && state?.errors.company_website && state.errors.company_website.join(', ')}
                            onChange={(e) => { setHire(hire.update({ company_website: e.target.value })) }}
                            className="px-4 py-2 border w-full bg-white text-gray-600 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    <div className="col-span-12 text-left">
                        <input type="text" hidden value={JSON.stringify(hire.details_of_positions)} name="details_of_positions" onChange={(e) => {
                            setHire(hire.update({ details_of_positions: [hire.details_of_positions] }))
                        }} />
                        <EditorJSComponent className="bg-white !h-60 !min-h-60 text-slate-800" placeholder="Details of positions*" onChange={(e) => { setHire(hire.update({ details_of_positions: [e] })) }} />
                        <InputError messages={state?.errors?.details_of_positions} inputName="details_of_positions" />
                    </div>

                    <div className="col-span-12 text-left">
                        <p className="text-sm font-regular text-gray-500 my-3 ml-2">
                            Document in support of the request (PDF or DOC)*
                        </p>
                        <input type="file" hidden name="document_support" ref={inputDocumentSupportRef} onChange={(e) => handleUploadDocumentSupport(e.target.files![0])} />
                        <FileUpload onFileSelect={(file) => {
                            handleUploadDocumentSupport(file as File);
                            setHire(
                                Hire.fromJSON({ ...hire.toJSON(), document_support: URL.createObjectURL(file!) })
                            );
                            console.log("document_support", hire.document_support);
                        }} />
                        <InputError messages={state?.errors?.document_support} inputName="document_support" />
                    </div>


                    <div className="col-span-12 text-center">
                        <Button className="!rounded-full text-sm px-20 mx-auto mt-10" isLoading={pending} disabled={pending}>
                            TO START
                        </Button>
                    </div>
                </form>
            </div>}
    </section>

}