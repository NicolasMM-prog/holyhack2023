import { ProductList } from './types.js'
import { getBestChoice } from './util.js'

// Gets the cheapest store based on the received product items
export function getCheapestStore(body: string): string {
    const parsed = JSON.parse(JSON.stringify(body)) as ProductList
    return getBestChoice([parsed.colruyt, parsed.ah, parsed.delhaize])
}
