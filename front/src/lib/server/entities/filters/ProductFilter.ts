import { Filter } from "$entities/filters/Filter";
import { Link } from "$entities/Link";
import { Product } from "$entities/Product";
import { Brackets } from "typeorm";

export class ProductFilter extends Filter<Product> {
    protected getRepository() { return Product.getRepository(); }

    public withUser(value: string, uniqueFieldCode: string = 'user_id') {
        if(value != "") {
            this.queryBuilder.andWhere(`"Product".user_id = :${uniqueFieldCode}`, {[uniqueFieldCode]:value});   
        }
        return this
    }

    public withActivity(isActive: null|boolean) {
        if(isActive !== null) {
            this.queryBuilder.andWhere('"Product".active = :active', { active: isActive });
        }
        return this;
    }

    public withBrand(id:  string) {
        if(id != "") {
            this.queryBuilder.andWhere('brand_id = :brand_id', {brand_id:id});   
        }
        return this;
    }
    public withBrands(ids: Array<string|number>) {
        if(ids.length) {
            this.queryBuilder.andWhere('"Product".brand_id in (:...brand_ids)', {brand_ids: ids});
        }
        return this;
    }

    public withLikeName(name: string) {
        if(name) {
            this.queryBuilder.andWhere('Product.name ILIKE :name', {name: `%${name}%`});
        }
        return this
    }

    public loadRelationCategory() {
        this.leftJoin("Product.category", "category")
        this.queryBuilder.addSelect(['category.name']);
        return this
    }

    public loadRelationBrand() {
        this.leftJoin("Product.brand", "brand")
        this.queryBuilder.addSelect(['brand.name']);
        return this
    }

    public withCategory(value: string) {
        if(value != "") {
            this.queryBuilder.andWhere('category_id = :category_id', {category_id:value});   
        }
        return this
    }
    public withCategories(ids: Array<string|number>) {
        if(ids.length) {
            this.queryBuilder.andWhere('category_id in (:...category_ids)', {category_ids:ids});   
        }
        return this
    }
    public withCompetitor(value: string) {
        if(value != '') {
            this.leftJoin('product_links', 'pl', '"Product".id = pl.product_id')
            this.leftJoin('links', 'l', 'l.id = pl.link_id')
            this.leftJoin('sites', 'site', 'l.site_id = site.id')
            this.leftJoin('competitors', 'c', 'c.site_id = site.id')
            this.queryBuilder.andWhere('c.id = :competitor_id', { competitor_id: value });
        }
        return this
    }
    public withCompetitors(value: string[]) {
        if( value.length ) {
            this.leftJoin('product_links', 'pl', '"Product".id = pl.product_id')
            this.leftJoin('links', 'l', 'l.id = pl.link_id')
            this.leftJoin('sites', 'site', 'l.site_id = pl.link_id')
            this.leftJoin('competitors', 'c', 'c.site_id = site.id')
            this.queryBuilder.andWhere('c.id in (:...competitor_ids)', { competitor_ids: value });
        }
        return this
    }
    public withName(name: string) {
        if(name != '') {
            this.queryBuilder.andWhere("\"Product\".name ilike '%"+name+"%'")
        }
        return this;
    }
    public withCity(id: string) {
        if(id != '') {
            this.leftJoin('product_links', 'pl', '"Product".id = pl.product_id')
            this.leftJoin('links', 'l', 'l.id = pl.link_id')
            this.queryBuilder.andWhere('l.city_id = :city_id', {city_id:id})
        }
        return this
    }

    public withNoLinks() {
        this.leftJoin('product_links', 'pl', '"Product".id = pl.product_id')
         this.queryBuilder.andWhere('pl.link_id is null');
        return this
    }

    public withPriceBetween(city: string, competitor: string|number, range: {min: number, max: number}, limits: {min: number, max: number}) {
        if((range.min || range.max) && (range.min > limits.min || range.max < limits.max)) {
            let sq = (new ProductFilter())
                .withCity(city)
                .withCompetitor(""+competitor)
                sq.select(['true as price_filter', '"Product".id as product_id'])

            if(range.min && range.max) {
               sq.getBuilder()
                    .andWhere('l.price between ' + Number(range.min)+' and '+ Number(range.max));
            } else if (range.min) {
                sq.getBuilder()
                    .andWhere('l.price > ' + Number(range.min));
            } else if (range.max) {
                sq.getBuilder()
                    .andWhere('l.price < ' + Number(range.max));
            }

            this.joinQuery(sq.getBuilder(), 'pf', 'pf.product_id = "Product".id')
            this.queryBuilder.andWhere("pf.price_filter = true");
        }
        return this;
    }

    public selectMinPriceBySite(siteId: number) {
        const joinName = 'min_price_site';

        if(! this.joins.includes(joinName)) {
            let sq = Link.getRepository().createQueryBuilder("l")
                .leftJoin("product_links", "pl", '"l".id = pl.link_id')
                .select(['pl.product_id as product_id', 'MIN(l.price) as min_price'])
                .where('"l".site_id = ' + siteId)
                .groupBy("pl.product_id").orderBy('pl.product_id');
            this.queryBuilder.leftJoin("(" + sq.getQuery() + ")", 'min_prices_site', 'min_prices_site.product_id = "Product".id');
            this.queryBuilder.addSelect(['min_prices_site.min_price as ' + joinName]);
            this.joins.push(joinName);
        }

        return this;
    }

