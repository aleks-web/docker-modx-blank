import { Product } from "$entities/Product.js";
import { json } from "@sveltejs/kit";

export async function PUT({ request, locals }) {
    let body = await request.json();
    let name = body.name;

    let sc = new Product();
    sc.name = name; 
    sc.user_id = locals.user.id;
    sc.active = true;
    sc = await sc.save();
    
    return json(sc.toPlain());
}

export async function DELETE({ request, locals }) {
    return json({});
}