import { json } from "@sveltejs/kit";
import { Product } from "$entities/Product";

/**
 * Competitor PUT
 * */


export async function DELETE(event) {
    const request = await event.request.json();
    const id = request.id;
    const product = await Product.findOneById(id);

    if (product) {
        await product?.remove();
    }

    return json({ success: true, message: "Успешное удаление товара" });
}

export async function PUT(event) {
    const request = await event.request.json();
    const product = await Product.findOneById(request.product.id);

    switch(request.action) {
        case 'toggle_monitoring':
            if (product) {
                return await toggle_monitoring(product);
            }
            break;
        default:
            break;
    }

    if (product) {
        product.active = !product.active;
        await product.save();
    }

    return json({ success: true, message: "Успешное изменение товара" });
}

async function toggle_monitoring(product: Product) {
    product.active = !product.active;
    await product.save();

    return json({ success: true, message: "Успешная смена активности", data: { active: product.active } });
}