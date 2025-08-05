import {Column, Entity, JoinColumn, ManyToMany, OneToMany} from 'typeorm';
import {Expose} from 'class-transformer';
import 'reflect-metadata';

import {BaseEntity} from '$entities/BaseEntity';
import {CitySite} from "$entities/CitySite";
import {Competitor} from '$entities/Competitor';
import {Link} from "$entities/Link";


/**
 * @see CompetitorCreateTableMigration1743058800812
 */
@Entity('sites', {
    orderBy: {id: "ASC"}
})
export class Site extends BaseEntity {
    @Column({type: 'varchar', nullable: false})
    @Expose()
    host!: string;

    @Column({name: 'price_selector', type: 'varchar', nullable: true})
    @Expose()
    priceSelector!: string;

    @Column({name: 'old_price_selector', type: 'varchar', nullable: true})
    @Expose()
    oldPriceSelector!: string;

    @Column({name: 'availability_selector', type: 'varchar', nullable: true})
    @Expose()
    availabilitySelector!: string;

    @Column({name: 'use_selenium', type: 'boolean', nullable: false, default: false})
    @Expose()
    useSelenium!: boolean;

    @ManyToMany(() => CitySite, cs => cs.site)
    @JoinColumn({name: 'id', referencedColumnName: 'city_id'})
    siteCities!: CitySite[]

    @OneToMany(() => Competitor, c => c.site)
    competitors!: Competitor[]

    @OneToMany(() => Link, link => link.site)
    links!: Link[]


    static async findByHostOrCreate(host: string) {
        let site = await Site.findOneBy({host});
        if (site == null) {
            site = new Site();
            site.host = host;
            await site.save();
        }
        return site;
    }
}