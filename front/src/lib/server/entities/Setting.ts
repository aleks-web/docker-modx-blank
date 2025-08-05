import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Expose, instanceToPlain } from 'class-transformer';
import 'reflect-metadata';

import { User } from "$entities/User";
import { BaseEntity } from "$entities/BaseEntity";


@Entity('settings', {
	orderBy: {
		id: "ASC"
	}
})
export class Setting extends BaseEntity {
	@Column({ type: 'text', nullable: false })
	@Expose()
	setting!: string;

	@Column({ type: 'text', nullable: true })
	@Expose()
	value!: string|number;

	@Column({ type: 'bigint', nullable: false })
	@Expose()
	user_id!: number;

	@ManyToOne(() => User, user => user.settings, { onDelete: 'CASCADE', nullable: false })
	@JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
	user!: User;

	toPlain() {
		return instanceToPlain(this);
	}
}