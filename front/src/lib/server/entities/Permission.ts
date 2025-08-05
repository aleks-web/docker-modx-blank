import { Entity, PrimaryColumn, ManyToMany, JoinTable, Column, Unique } from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import 'reflect-metadata';

import { Role } from '$entities/Role';
import { BaseEntity } from '$entities/BaseEntity';

@Entity('permissions')
export class Permission extends BaseEntity {
    @Column({ type: 'varchar', nullable: false, unique: true })
    @Expose()
    code!: string;

    @ManyToMany(() => Role, (role: Role) => role.permissions, { lazy: true })
    @JoinTable({
        name: 'roles_permissions',
        joinColumn: {
            name: 'permission_code',
            referencedColumnName: 'code',
        },
        inverseJoinColumn: {
            name: 'role_id',
            referencedColumnName: 'id',
        },
    })
    @Exclude()
    roles!: Promise<Role[]>;
}