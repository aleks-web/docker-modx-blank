import 'reflect-metadata';
import { Entity, Column, ManyToMany, OneToMany, JoinTable } from 'typeorm';
import { Exclude, Expose } from 'class-transformer';

import { Session } from '$entities/Session';
import { Product } from '$entities/Product';
import { Role } from '$entities/Role';
import { Competitor } from '$entities/Competitor';
import { BaseEntity } from '$entities/BaseEntity';
import { Setting } from '$entities/Setting';
import { Brand } from '$entities/Brand';
import { Category } from '$entities/Category';

@Entity({ name: 'users' })
export class User extends BaseEntity {
	@Column({ type: 'varchar', nullable: false })
	@Expose()
	name!: string;

	@Column({ type: 'varchar', nullable: false, unique: true })
	@Expose()
	email!: string;

	@Column({ name: 'password_hash', type: 'text', nullable: false })
	@Exclude()
	passwordHash!: string;

	@Column({ name: 'email_verification', type: 'timestamp', nullable: true })
	@Exclude()
	emailVerification!: Date;

	@ManyToMany(() => Role, (role: Role) => role.users, { cascade: true })
	@JoinTable({
		name: 'users_roles',
		joinColumn: {
			name: 'user_id',
			referencedColumnName: 'id',
		},
		inverseJoinColumn: {
			name: 'role_id',
			referencedColumnName: 'id',
		},
	})
	@Expose()
	roles!: Role[];

	@OneToMany(() => Competitor, competitor => competitor.user, { lazy: true })
	@Exclude()
	competitors!: Promise<Competitor[]>;

	@OneToMany(() => Session, session => session.user, { lazy: true })
	@Exclude()
	sessions!: Promise<Session[]>;

	@OneToMany(() => Product, product => product.user, { lazy: true })
	@Exclude()
	products!: Promise<Product[]>;

	@OneToMany(()=>Setting, setting=>setting.user)
	@Expose()
	settings!: Setting[];

	@OneToMany(() => Brand, brand => brand.user, { lazy: true })
	@Exclude()
	brands!: Promise<Brand[]>;

	@OneToMany(() => Category, category => category.user, { lazy: true })
	@Exclude()
	categories!: Promise<Category[]>;

	// @Exclude()
	// async hasPermission(permissionCode: string | string[]): Promise<boolean> {
	// 	const roles = await this.roles;
	// 	if (!roles) {
	// 		return false;
	// 	}
	// 	const permissions: Permission[] = [];
	// 	for (const role of roles) {
	// 		const rolePermissions = await role.permissions;
	// 		for (const permission of rolePermissions) {
	// 			permissions.push(permission);
	// 		}
	// 	}
	// 	if (!permissions.length) {
	// 		return false;
	// 	}
	// 	for (const premission of permissions) {
	// 		if (permissionCode instanceof Array) {
	// 			if (permissionCode.includes(premission.code)) {
	// 				return true;
	// 			}
	// 		} else {
	// 			if (premission.code === permissionCode) {
	// 				return true;
	// 			}
	// 		}
	// 	}
	// 	return false;
	// }
}