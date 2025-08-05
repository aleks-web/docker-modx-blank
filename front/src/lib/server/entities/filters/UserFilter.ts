import { Filter } from "$entities/filters/Filter";
import { User } from "$entities/User";

export class UserFilter extends Filter<User> {
    protected getRepository() { return User.getRepository(); }

    public withLikeName(name: string) {
        if(name) {
            this.queryBuilder.andWhere('"User".name ILIKE :name', {name: `%${name}%`});
        }
        return this
    }
}