import { User } from "$entities/User";
import { Permission } from "$entities/Permission";
import { Role } from "$entities/Role";

import { EPermissions } from "$enums/EPermissions";

import AppDataSource from "$lib/server/database/ormconfig";
import { BaseEntity, type DataSource, type EntityTarget, type ObjectLiteral } from "typeorm";
import "lodash";
import 'reflect-metadata';
import fs from "fs";
import _ from "lodash";
import { Product } from "$entities/Product";
import { Site } from "$entities/Site";
import { Seeder } from '@jorgebodega/typeorm-seeding';
import { faker, th } from "@faker-js/faker";
import { CitySite } from "$entities/CitySite";
import { Competitor } from "$entities/Competitor";
import { Category } from "$entities/Category";
import { Link } from "$entities/Link";
import { ProductLink } from "$entities/ProductLink";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
}


type Moc<T> = () => T
interface Entity extends BaseEntity {};
class UniSeeder<T> extends Seeder {
    protected moc: null | Moc<T> = null;
    protected fakeCount = 1;
    protected chunkSize: number = 10000;
    protected keepSaved: boolean = true;
    protected saved: T[] = [];
    protected stack: T[] = [];
    protected batchFunc: ((entities: T[])=>string) | null = null;
    protected entity: EntityTarget<ObjectLiteral> | null= null;
    public useEntity(entity: EntityTarget<ObjectLiteral>) {
        this.entity = entity;
    }
    public useBatchFunc(f:(entities: T[])=>string) {
        this.batchFunc = f;
    }
    public setMoc(moc: null | Moc<T>) {
        this.moc = moc;
        return this;
    }
    public getMoc() {
        return this.moc;
    }
    public getChunkSize() {
        return this.chunkSize;
    }
    public setChunkSize(size: number) {
        if(size > 0) {
            this.chunkSize = size;
        }
    }
    public setFakeCount(cnt: number) {
        this.fakeCount = cnt;
        return this
    }
    public getFakeCount() {
        return this;
    }
    public getSaved() {
        return this.saved;
    }
    public isKeepSaved() {
        return this.keepSaved;
    }
    public setKeepSaved(v: boolean) {
        this.keepSaved = v;
        return this;
    }
    public flushSaved() {
        this.saved = [];
    }
    public fill(entity: T, values: T&{}) {
        let k: keyof T;
        for(k of Object.keys(values) as [keyof T]) {
            entity[k] = values[k];
        }
        return entity;
    }

    public enque() {
        if(this.moc != null && this.fakeCount>0) {
            this.stack.push(...faker.helpers.multiple(this.moc, {count: this.fakeCount}))
        }
        return this;
    }
    
    async run(dataSource: DataSource) {
        console.time("run time");
        console.log("fake start with count: " + this.stack.length);
        if(this.moc != null && this.fakeCount>0) {
            console.log("fake example:");
            console.log(this.moc());
            const entity: T[] = this.stack.splice(0, this.stack.length);
            if(this.isKeepSaved()) {
                let chunkResult = await dataSource.createEntityManager().save<T>(entity, {chunk: this.chunkSize});
                this.saved.push(...chunkResult); 
            } else {
                if(this.entity) {
                    if(this.batchFunc) {
                        await dataSource.query(this.batchFunc(entity));
                    } else {
                        for (let i = 0; i < entity.length; i += this.chunkSize) {
                            const chunk = entity.slice(i, i + this.chunkSize);
                            await dataSource
                                .createQueryBuilder()
                                .insert()
                                .into(this.entity)
                                .values(chunk)
                                .execute();
                        }
                    }
                } else {
                    await dataSource.createEntityManager().save<T>(entity, {chunk: this.chunkSize});
                }
            }       
        }
        console.log("fake ended");
        console.timeEnd("run time");
        console.log("**********************************************************************");
    }

    async runWhenOverflow(dataSource: DataSource, minStackSize: number) {
        if(this.stack.length >= minStackSize) {
            await this.run(dataSource);
        }
    }
}

await (async (dataSource: DataSource)=>{ // Cities
    const sqlFilePath = path.join(__dirname, './sql/CitiesCreateTableMigration.sql');
    const sql = fs.readFileSync(sqlFilePath, { encoding: 'utf8' });
    await dataSource.query(sql);
})(AppDataSource)
await createUsers(AppDataSource);
await createRoles(AppDataSource);
await createPermissions(AppDataSource);
await createRolesPermissions(AppDataSource);
await createUsersRoles(AppDataSource);
await createTestSitesAndCompetitors(AppDataSource);


