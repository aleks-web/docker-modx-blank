import { Entity, Column, ManyToOne, JoinColumn, In, SelectQueryBuilder } from 'typeorm';
import { Expose } from 'class-transformer';
import 'reflect-metadata';

import { User } from "$entities/User";
import { BaseEntity } from '$entities/BaseEntity';
import { Site } from '$entities/Site';
import type { TLazyLoadResult, IOption } from '$lib/types/IInputProps';

@Entity('competitors', {
    orderBy: {
        id: "ASC"
    }
})
/**
 * @see CompetitorCreateTableMigration1743058800812
 */
export class Competitor extends BaseEntity {
    @Column({ type: 'varchar', nullable: false })
    @Expose()
    name!: string;

    @Column({ type: 'bigint', nullable: false })
    @Expose()
    user_id!: number;

    @ManyToOne(() => User, user => user.competitors, { onDelete: 'CASCADE', nullable: false })
    @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
    user!: User;

    @Column({ type: 'bigint', nullable: false })
    @Expose()
    site_id!: number;

    @ManyToOne(() => Site, s => s.competitors, { onDelete: 'CASCADE', nullable: false })
    @JoinColumn({ name: 'site_id', referencedColumnName: 'id' })
    site!: Site;

    public static async findOptions(filter: string, value?: string[] | null, ctx?: App.Locals): TLazyLoadResult {
        // return {options: [], selected: []};
        let repo = Competitor.getRepository();
        let q = repo.createQueryBuilder()
                .select('id, name')
                .addOrderBy('name', 'ASC')
                .limit(10);
        if(ctx && ctx.user && ctx.user.id) {
            q.andWhere('user_id = ' + ctx.user.id );
        } else {
            return {options: [], selected: []};
        }
            
        if(filter != '') {q.andWhere("name ilike '%"+filter+"%'")}
        let options = (await q.getRawMany()).map((c):IOption=>({name: c.name, value: ""+c.id}));
        let selected: IOption[] = [];
        if(Array.isArray(value) && value.length) {
            selected = (await repo.find({
                where: {id: In(value.map(v=>Number(v)))},
            })).map((c):IOption=>({name: c.name, value: ""+c.id}));
        }
        return {options, selected};
    }


    
    public static pinBuilder(builder: SelectQueryBuilder<Competitor>, values: string[]) {
        for (let k in values) {
            let pinColName = "_pin" + k;
            builder
                .addSelect('CASE WHEN "Competitor".id = ' + values[k] + ' THEN 0 ELSE 1 END AS ' + pinColName)
                .addOrderBy(pinColName, 'ASC');
        }
    }
    public static competitorsBuilder(builder: SelectQueryBuilder<Competitor>, values: string[]) {
        if(values.length)
            builder.where('id in (' + values.join(',') + ')');
    }
}