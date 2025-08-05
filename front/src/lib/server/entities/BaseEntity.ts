import { BaseEntity as ORMBaseEntity, PrimaryGeneratedColumn} from 'typeorm';
import { Expose, instanceToPlain, Transform } from 'class-transformer';
import 'reflect-metadata';
import type { IOption, TLazyLoadResult, TLoadResult } from '$lib/types/IInputProps';

export class BaseEntity extends ORMBaseEntity {
    @PrimaryGeneratedColumn({type: 'bigint'})
    @Expose()
    id!: string;

    toPlain() {
        return instanceToPlain(this, {enableImplicitConversion:true});
    }

    public static async findOptions(filter: string, value?: string[] | null, ctx?: App.Locals): TLazyLoadResult {
        return {options: [], selected: []};
    }
}