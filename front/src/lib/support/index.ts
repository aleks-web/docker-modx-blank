import type { Setting } from "$entities/Setting";
import type { User } from "$entities/User";

export * from "$lib/support/diff";

export const requiredSettingsIsFilled = (user: User)=>{
    let filledSettings  = user.settings.filter((s:Setting)=>(!!s.value)).map((s:Setting)=>s.setting);
    let requiredSettings = ["default_city", "default_competitor"];
    let excludeIntersected = requiredSettings.filter(rq=>(!filledSettings.includes(rq)));
    return excludeIntersected.length == 0;
}