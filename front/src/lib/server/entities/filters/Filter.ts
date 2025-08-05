import type { BaseEntity as CustomBase } from "$entities/BaseEntity";
import type { TPagination } from "$lib/types/TPagination";
import { startSpan } from "@sentry/sveltekit";
import { BaseEntity, Repository, type SelectQueryBuilder } from "typeorm";


export abstract class Filter<T extends CustomBase|BaseEntity> {
    protected rootBuilder: SelectQueryBuilder<T>;
    protected queryBuilder: SelectQueryBuilder<T>;
    protected joins: string[] = []
    protected abstract getRepository(): Repository<T>;
    protected queryStack: SelectQueryBuilder<T>[] = [];
    constructor() {
        this.queryBuilder = this.getRepository().createQueryBuilder();
        this.rootBuilder = this.queryBuilder;
        this.queryBuilder.cache(true);
        this.queryStack.push(this.queryBuilder);
    }

    public joinQuery(sq: SelectQueryBuilder<any>, alias: string, on:string) {
        this.queryBuilder.leftJoin("(" + sq.getQuery() + ")", alias, on);
        this.queryBuilder.setParameters({
            ...this.queryBuilder.getParameters(),
            ...sq.getParameters()
        });
        this.joins.push(alias);
        return this;
    }

    public with(column: string, value: number|string|boolean, varname= "value") {
        if(value != "") {
            this.queryBuilder.andWhere(`${column} = :${varname}`, {[varname]: value} );
        }
        return this;
    }

    public withLike(column: string, value: string, strict:boolean = true, varname= "value") {
        if(value != "") {
            this.queryBuilder.andWhere(`${column} ${strict?"like":"ilike"} :${varname}`, {[varname]: value} );
        }
        return this;
    }



    public withIn(column: string, value: string[]|number[], varname= "value") {
        if(value.length > 0) {
            this.queryBuilder.andWhere(`${column} in (:...${varname})`, {[varname]: value} );
        }
        return this;
    }



    public openBrackets(): this {
        let qb = this.rootBuilder.subQuery();
        qb.expressionMap.subQuery = false;
        qb.expressionMap.mainAlias = this.rootBuilder.expressionMap.mainAlias;
        qb.expressionMap.aliasNamePrefixingEnabled = this.rootBuilder.expressionMap.aliasNamePrefixingEnabled;
        qb.expressionMap.parameters = this.rootBuilder.expressionMap.parameters;
        qb.expressionMap.nativeParameters = this.rootBuilder.expressionMap.nativeParameters;
        qb.expressionMap.wheres = []
        this.queryBuilder = qb;
        this.queryStack.push(qb);
        return this;
    }

    public closeBrackets(logic: 'simple' | 'and' | 'or' = 'and') {
        // return this;
        
        if(this.queryStack.length > 1) {
            let subQuery = this.queryStack.pop();
            if(subQuery) {
                this.queryBuilder = this.queryStack[this.queryStack.length - 1];
                this.queryBuilder.expressionMap.wheres.push({
                    type: logic,
                    condition: subQuery.expressionMap.wheres,
                })
            }
        }
        return this;
    }

    public withId(values: Array<string|number>) {
       let mainAlias = this.queryBuilder.expressionMap.mainAlias?.name;
        if(values.length)
            this.queryBuilder.andWhere('"' + mainAlias + '".id in (:...ids)', {ids: values});
        return this;
    }

    public leftJoin(table: string, alias: string, condition?: string) {
        if(!this.joins.includes(alias)) {
            this.rootBuilder.leftJoin(table, alias, condition);
            this.joins.push(alias);
        }
        return this;
    }

    public select(fields: string[]) {
        this.queryBuilder.select(fields);
        return this;
    }

    public addSelect(fields: string[]) {
        this.queryBuilder.addSelect(fields);
        return this;
    }
    
    public orderBy(col: string, direction: "ASC" | "DESC" = "ASC") {
        this.queryBuilder.orderBy(col, direction);
        return this;
    }

    public addOrderBy(col: string, direction: "ASC" | "DESC" = "ASC") {
        this.queryBuilder.addOrderBy(col, direction);
        return this;
    }

    public distinct(d: boolean = true) {
        this.queryBuilder.distinct(d);
        return this;
    }

    public async getMany(): Promise<T[]> {
        return await this.queryBuilder.getMany();
    }

    public async getRawMany() {
        return await startSpan({
            name: "custom + " + this.queryBuilder.getQuery(), attributes: {
                'parameters': JSON.stringify(this.queryBuilder.getParameters())
            }
        }, async () => {
            return await this.queryBuilder.getRawMany()
        });
    }

    public getBuilder() {
        return this.queryBuilder;
    }

    public getRawOne() {
        return this.queryBuilder.getRawOne();
    }

    public getOne() {
        return this.queryBuilder.getOne();
    }

    public async paginate(pgSize: number, page: number = 1): Promise<[any[], TPagination]> {
        this.queryBuilder.limit(pgSize).offset((page-1) * pgSize);
        const total = await this.queryBuilder.getCount();
        const totalPages = Math.ceil(total / pgSize);
        return [await this.getRawMany(), {
            total,
            totalPages,
            currentPage: page,
            nextPage: page < totalPages ? page + 1 : null,
            prevPage: page > 1 ? page - 1 : null,
            pageSize: pgSize
        }];
    }
}