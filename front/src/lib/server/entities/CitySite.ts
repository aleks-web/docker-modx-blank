import {Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne, OneToMany, ManyToOne, BaseEntity, PrimaryColumn, ManyToMany} from 'typeorm';
import { Expose, Transform } from 'class-transformer';
import 'reflect-metadata';

// import { BaseEntity } from '$entities/BaseEntity';
import {Site} from "$entities/Site";
import {City} from "$entities/City";


@Entity('cities_sites')
/**
 * @see CompetitorCreateTableMigration1743058800812
 */
export class CitySite extends BaseEntity {
    @PrimaryColumn({name: 'site_id', type: 'bigint', primaryKeyConstraintName: "id"})
    site_id!: number

    @ManyToMany(()=>Site, s=>s.siteCities)
    @JoinColumn({ name: 'site_id', referencedColumnName: 'id' })
    site!: number

    @PrimaryColumn({name: 'city_id', type: 'bigint', primaryKeyConstraintName: "id"})
    city_id!: number

    @ManyToMany(()=>City, c=>c.citySites)
    @JoinColumn({ name: 'city_id', referencedColumnName: 'id' })
    city!: number

    @Column({name: 'href', type: 'text'})
    href!: string
}