"use client";


const isProd = true;

const PROD_API_BASE_URL = "https://industriel-rh.vercel.app/api"
const PROD_API_BASE = "https://api.industriel-rh.com"
const PROD_API_BASE_WITHOUT_PROTOCOL = "api.industriel-rh.com"

const DEV_API_BASE_URL = "http://localhost:3000/api"
const DEV_API_BASE = "http://localhost:3000/api"
const DEV_API_BASE_WITHOUT_PROTOCOL = "localhost:3000/api";

export const apiBaseURL = isProd ? PROD_API_BASE_URL : DEV_API_BASE_URL;

export const baseApiURL: string = isProd ? PROD_API_BASE_URL : DEV_API_BASE_URL;
export const apiBase: string = isProd ? PROD_API_BASE : DEV_API_BASE;
export const apiBaseWithoutProtocol: string = isProd ? PROD_API_BASE_WITHOUT_PROTOCOL : DEV_API_BASE_WITHOUT_PROTOCOL;

export const userAvartarURL: string = "https://cdn3d.iconscout.com/3d/premium/thumb/man-avatar-3d-icon-download-in-png-blend-fbx-gltf-file-formats--men-people-male-pack-avatars-icons-5187871.png?f=webp";