// storage controller

// item controller
const itemCtrl = (function() {
  // item constructor
  const Item = function(id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };

  //   data structure/ state
  const data = {
    items: [
      //   { id: 0, name: "Nasi", calories: 300 },
      //   { id: 1, name: "Bami", calories: 1300 },
      //   { id: 2, name: "Rijst", calories: 2300 }
    ],
    currentItem: null,
    totalCalories: 0
  };

  return {
    getItems: () => {
      return data.items;
    },
    addItem: (name, calories) => {
      let id;
      // Generate ID
      if (data.items.length > 0) {
        id = data.items[data.items.length - 1].id + 1;
      } else {
        id = 0;
      }

      //Calories to number
      calories = parseInt(calories);

      //create new item
      newItem = new Item(id, name, calories);

      //add item to items array
      data.items.push(newItem);

      return newItem;
    },

    getItemById: id => {
      let found = null;

      data.items.forEach(item => {
        if (item.id === id) {
          found = item;
        }
      });

      return found;
    },
    updateItem: (name, calories) => {
      // calories to number
      calories = parseInt(calories);

      let found = null;
      data.items.forEach(item => {
        if (item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });
      return found;
    },

    deleteItem: id => {
      // get id

      const ids = data.items.map(item => {
        return item.id;
      });

      // get index
      const index = ids.indexOf(id);

      // remove item
      data.items.splice(index, 1);
    },
    clearAllItems: () => {
      data.items = [];
    },
    setCurrentItem: item => {
      data.currentItem = item;
    },

    getCurrentItem: () => {
      return data.currentItem;
    },
    getTotalCalories: () => {
      let total = 0;

      // Loop thorugh items
      data.items.forEach(item => {
        total += item.calories;
      });

      //set total calories in data structure
      data.totalCalories = total;

      return data.totalCalories;
    }
  };
})();

// ui controller
const uiCtrl = (() => {
  const uiSelector = {
    itemList: "#item-list",
    addBtn: ".add-btn",
    listItems: "#item-list li",
    updateBtn: ".update-btn",
    deleteBtn: ".delete-btn",
    backBtn: ".back-btn",
    clearBtn: ".clear-btn",
    itemNameInput: "#item-name",
    itemCaloriesInput: "#item-calories",
    totalCalories: ".total-calories"
  };
  return {
    populateItemList: function(items) {
      let html = "";

      items.forEach(item => {
        html += `<li class="collection-item" id="item-${item.id}">
        <strong>${item.name}:</strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content"><i class="edit-item far fa-edit"></i></a>
      </li>`;
      });

      //   Insert list items
      document.querySelector(uiSelector.itemList).innerHTML = html;
    },
    getItemInput: () => {
      return {
        name: document.querySelector(uiSelector.itemNameInput).value,
        calories: document.querySelector(uiSelector.itemCaloriesInput).value
      };
    },
    addListItem: item => {
      //create li item
      const li = document.createElement("li");
      //add classes
      li.className = "collection-item";
      //add id
      li.id = `item-${item.id}`;
      //add HTML
      li.innerHTML = `<strong>${item.name}:</strong> <em>${
        item.calories
      } Calories</em>
      <a href="#" class="secondary-content"><i class="edit-item far fa-edit"></i></a>`;

      //insert li
      document
        .querySelector(uiSelector.itemList)
        .insertAdjacentElement("beforeend", li);
    },
    updateListItem: item => {
      let listitems = document.querySelectorAll(uiSelector.listItems); //returns NODELIST

      // Convert nodelist to array
      listitems = Array.from(listitems);

      listitems.forEach(listItem => {
        const itemId = listItem.getAttribute("id");
        if (itemId === `item-${item.id}`) {
          document.querySelector(`#${itemId}`).innerHTML = `<strong>${
            item.name
          }:</strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content"><i class="edit-item far fa-edit"></i></a>`;
        }
      });
    },
    deleteListItem: id => {
      const itemId = `#item-${id}`;
      const item = document.querySelector(itemId);
      item.remove();
    },
    removeItems: () => {
      let listItems = document.querySelectorAll(uiSelector.listItems); //returns nodelist

      // turn nodelist into array
      listItems = Array.from(listItems);

      listItems.forEach(item => {
        item.remove();
      });
    },
    clearInput: () => {
      document.querySelector(uiSelector.itemNameInput).value = "";
      document.querySelector(uiSelector.itemCaloriesInput).value = "";
    },
    addItemToForm: () => {
      document.querySelector(
        uiSelector.itemNameInput
      ).value = itemCtrl.getCurrentItem().name;
      document.querySelector(
        uiSelector.itemCaloriesInput
      ).value = itemCtrl.getCurrentItem().calories;
      uiCtrl.showEditState();
    },
    hideList: () => {
      document.querySelector(uiSelector.itemList).style.display = "none";
    },
    clearEditState: () => {
      uiCtrl.clearInput();
      document.querySelector(uiSelector.backBtn).style.display = "none";
      document.querySelector(uiSelector.updateBtn).style.display = "none";
      document.querySelector(uiSelector.deleteBtn).style.display = "none";
      document.querySelector(uiSelector.addBtn).style.display = "inline";
    },
    showEditState: () => {
      document.querySelector(uiSelector.backBtn).style.display = "inline";
      document.querySelector(uiSelector.updateBtn).style.display = "inline";
      document.querySelector(uiSelector.deleteBtn).style.display = "inline";
      document.querySelector(uiSelector.addBtn).style.display = "none";
    },
    getUiSelectors: () => {
      return uiSelector;
    },
    showTotalCalories: total => {
      document.querySelector(uiSelector.totalCalories).textContent = total;
    }
  };
})();

// app controller
const appCtrl = ((itemCtrl, uiCtrl) => {
  //Load
  const loadEvents = () => {
    //   get Ui Selectors
    const uiSelectors = uiCtrl.getUiSelectors();

    // add item event
    document
      .querySelector(uiSelectors.addBtn)
      .addEventListener("click", itemAddSubmit);

    // disable  submit on enter
    document.addEventListener("keypress", e => {
      if (e.keyCode === 13 || e.which === 13) {
        //13 = enter key
        e.preventDefault();
        return false;
      }
    });
    //Edit item click event
    document
      .querySelector(uiSelectors.itemList)
      .addEventListener("click", itemUpdateClick);

    // Update Item event
    document
      .querySelector(uiSelectors.updateBtn)
      .addEventListener("click", itemUpdateSubmit);
    // Back btn event
    document
      .querySelector(uiSelectors.backBtn)
      .addEventListener("click", uiCtrl.clearEditState);
    // Delete item event
    document
      .querySelector(uiSelectors.deleteBtn)
      .addEventListener("click", itemDeleteSubmit);
    // clear all item event
    document
      .querySelector(uiSelectors.clearBtn)
      .addEventListener("click", clearAllItemsClick);
  };

  //add item submit
  const itemAddSubmit = e => {
    e.preventDefault();
    // get form input from UI Ctrl
    const input = uiCtrl.getItemInput();

    // check for name and calorie input
    if (input.name != "" && input.calories != "") {
      //Add Item
      const newItem = itemCtrl.addItem(input.name, input.calories);
      //Add item to ui list
      uiCtrl.addListItem(newItem);
      // get total calories
      const totalCalories = itemCtrl.getTotalCalories();
      // add total calories to ui
      uiCtrl.showTotalCalories(totalCalories);
      //clear fields
      uiCtrl.clearInput();
    }
  };

  //Update item
  const itemUpdateClick = e => {
    if (e.target.classList.contains("edit-item")) {
      //Get list item id
      const ListId = e.target.parentNode.parentNode.id;
      // Split into Array
      const listIdArray = ListId.split("-"); // ["item", "id"]

      // get acutal id
      const id = parseInt(listIdArray[1]);

      //get item
      itemToEdit = itemCtrl.getItemById(id);

      //set current item
      itemCtrl.setCurrentItem(itemToEdit);
      //set current item to form
      uiCtrl.addItemToForm();
    }
    e.preventDefault();
  };

  // Update item submit
  const itemUpdateSubmit = e => {
    e.preventDefault();
    // Get item input
    const input = uiCtrl.getItemInput();

    // Update Item
    const updatedItem = itemCtrl.updateItem(input.name, input.calories);

    // Update UI
    uiCtrl.updateListItem(updatedItem);
    const totalCalories = itemCtrl.getTotalCalories();
    // add total calories to ui
    uiCtrl.showTotalCalories(totalCalories);

    uiCtrl.clearEditState();
  };

  // Delete item
  const itemDeleteSubmit = e => {
    e.preventDefault();
    // get current item
    const currentItem = itemCtrl.getCurrentItem();

    // delete from datastructure
    itemCtrl.deleteItem(currentItem.id);

    // delete from ui
    uiCtrl.deleteListItem(currentItem.id);

    const totalCalories = itemCtrl.getTotalCalories();
    // add total calories to ui
    uiCtrl.showTotalCalories(totalCalories);

    uiCtrl.clearEditState();
  };
  const clearAllItemsClick = e => {
    // delete all items from datastructure
    itemCtrl.clearAllItems();

    const totalCalories = itemCtrl.getTotalCalories();
    // add total calories to ui
    uiCtrl.showTotalCalories(totalCalories);

    uiCtrl.clearEditState();

    // Remove from ui
    uiCtrl.removeItems();
  };
  // Public Methods
  return {
    init: () => {
      // Clear edit state
      uiCtrl.clearEditState();
      // get items from data structure
      const items = itemCtrl.getItems();

      //check for items
      if ((items.length = 0)) {
        uiCtrl.hideList();
      } else {
        //populate list with items
        uiCtrl.populateItemList(items);
      }
      // get total calories
      const totalCalories = itemCtrl.getTotalCalories();
      // add total calories to ui
      uiCtrl.showTotalCalories(totalCalories);
      loadEvents();
    }
  };
})(itemCtrl, uiCtrl);

// Initialize App
appCtrl.init();
