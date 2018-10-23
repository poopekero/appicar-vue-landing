import gql from 'graphql-tag'

/** Limit of stores per request. */
const LIMIT = 24

/**
 * class :: StoreService
 *
 * Service for Store types.
 */
class StoreService {
  /**
   * Constructor.
   */
  constructor () {
    this.searchFrom404 = false
    this.skipCounter = 0
  }

  /**
   * Resets the skip counter.
   */
  resetSkipCounter () {
    this.skipCounter = 0
  }

  /**
   * Gets all the stores using pagination.
   *
   * @returns {any} GraphQL query for retrieving the stores from the API server.
   */
  getAll () {
    const query = gql`{
      stores (skip: ${this.skipCounter}, limit: ${LIMIT}) {
        URI
        name
        category
        address
        city
        image
      }
      storesCount
    }`

    this.skipCounter += LIMIT

    return query
  }

  /**
   * Gets all the featured stores.
   *
   * @returns {any} GraphQL query for retrieving the featured stores from the API server.
   */
  getAllFeatured () {
    const query = gql`{
      featuredStores {
        URI
        name
        category
        address
        city
        image
      }
    }`

    return query
  }

  /**
   * Gets an store from the API server by its URI.
   *
   * @param {String} URI The stores URI parameter.
   * @returns {any} GraphQL query for retrieving the store from the API server.
   */
  getStore (URI) {
    const query = gql`{
      store (URI: "${URI}") {
        name
        description {
          en
          es
          it
        }
        points
        category
        address
        city
        country
        lat
        lng
        image
        menu {
          items {
            food {
              name {
                en
                es
                it
              }
              category
              paymentMethods
              picture
              price {
                currency
                value
              }
            }
            drink {
              name {
                en
                es
                it
              }
              category
              paymentMethods
              picture
              price {
                currency
                value
              }
            }
          }
        }
        reviews {
          clientId
          clientName
          clientPicture
          date
          points
          text {
            en
            es
            it
          }
        }
      }
    }`

    return query
  }

  /**
   * Gets all the stores from the API server that have the given item in their menues.
   *
   * @param {MenuItem} menuItem The menu's item used to do the search.
   * @param {String} language The app's current language.
   * @param {Boolean} searchFrom404 True if the search was performed from the SearchBox component.
   * @returns {any} GraphQL query for retrieving the stores from the API server.
   */
  getAllByMenuItem (menuItem, language, searchFrom404) {
    this.searchFrom404 = searchFrom404 || false

    const query = gql`{
      stores (menuItemType: "${menuItem}", menuItemName: "${menuItem.getCategory()}", language: "${language}") {
        URI
        name
        category
        address
        city
        image
      }
    }`

    return query
  }
}

/**
 * Singleton implementation.
 */
export default (function () {
  /** StoreService instance reference. */
  let instance = null

  return {
    /**
     * Gets a unique instance of StoreService.
     *
     * @returns {StoreService} A unique instance of StoreService.
     */
    getInstance: function () {
      if (!instance) {
        instance = new StoreService()
      }
      return instance
    }
  }
})()
