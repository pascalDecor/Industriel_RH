
"use client";

import Button from "@/components/ui/button";
import FloatingLabelSelect from "@/components/ui/select";
import FloatingLabelInput from "@/components/ui/input";
import FileUpload from "@/components/ui/inputFile";


export default function HiringRequest() {


    return <section className="mx-auto w-lvw mb-0 p-10 bg-gray-200 text-center">
        <h2 className="text-3xl font-semibold text my-10 text-gray-800">
            Tell us what you need, we'll take care of the rest!
        </h2>

        <div className="bg-blue-100 rounded-3xl p-10 border max-w-5xl mx-auto border-gray-300 shadow-lg mb-10">
            <h2 className="text-xl font-medium text-center mb-10 text-gray-600">
                Submit your hiring Request
            </h2>
            <form action="" className="grid grid-cols-12 gap-4 w-full ">
                <div className="col-span-12 text-left">
                    <FloatingLabelSelect label="Civility" name="Civility" options={[{
                        label: "Option 1",
                        value: "option1"
                    }, {
                        label: "Option 2",
                        value: "option2"
                    }, {
                        label: "Option 3",
                        value: "option3"
                    }]} />
                </div>
                <div className="col-span-6 text-left">
                    <FloatingLabelInput
                        type="text"
                        label="Last name"
                        name="name"
                        required
                    />
                </div>
                <div className="col-span-6 text-left">
                    <FloatingLabelInput
                        type="text"
                        label="First name"
                        name="firstName"
                        required
                    />
                </div>

                <div className="col-span-6 text-left">
                    <FloatingLabelInput
                        type="number"
                        label="Phone*"
                        name="phone"
                    />
                </div>
                <div className="col-span-6 text-left">
                    <FloatingLabelInput
                        type="email"
                        label="Email*"
                        name="email"
                    />
                </div>

                <div className="col-span-6 text-left">
                    <FloatingLabelSelect label="sector*" name="Sector" options={[{
                        label: "Option 1",
                        value: "option1"
                    }, {
                        label: "Option 2",
                        value: "option2"
                    }, {
                        label: "Option 3",
                        value: "option3"
                    }]} />
                </div>
                <div className="col-span-6 text-left">
                    <FloatingLabelSelect label="Function*" name="function" options={[{
                        label: "Option 1",
                        value: "option1"
                    }, {
                        label: "Option 2",
                        value: "option2"
                    }, {
                        label: "Option 3",
                        value: "option3"
                    }]} />
                </div>

                <div className="col-span-12 text-left">
                    <FloatingLabelInput
                        type="number"
                        label="Year(s) of experience*"
                        name="year_of_experience"
                    />
                </div>

                <div className="col-span-12 text-left">
                    <p className="text-sm font-regular text-gray-500 my-3 ml-2">
                        CV (Word only, doc or docx format)*
                    </p>
                    <FileUpload  onFileSelect={(file) => console.log("Fichier sélectionné:", file)} />
                </div>

                <div className="col-span-12 text-left">
                    <p className="text-sm font-regular text-gray-500 my-3 ml-2">
                        Cover letter (PDF or DOC)*
                    </p>
                    <FileUpload onFileSelect={(file) => console.log("Fichier sélectionné:", file)} />
                </div>


                <div className="col-span-12 text-center">
                    <Button className="!rounded-full text-sm px-20 mx-auto mt-10">
                        TO START
                    </Button>
                </div>
            </form>
        </div>
    </section>

}