async function createUsers(dataSource: DataSource) {
    try {
        await dataSource.getRepository(User).save([
            {
                name: 'Алексей',
                email: 'dok.go@yandex.ru',
                passwordHash: '$argon2id$v=19$m=19456,t=2,p=1$sIdikyogdUafDRAOXuJRhQ$Ufptz1Zp5kV4JSNelraW6LP7FGfx5Mcy5kI5gXxQW60'
            },
            {
                name: 'Тест',
                email: 'dok.go@yandex.rus',
                passwordHash: '$argon2id$v=19$m=19456,t=2,p=1$sIdikyogdUafDRAOXuJRhQ$Ufptz1Zp5kV4JSNelraW6LP7FGfx5Mcy5kI5gXxQW60'
            }
        ]);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (er) {
        // console.log(er);
    }
}

async function createRoles(dataSource: DataSource) {
    try {
        await dataSource.getRepository(Role).save([
            {
                name: 'Клиент'
            },
            {
                name: 'Администратор ур1'
            },
            {
                name: 'Администратор ур2'
            }
        ]);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (er) {
        // console.log(er);
    }
}

async function createPermissions(dataSource: DataSource) {
    const listPerm = [];
    for (const perm of Object.values(EPermissions)) {
        listPerm.push({ code: perm });
    }

    try {
        await dataSource.getRepository(Permission).save(listPerm);
    } catch (er) {
        console.log(er);
    }
}

async function createRolesPermissions(dataSource: DataSource) {
    try {
        await dataSource.query(`
            INSERT INTO "roles_permissions" (role_id, permission_code)
            VALUES (1, '${EPermissions.ProductAll}'),
                   (1, '${EPermissions.ProductEdit}'),
                   (1, '${EPermissions.ProductCreate}'),
                   (1, '${EPermissions.ProductDelete}'),
                   (1, '${EPermissions.ProductView}'),

                   (1, '${EPermissions.CategoryAll}'),
                   (1, '${EPermissions.CategoryEdit}'),
                   (1, '${EPermissions.CategoryCreate}'),
                   (1, '${EPermissions.CategoryDelete}'),
                   (1, '${EPermissions.CategoryView}'),

                   (1, '${EPermissions.CompetitorAll}'),
                   (1, '${EPermissions.CompetitorEdit}'),
                   (1, '${EPermissions.CompetitorCreate}'),
                   (1, '${EPermissions.CompetitorDelete}'),
                   (1, '${EPermissions.CompetitorView}'),

                   (1, '${EPermissions.BrandAll}'),
                   (1, '${EPermissions.BrandEdit}'),
                   (1, '${EPermissions.BrandCreate}'),
                   (1, '${EPermissions.BrandDelete}'),
                   (1, '${EPermissions.BrandView}'),

                   (2, '${EPermissions.UserSwitch}'),

                   (2, '${EPermissions.TaskAll}'),
                   (2, '${EPermissions.TaskEdit}'),
                   (2, '${EPermissions.TaskCreate}'),
                   (2, '${EPermissions.TaskDelete}'),
                   (2, '${EPermissions.TaskView}'),

                   (2, '${EPermissions.SitesControlAll}'),
                   (2, '${EPermissions.SitesControlEdit}'),
                   (2, '${EPermissions.SitesControlCreate}'),
                   (2, '${EPermissions.SitesControlDelete}'),
                   (2, '${EPermissions.SitesControlView}')
        `);
    } catch (er) {
        console.log(er);
    }
}

async function createUsersRoles(dataSource: DataSource) {
    try {
        await dataSource.query(`
            INSERT INTO "users_roles" (user_id, role_id)
            VALUES (1, 1),
                   (2, 2)
        `);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (er) {
        // console.log(er);
    }
}


/**
 * @see CompetitorCreateTableMigration1743058800812
 * @see Site
 * @see CitySite
 * @see Competitor
 */
async function createTestSitesAndCompetitors(dataSource: DataSource) {
    try {
        let fakeSitesCount = 50;
        let fakeCitiesCount = 1117;
        let fakeCategoriesCount = 5;
        let fakeProductsCount = 100;
        let highChance = ()=>(faker.datatype.boolean() || faker.datatype.boolean() || faker.datatype.boolean());
        let smallChance = ()=>(!highChance());
        let halfChance = ()=>(faker.datatype.boolean());

        let siteFaker = new UniSeeder<Site>();
        siteFaker.setMoc(()=>(siteFaker.fill(new Site(), {
            host: faker.internet.protocol() + '://' + faker.internet.domainWord() + '/',
            priceSelector: "#price",
            oldPriceSelector: "#old-price",
            availabilitySelector: "#is-available",
            useSelenium: halfChance(),
        } as Site)));
        siteFaker.setFakeCount(fakeSitesCount);
        siteFaker.enque();
        await siteFaker.run(dataSource);

        let citySiteFaker = new UniSeeder<CitySite>();
        citySiteFaker.useEntity(CitySite);
        citySiteFaker.setKeepSaved(false);
        let competitorFaker = new UniSeeder<Competitor>();
        for(let site of siteFaker.getSaved()) {
            for(let i = 1; i<=fakeCitiesCount; i++) {
                citySiteFaker.setMoc(()=>(citySiteFaker.fill(new CitySite(), {
                    site_id: site.id,
                    city_id: i,
                    href: faker.internet.protocol() + "://" + faker.location.city().toLocaleLowerCase().replaceAll(" ", "-") + "." + site.host + "." + faker.internet.domainSuffix() + "/"
                 } as CitySite)));
                 citySiteFaker.enque();
            }
            

            competitorFaker.setMoc(()=>(competitorFaker.fill(new Competitor(), {
                name: site.host,
                user_id: 1,
                site_id: site.id,
             } as Competitor)));
             competitorFaker.enque();
        }
        await citySiteFaker.run(dataSource);
        await competitorFaker.run(dataSource);

        
        let categoryFaker = new UniSeeder<Category>();
        categoryFaker.setMoc(()=>(categoryFaker.fill(new Category(), {
            name: faker.commerce.department(),
            user_id: 1
        } as Category)));
        categoryFaker.setFakeCount(fakeCategoriesCount);
        categoryFaker.setKeepSaved(false);
        categoryFaker.useEntity(Category);
        categoryFaker.enque();
        await categoryFaker.run(dataSource);

        let productFaker = new UniSeeder<Product>();
        productFaker.setMoc(()=>(productFaker.fill(new Product(), {
            user_id: 1,
            name: faker.commerce.productName(),
            category_id: halfChance() ? faker.number.int({min:1, max: fakeCategoriesCount}) : null,
            article: halfChance() ? faker.string.numeric({length: {min:6, max:30}}) : null,
            active: halfChance(),
        } as Product)));
        productFaker.setFakeCount(fakeProductsCount);
        await productFaker.enque().run(dataSource);

        

        let linkFaker = new UniSeeder<Link>();
        linkFaker.setKeepSaved(false);
        linkFaker.useEntity(Link);
        linkFaker.useBatchFunc((entities: Link[])=>{
            return `INSERT INTO links (href, price, old_price, availability, city_id, site_id) VALUES ` + entities.map(l=>(`('${l.href}', ${l.price}, ${l.oldPrice}, ${l.availability}, ${l.city_id}, ${l.site_id})`)).join(",");
        })
        let productLinkFaker = new UniSeeder<ProductLink>();
        productLinkFaker.setKeepSaved(false);
        productLinkFaker.useEntity(ProductLink);
        let linkIdCounter = 0;


        // for(let s of siteFaker.getSaved()) {
        //     for(let p of productFaker.getSaved()) {
        //         if(true||smallChance()) { // пропустить некоторые товары некоторых конкурентов
        //             for(let city_id =1; city_id<fakeCitiesCount; city_id++) {
        //                 if(city_id != 1 && city_id != 996) {continue;}
        //                 linkFaker.setMoc(()=>{
        //                     let price = faker.number.float({min: 2, max: 10000000-1});
        //                     let oldPrice = faker.number.float({min: price+1, max:10000000})
        //                     return linkFaker.fill(new Link(), {
        //                         href: faker.internet.url(),
        //                         price: ""+price,
        //                         oldPrice: ""+oldPrice,
        //                         availability: halfChance(),
        //                         city_id: city_id,
        //                         site_id: s.id,
        //                     } as Link);
        //                 });
        //                 linkFaker.enque();
        //                 linkIdCounter++;
        //
        //                 productLinkFaker.setMoc(()=>(productLinkFaker.fill(new ProductLink(), {
        //                     link_id: linkIdCounter,
        //                     product_id: p.id,
        //                 } as ProductLink)));
        //                 productLinkFaker.enque();
        //                 await linkFaker.runWhenOverflow(dataSource, 100000);
        //                 await productLinkFaker.runWhenOverflow(dataSource, 100000);
        //             }
        //         }
        //     }
        // }

        for(let s of siteFaker.getSaved()) {
            for(let city_id =1; city_id<=fakeCitiesCount; city_id++) {
                // if(city_id != 1 && city_id != 996) {continue;}
                for(let p of productFaker.getSaved()) {
                    linkFaker.setMoc(()=>{
                        let price = faker.number.float({min: 2, max: 10000000-1});
                        let oldPrice = faker.number.float({min: price+1, max:10000000})
                        return linkFaker.fill(new Link(), {
                            href: faker.internet.url(),
                            price: "" + price,
                            oldPrice: "" + oldPrice,
                            availability: halfChance(),
                            city_id: city_id,
                            site_id: s.id,
                        } as unknown as Link);
                    });
                    linkFaker.enque();
                    await linkFaker.runWhenOverflow(dataSource, 100000);
                }
               
            }
        }
        await linkFaker.run(dataSource);

        for(let s of siteFaker.getSaved()) {
            for(let city_id =1; city_id<=fakeCitiesCount; city_id++) {
                // if(city_id != 1 && city_id != 996) {continue;}
                for(let p of productFaker.getSaved()) {
                    linkIdCounter++;
                    productLinkFaker.setMoc(()=>(productLinkFaker.fill(new ProductLink(), {
                        link_id: linkIdCounter,
                        product_id: p.id,
                    } as unknown as ProductLink)));
                    productLinkFaker.enque();
                    await productLinkFaker.runWhenOverflow(dataSource, 100000);
                }
            }
        }
        await productLinkFaker.run(dataSource);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (er) {
        console.log(er);
    }
}