export default {
  namespaced: true,
  state: () => ({
    books: [],
    selected: [],
    selectedAll: false,
  }),
  mutations: {
    books(state, books = []) {
      state.books = books;
    },
    add(state, book = {}) {
      state.books.push(book);
    },
    remove(state, idx = -1) {
      state.books.splice(idx, 1);
    },
    selected(state, selected = []) {
      state.selected = selected;
    },
    selectedAll(state, selectedAll = false) {
      state.selectedAll = selectedAll;
    },
  },
  actions: {
    indexOf(context, {book, callback}) {
      console.log("indexOf");
      let books = context.state.books;
      let i;
      for (i = 0; i < books.length; i++)
        if (books[i].id == book.id)
          break;
      if (i == books.length)
        i = -1;
      console.log("i: " + i);
      callback(i);
    },
    add(context, book) {
      let callback = i => {
        if (i < 0)
        {
          context.commit("add", book);
          context.dispatch("save");
        }
        else
        {
          console.log("书本已经存在！");
        }
      };

      context.dispatch("indexOf", {book, callback});
    },
    remove(context, book) {
      console.log("store: 移除");
      let callback = i => {
        if (i >= 0)
        {
          context.commit("remove", i);
          context.dispatch("save");
        }
        else
        {
          console.log("书本不存在！");
        }
      };
      
      context.dispatch("indexOf", {book, callback});
    },
    save({state}) {
      let json = JSON.stringify(state);
      localStorage.setItem("cart", json);
    },
    load({commit}) {
      let json = localStorage.getItem("cart");
      let state = JSON.parse(json);
      commit("books", state.books);
      commit("selected", state.selected);
      commit("selectedAll", state.selectedAll);
    },
  }
};