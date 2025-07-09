"use client";

import { imagePathFinder } from "@/utils/imagePathFinder";
import Image from "next/image";

export function HeaderOld() {

    return (

        <header className="ckxi0 cli41 c99j0 cpawk c7pl5 c8rmw cno1a cn67g cuc0w cd0ew c5jn9 ciybg cx5ad cij5c curk8 cuzab cnl4h cxtaf">
            <div className="clbq0 cnbwt cs7xl">
                <div className="flex items-center c3nk1 cm3rx">
                    <div className="flex">
                        <button className="text-gray-500 clwnn c3e4j c2y99 sidebarOpen" aria-controls="sidebar" >
                            <span className="cn8jz">Open sidebar</span>
                            <svg className="ctt6r cg8so cbm9w" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <rect x="4" y="5" width="16" height="2"></rect>
                                <rect x="4" y="11" width="16" height="2"></rect>
                                <rect x="4" y="17" width="16" height="2"></rect>
                            </svg>
                        </button>
                    </div>
                    <div className="flex items-center cp3jk">
                        <div>
                            <button className="flex items-center justify-center rounded-full cue4z cmwfi c76um cukve cw5z1 cvdqj" aria-controls="search-modal">
                                <span className="cn8jz">Search</span>
                                <svg className="cbm9w ch0mp cp14x" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M7 14c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7ZM7 2C4.243 2 2 4.243 2 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5Z"></path>
                                    <path d="m13.314 11.9 2.393 2.393a.999.999 0 1 1-1.414 1.414L11.9 13.314a8.019 8.019 0 0 0 1.414-1.414Z"></path>
                                </svg>
                            </button>
                            <div className="bg-gray-900 cjxg0 cini7 cys4p c2iqv c29tc" aria-hidden="true" ></div>
                            <div id="search-modal" className="flex justify-center cjxg0 cini7 c8zfd cys4p cdiog ce4zk cxe43 clbq0 cnbwt">
                                <div className="bg-white border caufm c6btv cn9uy co669 cb8zv c1xby ccwri cghq3 c2vpa" >
                                    <form className="border-gray-200 ctv3r cghq3">
                                        <div className="cm84d">
                                            <label htmlFor="modal-search" className="cn8jz">Search</label>
                                            <input id="modal-search" className="bg-white c6btv co5c0 cs6bq c72q5 cih2z cnqyw c7vc0 c37no c2vpa c0zkc c9hby" type="search" placeholder="Search Anything…" />
                                            <button className="cqdkw cini7 c29dn cqogy" type="submit" aria-label="Search">
                                                <svg className="mr-2 cfh3y coqgc cbm9w cdqku c4it8 cmpw7 cba8l" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M7 14c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zM7 2C4.243 2 2 4.243 2 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5z"></path>
                                                    <path d="M15.707 14.293L13.314 11.9a8.019 8.019 0 01-1.414 1.414l2.393 2.393a.997.997 0 001.414 0 .999.999 0 000-1.414z"></path>
                                                </svg>
                                            </button>
                                        </div>
                                    </form>
                                    <div className="c9hxi cz8qb">
                                        <div className="cxg65 c5w78">
                                            <div className="c6f83 c9hxi c1iho cgulq c0ef0 cdqku cmpw7">Recent searches</div>
                                            <ul className="text-sm">
                                                <li>
                                                    <a className="flex items-center text-gray-800 dark:text-gray-100 cb8zv c27zx c76um chfxh" href="#0">
                                                        <svg className="chfzq coqgc cbm9w cdqku cmpw7" width="16" height="16" viewBox="0 0 16 16">
                                                            <path d="M15.707 14.293v.001a1 1 0 01-1.414 1.414L11.185 12.6A6.935 6.935 0 017 14a7.016 7.016 0 01-5.173-2.308l-1.537 1.3L0 8l4.873 1.12-1.521 1.285a4.971 4.971 0 008.59-2.835l1.979.454a6.971 6.971 0 01-1.321 3.157l3.107 3.112zM14 6L9.127 4.88l1.521-1.28a4.971 4.971 0 00-8.59 2.83L.084 5.976a6.977 6.977 0 0112.089-3.668l1.537-1.3L14 6z"></path>
                                                        </svg>
                                                        <span>Form Builder - 23 hours on-demand video</span>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a className="flex items-center text-gray-800 dark:text-gray-100 cb8zv c27zx c76um chfxh" href="#0">
                                                        <svg className="chfzq coqgc cbm9w cdqku cmpw7" width="16" height="16" viewBox="0 0 16 16">
                                                            <path d="M15.707 14.293v.001a1 1 0 01-1.414 1.414L11.185 12.6A6.935 6.935 0 017 14a7.016 7.016 0 01-5.173-2.308l-1.537 1.3L0 8l4.873 1.12-1.521 1.285a4.971 4.971 0 008.59-2.835l1.979.454a6.971 6.971 0 01-1.321 3.157l3.107 3.112zM14 6L9.127 4.88l1.521-1.28a4.971 4.971 0 00-8.59 2.83L.084 5.976a6.977 6.977 0 0112.089-3.668l1.537-1.3L14 6z"></path>
                                                        </svg>
                                                        <span>Access Mosaic on mobile and TV</span>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a className="flex items-center text-gray-800 dark:text-gray-100 cb8zv c27zx c76um chfxh" href="#0">
                                                        <svg className="chfzq coqgc cbm9w cdqku cmpw7" width="16" height="16" viewBox="0 0 16 16">
                                                            <path d="M15.707 14.293v.001a1 1 0 01-1.414 1.414L11.185 12.6A6.935 6.935 0 017 14a7.016 7.016 0 01-5.173-2.308l-1.537 1.3L0 8l4.873 1.12-1.521 1.285a4.971 4.971 0 008.59-2.835l1.979.454a6.971 6.971 0 01-1.321 3.157l3.107 3.112zM14 6L9.127 4.88l1.521-1.28a4.971 4.971 0 00-8.59 2.83L.084 5.976a6.977 6.977 0 0112.089-3.668l1.537-1.3L14 6z"></path>
                                                        </svg>
                                                        <span>Product Update - Q4 2024</span>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a className="flex items-center text-gray-800 dark:text-gray-100 cb8zv c27zx c76um chfxh" href="#0">
                                                        <svg className="chfzq coqgc cbm9w cdqku cmpw7" width="16" height="16" viewBox="0 0 16 16">
                                                            <path d="M15.707 14.293v.001a1 1 0 01-1.414 1.414L11.185 12.6A6.935 6.935 0 017 14a7.016 7.016 0 01-5.173-2.308l-1.537 1.3L0 8l4.873 1.12-1.521 1.285a4.971 4.971 0 008.59-2.835l1.979.454a6.971 6.971 0 01-1.321 3.157l3.107 3.112zM14 6L9.127 4.88l1.521-1.28a4.971 4.971 0 00-8.59 2.83L.084 5.976a6.977 6.977 0 0112.089-3.668l1.537-1.3L14 6z"></path>
                                                        </svg>
                                                        <span>Master Digital Marketing Strategy course</span>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a className="flex items-center text-gray-800 dark:text-gray-100 cb8zv c27zx c76um chfxh" href="#0">
                                                        <svg className="chfzq coqgc cbm9w cdqku cmpw7" width="16" height="16" viewBox="0 0 16 16">
                                                            <path d="M15.707 14.293v.001a1 1 0 01-1.414 1.414L11.185 12.6A6.935 6.935 0 017 14a7.016 7.016 0 01-5.173-2.308l-1.537 1.3L0 8l4.873 1.12-1.521 1.285a4.971 4.971 0 008.59-2.835l1.979.454a6.971 6.971 0 01-1.321 3.157l3.107 3.112zM14 6L9.127 4.88l1.521-1.28a4.971 4.971 0 00-8.59 2.83L.084 5.976a6.977 6.977 0 0112.089-3.668l1.537-1.3L14 6z"></path>
                                                        </svg>
                                                        <span>Dedicated forms for products</span>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a className="flex items-center text-gray-800 dark:text-gray-100 cb8zv c27zx c76um chfxh" href="#0">
                                                        <svg className="chfzq coqgc cbm9w cdqku cmpw7" width="16" height="16" viewBox="0 0 16 16">
                                                            <path d="M15.707 14.293v.001a1 1 0 01-1.414 1.414L11.185 12.6A6.935 6.935 0 017 14a7.016 7.016 0 01-5.173-2.308l-1.537 1.3L0 8l4.873 1.12-1.521 1.285a4.971 4.971 0 008.59-2.835l1.979.454a6.971 6.971 0 01-1.321 3.157l3.107 3.112zM14 6L9.127 4.88l1.521-1.28a4.971 4.971 0 00-8.59 2.83L.084 5.976a6.977 6.977 0 0112.089-3.668l1.537-1.3L14 6z"></path>
                                                        </svg>
                                                        <span>Product Update - Q4 2024</span>
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="cxg65 c5w78">
                                            <div className="c6f83 c9hxi c1iho cgulq c0ef0 cdqku cmpw7">Recent pages</div>
                                            <ul className="text-sm">
                                                <li>
                                                    <a className="flex items-center text-gray-800 dark:text-gray-100 cb8zv c27zx c76um chfxh" href="#0">
                                                        <svg className="chfzq coqgc cbm9w cdqku cmpw7" width="16" height="16" viewBox="0 0 16 16">
                                                            <path d="M14 0H2c-.6 0-1 .4-1 1v14c0 .6.4 1 1 1h8l5-5V1c0-.6-.4-1-1-1zM3 2h10v8H9v4H3V2z"></path>
                                                        </svg>
                                                        <span><span className="c1k3n">Messages</span> - <span className="dark:text-gray-400 c1ukq">Conversation / … / Mike Mills</span></span>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a className="flex items-center text-gray-800 dark:text-gray-100 cb8zv c27zx c76um chfxh" href="#0">
                                                        <svg className="chfzq coqgc cbm9w cdqku cmpw7" width="16" height="16" viewBox="0 0 16 16">
                                                            <path d="M14 0H2c-.6 0-1 .4-1 1v14c0 .6.4 1 1 1h8l5-5V1c0-.6-.4-1-1-1zM3 2h10v8H9v4H3V2z"></path>
                                                        </svg>
                                                        <span><span className="c1k3n">Messages</span> - <span className="dark:text-gray-400 c1ukq">Conversation / … / Eva Patrick</span></span>
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="inline-flex cm84d">
                            <button className="flex items-center justify-center rounded-full cue4z cmwfi c76um cukve cw5z1 cvdqj" aria-haspopup="true" >
                                <span className="cn8jz">Notifications</span>
                                <svg className="cbm9w ch0mp cp14x" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M7 0a7 7 0 0 0-7 7c0 1.202.308 2.33.84 3.316l-.789 2.368a1 1 0 0 0 1.265 1.265l2.595-.865a1 1 0 0 0-.632-1.898l-.698.233.3-.9a1 1 0 0 0-.104-.85A4.97 4.97 0 0 1 2 7a5 5 0 0 1 5-5 4.99 4.99 0 0 1 4.093 2.135 1 1 0 1 0 1.638-1.148A6.99 6.99 0 0 0 7 0Z"></path>
                                    <path d="M11 6a5 5 0 0 0 0 10c.807 0 1.567-.194 2.24-.533l1.444.482a1 1 0 0 0 1.265-1.265l-.482-1.444A4.962 4.962 0 0 0 16 11a5 5 0 0 0-5-5Zm-3 5a3 3 0 0 1 6 0c0 .588-.171 1.134-.466 1.6a1 1 0 0 0-.115.82 1 1 0 0 0-.82.114A2.973 2.973 0 0 1 11 14a3 3 0 0 1-3-3Z"></path>
                                </svg>
                                <div className="rounded-full cqdkw cgky2 cli41 cf894 cych8 ct7xr cbv37 cg902 cdnc2"></div>
                            </button>
                            <div className="bg-white border border-gray-200 cqdkw cgky2 ctd47 cvggx cdqsh ccwg3 cyh17 cbx8s cxe43 cb8zv cbxoy ccwri cghq3 c2vpa ctj0o">
                                <div className="clbq0 cif3q c1yoz c1iho cgulq c0ef0 cdqku cmpw7">Notifications</div>
                                <ul>
                                    <li className="border-gray-200 ctv3r cmtlz cghq3">
                                        <a className="block clbq0 cuvgf csd0k chfxh" href="#0">
                                            <span className="block text-sm c6f83">📣 <span className="text-gray-800 dark:text-gray-100 c1k3n">Edit your information in a swipe</span> Sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim.</span>
                                            <span className="block c1iho c1k3n cdqku cmpw7">Feb 12, 2024</span>
                                        </a>
                                    </li>
                                    <li className="border-gray-200 ctv3r cmtlz cghq3">
                                        <a className="block clbq0 cuvgf csd0k chfxh" href="#0">
                                            <span className="block text-sm c6f83">📣 <span className="text-gray-800 dark:text-gray-100 c1k3n">Edit your information in a swipe</span> Sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim.</span>
                                            <span className="block c1iho c1k3n cdqku cmpw7">Feb 9, 2024</span>
                                        </a>
                                    </li>
                                    <li className="border-gray-200 ctv3r cmtlz cghq3">
                                        <a className="block clbq0 cuvgf csd0k chfxh" href="#0">
                                            <span className="block text-sm c6f83">🚀<span className="text-gray-800 dark:text-gray-100 c1k3n">Say goodbye to paper receipts!</span> Sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim.</span>
                                            <span className="block c1iho c1k3n cdqku cmpw7">Jan 24, 2024</span>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="inline-flex cm84d">
                            <button className="flex items-center justify-center rounded-full cue4z cmwfi c76um cukve cw5z1 cvdqj" aria-haspopup="true" >
                                <span className="cn8jz">Info</span>
                                <svg className="cbm9w ch0mp cp14x" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 7.5a1 1 0 1 0-2 0v4a1 1 0 1 0 2 0v-4ZM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"></path>
                                    <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16Zm6-8A6 6 0 1 1 2 8a6 6 0 0 1 12 0Z"></path>
                                </svg>
                            </button>
                            <div className="bg-white border border-gray-200 cqdkw cgky2 ctd47 cvggx ccwg3 c45yg cbx8s cxe43 cb8zv cbxoy ccwri cghq3 c2vpa" >
                                <div className="cb2br cif3q c1yoz c1iho cgulq c0ef0 cdqku cmpw7">Need help?</div>
                                <ul>
                                    <li>
                                        <a className="text-sm text-violet-500 flex items-center cb2br cwn3v c1k3n ceetm c5ylh" href="#0">
                                            <svg className="w-3 h-3 text-violet-500 mr-2 coqgc cbm9w" viewBox="0 0 12 12">
                                                <rect y="3" width="12" height="9" rx="1"></rect>
                                                <path d="M2 0h8v2H2z"></path>
                                            </svg>
                                            <span>Documentation</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a className="text-sm text-violet-500 flex items-center cb2br cwn3v c1k3n ceetm c5ylh" href="#0">
                                            <svg className="w-3 h-3 text-violet-500 mr-2 coqgc cbm9w" viewBox="0 0 12 12">
                                                <path d="M10.5 0h-9A1.5 1.5 0 000 1.5v9A1.5 1.5 0 001.5 12h9a1.5 1.5 0 001.5-1.5v-9A1.5 1.5 0 0010.5 0zM10 7L8.207 5.207l-3 3-1.414-1.414 3-3L5 2h5v5z"></path>
                                            </svg>
                                            <span>Support Site</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a className="text-sm text-violet-500 flex items-center cb2br cwn3v c1k3n ceetm c5ylh" href="#0">
                                            <svg className="w-3 h-3 text-violet-500 mr-2 coqgc cbm9w" viewBox="0 0 12 12">
                                                <path d="M11.854.146a.5.5 0 00-.525-.116l-11 4a.5.5 0 00-.015.934l4.8 1.921 1.921 4.8A.5.5 0 007.5 12h.008a.5.5 0 00.462-.329l4-11a.5.5 0 00-.116-.525z"></path>
                                            </svg>
                                            <span>Contact us</span>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div>
                            <input type="checkbox" name="light-switch" id="light-switch" className="light-switch cn8jz" />
                            <label className="flex items-center justify-center rounded-full cue4z cmwfi c5flv c76um cukve cw5z1 cvdqj" htmlFor="light-switch">
                                <svg className="cbm9w ch0mp c1bco cp14x" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8 0a1 1 0 0 1 1 1v.5a1 1 0 1 1-2 0V1a1 1 0 0 1 1-1Z"></path>
                                    <path d="M12 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0Zm-4 2a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"></path>
                                    <path d="M13.657 3.757a1 1 0 0 0-1.414-1.414l-.354.354a1 1 0 0 0 1.414 1.414l.354-.354ZM13.5 8a1 1 0 0 1 1-1h.5a1 1 0 1 1 0 2h-.5a1 1 0 0 1-1-1ZM13.303 11.889a1 1 0 0 0-1.414 1.414l.354.354a1 1 0 0 0 1.414-1.414l-.354-.354ZM8 13.5a1 1 0 0 1 1 1v.5a1 1 0 1 1-2 0v-.5a1 1 0 0 1 1-1ZM4.111 13.303a1 1 0 1 0-1.414-1.414l-.354.354a1 1 0 1 0 1.414 1.414l.354-.354ZM0 8a1 1 0 0 1 1-1h.5a1 1 0 0 1 0 2H1a1 1 0 0 1-1-1ZM3.757 2.343a1 1 0 1 0-1.414 1.414l.354.354A1 1 0 1 0 4.11 2.697l-.354-.354Z"></path>
                                </svg>
                                <svg className="hidden cbm9w ch0mp c2e1r cp14x" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11.875 4.375a.625.625 0 1 0 1.25 0c.001-.69.56-1.249 1.25-1.25a.625.625 0 1 0 0-1.25 1.252 1.252 0 0 1-1.25-1.25.625.625 0 1 0-1.25 0 1.252 1.252 0 0 1-1.25 1.25.625.625 0 1 0 0 1.25c.69.001 1.249.56 1.25 1.25Z"></path>
                                    <path d="M7.019 1.985a1.55 1.55 0 0 0-.483-1.36 1.44 1.44 0 0 0-1.53-.277C2.056 1.553 0 4.5 0 7.9 0 12.352 3.648 16 8.1 16c3.407 0 6.246-2.058 7.51-4.963a1.446 1.446 0 0 0-.25-1.55 1.554 1.554 0 0 0-1.372-.502c-4.01.552-7.539-2.987-6.97-7ZM2 7.9C2 5.64 3.193 3.664 4.961 2.6 4.82 7.245 8.72 11.158 13.36 11.04 12.265 12.822 10.341 14 8.1 14 4.752 14 2 11.248 2 7.9Z"></path>
                                </svg>
                                <span className="cn8jz">Switch to light / dark version</span>
                            </label>
                        </div>

                        <hr className="ctt6r cn8zk cb4ug cvwbh cmr9m" />

                        <div className="inline-flex cm84d">
                            <button className="inline-flex justify-center items-center cqogy" aria-haspopup="true" >
                                <Image loading="lazy" className="rounded-full cue4z cmwfi" src={imagePathFinder.icons_location} width="32" height="32" alt="User" />
                                <div className="flex items-center c941w">
                                    <span className="text-sm dark:text-gray-100 c8bkw c941w c1k3n c1ukq ccuo4 croon">Acme Inc.</span>
                                    <svg className="w-3 h-3 cpts2 coqgc cbm9w cdqku cmpw7" viewBox="0 0 12 12">
                                        <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z"></path>
                                    </svg>
                                </div>
                            </button>
                            <div className="bg-white border border-gray-200 cqdkw cgky2 ctd47 cvggx ccwg3 c45yg cbx8s cxe43 cb8zv cbxoy ccwri cghq3 c2vpa">
                                <div className="border-gray-200 cu6vl ctv3r cb2br cif3q c8asz cghq3">
                                    <div className="text-gray-800 dark:text-gray-100 c1k3n">Acme Inc.</div>
                                    <div className="text-gray-500 dark:text-gray-400 c1iho caf78">Administrator</div>
                                </div>
                                <ul>
                                    <li>
                                        <a className="text-sm text-violet-500 flex items-center cb2br cwn3v c1k3n ceetm c5ylh" href="settings.html">Settings</a>
                                    </li>
                                    <li>
                                        <a className="text-sm text-violet-500 flex items-center cb2br cwn3v c1k3n ceetm c5ylh" href="signin.html">Sign Out</a>
                                    </li>
                                </ul>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </header>
    );
}

