
//========================>> 
// Cart class: handles cart items and display
//========================>>

class Cart {
  constructor() {
    this.items = []; 
    this.total = 0;
  }

  //========================>> 
  // add item to cart
  //========================>>
  addItem(item) {
    let existingItem = null;
    let itemId = item.getId ? item.getId() : item.id;

    for (let i = 0; i < this.items.length; i++) {
      let currentId = this.items[i].getId ? this.items[i].getId() : this.items[i].id;
      if (currentId === itemId) {
        existingItem = this.items[i];
        break;
      }
    }

    if (existingItem) {
      existingItem.quantity += (item.quantity || 1);
    } else {
      item.quantity = item.quantity || 1;
      this.items.push(item);
    }
  }

  //========================>> 
  // remove items from cart
  //========================>>
  removeItem(itemId, quantity = 1) {
    for (let i = 0; i < this.items.length; i++) {
      let currentId = this.items[i].getId ? this.items[i].getId() : this.items[i].id;
      if (currentId === itemId) {
        if (this.items[i].quantity > quantity) {
          this.items[i].quantity -= quantity;
        } else {
          this.items.splice(i, 1); 
        }
        return true;
      }
    }
    return false; 
  }

  //========================>> 
  // clear all items from cart
  //========================>>
  clearItems() {
    this.items = [];
    this.total = 0;
  }

  //========================>> 
  // get total number of items in cart
  //========================>>
  getCartCount() {
    let totalItems = 0;
    for (let i = 0; i < this.items.length; i++) {
      totalItems += this.items[i].quantity;
    }
    return totalItems;
  }

  //========================>> 
  // get all items
  //========================>>
  getCartItems() {
    return this.items;
  }

  //========================>> 
  // display cart in #cartPanel
  //========================>>
  displayCart() {
    this.total = 0;
    let cartPanel = document.querySelector('#cartPanel');
    cartPanel.innerHTML = ''; 

    // close icon
    let closeIcon = document.createElement('div');
    closeIcon.classList.add('closeIcon');
    closeIcon.setAttribute('onclick', 'hideCart();');
    closeIcon.innerText = 'X';
    cartPanel.appendChild(closeIcon);

    // clear button
    let clrButton = document.createElement('button');
    clrButton.setAttribute('onclick', 'clearCart();');
    clrButton.setAttribute('type', 'button');
    clrButton.innerText = 'Clear Items';
    cartPanel.appendChild(clrButton);

    // cart items container
    let cartContent = document.createElement('div');
    cartContent.style.marginTop = '60px';
    cartPanel.appendChild(cartContent);

    if (this.items.length === 0) {
      let emptyMessage = document.createElement('h2');
      emptyMessage.textContent = 'Your cart is empty';
      emptyMessage.style.textAlign = 'center';
      emptyMessage.style.color = '#fff';
      emptyMessage.style.marginTop = '50px';
      cartContent.appendChild(emptyMessage);
    } else {
      
      // the for loop
      for(let r = 0; r < this.items.length; r++) {
        let lineItem = document.createElement('div');
        lineItem.classList.add('lineItem');

        let prodName = document.createElement('div');
        prodName.classList.add('nameItem');
        
        // added (x quantity) so user knows why price is higher
        let displayName = scooterProducts[this.items[r].getId()][1];
        if(this.items[r].quantity > 1) {
            displayName += ` (× ${this.items[r].quantity})`;
        }
        prodName.innerHTML = `<h2>${displayName}</h2>`;
        lineItem.appendChild(prodName);

        let prodPrice = document.createElement('div');
        prodPrice.classList.add('priceItem');
        
        // multiply unit price by quantity
        let itemTotal = scooterProducts[this.items[r].getId()][2] * this.items[r].quantity;
        prodPrice.innerHTML = `<h2>$${itemTotal.toFixed(2)}</h2>`;
        lineItem.appendChild(prodPrice);

        // adds the calculated itemTotal, not just the unit price
        this.total += itemTotal;

        cartContent.appendChild(lineItem);
      } // for

      // cart total
      let cartTotal = document.createElement('div');
      cartTotal.classList.add('totalItem');
      cartTotal.innerHTML = `<h1>Total: $${this.total.toFixed(2)}</h1>`;
      cartContent.appendChild(cartTotal);
    }
  }
}