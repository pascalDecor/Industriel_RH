
"use client";

import Button from "@/components/ui/button";
import FloatingLabelSelect from "@/components/ui/select";
import FloatingLabelInput from "@/components/ui/input";
import FileUpload from "@/components/ui/inputFile";
import { AsyncBuilder } from "@/components/ui/asyncBuilder";
import { LoadingSpinner } from "@/lib/load.helper";
import { HttpService } from "@/utils/http.services";

import { Civility } from "@/models/civility";
import { useActionState, useRef, useState } from "react";
import { addCandidature } from "@/app/actions/candidatures";
import { Sector } from "@/models/sector";
import { Fonction } from "@/models/fonction";
import { City } from "@/models/city";
import { Application } from "@/models/application";
import SuccessSend from "./successSend";
import InputError from "@/components/ui/inputError";


export default function MoveYourCareerForward() {
    const [state, action, pending] = useActionState(addCandidature, undefined);
    const [sectorId, setSectorId] = useState<string | undefined>(undefined);

    const [candidature, setCandidature] = useState(Application.fromJSON({} as any));

    const inputCvRef = useRef<HTMLInputElement>(null);
    const inputLetterRef = useRef<HTMLInputElement>(null);


    const handleUploadCV = async (e: File) => {
        if (e) {
            if (inputCvRef.current) {
                const dt = new DataTransfer();
                dt.items.add(e);
                inputCvRef.current.files = dt.files;
            }
        }
    };

    const handleUploadLetter = async (e: File) => {
        if (e) {

            if (inputLetterRef.current) {
                const dt = new DataTransfer();
                dt.items.add(e);
                inputLetterRef.current.files = dt.files;
            }
        }
    };

    return <section className="mx-auto w-lvw mb-0 p-10 bg-gray-200 text-center">
        <h2 className="text-3xl font-semibold text my-10 text-gray-800">
            Move your career forward
        </h2>
        {state === true ?
            <SuccessSend />
            :
            <div className="bg-blue-100 rounded-3xl p-10 border max-w-5xl mx-auto border-gray-300 shadow-lg mb-10">
                <h2 className="text-xl font-medium text-center mb-10 text-gray-600">
                    Submit your spontaneous application
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
                                    onChange={(e) => { setCandidature(candidature.update({ civilityId: e.target.value })) }}
                                    options={data.data.map((s) => ({ value: s.id, label: s.libelle }))} />
                            }
                        />

                    </div>
                    <div className="col-span-6 text-left">
                        <FloatingLabelInput
                            type="text"
                            label="Name*"
                            name="name"
                            value={candidature.lastName}
                            error={state?.errors && state?.errors.lastName && state.errors.lastName.join(', ')}
                            onChange={(e) => { setCandidature(candidature.update({ lastName: e.target.value })) }}
                            className="px-4 py-2 border w-full bg-white text-gray-600 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="col-span-6 text-left">
                        <FloatingLabelInput
                            type="text"
                            label="First name*"
                            name="firstName"
                            value={candidature.firstName}
                            error={state?.errors && state?.errors.firstName && state.errors.firstName.join(', ')}
                            onChange={(e) => { setCandidature(candidature.update({ firstName: e.target.value })) }}
                            className="px-4 py-2 border w-full bg-white text-gray-600 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    <div className="col-span-6 text-left">
                        <FloatingLabelInput
                            type="text"
                            label="Address*"
                            name="adresse"
                            value={candidature.adresse}
                            error={state?.errors && state?.errors.adresse && state.errors.adresse.join(', ')}
                            onChange={(e) => { setCandidature(candidature.update({ adresse: e.target.value })) }}
                            className="px-4 py-2 border w-full bg-white text-gray-600 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="col-span-6 text-left">
                        <AsyncBuilder
                            promise={async () => { return HttpService.index<City>({ url: '/cities', fromJson: (json: any) => City.fromJSON(json), }) }}
                            loadingComponent={<LoadingSpinner color="#0F766E"></LoadingSpinner>}
                            hasData={(data) =>
                                <FloatingLabelSelect
                                    label="City"
                                    required
                                    name="city"
                                    error={state?.errors && state?.errors.cityId && state.errors.cityId.join(', ')}
                                    onChange={(e) => { setCandidature(candidature.update({ cityId: e.target.value })) }}
                                    options={data.data.map((s) => ({ value: s.id, label: s.libelle }))} />
                            }
                        />
                    </div>

                    <div className="col-span-6 text-left">
                        <FloatingLabelInput
                            type="number"
                            label="Phone*"
                            name="phone"
                            value={candidature.phone}
                            error={state?.errors && state?.errors.phone && state.errors.phone.join(', ')}
                            onChange={(e) => { setCandidature(candidature.update({ phone: e.target.value })) }}
                            className="px-4 py-2 border w-full bg-white text-gray-600 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="col-span-6 text-left">
                        <FloatingLabelInput
                            type="email"
                            label="Email*"
                            name="email"
                            value={candidature.email}
                            error={state?.errors && state?.errors.email && state.errors.email.join(', ')}
                            onChange={(e) => { setCandidature(candidature.update({ email: e.target.value })) }}
                            className="px-4 py-2 border w-full bg-white text-gray-600 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    <div className="col-span-6 text-left">
                        <AsyncBuilder
                            promise={async () => { return HttpService.index<Sector>({ url: '/sectors', fromJson: (json: any) => Sector.fromJSON(json), }) }}
                            loadingComponent={<LoadingSpinner color="#0F766E"></LoadingSpinner>}
                            hasData={(data) =>
                                <FloatingLabelSelect
                                    error={state?.errors && state?.errors.titre && state.errors.titre.join(', ')}
                                    label="Sector"
                                    required
                                    name="sector"
                                    onChange={(e) => { setSectorId(e.target.value); setCandidature(candidature.update({ sectorId: e.target.value })) }}
                                    options={data.data.map((s) => ({ value: s.id, label: s.libelle }))} />
                            }
                        />
                    </div>
                    <div className="col-span-6 text-left">
                        <AsyncBuilder
                            promise={async () => { return HttpService.index<Fonction>({ url: '/fonctions?sectorId=' + sectorId, fromJson: (json: any) => Fonction.fromJSON(json), }) }}
                            loadingComponent={<LoadingSpinner color="#0F766E"></LoadingSpinner>}
                            callDataListen={sectorId}
                            hasData={(data) =>
                                <FloatingLabelSelect
                                    label="Function"
                                    required
                                    name="function"
                                    error={state?.errors && state?.errors.functionId && state.errors.functionId.join(', ')}
                                    onChange={(e) => { setCandidature(candidature.update({ functionId: e.target.value })) }}
                                    options={data.data.map((s) => ({ value: s.id, label: s.libelle }))} />
                            }
                        />
                    </div>

                    <div className="col-span-12 text-left">
                        <FloatingLabelInput
                            type="number"
                            label="Year(s) of experience"
                            name="year_of_experience"
                            value={JSON.stringify(candidature.year_of_experience)}
                            required
                            error={state?.errors && state?.errors.year_of_experience && state.errors.year_of_experience.join(', ')}
                            onChange={(e) => { setCandidature(candidature.update({ year_of_experience: parseInt(e.target.value) })) }}
                            className="px-4 py-2 border w-full bg-white text-gray-600 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    <div className="col-span-12 text-left">
                        <p className="text-sm font-regular text-gray-500 my-3 ml-2">
                            CV (Word only, doc or docx format)*
                        </p>
                        <input type="file" hidden name="cv" ref={inputCvRef} onChange={(e) => handleUploadCV(e.target.files![0])} />
                        <FileUpload onFileSelect={(file) => {
                            handleUploadCV(file as File);
                            setCandidature(
                                Application.fromJSON({ ...candidature.toJSON(), cv: URL.createObjectURL(file!) })
                            );
                            console.log("cv", candidature.cv);
                        }} />
                        <InputError messages={state?.errors?.cv} inputName="cv" />
                    </div>

                    <div className="col-span-12 text-left">
                        <p className="text-sm font-regular text-gray-500 my-3 ml-2">
                            Cover letter (PDF or DOC)*
                        </p>
                        <input type="file" hidden name="coverLetter" ref={inputLetterRef} onChange={(e) => handleUploadLetter(e.target.files![0])} />
                        <FileUpload onFileSelect={(file) => {
                            handleUploadLetter(file as File);
                            setCandidature(
                                Application.fromJSON({ ...candidature.toJSON(), coverLetter: URL.createObjectURL(file!) })
                            );
                            console.log("coverLetter", candidature.coverLetter);
                        }} />
                        <InputError messages={state?.errors?.coverLetter} inputName="coverLetter" />
                    </div>


                    <div className="col-span-12 text-center">
                        <Button className="!rounded-full text-sm px-20 mx-auto mt-10" type="submit" isLoading={pending} disabled={pending}>
                            TO START
                        </Button>
                    </div>
                </form>
            </div>}
    </section>

}