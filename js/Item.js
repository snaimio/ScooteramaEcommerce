
class Item {
  constructor(id, quantity = 1) {
    this.id = id;
    this.quantity = quantity;
  }
  getId() {
    return this.id;
  }
}