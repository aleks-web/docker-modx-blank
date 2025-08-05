import {ProductFilter} from "$entities/filters/ProductFilter";
import {LinkFilter} from "$entities/filters/LinkFilter";
import type {RequestEvent} from "@sveltejs/kit";

export type TFilter = {
    [key:string]: undefined|null|boolean|FormDataEntryValue|string|number|Array<number|string|FormDataEntryValue>,
    competitors: string[],
    categories: string[],
    brands: string[],
    items: string[],
    regions: string[],
    active: null|boolean,
    search: string
    size: number
    page: number
}

export async function filter (event: RequestEvent, prefilter?:Partial<TFilter>){
    const searchParams = event.url.searchParams;
    
    const filter: TFilter = {
        competitors: searchParams.getAll('categories[]').length ? searchParams.getAll('categories[]') : [],
        categories: searchParams.getAll('categories[]').length ? searchParams.getAll('categories[]') : [],
        brands: searchParams.getAll('brands[]').length ? searchParams.getAll('brands[]') : [],
        items: searchParams.getAll('items[]').length ? searchParams.getAll('items[]') : [],
        regions: searchParams.getAll('regions[]').length ? searchParams.getAll('regions[]') : [],
        active: searchParams.get('active') !== null ? !!Number(searchParams.get('active')) : null,
        search: searchParams.get('search') ? String(searchParams.get('search')) : '',
        size: Number(searchParams.get('size')) ? Number(searchParams.get('size')) : 10,
        page: Number(searchParams.get('page')) ? Number(searchParams.get('page')) : 1, 
    }
    if(prefilter) {Object.assign(filter, prefilter)}

    try {
        let data: FormData = await event.request.formData();
        for(let k of data.keys()) {
            let fk: keyof TFilter = k.replaceAll(/\[.*\]/g, "") as keyof TFilter;
            filter[fk] = k.endsWith("[]") ? data.getAll(k) : data.get(k);
        }
    } catch(e) {}

    const productFilter = new ProductFilter()
        .select(['"Product".*'])
        .withUser(event.locals.user.id)
        .withId(filter.items)
        .withBrands(filter.brands)
        .withCategories(filter.categories)
        .withLikeName(filter.search)
        .withActivity(filter.active)
        .loadRelationBrand()
        .loadRelationCategory();

    if(filter.regions.length) {
        // ### опционально проверка на то что есть хотя бы одна ссылка
        productFilter.joinQuery(
            new LinkFilter()
                .distinct(true)
                .leftJoin('product_links', 'pl', '"Link".id = pl.link_id')
                .select(['pl.product_id', 'true as hasLinks'])
                .withCompetitors(filter.competitors)
                .withCities(filter.regions)
                .getBuilder(),

            'agr', "agr.pl_product_id = Product.id"
        )
            .with("agr.hasLinks", true)
        // ###
    }

    const [products, pagination] = await productFilter.paginate(Number(filter.size), Number(filter.page));

    for (const product of products) {
        const lF = new LinkFilter()
            .select(['"Link".*', "Competitor.name as competitor_name"])
            .withProducts([product.id])
            .withCompetitors(filter.competitors)
            .withCities(filter.regions)
            .loadRelationCity()
            .loadRelationCompetitor();

        lF.getBuilder().limit(5); 
        const links = await lF.getRawMany();
        product.links = links;
        product.links_pagination = {};
    }
    // console.log(products);

    return { filter, products, pagination };
}

export default filter;