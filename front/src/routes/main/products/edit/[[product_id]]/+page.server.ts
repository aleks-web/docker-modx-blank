import type {Actions, PageServerLoad} from './$types';
import {redirect} from "@sveltejs/kit";

/*
    Entities
*/
import {Product} from '$entities/Product';

/*
* Filteres
* */
import {ProductFilter} from "$entities/filters/ProductFilter";
import {LinkFilter} from "$entities/filters/LinkFilter";

export const load: PageServerLoad = async (event) => {
    return actions.filter(event);
};


export const actions: Actions = {
    filter: async (event) => {
        const searchParams = event.url.searchParams;
        const filter: any = {
            size: Number(searchParams.get('size')) ? Number(searchParams.get('size')) : 10,
            page: Number(searchParams.get('page')) ? Number(searchParams.get('page')) : 1,
            availability: searchParams.get('availability') !== null ? !!Number(searchParams.get('availability')) : null,
            regions: searchParams.getAll('regions[]').length ? searchParams.getAll('regions[]') : []
        }
        try {
            let data: FormData = await event.request.formData();
            for (let k of data.keys()) {
                filter[k.replaceAll(/\[.*\]/g, "")] = k.endsWith("[]") ? data.getAll(k) : data.get(k);
            }
        } catch (e) {
        }

        const productId = event.params.product_id && String(event.params.product_id);

        if (productId) {
            const product = await (new ProductFilter()).select(['"Product".*'])
                .withUser(event.locals.user.id)
                .withId([productId]).getRawOne() as Product;
            const linksFilter = new LinkFilter()
                .select(['"Link".*', "Competitor.name as competitor_name"])
                .withProduct(productId)
                .withCompetitor((await UserSettings.getCompetitor())?.id || "")
                .withCities(filter.regions)
                .withAvailability(filter.availability)
                .loadRelationCity()
                .loadRelationCompetitor();

            const [links, pagination] = await linksFilter.paginate(Number(filter.size), Number(filter.page));

            product.links = links;
            return {
                product,
                competitorId: (await UserSettings.getCompetitor())?.id,
                pagination,
                filter
            }
        }

        let p = new Product;
        p.links = [];
        p.active = true;
        return {
            product: p.toPlain() as Product,
            pagination: {
                total: 0,
                totalPages: 0,
                currentPage: 1,
                nextPage: null,
                prevPage: null,
                pageSize: 0
            }
        }
    },
    toggle_active: async (event) => {
        const productId = Number(event.params.product_id);

        if (!productId) {
            return { success: false }
        }

        const product = await Product.findOneBy({ id: productId });

        if (product) {
            product.active = !product.active;
            await product.save();
            return { success: true }
        }

        return { success: false }
    },


    product_update: async (event) => {
        const formData = await event.request.formData();
        const productName = String(formData.get('product_name'));
        const productArticle = String(formData.get('product_article'));
        const productCategory = Number(formData.get('category'));
        const productBrand = Number(formData.get('brand'));
        const productActive = !!Number(formData.get('active'));
        let product: null | undefined | Product;
        let needRedirect = false
        if (event.params.product_id) {
            product = await Product.findOneBy({id: Number(event.params.product_id)});
            console.log(event.params.product_id, product);
        }
        if (!product) {
            product = new Product();
            product.user_id = event.locals.user.id
            needRedirect = true;
        }

        product.name = productName;
        product.article = productArticle;
        product.active = productActive;

        if (productBrand) {
            product.brand_id = productBrand;
        }

        if (productCategory) {
            product.category_id = productCategory;
        }

        product = await product.save();

        if (needRedirect) {
            redirect(300, "/main/products/edit/" + product.id)
        }
    },
    product_delete: async (event) => {
        const product = await Product.findOneBy({id: Number(event.params.product_id)});

        await product?.remove();

        redirect(300, '/main/products');
    }
};