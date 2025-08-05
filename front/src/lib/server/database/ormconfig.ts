import { DataSource } from 'typeorm';
import { User as UserEntity } from "$entities/User";
import { Session as SessionEntity } from "$entities/Session";
import { Product as ProductEntity } from "$entities/Product";
import { Role as RoleEntity } from "$entities/Role";
import { Permission as PermissionEntity } from "$entities/Permission";
import { City as CityEntity } from "$entities/City";
import { Category as CategoryEntity } from "$entities/Category";
import { Task as TaskEntity } from "$entities/Task";
import { Link as LinkEntity } from "$entities/Link";
import { Competitor as CompetitorEntity } from "$entities/Competitor";
import { Brand as BrandEntity } from "$entities/Brand";
import { Setting as SettingEntity } from "$entities/Setting";
import {CitySite} from "$entities/CitySite";
import {Site} from "$entities/Site";
import { ProductLinkSubscriber } from "$lib/server/subscribers/productLinkSubscribe";
import { ProductLink } from '$entities/ProductLink';
import { AcccesRule } from '$entities/AcccesRule';

const AppDataSource = new DataSource({
	type: 'postgres',
	host: 'localhost',
	port: 5432,
	username: 'root',
	password: 'mysecretpassword',
	database: 'local',
	synchronize: false,
	logging: false,
	cache: {
		type: "redis",
		options: {
			socket: {
				host: "localhost",
				port: 6379
			}
		}
	},
	entities: [
		UserEntity,
		SessionEntity,
		ProductEntity,
		RoleEntity,
		PermissionEntity,
		CityEntity,
		CategoryEntity,
		TaskEntity,
		LinkEntity,
		CompetitorEntity,
		BrandEntity,
		SettingEntity,
		Site,
		CitySite,
		ProductEntity,
		ProductLink,
		AcccesRule,
	],
	migrations: [],
	subscribers: [
		ProductLinkSubscriber
	],
});

export default AppDataSource;