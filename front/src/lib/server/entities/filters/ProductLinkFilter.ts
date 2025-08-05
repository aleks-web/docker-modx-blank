import { Filter } from "$entities/filters/Filter";
import { ProductLink } from "$entities/ProductLink";

export class ProductLinkFilter extends Filter<ProductLink> {
    protected getRepository() { return ProductLink.getRepository(); }
    public joinProduct() {
        return this.leftJoin('products', 'p', '"p"."id" = "ProductLink"."product_id"')
    }
    public joinLink() {
        return this.leftJoin('links', 'l', '"l"."id" = "ProductLink"."link_id"')
    }
    public joinSite() {
        return this.joinLink().leftJoin('sites', 'site', '"l"."site_id" = "site"."id"')
    }
    public joinCompetitor() {
        return this.joinSite().leftJoin('competitors', 'c', '"c"."site_id" = "site"."id"')
    }

    public withCompetitor(value: string|number) {
        if(value != "") {
            this.joinCompetitor();
            this.queryBuilder.andWhere(`c.id = :pl_competitor_id`, {pl_competitor_id: value});   
        }
        return this
    }
    public withCompetitors(value: Array<string|number>) {
        if(value.length > 0) {
            this.joinCompetitor();
            this.queryBuilder.andWhere(`c.id in (:...pl_competitor_ids)`, {pl_competitor_ids: value});
        }
        return this
    }

    public withCity(id: string|number) {
        if(id != '') {
            this.joinLink();
            this.queryBuilder.andWhere("l.city_id = :city_id", {city_id:id})
        }
        return this
    }

    public withCities(ids: Array<string|number>) {
        if(ids.length > 0) {
            this.joinLink();
            this.queryBuilder.andWhere("l.city_id in (:...city_ids)", {city_ids:ids})
        }
        return this
    }

    public withCategories(ids: Array<string|number>) {
        if(ids.length) {
            this.joinProduct();
            this.queryBuilder.andWhere('"p".category_id in (:...category_ids)', {category_ids:ids});   
        }
        return this
    }

    public withUser(value: string, uniqueFieldCode: string = 'user_id') {
        if(value != "") {
            this.joinCompetitor();
            this.queryBuilder.andWhere(`"c".user_id = :${uniqueFieldCode}`, {[uniqueFieldCode]:value});   
        }
        return this
    }


}