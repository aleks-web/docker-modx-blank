import type objectHash from "object-hash"
import hash from "object-hash"
import { SvelteMap } from "svelte/reactivity"
import { derived, fromStore, toStore, type Readable } from "svelte/store";

export class Diff {
    private map!: SvelteMap<string, objectHash.NotUndefined>;
    private getKey(k:string): objectHash.NotUndefined {return this.map.get(k) as objectHash.NotUndefined;}
    private getHash(v: objectHash.NotUndefined) {return hash(v, {
        unorderedArrays: true,
    });}
    private normalize(v: any): objectHash.NotUndefined {
        return v;//JSON.parse(JSON.stringify(v));
    }
    
    constructor(value: objectHash.NotUndefined) {
        this.map = new SvelteMap<string, objectHash.NotUndefined>();
        this.rewind(value);
    }
    rewind(value: objectHash.NotUndefined) {
        this.map.set('v', this.normalize(value));
        this.map.set('v_hash', this.getHash(this.getKey('v')));
    }
    equalWith(otherValue: objectHash.NotUndefined) {
        return this.getKey('v_hash') === this.getHash(this.normalize(otherValue));
    }
}
