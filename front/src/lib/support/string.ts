const formatter = new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0
});

export function formatPrice(price: string | number): string {
    return formatter.format(Number(price))
};