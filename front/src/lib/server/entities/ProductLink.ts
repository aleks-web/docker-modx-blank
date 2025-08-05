import {
    BaseEntity,
    Entity,
    JoinColumn,
    ManyToMany,
    PrimaryColumn
} from 'typeorm';
import 'reflect-metadata';

// import { BaseEntity } from '$entities/BaseEntity';
import { Link } from '$entities/Link';
import { Product } from '$entities/Product';

@Entity('product_links')
export class ProductLink extends BaseEntity {
    @PrimaryColumn({ type: 'bigint', nullable: false, primary: true })
    link_id!: number;

    @ManyToMany(() => Link, l=>l.id)
    @JoinColumn({ name: 'link_id' })
    link!: Link;

    @PrimaryColumn({ type: 'bigint', unique: false, primary: true })
    product_id!: number;

    @ManyToMany(() => Product)
    @JoinColumn({ name: 'product_id' })
    product!: Product;
}