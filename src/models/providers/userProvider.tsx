import { LocalStorageHelper } from "@/utils/localStorage.helper";
import { User } from "../user";

export class UserProvider {

    user: User = User.fromJSON({
        id: "",
        name: "",
        email: ""
    });

    key: string = 'userLocal';

    saveInLocal(): User {
        LocalStorageHelper.setValue(this.key, JSON.stringify(this.user.toJSON()));
        return this.user;
    }

    fromLocal(): User {
        const data: string = LocalStorageHelper.getValue(this.key);
        this.user = User.fromJSON(data.length > 0 ? JSON.parse(data) : {});
        return this.user;
    }

    logout(): void {
        this.user = User.fromJSON({
            id: "",
            name: "",
            email: ""
        });
        LocalStorageHelper.removeKey(this.key);
    }
}