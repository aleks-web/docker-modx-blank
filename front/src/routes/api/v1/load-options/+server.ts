
import { BaseEntity } from '$entities/BaseEntity';
import AppDataSource from '$lib/server/database/ormconfig.js';
import { json } from '@sveltejs/kit';

export async function POST({request, locals}) {
    const post = await request.json();
    const entityConstructor = AppDataSource.getMetadata(post.entity).target as string | typeof BaseEntity;
    if(typeof entityConstructor == 'string') { return json({options: [], selected: []}); }
    return json(await entityConstructor.findOptions(post.filter, post.value?post.value:null, locals));
}