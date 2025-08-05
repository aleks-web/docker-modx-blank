import { Entity, Column, ManyToOne, JoinColumn, OneToMany, In } from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import 'reflect-metadata';

import { BaseEntity } from '$entities/BaseEntity';
import { User } from "$entities/User";
import { Product } from "$entities/Product";
import type { IOption, TLazyLoadResult } from '$lib/types/IInputProps';
import { Site } from './Site';

@Entity('brands', {
	orderBy: {
		id: "ASC"
	}
})
export class Brand extends BaseEntity {
	@Column({ type: 'varchar', nullable: false })
	@Expose()
	name!: string;

	@ManyToOne(() => User, user => user.brands, { onDelete: 'CASCADE', nullable: false })
	@JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
	user!: User;

	@OneToMany(() => Product, product => product.brand, { lazy: true })
	@Exclude()
	products!: Promise<Product[]>;

	public static async findOptions(filter: string, value?: string[] | null, ctx?: App.Locals): TLazyLoadResult {
		let repo = Brand.getRepository();
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