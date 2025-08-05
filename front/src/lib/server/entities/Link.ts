import {
    Column,
    Entity,
    Index,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne, PrimaryGeneratedColumn,
} from 'typeorm';
import { Expose } from 'class-transformer';
import 'reflect-metadata';

import { BaseEntity } from "$entities/BaseEntity";
import { City } from "$entities/City";
import { Product } from '$entities/Product';
import { Site } from '$entities/Site';
import {ProductLink} from "$entities/ProductLink";


@Entity('links')
/**
 * @see LinkCreateTableMigration1741695532583 for scheme details
 */
export class Link extends BaseEntity {
    // ссылка на товар 
    @Column({ name: 'href', type: 'text', nullable: false })
    @Expose()
    href!: string;

    // Значение цены полученное с сайта
    @Column({ name: 'price', type: 'float', nullable: true })
    @Expose()
    price!: string|null;

    // Значение цены без скидки полученное с сайта
    @Column({ name: 'old_price', type: 'float', nullable: true })
    @Expose()
    oldPrice!: string|null;

    // Товар в наличии: информация с сайта 
    @Column({ name: 'availability', type: 'boolean', nullable: true })
    @Expose()
    availability!: boolean|null;


    @Column({ name: 'city_id', type: 'bigint', nullable: false })
    @Expose()
    @Index()
    city_id!: number;


    // Город к которому привязана ссылка
    @ManyToOne(() => City, city => city.links, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'city_id', referencedColumnName: 'id' })
    city!: City;

    @Column({ name: 'site_id', type: 'bigint', nullable: false })
    @Index()
    site_id!: number

    // Сайт к которому привязана ссылка
    @ManyToOne(() => Site, site=> site.links)
    @JoinColumn({ name: 'site_id', referencedColumnName: 'id' })
    @Expose()
    site!: Site

    // Товары к которм привязана ссылка
    @ManyToMany(() => Product, (p)=>p.links)
    @JoinTable({
        name: "product_links",
        joinColumn: {
            name: "link_id",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "product_id",
            referencedColumnName: "id"
        }
    })
    products!: Product[];
    
	bg: any;
}