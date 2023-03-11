import * as cheerio from 'cheerio';
import got from 'got';
export async function scrapeProducts(searchTerm) {
    const selector = '#plpProducts > div.plp__items > div.plp-products > div';
    const response = await got(`https://www.collectandgo.be/colruyt/nl/zoek?searchTerm=${searchTerm}`, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36 Edg/110.0.1587.63',
        },
    });
    const $ = cheerio.load(response.body);
    const products = [];
    for (let i = 1; i < 11; i++) {
        const price = normalize($(`${selector} > div:nth-child(${i}) > div > div.plp-item__price > div.plp-item__price-display > div > span.c-price__euro`).html()) +
            normalize($(`${selector} > div:nth-child(${i}) > div > div.plp-item__price > div.plp-item__price-display > div > span.c-price__cent`).html());
        products.push({
            title: normalize($(`${selector} > div:nth-child(${i}) > div > div.plp-item-top > div.c-tile__data > div > div.c-product-name__long.--plp`).html()),
            brand: normalize($(`${selector} > div:nth-child(${i}) > div > div.plp-item-top > div.c-tile__data > div > div.c-product-name__brand.--plp`).html()),
            priceKilo: normalize($(`${selector} > div:nth-child(${i}) > div > div.plp-item__price > div.plp-item__price-display > div > span.product__price__weight-price > span.product__price__volume-price.s-volume-price`).html()),
            image: normalize($(`${selector} > div:nth-child(${i}) > div > div.plp-item-top > div.plp-item-top__image-banner-wrap > a > img`).attr('src')),
            price,
        });
    }
    return products;
}
function normalize(data) {
    return (data || '').trim().replace(/&nbsp;/g, '');
}
//# sourceMappingURL=scraper.js.map