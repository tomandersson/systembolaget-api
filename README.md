# An HTTP-API for accessing Systembolaget's contents

## Endpoints

### Search
Searches through (almost) all fields.

Usage:
`/search?q=<search>`

### Country/region
Find wines from a specific country and, optionally, region.

Usage
`/country/frankrike/bourgogne`

### Producer
Find wines from a specific producer.

Usage
`/producer/Maison%20Rijckaert`

### Supplier
Find wines from a specific supplier.

Usage
`/supplier/Johan%20Lidby%20Vinhandel%20AB`

## Filtering
All endpoints support filtering. The following filters are available:

 * `vintage`: year to filter by. May appear more than once, may be a range (e.g. 2001-2003)
 * `country`: country (in Swedish),
 * `region`: region (in Swedish),
 * `supplier`: name of supplier, does not need to be exact match (e.g. 'lidby' is fine),
 * `producer`: name of producer, does not need to be exact match (e.g. 'rijckaert' is fine),
 * `line`: Systembolaget line to look at, must be one of FS, BS, TSE
 * `availableFrom`: date from which the wines should have been made available, of the form 2011-01-21,
 * `group`: which type of wine, one of rose, white, red, sparkling

## TODO

 * Search frontend
 * Filtering
   * Grape
   * Availability
 * Add extra metadata from Systembolaget unofficial API (e.g. https://www.systembolaget.se/api/productsearch/search/sok-dryck/?searchquery=7961509)
 * Add extra metadata from Munskänkarna search engine (http://www.vintesten.se/pages/searchwine.php?pr=72861)

