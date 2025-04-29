"use client";

import { useState, useRef, useEffect } from "react";

export function SideBarOld() {

    const [sidebarOpen, setSidebarOpen] = useState(true);
    const sidebarRef = useRef(null);

    // Gestion du clic en dehors de la sidebar
    useEffect(() => {
        const handleClickOutside = (event: { target: any; }) => {
            if (sidebarRef.current) {
                setSidebarOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Gestion de la touche Escape
    useEffect(() => {
        const handleKeyDown = (event: { key: string; }) => {
            if (event.key === "Escape") {
                setSidebarOpen(false);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);


    return (

        <div id="sidebar"
            className={`flex 2xl:!w-64 bg-white border-gray-200 cu49b cqdkw cu1dd cli41 cbzdv cmi6g chreu coqgc cetff cggqk cpsmr clxb7 c9hmh c8uqq cz9ag cghq3 c2vpa c3aql cohrt cwecn crey7 c8xsn cz8c3 cb401 cvssj transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-64"
                }`} >
            <div className="flex ckdp3 cm3rx cnbr1 c83go">
                <button className="text-gray-500 c6jfa c2y99" aria-controls="sidebar" >
                    <span className="cn8jz">Close sidebar</span>
                    <svg className="ctt6r cg8so cbm9w" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.7 18.7l1.4-1.4L7.8 13H20v-2H7.8l4.3-4.3-1.4-1.4L4 12z"></path>
                    </svg>
                </button>
                <a className="block" href="index-2.html">
                    <svg className="cwjz0" xmlns="http://www.w3.org/2000/svg" width="32" height="32">
                        <path d="M31.956 14.8C31.372 6.92 25.08.628 17.2.044V5.76a9.04 9.04 0 0 0 9.04 9.04h5.716ZM14.8 26.24v5.716C6.92 31.372.63 25.08.044 17.2H5.76a9.04 9.04 0 0 1 9.04 9.04Zm11.44-9.04h5.716c-.584 7.88-6.876 14.172-14.756 14.756V26.24a9.04 9.04 0 0 1 9.04-9.04ZM.044 14.8C.63 6.92 6.92.628 14.8.044V5.76a9.04 9.04 0 0 1-9.04 9.04H.044Z"></path>
                    </svg>
                </a>
            </div>

            <div className="cvsuf">
                <div>
                    <h3 className="c9aea c1iho cgulq c0ef0 cdqku cmpw7">
                        <span className="hidden 2xl:hidden cg8so cydwr cv9uc cs2n8 cbbia" aria-hidden="true">•••</span>
                        <span className="2xl:block c2y99 c185y cmt20">Pages</span>
                    </h3>
                    <ul className="c7gr8">
                        <li className="cjxkd cb8zv cuvgf csr1i cnbr1 c5w78" >
                            <a className="block text-gray-800 dark:text-gray-100 c941w cxxol c4t3r cigpx" href="#0" >
                                <div className="flex items-center cm3rx">
                                    <div className="flex items-center">
                                        <svg className="coqgc cbm9w cdqku cmpw7" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                                            <path d="M5.936.278A7.983 7.983 0 0 1 8 0a8 8 0 1 1-8 8c0-.722.104-1.413.278-2.064a1 1 0 1 1 1.932.516A5.99 5.99 0 0 0 2 8a6 6 0 1 0 6-6c-.53 0-1.045.076-1.548.21A1 1 0 1 1 5.936.278Z"></path>
                                            <path d="M6.068 7.482A2.003 2.003 0 0 0 8 10a2 2 0 1 0-.518-3.932L3.707 2.293a1 1 0 0 0-1.414 1.414l3.775 3.775Z"></path>
                                        </svg>
                                        <span className="text-sm 2xl:opacity-100 cfh3y c1k3n c8uqq cvxm1 c68cp c9gyy">Dashboard</span>
                                    </div>
                                    <div className="flex 2xl:opacity-100 c8bkw coqgc c8uqq cvxm1 c68cp c9gyy">
                                        <svg className="w-3 h-3 cpts2 coqgc cbm9w cdqku cmpw7" viewBox="0 0 12 12">
                                            <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z"></path>
                                        </svg>
                                    </div>
                                </div>
                            </a>
                            <div className="2xl:block c2y99 c185y cmt20">
                                <ul className="ccwg3 cwbdk">
                                    <li className="cu6vl c5w78">
                                        <a className="block dark:text-gray-400 c941w cwwmd cxxol c18od c196r" href="index-2.html">
                                            <span className="text-sm 2xl:opacity-100 c1k3n c8uqq cvxm1 c68cp c9gyy">Main</span>
                                        </a>
                                    </li>
                                    <li className="cu6vl c5w78">
                                        <a className="block dark:text-gray-400 c941w cwwmd cxxol c18od c196r" href="analytics.html">
                                            <span className="text-sm 2xl:opacity-100 c1k3n c8uqq cvxm1 c68cp c9gyy">Analytics</span>
                                        </a>
                                    </li>
                                    <li className="cu6vl c5w78">
                                        <a className="block dark:text-gray-400 c941w cwwmd cxxol c18od c196r" href="fintech.html">
                                            <span className="text-sm 2xl:opacity-100 c1k3n c8uqq cvxm1 c68cp c9gyy">Fintech</span>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li className="cjxkd cb8zv cuvgf csr1i cnbr1 c5w78" >
                            <a className="block text-gray-800 dark:text-gray-100 c941w cxxol c4t3r cigpx" href="#0" >
                                <div className="flex items-center cm3rx">
                                    <div className="flex items-center">
                                        <svg className="coqgc cbm9w cdqku cmpw7" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                                            <path d="M9 6.855A3.502 3.502 0 0 0 8 0a3.5 3.5 0 0 0-1 6.855v1.656L5.534 9.65a3.5 3.5 0 1 0 1.229 1.578L8 10.267l1.238.962a3.5 3.5 0 1 0 1.229-1.578L9 8.511V6.855ZM6.5 3.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm4.803 8.095c.005-.005.01-.01.013-.016l.012-.016a1.5 1.5 0 1 1-.025.032ZM3.5 11c.474 0 .897.22 1.171.563l.013.016.013.017A1.5 1.5 0 1 1 3.5 11Z"></path>
                                        </svg>
                                        <span className="text-sm 2xl:opacity-100 cfh3y c1k3n c8uqq cvxm1 c68cp c9gyy">E-Commerce</span>
                                    </div>
                                    <div className="flex 2xl:opacity-100 c8bkw coqgc c8uqq cvxm1 c68cp c9gyy">
                                        <svg className="w-3 h-3 cpts2 coqgc cbm9w cdqku cmpw7" viewBox="0 0 12 12">
                                            <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z"></path>
                                        </svg>
                                    </div>
                                </div>
                            </a >
                            <div className="2xl:block c2y99 c185y cmt20">
                                <ul className="hidden ccwg3 cwbdk">
                                    <li className="cu6vl c5w78">
                                        <a className="block dark:text-gray-400 c941w cwwmd cxxol c18od c196r" href="customers.html">
                                            <span className="text-sm 2xl:opacity-100 c1k3n c8uqq cvxm1 c68cp c9gyy">Customers</span>
                                        </a>
                                    </li>
                                    <li className="cu6vl c5w78">
                                        <a className="block dark:text-gray-400 c941w cwwmd cxxol c18od c196r" href="orders.html">
                                            <span className="text-sm 2xl:opacity-100 c1k3n c8uqq cvxm1 c68cp c9gyy">Orders</span>
                                        </a>
                                    </li>
                                    <li className="cu6vl c5w78">
                                        <a className="block dark:text-gray-400 c941w cwwmd cxxol c18od c196r" href="invoices.html">
                                            <span className="text-sm 2xl:opacity-100 c1k3n c8uqq cvxm1 c68cp c9gyy">Invoices</span>
                                        </a>
                                    </li>
                                    <li className="cu6vl c5w78">
                                        <a className="block dark:text-gray-400 c941w cwwmd cxxol c18od c196r" href="shop.html">
                                            <span className="text-sm 2xl:opacity-100 c1k3n c8uqq cvxm1 c68cp c9gyy">Shop</span>
                                        </a>
                                    </li>
                                    <li className="cu6vl c5w78">
                                        <a className="block dark:text-gray-400 c941w cwwmd cxxol c18od c196r" href="shop-2.html">
                                            <span className="text-sm 2xl:opacity-100 c1k3n c8uqq cvxm1 c68cp c9gyy">Shop 2</span>
                                        </a>
                                    </li>
                                    <li className="cu6vl c5w78">
                                        <a className="block dark:text-gray-400 c941w cwwmd cxxol c18od c196r" href="product.html">
                                            <span className="text-sm 2xl:opacity-100 c1k3n c8uqq cvxm1 c68cp c9gyy">Single Product</span>
                                        </a>
                                    </li>
                                    <li className="cu6vl c5w78">
                                        <a className="block dark:text-gray-400 c941w cwwmd cxxol c18od c196r" href="cart.html">
                                            <span className="text-sm 2xl:opacity-100 c1k3n c8uqq cvxm1 c68cp c9gyy">Cart</span>
                                        </a>
                                    </li>
                                    <li className="cu6vl c5w78">
                                        <a className="block dark:text-gray-400 c941w cwwmd cxxol c18od c196r" href="cart-2.html">
                                            <span className="text-sm 2xl:opacity-100 c1k3n c8uqq cvxm1 c68cp c9gyy">Cart 2</span>
                                        </a>
                                    </li>
                                    <li className="cu6vl c5w78">
                                        <a className="block dark:text-gray-400 c941w cwwmd cxxol c18od c196r" href="cart-3.html">
                                            <span className="text-sm 2xl:opacity-100 c1k3n c8uqq cvxm1 c68cp c9gyy">Cart 3</span>
                                        </a>
                                    </li>
                                    <li className="cu6vl c5w78">
                                        <a className="block dark:text-gray-400 c941w cwwmd cxxol c18od c196r" href="pay.html">
                                            <span className="text-sm 2xl:opacity-100 c1k3n c8uqq cvxm1 c68cp c9gyy">Pay</span>
                                        </a>
                                    </li>
                                </ul>
                            </div >
                        </li >
                        <li className="cjxkd cb8zv cuvgf csr1i cnbr1 c5w78" >
                            <a className="block text-gray-800 dark:text-gray-100 c941w cxxol c4t3r cigpx" href="#0">
                                <div className="flex items-center cm3rx">
                                    <div className="flex items-center">
                                        <svg className="coqgc cbm9w cdqku cmpw7" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                                            <path d="M12 1a1 1 0 1 0-2 0v2a3 3 0 0 0 3 3h2a1 1 0 1 0 0-2h-2a1 1 0 0 1-1-1V1ZM1 10a1 1 0 1 0 0 2h2a1 1 0 0 1 1 1v2a1 1 0 1 0 2 0v-2a3 3 0 0 0-3-3H1ZM5 0a1 1 0 0 1 1 1v2a3 3 0 0 1-3 3H1a1 1 0 0 1 0-2h2a1 1 0 0 0 1-1V1a1 1 0 0 1 1-1ZM12 13a1 1 0 0 1 1-1h2a1 1 0 1 0 0-2h-2a3 3 0 0 0-3 3v2a1 1 0 1 0 2 0v-2Z"></path>
                                        </svg>
                                        <span className="text-sm 2xl:opacity-100 cfh3y c1k3n c8uqq cvxm1 c68cp c9gyy">Community</span>
                                    </div>
                                    <div className="flex 2xl:opacity-100 c8bkw coqgc c8uqq cvxm1 c68cp c9gyy">
                                        <svg className="w-3 h-3 cpts2 coqgc cbm9w cdqku cmpw7" viewBox="0 0 12 12">
                                            <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z"></path>
                                        </svg>
                                    </div>
                                </div>
                            </a >
                            <div className="2xl:block c2y99 c185y cmt20">
                                <ul className="hidden ccwg3 cwbdk">
                                    <li className="cu6vl c5w78">
                                        <a className="block dark:text-gray-400 c941w cwwmd cxxol c18od c196r" href="users-tabs.html">
                                            <span className="text-sm 2xl:opacity-100 c1k3n c8uqq cvxm1 c68cp c9gyy">Users - Tabs</span>
                                        </a>
                                    </li>
                                    <li className="cu6vl c5w78">
                                        <a className="block dark:text-gray-400 c941w cwwmd cxxol c18od c196r" href="users-tiles.html">
                                            <span className="text-sm 2xl:opacity-100 c1k3n c8uqq cvxm1 c68cp c9gyy">Users - Tiles</span>
                                        </a>
                                    </li>
                                    <li className="cu6vl c5w78">
                                        <a className="block dark:text-gray-400 c941w cwwmd cxxol c18od c196r" href="profile.html">
                                            <span className="text-sm 2xl:opacity-100 c1k3n c8uqq cvxm1 c68cp c9gyy">Profile</span>
                                        </a>
                                    </li>
                                    <li className="cu6vl c5w78">
                                        <a className="block dark:text-gray-400 c941w cwwmd cxxol c18od c196r" href="feed.html">
                                            <span className="text-sm 2xl:opacity-100 c1k3n c8uqq cvxm1 c68cp c9gyy">Feed</span>
                                        </a>
                                    </li>
                                    <li className="cu6vl c5w78">
                                        <a className="block dark:text-gray-400 c941w cwwmd cxxol c18od c196r" href="forum.html">
                                            <span className="text-sm 2xl:opacity-100 c1k3n c8uqq cvxm1 c68cp c9gyy">Forum</span>
                                        </a>
                                    </li>
                                    <li className="cu6vl c5w78">
                                        <a className="block dark:text-gray-400 c941w cwwmd cxxol c18od c196r" href="forum-post.html">
                                            <span className="text-sm 2xl:opacity-100 c1k3n c8uqq cvxm1 c68cp c9gyy">Forum - Post</span>
                                        </a>
                                    </li>
                                    <li className="cu6vl c5w78">
                                        <a className="block dark:text-gray-400 c941w cwwmd cxxol c18od c196r" href="meetups.html">
                                            <span className="text-sm 2xl:opacity-100 c1k3n c8uqq cvxm1 c68cp c9gyy">Meetups</span>
                                        </a>
                                    </li>
                                    <li className="cu6vl c5w78">
                                        <a className="block dark:text-gray-400 c941w cwwmd cxxol c18od c196r" href="meetups-post.html">
                                            <span className="text-sm 2xl:opacity-100 c1k3n c8uqq cvxm1 c68cp c9gyy">Meetups - Post</span>
                                        </a>
                                    </li>
                                </ul>
                            </div >
                        </li >
                        <li className="cjxkd cb8zv cuvgf csr1i cnbr1 c5w78" >
                            <a className="block text-gray-800 dark:text-gray-100 c941w cxxol c4t3r cigpx" href="#0">
                                <div className="flex items-center cm3rx">
                                    <div className="flex items-center">
                                        <svg className="coqgc cbm9w cdqku cmpw7" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                                            <path d="M6 0a6 6 0 0 0-6 6c0 1.077.304 2.062.78 2.912a1 1 0 1 0 1.745-.976A3.945 3.945 0 0 1 2 6a4 4 0 0 1 4-4c.693 0 1.344.194 1.936.525A1 1 0 1 0 8.912.779 5.944 5.944 0 0 0 6 0Z"></path>
                                            <path d="M10 4a6 6 0 1 0 0 12 6 6 0 0 0 0-12Zm-4 6a4 4 0 1 1 8 0 4 4 0 0 1-8 0Z"></path>
                                        </svg>
                                        <span className="text-sm 2xl:opacity-100 cfh3y c1k3n c8uqq cvxm1 c68cp c9gyy">Finance</span>
                                    </div>
                                    <div className="flex 2xl:opacity-100 c8bkw coqgc c8uqq cvxm1 c68cp c9gyy">
                                        <svg className="w-3 h-3 cpts2 coqgc cbm9w cdqku cmpw7" viewBox="0 0 12 12">
                                            <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z"></path>
                                        </svg>
                                    </div>
                                </div>
                            </a >
                            <div className="2xl:block c2y99 c185y cmt20">
                                <ul className="hidden ccwg3 cwbdk">
                                    <li className="cu6vl c5w78">
                                        <a className="block dark:text-gray-400 c941w cwwmd cxxol c18od c196r" href="credit-cards.html">
                                            <span className="text-sm 2xl:opacity-100 c1k3n c8uqq cvxm1 c68cp c9gyy">Cards</span>
                                        </a>
                                    </li>
                                    <li className="cu6vl c5w78">
                                        <a className="block dark:text-gray-400 c941w cwwmd cxxol c18od c196r" href="transactions.html">
                                            <span className="text-sm 2xl:opacity-100 c1k3n c8uqq cvxm1 c68cp c9gyy">Transactions</span>
                                        </a>
                                    </li>
                                    <li className="cu6vl c5w78">
                                        <a className="block dark:text-gray-400 c941w cwwmd cxxol c18od c196r" href="transaction-details.html">
                                            <span className="text-sm 2xl:opacity-100 c1k3n c8uqq cvxm1 c68cp c9gyy">Transaction Details</span>
                                        </a>
                                    </li>
                                </ul>
                            </div >
                        </li >
                        <li className="cjxkd cb8zv cuvgf csr1i cnbr1 c5w78" >
                            <a className="block text-gray-800 dark:text-gray-100 c941w cxxol c4t3r cigpx" href="#0">
                                <div className="flex items-center cm3rx">
                                    <div className="flex items-center">
                                        <svg className="coqgc cbm9w cdqku cmpw7" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                                            <path d="M6.753 2.659a1 1 0 0 0-1.506-1.317L2.451 4.537l-.744-.744A1 1 0 1 0 .293 5.207l1.5 1.5a1 1 0 0 0 1.46-.048l3.5-4ZM6.753 10.659a1 1 0 1 0-1.506-1.317l-2.796 3.195-.744-.744a1 1 0 0 0-1.414 1.414l1.5 1.5a1 1 0 0 0 1.46-.049l3.5-4ZM8 4.5a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2H9a1 1 0 0 1-1-1ZM9 11.5a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2H9Z"></path>
                                        </svg>
                                        <span className="text-sm 2xl:opacity-100 cfh3y c1k3n c8uqq cvxm1 c68cp c9gyy">Job Board</span>
                                    </div>
                                    <div className="flex 2xl:opacity-100 c8bkw coqgc c8uqq cvxm1 c68cp c9gyy">
                                        <svg className="w-3 h-3 cpts2 coqgc cbm9w cdqku cmpw7" viewBox="0 0 12 12">
                                            <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z"></path>
                                        </svg>
                                    </div>
                                </div>
                            </a >
                            <div className="2xl:block c2y99 c185y cmt20">
                                <ul className="hidden ccwg3 cwbdk">
                                    <li className="cu6vl c5w78">
                                        <a className="block dark:text-gray-400 c941w cwwmd cxxol c18od c196r" href="job-listing.html">
                                            <span className="text-sm 2xl:opacity-100 c1k3n c8uqq cvxm1 c68cp c9gyy">Listing</span>
                                        </a>
                                    </li>
                                    <li className="cu6vl c5w78">
                                        <a className="block dark:text-gray-400 c941w cwwmd cxxol c18od c196r" href="job-post.html">
                                            <span className="text-sm 2xl:opacity-100 c1k3n c8uqq cvxm1 c68cp c9gyy">Job Post</span>
                                        </a>
                                    </li>
                                    <li className="cu6vl c5w78">
                                        <a className="block dark:text-gray-400 c941w cwwmd cxxol c18od c196r" href="company-profile.html">
                                            <span className="text-sm 2xl:opacity-100 c1k3n c8uqq cvxm1 c68cp c9gyy">Company Profile</span>
                                        </a>
                                    </li>
                                </ul>
                            </div >
                        </li >
                        <li className="cjxkd cb8zv cuvgf csr1i cnbr1 c5w78" >
                            <a className="block text-gray-800 dark:text-gray-100 c941w cxxol c4t3r cigpx" href="#0">
                                <div className="flex items-center cm3rx">
                                    <div className="flex items-center">
                                        <svg className="coqgc cbm9w cdqku cmpw7" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                                            <path d="M7.586 9H1a1 1 0 1 1 0-2h6.586L6.293 5.707a1 1 0 0 1 1.414-1.414l3 3a1 1 0 0 1 0 1.414l-3 3a1 1 0 1 1-1.414-1.414L7.586 9ZM3.075 4.572a1 1 0 1 1-1.64-1.144 8 8 0 1 1 0 9.144 1 1 0 0 1 1.64-1.144 6 6 0 1 0 0-6.856Z"></path>
                                        </svg>
                                        <span className="text-sm 2xl:opacity-100 cfh3y c1k3n c8uqq cvxm1 c68cp c9gyy">Tasks</span>
                                    </div>
                                    <div className="flex 2xl:opacity-100 c8bkw coqgc c8uqq cvxm1 c68cp c9gyy">
                                        <svg className="w-3 h-3 cpts2 coqgc cbm9w cdqku cmpw7" viewBox="0 0 12 12">
                                            <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z"></path>
                                        </svg>
                                    </div>
                                </div>
                            </a >
                            <div className="2xl:block c2y99 c185y cmt20">
                                <ul className="hidden ccwg3 cwbdk">
                                    <li className="cu6vl c5w78">
                                        <a className="block dark:text-gray-400 c941w cwwmd cxxol c18od c196r" href="tasks-kanban.html">
                                            <span className="text-sm 2xl:opacity-100 c1k3n c8uqq cvxm1 c68cp c9gyy">Kanban</span>
                                        </a>
                                    </li>
                                    <li className="cu6vl c5w78">
                                        <a className="block dark:text-gray-400 c941w cwwmd cxxol c18od c196r" href="tasks-list.html">
                                            <span className="text-sm 2xl:opacity-100 c1k3n c8uqq cvxm1 c68cp c9gyy">List</span>
                                        </a>
                                    </li>
                                </ul>
                            </div >
                        </li >
                        <li className="cjxkd cb8zv cuvgf csr1i cnbr1 c5w78">
                            <a className="block text-gray-800 dark:text-gray-100 c941w cxxol c4t3r cigpx" href="messages.html">
                                <div className="flex items-center cm3rx">
                                    <div className="flex items-center cbw8w">
                                        <svg className="coqgc cbm9w cdqku cmpw7" width="16" height="16" viewBox="0 0 16 16">
                                            <path d="M13.95.879a3 3 0 0 0-4.243 0L1.293 9.293a1 1 0 0 0-.274.51l-1 5a1 1 0 0 0 1.177 1.177l5-1a1 1 0 0 0 .511-.273l8.414-8.414a3 3 0 0 0 0-4.242L13.95.879ZM11.12 2.293a1 1 0 0 1 1.414 0l1.172 1.172a1 1 0 0 1 0 1.414l-8.2 8.2-3.232.646.646-3.232 8.2-8.2Z"></path>
                                            <path d="M10 14a1 1 0 1 0 0 2h5a1 1 0 1 0 0-2h-5Z"></path>
                                        </svg>
                                        <span className="text-sm 2xl:opacity-100 cfh3y c1k3n c8uqq cvxm1 c68cp c9gyy">Messages</span>
                                    </div>
                                    <div className="flex c8bkw cai12">
                                        <span className="inline-flex items-center justify-center rounded cf3id cb63n c9hxi c1iho c1k3n cpcyu">4</span>
                                    </div>
                                </div>
                            </a>
                        </li>
                        <li className="cjxkd cb8zv cuvgf csr1i cnbr1 c5w78">
                            <a className="block text-gray-800 dark:text-gray-100 c941w cxxol c4t3r cigpx" href="inbox.html">
                                <div className="flex items-center">
                                    <svg className="coqgc cbm9w cdqku cmpw7" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                                        <path d="M11.92 6.851c.044-.027.09-.05.137-.07.481-.275.758-.68.908-1.256.126-.55.169-.81.357-2.058.075-.498.144-.91.217-1.264-4.122.75-7.087 2.984-9.12 6.284a18.087 18.087 0 0 0-1.985 4.585 17.07 17.07 0 0 0-.354 1.506c-.05.265-.076.448-.086.535a1 1 0 0 1-1.988-.226c.056-.49.209-1.312.502-2.357a20.063 20.063 0 0 1 2.208-5.09C5.31 3.226 9.306.494 14.913.004a1 1 0 0 1 .954 1.494c-.237.414-.375.993-.567 2.267-.197 1.306-.244 1.586-.392 2.235-.285 1.094-.789 1.853-1.552 2.363-.748 3.816-3.976 5.06-8.515 4.326a1 1 0 0 1 .318-1.974c2.954.477 4.918.025 5.808-1.556-.628.085-1.335.121-2.127.121a1 1 0 1 1 0-2c1.458 0 2.434-.116 3.08-.429Z"></path>
                                    </svg>
                                    <span className="text-sm 2xl:opacity-100 cfh3y c1k3n c8uqq cvxm1 c68cp c9gyy">Inbox</span>
                                </div>
                            </a>
                        </li>
                        <li className="cjxkd cb8zv cuvgf csr1i cnbr1 c5w78">
                            <a className="block text-gray-800 dark:text-gray-100 c941w cxxol c4t3r cigpx" href="calendar.html">
                                <div className="flex items-center">
                                    <svg className="coqgc cbm9w cdqku cmpw7" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                                        <path d="M5 4a1 1 0 0 0 0 2h6a1 1 0 1 0 0-2H5Z"></path>
                                        <path d="M4 0a4 4 0 0 0-4 4v8a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4V4a4 4 0 0 0-4-4H4ZM2 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4Z"></path>
                                    </svg>
                                    <span className="text-sm 2xl:opacity-100 cfh3y c1k3n c8uqq cvxm1 c68cp c9gyy">Calendar</span>
                                </div>
                            </a>
                        </li>
                        <li className="cjxkd cb8zv cuvgf csr1i cnbr1 c5w78">
                            <a className="block text-gray-800 dark:text-gray-100 c941w cxxol c4t3r cigpx" href="campaigns.html">
                                <div className="flex items-center">
                                    <svg className="coqgc cbm9w cdqku cmpw7" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                                        <path d="M6.649 1.018a1 1 0 0 1 .793 1.171L6.997 4.5h3.464l.517-2.689a1 1 0 1 1 1.964.378L12.498 4.5h2.422a1 1 0 0 1 0 2h-2.807l-.77 4h2.117a1 1 0 1 1 0 2h-2.501l-.517 2.689a1 1 0 1 1-1.964-.378l.444-2.311H5.46l-.517 2.689a1 1 0 1 1-1.964-.378l.444-2.311H1a1 1 0 1 1 0-2h2.807l.77-4H2.46a1 1 0 0 1 0-2h2.5l.518-2.689a1 1 0 0 1 1.17-.793ZM9.307 10.5l.77-4H6.612l-.77 4h3.464Z"></path>
                                    </svg>
                                    <span className="text-sm 2xl:opacity-100 cfh3y c1k3n c8uqq cvxm1 c68cp c9gyy">Campaigns</span>
                                </div>
                            </a>
                        </li>
                        <li className="cjxkd cb8zv cuvgf csr1i cnbr1 c5w78" >
                            <a className="block text-gray-800 dark:text-gray-100 c941w cxxol c4t3r cigpx" href="#0">
                                <div className="flex items-center cm3rx">
                                    <div className="flex items-center">
                                        <svg className="coqgc cbm9w cdqku cmpw7" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                                            <path d="M10.5 1a3.502 3.502 0 0 1 3.355 2.5H15a1 1 0 1 1 0 2h-1.145a3.502 3.502 0 0 1-6.71 0H1a1 1 0 0 1 0-2h6.145A3.502 3.502 0 0 1 10.5 1ZM9 4.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM5.5 9a3.502 3.502 0 0 1 3.355 2.5H15a1 1 0 1 1 0 2H8.855a3.502 3.502 0 0 1-6.71 0H1a1 1 0 1 1 0-2h1.145A3.502 3.502 0 0 1 5.5 9ZM4 12.5a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0Z"></path>
                                        </svg>
                                        <span className="text-sm 2xl:opacity-100 cfh3y c1k3n c8uqq cvxm1 c68cp c9gyy">Settings</span>
                                    </div>
                                    <div className="flex 2xl:opacity-100 c8bkw coqgc c8uqq cvxm1 c68cp c9gyy">
                                        <svg className="w-3 h-3 cpts2 coqgc cbm9w cdqku cmpw7" viewBox="0 0 12 12">
                                            <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z"></path>
                                        </svg>
                                    </div>
                                </div>
                            </a >
                            <div className="2xl:block c2y99 c185y cmt20">
                                <ul className="hidden ccwg3 cwbdk">
                                    <li className="cu6vl c5w78">
                                        <a className="block dark:text-gray-400 c941w cwwmd cxxol c18od c196r" href="settings.html">
                                            <span className="text-sm 2xl:opacity-100 c1k3n c8uqq cvxm1 c68cp c9gyy">My Account</span>
                                        </a>
                                    </li>
                                    <li className="cu6vl c5w78">
                                        <a className="block dark:text-gray-400 c941w cwwmd cxxol c18od c196r" href="notifications.html">
                                            <span className="text-sm 2xl:opacity-100 c1k3n c8uqq cvxm1 c68cp c9gyy">My Notifications</span>
                                        </a>
                                    </li>
                                    <li className="cu6vl c5w78">
                                        <a className="block dark:text-gray-400 c941w cwwmd cxxol c18od c196r" href="connected-apps.html">
                                            <span className="text-sm 2xl:opacity-100 c1k3n c8uqq cvxm1 c68cp c9gyy">Connected Apps</span>
                                        </a>
                                    </li>
                                    <li className="cu6vl c5w78">
                                        <a className="block dark:text-gray-400 c941w cwwmd cxxol c18od c196r" href="plans.html">
                                            <span className="text-sm 2xl:opacity-100 c1k3n c8uqq cvxm1 c68cp c9gyy">Plans</span>
                                        </a>
                                    </li>
                                    <li className="cu6vl c5w78">
                                        <a className="block dark:text-gray-400 c941w cwwmd cxxol c18od c196r" href="billing.html">
                                            <span className="text-sm 2xl:opacity-100 c1k3n c8uqq cvxm1 c68cp c9gyy">Billing &amp; Invoices</span>
                                        </a>
                                    </li>
                                    <li className="cu6vl c5w78">
                                        <a className="block dark:text-gray-400 c941w cwwmd cxxol c18od c196r" href="feedback.html">
                                            <span className="text-sm 2xl:opacity-100 c1k3n c8uqq cvxm1 c68cp c9gyy">Give Feedback</span>
                                        </a>
                                    </li>
                                </ul>
                            </div >
                        </li >
                        <li className="cjxkd cb8zv cvwie c33r0 cgnhv cuvgf csr1i cnbr1 c5w78 cosgb" >
                            <a className="block text-gray-800 dark:text-gray-100 c941w cxxol" href="#0">
                                <div className="flex items-center cm3rx">
                                    <div className="flex items-center">
                                        <svg className="text-violet-500 coqgc cbm9w" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                                            <path d="M14.75 2.5a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM14.75 16a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM2.5 14.75a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0ZM1.25 2.5a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5Z"></path>
                                            <path d="M8 2a6 6 0 1 0 0 12A6 6 0 0 0 8 2ZM4 8a4 4 0 1 1 8 0 4 4 0 0 1-8 0Z"></path>
                                        </svg>
                                        <span className="text-sm 2xl:opacity-100 cfh3y c1k3n c8uqq cvxm1 c68cp c9gyy">Utility</span>
                                    </div>
                                    <div className="flex 2xl:opacity-100 c8bkw coqgc c8uqq cvxm1 c68cp c9gyy">
                                        <svg className="w-3 h-3 cpts2 coqgc cbm9w cdqku cmpw7" viewBox="0 0 12 12">
                                            <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z"></path>
                                        </svg>
                                    </div>
                                </div>
                            </a >
                            <div className="2xl:block c2y99 c185y cmt20">
                                <ul className="hidden ccwg3 cwbdk">
                                    <li className="cu6vl c5w78">
                                        <a className="block dark:text-gray-400 c941w cwwmd cxxol c18od c196r" href="changelog.html">
                                            <span className="text-sm 2xl:opacity-100 c1k3n c8uqq cvxm1 c68cp c9gyy">Changelog</span>
                                        </a>
                                    </li>
                                    <li className="cu6vl c5w78">
                                        <a className="block dark:text-gray-400 c941w cwwmd cxxol c18od c196r" href="roadmap.html">
                                            <span className="text-sm 2xl:opacity-100 c1k3n c8uqq cvxm1 c68cp c9gyy">Roadmap</span>
                                        </a>
                                    </li>
                                    <li className="cu6vl c5w78">
                                        <a className="block dark:text-gray-400 c941w cwwmd cxxol c18od c196r" href="faqs.html">
                                            <span className="text-sm 2xl:opacity-100 c1k3n c8uqq cvxm1 c68cp c9gyy">FAQs</span>
                                        </a>
                                    </li>
                                    <li className="cu6vl c5w78">
                                        <a className="block dark:text-gray-400 c941w cwwmd cxxol c18od c196r" href="empty-state.html">
                                            <span className="text-sm 2xl:opacity-100 c1k3n c8uqq cvxm1 c68cp c9gyy">Empty State</span>
                                        </a>
                                    </li>
                                    <li className="cu6vl c5w78">
                                        <a className="block text-violet-500 c941w cxxol" href="404.html">
                                            <span className="text-sm 2xl:opacity-100 c1k3n c8uqq cvxm1 c68cp c9gyy">404</span>
                                        </a>
                                    </li>
                                </ul>
                            </div >
                        </li >
                    </ul >
                </div >
                <div>
                    <h3 className="c9aea c1iho cgulq c0ef0 cdqku cmpw7">
                        <span className="hidden 2xl:hidden cg8so cydwr cv9uc cs2n8 cbbia" aria-hidden="true">•••</span>
                        <span className="2xl:block c2y99 c185y cmt20">More</span>
                    </h3>
                    <ul className="c7gr8">
                        <li className="cjxkd cb8zv cuvgf csr1i cnbr1 c5w78" >
                            <a className="block text-gray-800 dark:text-gray-100 cxxol c4t3r cigpx" href="#0">
                                <div className="flex items-center cm3rx">
                                    <div className="flex items-center">
                                        <svg className="coqgc cbm9w cdqku cmpw7" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                                            <path d="M11.442 4.576a1 1 0 1 0-1.634-1.152L4.22 11.35 1.773 8.366A1 1 0 1 0 .227 9.634l3.281 4a1 1 0 0 0 1.59-.058l6.344-9ZM15.817 4.576a1 1 0 1 0-1.634-1.152l-5.609 7.957a1 1 0 0 0-1.347 1.453l.656.8a1 1 0 0 0 1.59-.058l6.344-9Z"></path>
                                        </svg>
                                        <span className="text-sm 2xl:opacity-100 cfh3y c1k3n c8uqq cvxm1 c68cp c9gyy">Authentication</span>
                                    </div>
                                    <div className="flex 2xl:opacity-100 c8bkw coqgc c8uqq cvxm1 c68cp c9gyy">
                                        <svg className="w-3 h-3 cpts2 coqgc cbm9w cdqku cmpw7" viewBox="0 0 12 12">
                                            <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z"></path>
                                        </svg>
                                    </div>
                                </div>
                            </a>
                            <div className="2xl:block c2y99 c185y cmt20">
                                <ul className="hidden ccwg3 cwbdk">
                                    <li className="cu6vl c5w78">
                                        <a className="block dark:text-gray-400 c941w cwwmd cxxol c18od c196r" href="signin.html">
                                            <span className="text-sm 2xl:opacity-100 c1k3n c8uqq cvxm1 c68cp c9gyy">Sign In</span>
                                        </a>
                                    </li>
                                    <li className="cu6vl c5w78">
                                        <a className="block dark:text-gray-400 c941w cwwmd cxxol c18od c196r" href="signup.html">
                                            <span className="text-sm 2xl:opacity-100 c1k3n c8uqq cvxm1 c68cp c9gyy">Sign up</span>
                                        </a>
                                    </li>
                                    <li className="cu6vl c5w78">
                                        <a className="block dark:text-gray-400 c941w cwwmd cxxol c18od c196r" href="reset-password.html">
                                            <span className="text-sm 2xl:opacity-100 c1k3n c8uqq cvxm1 c68cp c9gyy">Reset Password</span>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </li >
                        <li className="cjxkd cb8zv cuvgf csr1i cnbr1 c5w78" >
                            <a className="block text-gray-800 dark:text-gray-100 cxxol c4t3r cigpx" href="#0">
                                <div className="flex items-center cm3rx">
                                    <div className="flex items-center">
                                        <svg className="coqgc cbm9w cdqku cmpw7" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                                            <path d="M6.668.714a1 1 0 0 1-.673 1.244 6.014 6.014 0 0 0-4.037 4.037 1 1 0 1 1-1.916-.571A8.014 8.014 0 0 1 5.425.041a1 1 0 0 1 1.243.673ZM7.71 4.709a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM9.995.04a1 1 0 1 0-.57 1.918 6.014 6.014 0 0 1 4.036 4.037 1 1 0 0 0 1.917-.571A8.014 8.014 0 0 0 9.995.041ZM14.705 8.75a1 1 0 0 1 .673 1.244 8.014 8.014 0 0 1-5.383 5.384 1 1 0 0 1-.57-1.917 6.014 6.014 0 0 0 4.036-4.037 1 1 0 0 1 1.244-.673ZM1.958 9.424a1 1 0 0 0-1.916.57 8.014 8.014 0 0 0 5.383 5.384 1 1 0 0 0 .57-1.917 6.014 6.014 0 0 1-4.037-4.037Z"></path>
                                        </svg>
                                        <span className="text-sm 2xl:opacity-100 cfh3y c1k3n c8uqq cvxm1 c68cp c9gyy">Onboarding</span>
                                    </div>
                                    <div className="flex 2xl:opacity-100 c8bkw coqgc c8uqq cvxm1 c68cp c9gyy">
                                        <svg className="w-3 h-3 cpts2 coqgc cbm9w cdqku cmpw7" viewBox="0 0 12 12">
                                            <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z"></path>
                                        </svg>
                                    </div>
                                </div>
                            </a >
                            <div className="2xl:block c2y99 c185y cmt20">
                                <ul className="hidden ccwg3 cwbdk">
                                    <li className="cu6vl c5w78">
                                        <a className="block dark:text-gray-400 c941w cwwmd cxxol c18od c196r" href="onboarding-01.html">
                                            <span className="text-sm 2xl:opacity-100 c1k3n c8uqq cvxm1 c68cp c9gyy">Step 1</span>
                                        </a>
                                    </li>
                                    <li className="cu6vl c5w78">
                                        <a className="block dark:text-gray-400 c941w cwwmd cxxol c18od c196r" href="onboarding-02.html">
                                            <span className="text-sm 2xl:opacity-100 c1k3n c8uqq cvxm1 c68cp c9gyy">Step 2</span>
                                        </a>
                                    </li>
                                    <li className="cu6vl c5w78">
                                        <a className="block dark:text-gray-400 c941w cwwmd cxxol c18od c196r" href="onboarding-03.html">
                                            <span className="text-sm 2xl:opacity-100 c1k3n c8uqq cvxm1 c68cp c9gyy">Step 3</span>
                                        </a>
                                    </li>
                                    <li className="cu6vl c5w78">
                                        <a className="block dark:text-gray-400 c941w cwwmd cxxol c18od c196r" href="onboarding-04.html">
                                            <span className="text-sm 2xl:opacity-100 c1k3n c8uqq cvxm1 c68cp c9gyy">Step 4</span>
                                        </a>
                                    </li>
                                </ul>
                            </div >
                        </li >
                        <li className="cjxkd cb8zv cuvgf csr1i cnbr1 c5w78" >
                            <a className="block text-gray-800 dark:text-gray-100 cxxol c4t3r cigpx" href="#0">
                                <div className="flex items-center cm3rx">
                                    <div className="flex items-center">
                                        <svg className="coqgc cbm9w cdqku cmpw7" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                                            <path d="M.06 10.003a1 1 0 0 1 1.948.455c-.019.08.01.152.078.19l5.83 3.333c.053.03.116.03.168 0l5.83-3.333a.163.163 0 0 0 .078-.188 1 1 0 0 1 1.947-.459 2.161 2.161 0 0 1-1.032 2.384l-5.83 3.331a2.168 2.168 0 0 1-2.154 0l-5.83-3.331a2.162 2.162 0 0 1-1.032-2.382Zm7.856-7.981-5.83 3.332a.17.17 0 0 0 0 .295l5.828 3.33c.054.031.118.031.17.002l5.83-3.333a.17.17 0 0 0 0-.294L8.085 2.023a.172.172 0 0 0-.17-.001ZM9.076.285l5.83 3.332c1.458.833 1.458 2.935 0 3.768l-5.83 3.333c-.667.38-1.485.38-2.153-.001l-5.83-3.332c-1.457-.833-1.457-2.935 0-3.767L6.925.285a2.173 2.173 0 0 1 2.15 0Z"></path>
                                        </svg>
                                        <span className="text-sm 2xl:opacity-100 cfh3y c1k3n c8uqq cvxm1 c68cp c9gyy">Components</span>
                                    </div>
                                    <div className="flex 2xl:opacity-100 c8bkw coqgc c8uqq cvxm1 c68cp c9gyy">
                                        <svg className="w-3 h-3 cpts2 coqgc cbm9w cdqku cmpw7" viewBox="0 0 12 12">
                                            <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z"></path>
                                        </svg>
                                    </div>
                                </div>
                            </a >
                            <div className="2xl:block c2y99 c185y cmt20">
                                <ul className="hidden ccwg3 cwbdk">
                                    <li className="cu6vl c5w78">
                                        <a className="block dark:text-gray-400 c941w cwwmd cxxol c18od c196r" href="component-button.html">
                                            <span className="text-sm 2xl:opacity-100 c1k3n c8uqq cvxm1 c68cp c9gyy">Button</span>
                                        </a>
                                    </li>
                                    <li className="cu6vl c5w78">
                                        <a className="block dark:text-gray-400 c941w cwwmd cxxol c18od c196r" href="component-form.html">
                                            <span className="text-sm 2xl:opacity-100 c1k3n c8uqq cvxm1 c68cp c9gyy">Input Form</span>
                                        </a>
                                    </li>
                                    <li className="cu6vl c5w78">
                                        <a className="block dark:text-gray-400 c941w cwwmd cxxol c18od c196r" href="component-dropdown.html">
                                            <span className="text-sm 2xl:opacity-100 c1k3n c8uqq cvxm1 c68cp c9gyy">Dropdown</span>
                                        </a>
                                    </li>
                                    <li className="cu6vl c5w78">
                                        <a className="block dark:text-gray-400 c941w cwwmd cxxol c18od c196r" href="component-alert.html">
                                            <span className="text-sm 2xl:opacity-100 c1k3n c8uqq cvxm1 c68cp c9gyy">Alert &amp; Banner</span>
                                        </a>
                                    </li>
                                    <li className="cu6vl c5w78">
                                        <a className="block dark:text-gray-400 c941w cwwmd cxxol c18od c196r" href="component-modal.html">
                                            <span className="text-sm 2xl:opacity-100 c1k3n c8uqq cvxm1 c68cp c9gyy">Modal</span>
                                        </a>
                                    </li>
                                    <li className="cu6vl c5w78">
                                        <a className="block dark:text-gray-400 c941w cwwmd cxxol c18od c196r" href="component-pagination.html">
                                            <span className="text-sm 2xl:opacity-100 c1k3n c8uqq cvxm1 c68cp c9gyy">Pagination</span>
                                        </a>
                                    </li>
                                    <li className="cu6vl c5w78">
                                        <a className="block dark:text-gray-400 c941w cwwmd cxxol c18od c196r" href="component-tabs.html">
                                            <span className="text-sm 2xl:opacity-100 c1k3n c8uqq cvxm1 c68cp c9gyy">Tabs</span>
                                        </a>
                                    </li>
                                    <li className="cu6vl c5w78">
                                        <a className="block dark:text-gray-400 c941w cwwmd cxxol c18od c196r" href="component-breadcrumb.html">
                                            <span className="text-sm 2xl:opacity-100 c1k3n c8uqq cvxm1 c68cp c9gyy">Breadcrumb</span>
                                        </a>
                                    </li>
                                    <li className="cu6vl c5w78">
                                        <a className="block dark:text-gray-400 c941w cwwmd cxxol c18od c196r" href="component-badge.html">
                                            <span className="text-sm 2xl:opacity-100 c1k3n c8uqq cvxm1 c68cp c9gyy">Badge</span>
                                        </a>
                                    </li>
                                    <li className="cu6vl c5w78">
                                        <a className="block dark:text-gray-400 c941w cwwmd cxxol c18od c196r" href="component-avatar.html">
                                            <span className="text-sm 2xl:opacity-100 c1k3n c8uqq cvxm1 c68cp c9gyy">Avatar</span>
                                        </a>
                                    </li>
                                    <li className="cu6vl c5w78">
                                        <a className="block dark:text-gray-400 c941w cwwmd cxxol c18od c196r" href="component-tooltip.html">
                                            <span className="text-sm 2xl:opacity-100 c1k3n c8uqq cvxm1 c68cp c9gyy">Tooltip</span>
                                        </a>
                                    </li>
                                    <li className="cu6vl c5w78">
                                        <a className="block dark:text-gray-400 c941w cwwmd cxxol c18od c196r" href="component-accordion.html">
                                            <span className="text-sm 2xl:opacity-100 c1k3n c8uqq cvxm1 c68cp c9gyy">Accordion</span>
                                        </a>
                                    </li>
                                    <li className="cu6vl c5w78">
                                        <a className="block dark:text-gray-400 c941w cwwmd cxxol c18od c196r" href="component-icons.html">
                                            <span className="text-sm 2xl:opacity-100 c1k3n c8uqq cvxm1 c68cp c9gyy">Icons</span>
                                        </a>
                                    </li>
                                </ul>
                            </div >
                        </li >
                    </ul >
                </div >
            </div >

            <div className="hidden 2xl:hidden justify-end czn6f cmyi8 cw8up cbbia">
                <div className="ct03h cuvgf csr1i cnbr1">
                    <button className="cdqku cvvyz cg12x cmpw7 c3e4j" >
                        <span className="cn8jz">Expand / collapse sidebar</span>
                        <svg className="coqgc cbm9w cdqku cfa4k cmpw7" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                            <path d="M15 16a1 1 0 0 1-1-1V1a1 1 0 1 1 2 0v14a1 1 0 0 1-1 1ZM8.586 7H1a1 1 0 1 0 0 2h7.586l-2.793 2.793a1 1 0 1 0 1.414 1.414l4.5-4.5A.997.997 0 0 0 12 8.01M11.924 7.617a.997.997 0 0 0-.217-.324l-4.5-4.5a1 1 0 0 0-1.414 1.414L8.586 7M12 7.99a.996.996 0 0 0-.076-.373Z"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>

    );
}

