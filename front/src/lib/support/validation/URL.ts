export class URLValidator {
    public static new(err?: string): (v:string)=>boolean {
        return (v:string) => {
            let url;
            console.log(v);
            try {
                url = new URL(v);
                return true;
            } catch (_) {
                throw err;
            }
        }
    }
}
export class HttpHost {
    public static new(err?: string): (v:string)=>boolean {
        return (v:string) => {
            let r = (v.match(/^([\d|\w|-]+\.)*[\w]{2,3}$/gi) !== null);
            if(err && !r) {
                throw err;
            }
            return r;
        }
    }
}