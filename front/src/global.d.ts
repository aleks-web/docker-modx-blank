import { EPermissions } from "$enums/EPermissions";
import type { Auth } from "$lib/server/auth";
import type { UserSettings } from "$lib/server/UserSettings";

export declare global {
    namespace globalThis {
        function hasPermission(permission: string | EPermissions): boolean;
        var Auth: Auth;
        var UserSettings: UserSettings;
    }
}