"use client";

export class LocalStorageHelper {
  static getValue(key: string): string {
    if (typeof window === "undefined") return "";
    return localStorage.getItem(key) ?? "";
  }

  static getIntValue(key: string): number {
    if (typeof window === "undefined") return 0;
    const data = parseInt(localStorage.getItem(key) ?? "0");
    return isNaN(data) ? 0 : data;
  }

  static getBoolValue(key: string): boolean {
    if (typeof window === "undefined") return false;
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : false;
  }

  static setValue(key: string, value: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(key, value);
  }

  static setIntValue(key: string, value: number): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(key, value.toString());
  }

  static setBoolValue(key: string, value: boolean): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(key, JSON.stringify(value));
  }

  static removeKey(key: string): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(key);
  }

  static containsKey(key: string): boolean {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem(key);
  }
}
