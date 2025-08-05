import { Competitor } from "$entities/Competitor";
import { Filter } from "$entities/filters/Filter";

export class CompetitorFilter extends Filter<Competitor> {
    protected getRepository() { return Competitor.getRepository(); }
    
    public pin(pinned: string[]) {
        for (let k in pinned) {
            let pinColName = "_pin" + k;
            this.queryBuilder
                .addSelect('CASE WHEN "Competitor".id = ' + pinned[k] + ' THEN 0 ELSE 1 END AS ' + pinColName)
                .addOrderBy(pinColName, 'ASC');
        }
        return this;
    }

    public sortByItemPrice(sortProductId: string, sortDirection: "ASC"|"DESC" = "ASC") {
        this.leftJoin('links', 'l', '"Competitor".id = l.competitor_id');
        this.leftJoin('product_links', 'lp', 'lp.link_id = l.id');
        this.queryBuilder
			.andWhere('lp.product_id = :productId', { productId: sortProductId })
			.addOrderBy('l.price', sortDirection);
        return this;
    }

    public withCity(id: string) {
        if(id != "") {
            this.leftJoin('cities_sites', 'c_to_s', '"Competitor".site_id = c_to_s.site_id');
            this.queryBuilder
                .andWhere('c_to_s.city_id = :id', {id})
        }
        
        return this;
    }   


    public loadHost(city?: string) {
        let cityQuery = city ? "and c_to_s.city_id = "+city : "";
        this.leftJoin('cities_sites', 'c_to_s', '"Competitor".site_id = c_to_s.site_id '+cityQuery);
        this.leftJoin('sites', 'sites', 'c_to_s.site_id = sites.id');
        this.queryBuilder.addSelect('sites.host as host');
        return this;
    }

    public withName(name: string) {
        if(name != '') {
            this.queryBuilder.andWhere("\"Competitor\".name like '%"+name+"%'")
        }
        return this;
    }

    public withUser(value: string) {
        if(value != "") {
            this.queryBuilder.andWhere('"Competitor".user_id = :user_id', {user_id:value});
        }
        return this;
    }

    public loadRelationSite() {
        this.leftJoin("Competitor.site", "site")
        this.queryBuilder.addSelect(['site.host as host']);
        return this
    }
}