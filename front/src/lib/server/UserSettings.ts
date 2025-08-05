import {ESettings} from '$lib/enums/ESettings';
import {Setting} from '$entities/Setting';
import {Site} from '$entities/Site';
import {City} from '$entities/City';
import {Competitor} from '$entities/Competitor';
import type {RequestEvent} from "@sveltejs/kit";

export class UserSettings {
    private event: RequestEvent;
    private settings: Setting[] = [];
    private buffer: any = {}; 

    constructor(event: RequestEvent) {
        this.event = event;
    }

    public async init() {
        const settings = await Setting.findBy({ user: this.event.locals.user });

        if (settings) {
            this.settings = settings;
        }
    }

    public get(setting: string) {
        for (let sg of this.settings) {
            if (sg.setting === setting) {
                return sg;
            }
        }
        return null;
    }

    protected async getBuffered(k: string, def: ( ()=>Promise<any>) = async () => null): Promise<typeof def | ReturnType<typeof def> | Awaited<ReturnType<typeof def>>> {
        if(this.buffer[k] !== undefined) { return this.buffer[k]; }
        this.buffer[k] = typeof def == 'function' ? await def() : def;
        return this.buffer[k];
    }
    protected async resetBuffer(k?: string) {
        if(k) { delete this.buffer[k]; } else { this.buffer = {} }
    }

    public async set(setting: string, value: string) {
        const settingEntity = this.get(setting);

        if (settingEntity) {
            settingEntity.value = value;
            await settingEntity.save();
        }

        return settingEntity;
    }

    public async getSite() {
        return await this.getBuffered('site', async ()=>{
            const competitor =  await this.getCompetitor();
            if (!competitor) { return null; }
            return await Site.findOneBy({id: Number(competitor.site_id)});
        });
    }

    public async getCompetitor(): Promise<Competitor|null> {
        return await this.getBuffered('competitor', async ()=>{
            const setting = this.get(ESettings.Competitor);
            if (setting) {
                return await Competitor.findOneBy({id: Number(setting.value)});
            }
            return null;
        });
    }

    public async getCity() {
        return await this.getBuffered('city', async ()=>{
            const setting = this.get(ESettings.City);
            if (setting) {
                return await City.findOneBy({id: Number(setting.value)});
            }
            return null;
        })
    }

    public async setCity(city: string | number | City) {
        if (typeof city !== 'object') {
            await this.set(ESettings.City, String(city));
        } else {
            await this.set(ESettings.City, String(city.id));
        }
        this.resetBuffer('city');
    }


    private async prepareSetting(setting: Setting) {
        switch (setting.setting) {
            case ESettings.City:
                return await City.findOneBy({id: Number(setting.value)});
            default:
                return setting;
        }
    }
}

export default UserSettings;