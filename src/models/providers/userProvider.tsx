import { LocalStorageHelper } from "@/utils/localStorage.helper";
import { User } from "../user";

export class UserProvider {

    user: User = User.fromJson({});

    key: string = 'userLocal';

    saveInLocal(): User {
        LocalStorageHelper.setValue(this.key, JSON.stringify(this.user.toJson()));
        return this.user;
    }

    fromLocal(): User {
        const data: string = LocalStorageHelper.getValue(this.key);
        this.user = User.fromJson(data.length > 0 ? JSON.parse(data) : {});
        return this.user;
    }

    logout(): void {
        this.user = User.fromJson({});
        LocalStorageHelper.removeKey(this.key);
    }
}