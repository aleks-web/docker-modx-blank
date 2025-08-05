import { Entity, Column, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import 'reflect-metadata';

import { BaseEntity } from '$entities/BaseEntity';
import { Product } from "$entities/Product";

import { Permission } from '$entities/Permission';

@Entity('access-rule')
export class AcccesRule extends BaseEntity {
    @Column({ type: 'varchar', nullable: false })
    path!: string;

    @ManyToMany(() => Permission, {eager: true})
    @JoinTable()
	permissions!: Permission[];
}