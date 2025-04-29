export class LocalStorageHelper {
    static getValue(key: string): string {
        return localStorage.getItem(key) ?? '';
    }

    static getIntValue(key: string): number {
        const data = parseInt(localStorage.getItem(key) ?? "0");
        return isNaN(data) ? 0 : data;
    }

    static getBoolValue(key: string): boolean {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : false;
    }

    static setValue(key: string, value: string): void {
        localStorage.setItem(key, value);
    }

    static setIntValue(key: string, value: number): void {
        localStorage.setItem(key, value.toString());
    }

    static setBoolValue(key: string, value: boolean): void {
        localStorage.setItem(key, JSON.stringify(value));
    }

    static removeKey(key: string): void {
        localStorage.removeItem(key);
    }

    static containsKey(key: string): boolean {
        return !!localStorage.getItem(key);
    }
}
