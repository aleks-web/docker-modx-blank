import { Filter } from "$entities/filters/Filter";
import { Site } from "$entities/Site";

export class SiteFilter extends Filter<Site> {
    protected getRepository() { return Site.getRepository(); }
}