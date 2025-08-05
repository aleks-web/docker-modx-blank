import { Entity, PrimaryColumn, JoinColumn, ManyToOne, Column } from 'typeorm';

import { User } from '$entities/User';
import { BaseEntity } from '$entities/BaseEntity';

@Entity('sessions')
export class Session extends BaseEntity {

    @Column({ name: "uid", type: 'varchar', nullable: false, unique: true })
    uid!: string

    @ManyToOne(() => User, user => user.sessions, { onDelete: 'CASCADE', nullable: false })
    @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
    user!: User;

    @Column({ name: "expires_at", type: 'timestamp', nullable: false })
    expiresAt!: Date;
}