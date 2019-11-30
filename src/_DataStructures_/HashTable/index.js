const HashEntry = require('./HashEntry');

class HashTable {
  constructor(slots) {
    // init with a default set of slots
    this.slot = slots || 19;
    // size to hold the current size
    // and help to resize when the table is half filled
    this.size = 0;
    // threshold (let it be 70%)
    this.threshold = 0.7;
    // the main bucket
    this.bucket = new Array(this.slot);

    // fill the bucket with null
    for (let i = 0; i < this.slot; i += 1) this.bucket[i] = null;
  }

  _hash(key) {
    // convert the key to String;
    const stringKey = String(key);

    let index = 0;
    const PRIME = 1801;

    // loop till the length of the key or mamx 100
    const loopTill = Math.min(stringKey.length, 100);

    for (let i = 0; i < loopTill; i += 1) {
      const char = stringKey[i];
      const value = char.charCodeAt(0) - 96;
      index = (index + PRIME + value) % this.bucket.length;
    }
    return index;
  }

  _resize() {
    const oldSlot = this.slot;
    const oldBucket = this.bucket;

    this.slot = oldSlot * 2;
    const newBucket = new Array(this.slot);
    // fill the new bucket with nulls
    for (let i = 0; i < this.slot; i += 1) newBucket[i] = null;

    this.bucket = newBucket;

    for (let i = 0; i < oldSlot; i += 1) {
      if (oldBucket[i]) {
        // get all the nodes associated here
        let head = oldBucket[i];

        while (head !== null) {
          const { key, value } = head;
          // eslint-disable-next-line no-underscore-dangle
          const newIndex = this._hash(key);
          // eslint-disable-next-line no-underscore-dangle
          this._push(newIndex, { key, value });
          head = head.next;
        }
      }
    }
  }

  _push(index, value) {
    /**
     * Util to add a SSL to the index in case of more than once
     * value for the same key exixts
     */
    const node = new HashEntry(value);
    if (!this.bucket[index]) {
      this.bucket[index] = node;
      this.size += 1;
      return index;
    }

    let head = this.bucket[index];

    // traverse to the end
    while (head.next !== null) {
      head = head.next;
    }
    head.next = node;
    this.size += 1;
    return index;
  }

  _values(index, key) {
    /**
     * Util to return the values as an array
     */
    const res = [];
    let head = this.bucket[index];
    while (head !== null) {
      if (head.key === key) {
        res.push(head.value);
      }
      head = head.next;
    }
    return res;
  }

  set(key, value) {
    // eslint-disable-next-line no-underscore-dangle
    const index = this._hash(key);
    // storing value as an key-value pair
    // eslint-disable-next-line no-underscore-dangle
    this._push(index, { key, value });

    /**
     * calculate the load factor, if it's greater than threshold
     * resize the hash table
     */
    const loadFactor = (this.size / this.slot).toFixed(1);
    if (loadFactor > this.threshold) {
      // console.log('Resizing hash table');
      // eslint-disable-next-line no-underscore-dangle
      this._resize();
    }
  }

  get(key) {
    // get the index
    // eslint-disable-next-line no-underscore-dangle
    const index = this._hash(key);
    if (!this.bucket[index]) return null;
    // eslint-disable-next-line no-underscore-dangle
    return this._values(index, key);
  }

  getSize() {
    return this.size;
  }

  isEmpty() {
    return this.getSize() === 0;
  }
}

// const ht = new HashTable(5);
// ht.set('hello', 'I am a new value');
// ht.set('hello', 'I am a yet another value');
// ht.set('maroon', 'I maroon');
// ht.set('yellow', 'I am yellow');

// console.log(ht.get('hello'));
// console.log(ht.get('maroon'));
// console.log(ht.bucket);

module.exports = HashTable;