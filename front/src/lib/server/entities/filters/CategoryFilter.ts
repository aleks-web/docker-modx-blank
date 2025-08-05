import { Category } from "$entities/Category";
import type { Repository } from "typeorm";
import { Filter } from "./Filter";

export class CategoryFilter extends Filter<Category> {
    protected getRepository(): Repository<Category> {
        return Category.getRepository();
    }
}