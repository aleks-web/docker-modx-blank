import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Expose, instanceToPlain } from 'class-transformer';
import 'reflect-metadata';

import { BaseEntity } from '$entities/BaseEntity';

@Entity('tasks', {
    orderBy: {
        id: "ASC"
    }
})
export class Task extends BaseEntity {
    @Column({ name: 'name', type: 'text' })
    @Expose()
    name!: string;

    @Column({ name: 'body', type: 'text' })
    @Expose()
    body!: string;

    toPlain() {
        return instanceToPlain(this);
    }
}