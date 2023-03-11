import * as cheerio from 'cheerio'
import got from 'got'
import { ProductList, Product, APIProduct } from './types.js'
import { getAPIResponse, normalize, normalizeWeight, parsePrice, removeFalses } from './util.js'

// Scrapes all stores and returns the products, sorted by price per kilo
export async function scrapeProducts(searchTerm: string): Promise<ProductList> {
    const colruyt = removeFalses(await scrapeProductsColruyt(searchTerm)).sort((a,b) => a.priceKilo - b.priceKilo)
    const albert_heijn = removeFalses(await scrapeProductsAH(searchTerm)).sort((a,b) => a.priceKilo - b.priceKilo)
    const delhaize = removeFalses(await scrapeProductsDelhaize(searchTerm)).sort((a,b) => a.priceKilo - b.priceKilo)
    return {
        colruyt,
        albert_heijn,
        delhaize,
    }
}

// Scrape the Colruyt products
export async function scrapeProductsColruyt(searchTerm: string): Promise<Product[]> {
    const selector = '#plpProducts > div.plp__items > div.plp-products > div'

    const response = await got(`https://www.collectandgo.be/colruyt/nl/zoek?searchTerm=${searchTerm}`, {
        headers: {
            'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36 Edg/110.0.1587.63',
        },
    })
    const $ = cheerio.load(response.body)

    const products = [] as Product[]

    for (let i = 1; i < 11; i++) {
        const price =
            normalize(
                $(
                    `${selector} > div:nth-child(${i}) > div > div.plp-item__price > div.plp-item__price-display > div > span.c-price__euro`,
                ).html(),
            ) +
            normalize(
                $(
                    `${selector} > div:nth-child(${i}) > div > div.plp-item__price > div.plp-item__price-display > div > span.c-price__cent`,
                ).html(),
            )

        products.push({
            title: normalize(
                $(
                    `${selector} > div:nth-child(${i}) > div > div.plp-item-top > div.c-tile__data > div > div.c-product-name__long.--plp`,
                ).html(),
            ),
            brand: normalize(
                $(
                    `${selector} > div:nth-child(${i}) > div > div.plp-item-top > div.c-tile__data > div > div.c-product-name__brand.--plp`,
                ).html(),
            ),
            priceKilo: parsePrice(normalize(
                $(
                    `${selector} > div:nth-child(${i}) > div > div.plp-item__price > div.plp-item__price-display > div > span.product__price__weight-price > span.product__price__volume-price.s-volume-price`,
                ).html(),
            )),
            image: normalize(
                $(
                    `${selector} > div:nth-child(${i}) > div > div.plp-item-top > div.plp-item-top__image-banner-wrap > a > img`,
                ).attr('src'),
            ),
            price: parsePrice(price),
        })
    }

    return products
}

// Scrape the Albert Heijn products
export async function scrapeProductsAH(searchTerm: string): Promise<Product[]> {
    const selector = '#search-lane > div'

    const response = await got(`https://www.ah.be/zoeken?query=${searchTerm}`, {
        headers: {
            'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36 Edg/110.0.1587.63',
        },
    })
    const $ = cheerio.load(response.body)

    const products = [] as Product[]

    for (let i = 1; i < 11; i++) {
        const pricePart =
            normalize(
                $(`${selector} > article:nth-child(${i}) > div > a > div > div > div > span:nth-child(1)`).html(),
            ) +
            ',' +
            normalize($(`${selector} > article:nth-child(${i}) > div > a > div > div > div > span:nth-child(3)`).html())

        const title = normalize($(`${selector} > article:nth-child(${i}) > div > div > a > strong > span`).html())
        const price = parsePrice(pricePart)
        const weight = normalizeWeight($(`${selector} > article:nth-child(${i}) > div > a > div > div > span`).html())

        products.push({
            title,
            image: normalize($(`${selector} > article:nth-child(${i}) > div > a > figure > div > img`).attr('src')),
            price,
            priceKilo: Math.round((price / (weight / 1000) + Number.EPSILON) * 100) / 100,
            brand: /^AH/.test(title) ? 'AH' : undefined
        })
    }

    return products
}

// Scrape the Delhaize products
export async function scrapeProductsDelhaize(searchTerm: string): Promise<Product[]> {
    const res = await getAPIResponse(searchTerm)
    const products = res.data.productSearch.products as APIProduct[]
    return products.map(product => {
        return {
            priceKilo: parsePrice(product.price.supplementaryPriceLabel1),
            image: `https://static.delhaize.be${product.images.filter(image => image.format == 'respListGrid')[0].url}`,
            title: product.name,
            price: parsePrice(product.price.unitPriceFormatted),
            brand: product.manufacturerName
        }
    })
}
