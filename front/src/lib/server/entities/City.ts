import { Entity, PrimaryGeneratedColumn, Column, OneToMany, type FindOptionsWhere, In, Like } from 'typeorm';
import { Expose } from 'class-transformer';
import 'reflect-metadata';

import { BaseEntity } from '$entities/BaseEntity';
import { Link } from '$entities/Link';
import { CitySite } from "$entities/CitySite";
import type { IOption, TLazyLoadResult, TLoadResult } from '$lib/types/IInputProps';

@Entity('cities')
export class City extends BaseEntity {
    @Column({ name: 'address', type: 'text' })
    address!: string;    
    
    @Column({ name: 'postal_code', type: 'bigint', nullable: true })
    postal_code!: number|null;    
    
    @Column({ name: 'federal_district', type: 'text' })
    federal_district!: string;    

    @Column({ name: 'region_type', type: 'text' })
    region_type!: string;    

    @Column({ name: 'area', type: 'text', nullable: true })
    area!: string|null;    

    @Column({ name: 'area_type', type: 'text', nullable: true })
    area_type!: string|null;

    @Column({ name: 'settlement_type', type: 'text', nullable: true })
    settlement_type!: string|null;

    @Column({ name: 'settlement', type: 'text', nullable: true })
    settlement!: string|null;

    @Column({ name: 'kladr_id', type: 'bigint' })
    kladr_id!: number;

    @Column({ name: 'fias_id', type: 'text' })
    fias_id!: string;  

    @Column({ name: 'fias_level', type: 'bigint' })
    fias_level!: number;  

    @Column({ name: 'capital_marker', type: 'bigint' })
    capital_marker!: number;  

    @Column({ name: 'okato', type: 'bigint' })
    okato!: number;  
    
    @Column({ name: 'oktmo', type: 'bigint' })
    oktmo!: number; 
    
    @Column({ name: 'tax_office', type: 'bigint' })
    tax_office!: number;  
    
    @Column({ name: 'timezone', type: 'text' })
    timezone!: string;     

    @Column({ name: 'geo_lat', type: 'double precision'})
    geo_lat!: number;     
    
    @Column({ name: 'geo_lon', type: 'double precision'})
    geo_lon!: number;  

    @Column({ name: 'population', type: 'bigint' })
    population!: number;  

    @Column({ name: 'foundation_year', type: 'bigint' })
    foundation_year!: number;  

    @Column({ name: 'country', type: 'text' })
    country!: string;

    @Column({ name: 'region', type: 'text' })
    region!: string;

    @Column({ name: 'city_type', type: 'text', nullable: true })
    cityType!: string|null;

    @Column({ name: 'city', type: 'text', nullable: true })
    city!: string|null;

    @OneToMany(() => Link, link => link.city, { lazy: true })
    links!: Promise<Link[]>;

    @OneToMany(() => CitySite, cs => cs.city, { lazy: true })
    citySites!: Promise<CitySite[]>;

    public static async findOptions(filter: string, value?: string[] | null, ctx?: App.Locals): TLazyLoadResult {
        // filter = filter.toLowerCase();
        let q = City.getRepository().createQueryBuilder()
            .select('id, address')
            .addOrderBy('population', 'DESC')
            .limit(10);
        if (filter != '') { q.where("address ilike '%" + filter + "%'") }
        let options = (await q.getRawMany()).map((c): IOption => ({ name: c.address, value: "" + c.id }));
        let selected: IOption[] = [];
        if (Array.isArray(value) && value.length) {
            selected = (await City.getRepository().find({
                where: { id: In(value.map(v => Number(v))) },
            })).map((c): IOption => ({ name: c.address, value: "" + c.id }));
        }
        return { options, selected };
    }
}