    public selectMaxPriceBySite(siteId: number) {
        const joinName = 'max_price_site';

        if(! this.joins.includes(joinName)) {
            let sq = Link.getRepository().createQueryBuilder("l")
                .leftJoin("product_links", "pl", '"l".id = pl.link_id')
                .select(['pl.product_id as product_id', 'MAX(l.price) as min_price'])
                .where('"l".site_id = ' + siteId)
                .groupBy("pl.product_id").orderBy('pl.product_id');
            this.queryBuilder.leftJoin("(" + sq.getQuery() + ")", 'max_prices_site', 'max_prices_site.product_id = "Product".id');
            this.queryBuilder.addSelect(['max_prices_site.min_price as ' + joinName]);
            this.joins.push(joinName);
        }

        return this;
    }

    public selectMinMaxPrice(city: number|null = null) {
        const joinName = city ? 'minmax_city' : 'minmax';

        if(! this.joins.includes(joinName)) {
            let sufix =  city ? "_city" : "";
            let sq = Link.getRepository().createQueryBuilder("l")
                .leftJoin("product_links", "pl", '"l".id = pl.link_id')
                .select(['pl.product_id as product_id', 'MIN(l.price) as min_price', 'MAX(l.price) as max_price'])
                .groupBy("pl.product_id");

            if (city) {
                sq.andWhere('"l".city_id = ' + city);
            }

            this.joinQuery(sq, 'minmax', 'minmax.product_id = "Product".id')
            this.queryBuilder.addSelect(['minmax.min_price as min_price'+sufix]);
            this.queryBuilder.addSelect(['minmax.max_price as max_price'+sufix]);
        }

        return this;
    }
    public selectMinPrice(city: number|null = null) {
        const joinName = city ? 'min_price_city' : 'min_price';

        if(! this.joins.includes(joinName)) {
            let sq = Link.getRepository().createQueryBuilder("l")
                .leftJoin("product_links", "pl", '"l".id = pl.link_id')
                .select(['pl.product_id as product_id', 'MIN(l.price) as min_price'])
                .groupBy("pl.product_id");

            if (city) {
                sq.andWhere('"l".city_id = ' + city);
            }

            const subQuery = sq.getQuery();
            const parameters = sq.getParameters();

            this.queryBuilder.leftJoin("(" + subQuery + ")", 'min_prices', 'min_prices.product_id = "Product".id');
            this.queryBuilder.addSelect(['min_prices.min_price as ' + joinName]);
            this.joins.push(joinName);

            const queryParameters = {
                ...this.queryBuilder.getParameters(),
                ...parameters
            };

            this.queryBuilder.setParameters(queryParameters);
        }

        return this;
    }
    public selectMaxPrice(city: number|null = null) {
        const joinName = city ? 'max_price_city' : 'max_price';

        if(! this.joins.includes(joinName)) {
            let sq = Link.getRepository().createQueryBuilder("l")
                .leftJoin("product_links", "pl", '"l".id = pl.link_id')
                .select(['pl.product_id as product_id', 'MAX(l.price) as max_price'])
                .groupBy("pl.product_id");

            if (city) {
                sq.andWhere('"l".city_id = ' + city);
            }

            const subQuery = sq.getQuery();
            const parameters = sq.getParameters();

            this.queryBuilder.leftJoin("(" + subQuery + ")", 'max_prices', 'max_prices.product_id = "Product".id');
            this.queryBuilder.addSelect(['max_prices.max_price as ' + joinName]);
            this.joins.push(joinName);

            const queryParameters = {
                ...this.queryBuilder.getParameters(),
                ...parameters
            };

            this.queryBuilder.setParameters(queryParameters);
        }
        return this;
    }

    public withPlacesInMarket(competitor: string|number, city: string|number, places: Array<'bottom'|'middle'|'top'>) {
        if(places.length) {
            let sq = new ProductFilter();
            
            sq.selectMinMaxPrice(Number(city))
                .leftJoin('product_links', 'pl', '"Product".id = pl.product_id')
                .leftJoin('links', 'l', 'l.id = pl.link_id')
                .leftJoin('sites', 's', 's.id = l.site_id')
                .leftJoin('competitors', 'c', 'c.site_id = s.id');
            sq.select(['true as place_filter', '"Product".id as product_id'])
            sq.getBuilder().andWhere("c.id = :competitor_id", {competitor_id: ""+competitor});
            sq.getBuilder().andWhere("l.city_id = :city_id", {city_id: ""+city});
            sq.getBuilder().andWhere(new Brackets(qb=>{
                if(places.includes('bottom')) {
                    qb.orWhere("min_price = l.price");
                }
                if(places.includes('top')) {
                    qb.orWhere("max_price = l.price");
                }
                if(places.includes('middle')) {
                    qb.orWhere(new Brackets(qb2=>{
                        qb2.andWhere("l.price < max_price").andWhere("l.price > min_price");
                        return qb2;
                    }));
                }
                return qb;
            }));  

            this.joinQuery(sq.getBuilder(), 'place_in_market', 'place_in_market.product_id = "Product".id');

            this.queryBuilder.andWhere("place_in_market.place_filter = true");                  
        }
        return this;
    }
}