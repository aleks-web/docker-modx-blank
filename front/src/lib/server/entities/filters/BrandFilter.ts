import { Brand } from "$entities/Brand";
import type { Repository } from "typeorm";
import { Filter } from "./Filter";

export class BrandFilter extends Filter<Brand> {
    protected getRepository(): Repository<Brand> {
        return Brand.getRepository();
    }
}