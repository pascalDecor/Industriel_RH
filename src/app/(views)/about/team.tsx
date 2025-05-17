import { imagePathFinder } from "@/utils/imagePathFinder";
import Image from "next/image";

export default function Team() {
    return <>
        {/* Catalyst of prosperity for Quebec businesses */}
        <section className="mx-auto w-lvw mb-0 px-10 py-24 bg-gray-200">
            <h2 className="text-3xl font-semibold text mb-20 text-black text-center">
                Leadership team
            </h2>

            <div className="mx-auto max-w-5xl mb-10 p-10 grid grid-cols-3 gap-4">
                <div className="col-span-1 border border-gray-200 p-7 rounded-2xl text-center bg-gradient-to-t from-gray-300 to-gray-200 h-full">
                    <Image src={imagePathFinder.Jerome_youmani_lankoande} alt="Describe your Need" className="w-40 mb-4 mx-auto -mt-20" />
                    <p className="text uppercase font-semibold mb-5  text-blue-900 text-center">
                        Jérôme Youmani Lankoandé +
                    </p>
                    <p className="text-sm font-regular text  text-gray-500 text-center">
                        Président Directeur Général
                    </p>
                </div>
                <div className="col-span-1 border border-gray-200 p-7 rounded-2xl text-center bg-gradient-to-t from-gray-300 to-gray-200 h-full">
                    <Image src={imagePathFinder.alice_morin} alt="Describe your Need" className="w-40 mb-4 mx-auto -mt-20" />
                    <p className="text uppercase font-semibold mb-5  text-blue-900 text-center">
                        Alice Morin
                    </p>
                    <p className="text-sm font-regular text  text-gray-500 text-center">
                        Gestionnaire de projet TI
                    </p>
                </div>
                <div className="col-span-1 border border-gray-200 p-7 rounded-2xl text-center bg-gradient-to-t from-gray-300 to-gray-200 h-full">
                    <Image src={imagePathFinder.louis_caron} alt="Describe your Need" className="w-40 mb-4 mx-auto -mt-20" />
                    <p className="text uppercase font-semibold mb-5  text-blue-900 text-center">
                        Louis Caron
                    </p>
                    <p className="text-sm font-regular text  text-gray-500 text-center">
                        Directeur de Projet
                    </p>
                </div>

            </div>
            <h2 className="text-3xl font-semibold text mb-20 text-black text-center">
                Board of Directors
            </h2>

            <div className="mx-auto max-w-5xl mb-10 p-10 grid grid-cols-3 gap-4">
                <div className="col-span-1 border border-gray-200 p-7 rounded-2xl text-center bg-gradient-to-t from-gray-300 to-gray-200 h-full">
                    <Image src={imagePathFinder.paul_farcas} alt="Describe your Need" className="w-40 mb-4 mx-auto -mt-20" />
                    <p className="text uppercase font-semibold mb-5  text-blue-900 text-center">
                        Paul Farcas
                    </p>
                    <p className="text-sm font-regular text  text-gray-500 text-center">
                        {"Directeur des Systémes d' Information"}
                    </p>
                </div>
                <div className="col-span-1 border border-gray-200 p-7 rounded-2xl text-center bg-gradient-to-t from-gray-300 to-gray-200 h-full">
                    <Image src={imagePathFinder.komi_sodoke} alt="Describe your Need" className="w-40 mb-4 mx-auto -mt-20" />
                    <p className="text uppercase font-semibold mb-5  text-blue-900 text-center">
                        Komi Sodoke, PhD
                    </p>
                    <p className="text-sm font-regular text  text-gray-500 text-center">
                        Directeur de Projet-Intelligence Artificielle
                    </p>
                </div>
                <div className="col-span-1 border border-gray-200 p-7 rounded-2xl text-center  bg-gradient-to-t from-gray-300 to-gray-200 h-full">
                    <Image src={imagePathFinder.eloise_emery} alt="Describe your Need" className="w-40 mb-4 mx-auto -mt-20" />
                    <p className="text uppercase font-semibold mb-5  text-blue-900 text-center">
                        Éloïse Emery
                    </p>
                    <p className="text-sm font-regular text  text-gray-500 text-center">
                        Développeuse Web et Designer UX/UI
                    </p>
                </div>

            </div>
        </section>
    </>
}