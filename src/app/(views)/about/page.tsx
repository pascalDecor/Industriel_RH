import { imagePathFinder } from "@/utils/imagePathFinder";
import Image from 'next/image';

export default function About() {
  return <>
    {/* Catalyst of prosperity for Quebec businesses */}
    <section className="mx-auto max-w-5xl mb-10 p-10">
      <div className="grid grid-cols-5 items-center gap-4 mt-10">
        <div className="lg:col-span-3 col-span-12  pr-4">
          <h2 className="text-3xl font-semibold text mb-14 text-gray-800">
            {"Catalyst of prosperity for Quebec businesses"}
          </h2>
          <p className="text-gray-500 text-sm mb-5">
            {`At Industrielle RH, we firmly believe that people are the cornerstone of every company's success. 
As a specialized staffing agency, we excel in both local and international recruitment, offering a seamless process from understanding your
 needs to integrating the ideal candidates into your team. Guided by our core values of collaboration, innovation, and integrity,
  we are committed to building lasting partnerships and delivering impactful results.
Let us bridge the gap between talent and opportunity, empowering your business to thrive and creating a solid foundation for sustainable growth.`}
          </p>
        </div>
        <div className="lg:col-span-2 col-span-12">
          <Image src={imagePathFinder.about_catalyst_of_prosperity} alt="Salary Guide" />
        </div>
      </div>
    </section>
    {/* Catalyst of prosperity for Quebec businesses */}
    <section className="mx-auto max-w-5xl mb-10 p-10">
      <div className="grid grid-cols-4 items-center gap-4">
        <div className="col-span-1 border-2 border-gray-300 p-7 rounded-2xl text-center h-full">
          <Image src={imagePathFinder.expertise} alt="Describe your Need" className="w-10 mb-4 mx-auto" />
          <p className="text-sm font-semibold mb-5  text-blue-900 text-center">
            Expertise
          </p>
          <p className="text-sm font-regular text  text-gray-500 text-center">
            We excel in accurately identifying top francophone talent, ensuring a seamless match with your specific needs. Our deep understanding of industries guarantees tailored solutions for your workforce challenges.
          </p>
        </div>
        <div className="col-span-1 border-2 border-gray-300 p-7 rounded-2xl text-center h-full">
          <Image src={imagePathFinder.technology} alt="  We Source the Talent" className="w-10 mb-4 mx-auto" />
          <p className="text-sm font-semibold mb-5  text-blue-900 text-center">
            Technology
          </p>
          <p className="text-sm font-regular text  text-gray-500 text-center ">
            Using cutting-edge software, we streamline CV management and immigration procedures, delivering an efficient and hassle-free recruitment process for all stakeholders.          </p>
        </div>
        <div className="col-span-1 border-2 border-gray-300 p-7 rounded-2xl text-center h-full">
          <Image src={imagePathFinder.innovative_approach} alt="Select and Approve" className="w-10 mb-4 mx-auto" />
          <p className="text-sm font-semibold mb-5  text-blue-900 text-center">
            Innovative Approach
          </p>
          <p className="text-sm font-regular text  text-gray-500 text-center ">
            Our commitment goes beyond recruitment. By prioritizing social integration and cultural adaptation, we ensure a smooth transition and long-term success for employees and companies alike.          </p>
        </div>
        <div className="col-span-1 border-2 border-gray-300 p-7 rounded-2xl text-center h-full" >
          <Image src={imagePathFinder.reliability} alt="Seamless Integration" className="w-10 mb-4 mx-auto" />
          <p className="text-sm font-semibold mb-5  text-blue-900 text-center">
            Reliability
          </p>
          <p className="text-sm font-regular text  text-gray-500 text-center">
            We offer a six-month guarantee on our placements, providing peace of mind and reinforcing our dedication to delivering quality results and unmatched service.          </p>
        </div>

      </div>
    </section>

    {/*  Mission, Vision et Valeurs */}
    <section className="mx-auto max-w-5xl p-10 flex items-center justify-center">
      <div className="bg-blue-900 p-10 rounded-3xl border max-w-5xl w-5xl mx-auto">
        <h2 className="text-3xl font-semibold text mb-10 mt-5 text-white text-center">
          Mission, Vision et Valeurs
        </h2>
        <div className="grid grid-cols-12  items-center gap-14 mt-10">
          <div className="col-span-6 text-left bg-white rounded-2xl p-7 h-full">
            <p className="font-bold text mb-5  text-blue-800 text-start">
              MISSION
            </p>
            <p className="text-sm font-regular text  text-gray-500 text-start mb-2">
              Empowering companies with the best talents to thrive in their industries. We aim to simplify recruitment, ensuring seamless integration of candidates while contributing to the success of businesses and the well-being of workers.
            </p>
          </div>
          <div className="col-span-6 text-left bg-white rounded-2xl p-7 h-full">
            <p className="font-bold text mb-5  text-blue-800 text-start">
              VISION
            </p>
            <p className="text-sm font-regular text  text-gray-500 text-start mb-2">
              To become the leading partner for Quebec businesses in sourcing and integrating top-tier talents from around the world, driving mutual growth and societal impact.            </p>
          </div>
        </div>
        <h2 className="text-xl font-semibold text mt-10 text-white text-center">
          VALEURS
        </h2>
        <p className="text-sm font-regular text  text-white text-center mb-10">
          Valeurs véhicules par Industrielle RH
        </p>
        <div className="grid grid-cols-2 grid-rows-2 gap-4 place-items-center">
          <div className="bg-[url(/images/card_fond.png)] 
                  bg-white bg-cover bg-center rounded-lg p-4">
            <div className="flex">
              <div>
                <h6 className="text-blue-800 uppercase text-sm mb-3 font-semibold">
                  INNOVATION
                </h6>
                <p className="text-gray-500 text-sm">
                  The company was created with the belief that we can bring innovations that
                  will contribute to improving our society. We will continue to make innovation our reason for existence.
                </p>
              </div>
              <div className="p-5 m-auto w-50 ">
                <Image className="w-full" src={imagePathFinder.valeur_innovation} alt="Salary Guide" />
              </div>
            </div>
          </div>
          <div className="bg-[url(/images/card_fond.png)] 
                  bg-white bg-cover bg-center rounded-lg p-4">
            <div className="flex">
              <div>
                <h6 className="text-blue-800 uppercase text-sm mb-3 font-semibold">
                  Integrity
                </h6>
                <p className="text-gray-500 text-sm">
                  Integrity guides all our actions. We create solutions
                  that enhance transparency in the world and develop partnerships that reflect this commitment.
                </p>
              </div>
              <div className="p-5 m-auto w-50 ">
                <Image className="w-full" src={imagePathFinder.valeur_integrity} alt="What jobs are in demand?" />
              </div>
            </div>
          </div>
          <div className="bg-[url(/images/card_fond.png)] 
                  bg-white bg-cover bg-center rounded-lg p-4">
            <div className="flex">
              <div>
                <h6 className="text-blue-800 uppercase text-sm mb-3 font-semibold">
                  Diversity
                </h6>
                <p className="text-gray-500 text-sm">
                  Humanity is at the heart of our mission. We value the diversity of people who work for our client companies .
                  We firmly believe that talent has no nationality or race.
                </p>
              </div>
              <div className="p-5 m-auto w-50 ">
                <Image className="w-full" src={imagePathFinder.valeur_diversity} alt="Robert Half blog" />
              </div>
            </div>
          </div>
          <div className="bg-[url(/images/card_fond.png)] 
                  bg-white bg-cover bg-center rounded-lg p-4">
            <div className="flex">
              <div>
                <h6 className="text-blue-800 uppercase text-sm mb-3 font-semibold">
                  Sustainability
                </h6>
                <p className="text-gray-500 text-sm">
                  IR is determined to be, wherever it operates, a socially and
                  environmentally responsible company with a commitment to sustainable development.
                </p>
              </div>
              <div className="p-5 m-auto w-50 ">
                <Image className="w-full" src={imagePathFinder.valeur_sustanability} alt="Navigate tech skills gaps" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

    {/* Hire the best francophone talent Worldwide */}
    <section className="mx-auto max-w-5xl mb-10 p-10">
      <div className="grid grid-cols-5 items-center gap-4 lg:gap-10 mt-10">

        <div className="lg:col-span-2 col-span-12">
          <Image src={imagePathFinder.hire_the_best_francophone_talent_worldwide} alt="Salary Guide" />
        </div>
        <div className="lg:col-span-3 col-span-12  pr-4">
          <h2 className="text-3xl font-semibold text mb-14 text-gray-800">
            {"Hire the best francophone talent Worldwide"}
          </h2>
          <p className="text-gray-500 text-sm mb-5">
            {`Industrielle RH is led by a team of dedicated professionals specializing in recruitment and workforce management.
             Our team consists of experts in talent acquisition, immigration processes, workforce integration, and professional training. 
With extensive experience and a solid reputation for professionalism, respect for deadlines, and the sustainability 
of our recruitment solutions, we are committed to helping your organization thrive byconnecting you with the best francophone talent`}
          </p>
        </div>

      </div>
    </section>

    {/*  Leadership team  */}
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