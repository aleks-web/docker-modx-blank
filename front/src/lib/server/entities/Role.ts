import { Entity, PrimaryGeneratedColumn, JoinTable, Column, ManyToMany, OneToMany } from 'typeorm';
import { Exclude, Expose, instanceToPlain } from 'class-transformer';
import 'reflect-metadata';

import { Permission } from '$entities/Permission';
import { User } from '$entities/User';
import { BaseEntity } from '$entities/BaseEntity';


@Entity('roles')
export class Role extends BaseEntity {
    @Column({ type: 'varchar' })
    @Expose()
    name!: string;

    @ManyToMany(() => Permission, (permission: Permission) => permission.roles, { cascade: true })
    @JoinTable({
        name: 'roles_permissions',
        joinColumn: {
            name: 'role_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'permission_code',
            referencedColumnName: 'code',
        },
    })
    @Expose()
    permissions!: Permission[];

    @ManyToMany(() => User, (user: User) => user.roles, { lazy: true })
    @JoinTable({
		name: 'users_roles',
		joinColumn: {
			name: 'role_id',
			referencedColumnName: 'id',
		},
		inverseJoinColumn: {
			name: 'user_id',
			referencedColumnName: 'id',
		},
	})
    @Exclude()
    users!: Promise<User[]>;
}