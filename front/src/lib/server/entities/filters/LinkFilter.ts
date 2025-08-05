import { Link } from "$entities/Link";
import type { Repository } from "typeorm";
import { Filter } from "./Filter";
import type { SelectQueryBuilder } from "typeorm/browser";
import type { Product } from "$entities/Product";

export class LinkFilter extends Filter<Link> {
    protected getRepository(): Repository<Link> {
        return Link.getRepository();
    }

    public withProduct(id: string) {
        this.leftJoin('product_links', 'pl', '"Link".id = pl.link_id')
        if(id) { this.queryBuilder.andWhere('pl.product_id = :id', {id}); }
        return this;
    }    
    public withProducts(ids: string[]) {
        this.leftJoin('product_links', 'pl', '"Link".id = pl.link_id')
        if(ids.length) { this.queryBuilder.andWhere('pl.product_id in (:...product_ids)', {product_ids: ids}); }
        return this;
    }
    
    public withProductsSub(q: SelectQueryBuilder<Product>) {
        this.leftJoin('product_links', 'pl', '"Link".id = pl.link_id');
        this.queryBuilder.andWhere('pl.product_id in (' + q.clone().select(['"Product".id']).getQuery() + ')');
        return this;
    }

    public withAvailability(availability: boolean|null) {
        if (availability !== null) {
            this.queryBuilder.andWhere('"Link".availability = :availability', { availability: availability });
        }

        return this;
    }

    public withCity(id: string) {
        if(id != '') {
            this.queryBuilder.andWhere('"Link".city_id = :city_id', {city_id: id})
        }
        return this
    }

    public withCities(ids: Array<string|number>) {
        if(ids.length) {
            this.queryBuilder.andWhere('"Link".city_id in (:...city_ids)', {city_ids: ids})
        }
        return this
    }

    public withSite(id: string) {
        if(id != '') {
            this.queryBuilder.andWhere('"Link".site_id = :site_id', {site_id: id})
        }
        return this
    }
     public withCompetitor(id: number|string) {
        if(id) {
            this.leftJoin('sites', 'Site', '"Link".site_id = "Site".id');
            this.leftJoin('competitors', 'Competitor', '"Site".id = "Competitor".site_id');
            this.queryBuilder.andWhere('"Competitor".id = :competitor_id', { competitor_id:id })
        }
        return this
    }

    public loadRelationCompetitor() {
        this.leftJoin('sites', 'Site', '"Link".site_id = "Site".id');
        this.leftJoin('competitors', 'Competitor', '"Site".id = "Competitor".site_id');
        return this;
    }
    public withCompetitors(ids: Array<string|number>) {
        if(ids.length) {
            this.loadRelationCompetitor();
            this.queryBuilder.andWhere('"Competitor".id in (:...competitor_ids)', { competitor_ids:ids })
        }
        return this
    }

    public loadRelationProduct() {
        this.leftJoin("Link.products", "product")
        this.queryBuilder.addSelect(['product.name', 'product.id']);
        return this
    }

    public loadRelationCity() {
        this.leftJoin("Link.city", "city")
        this.queryBuilder.addSelect(['city.address', 'city.city as city_name']);
        return this
    }

    public withPriceBetween(range: {min: number, max: number}) {
        if(range.min > 0 || range.max > 0) {
            this.queryBuilder.andWhere('price between :min and :max', range)
        }
        return this;
    }

    public static async getMinMaxPrice(city_id: number|string|undefined = undefined, competitor_id: number|string|undefined = undefined) {
        let f = new LinkFilter();
        f.queryBuilder.select(["MIN(price) as min", "MAX(price) as max", "1 as g"]);
        if(city_id) { f.withCity(""+city_id) }
        if(competitor_id) { f.withCompetitor(""+competitor_id) }
        return await f.queryBuilder.groupBy('g').orderBy("g").getRawOne();
    }
}