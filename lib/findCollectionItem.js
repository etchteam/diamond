/**
 * Find an item within a collection by it’s url
 * @param {Array} collection the collection to search
 * @param {String} url the url of the item to search for
 * @returns A collection item or undefined
 */
export default function findCollectionItem(collection = [], url = '') {
  return collection.find(post => post.url === url);
}