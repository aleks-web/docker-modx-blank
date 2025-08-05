import {
    Entity,
    PrimaryGeneratedColumn,
    JoinColumn,
    ManyToOne,
    Column,
    ManyToMany,
    JoinTable,
    In,
    SelectQueryBuilder,
    Index
} from 'typeorm';
import { Exclude, Expose, instanceToPlain, Transform } from 'class-transformer';
import 'reflect-metadata';

import { User } from "$entities/User";
import { Category } from "$entities/Category";
import { Brand } from "$entities/Brand";
import { Link } from "$entities/Link";
import { BaseEntity } from "$entities/BaseEntity";
import type { TLazyLoadResult, IOption } from '$lib/types/IInputProps';

@Entity('products', {
    orderBy: {
        id: "ASC"
    }
})
export class Product extends BaseEntity {
    @Column({ type: 'varchar', nullable: false })
    @Expose()
    name!: string;

    @Column({ type: 'varchar', nullable: true })
    @Expose()
    article!: string;

    @Column({ name: 'user_id', type: 'bigint', nullable: false })
    @Index()
    user_id!: number;

    @ManyToOne(() => User, user => user.products, { onDelete: 'CASCADE', nullable: false })
    @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
    user!: User;

    @Column({ name: 'category_id', type: 'bigint', nullable: true })
    category_id!: number|null;

    @ManyToOne(() => Category, category => category.products, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'category_id', referencedColumnName: 'id' })
    category!: Category;


    @Column({ name: 'brand_id', type: 'bigint', nullable: true })
    @Index()
    brand_id!: number|null;

    @ManyToOne(() => Brand, brand => brand.products, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'brand_id', referencedColumnName: 'id' })
    brand!: Brand;

    @ManyToMany(() => Link, l=>l.products)
    @JoinTable({
        name: "product_links",
        joinColumn: {
            name: "product_id",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "link_id",
            referencedColumnName: "id"
        }
    })
    @Exclude()
    links!: Link[];

    @Column({ name: 'active', type: 'boolean', nullable: false, default: true })
    @Expose()
    active!: boolean;

    public static async findOptions(filter: string, value?: string[] | null, ctx?: App.Locals): TLazyLoadResult {
        let repo = Product.getRepository();
        let q = repo.createQueryBuilder()
                .select('id, name')
                .addOrderBy('name', 'ASC')
                .limit(10);

        if(ctx && ctx.user && ctx.user.id) {
            q.andWhere('user_id = ' + ctx.user.id );
        } else {
            return {options: [], selected: []};
        }
            
        if(filter != '') {q.andWhere("LOWER(name) like '%"+filter+"%'")}
        let options = (await q.getRawMany()).map((c):IOption=>({name: c.name, value: ""+c.id}));
        let selected: IOption[] = [];
        if(Array.isArray(value) && value.length) {
            selected = (await repo.find({
                where: {id: In(value.map(v=>Number(v)))},
            })).map((c):IOption=>({name: c.name, value: ""+c.id}));
        }
        return {options, selected};
    }
}