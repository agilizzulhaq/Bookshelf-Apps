document.addEventListener("DOMContentLoaded", function () {
    const bookshelf = {
      incomplete: document.getElementById("incompleteBookshelfList"),
      complete: document.getElementById("completeBookshelfList"),
    };
  
    const BOOKS_KEY = "books";
  
    function saveToLocalStorage(books) {
      localStorage.setItem(BOOKS_KEY, JSON.stringify(books));
    }
  
    function getFromLocalStorage() {
      return JSON.parse(localStorage.getItem(BOOKS_KEY)) || [];
    }
  
    function renderBook(book, shelf) {
      const bookElement = document.createElement("article");
      bookElement.classList.add("book_item");
      bookElement.innerHTML = `
        <h3>${book.title}</h3>
        <p>Penulis: ${book.author}</p>
        <p>Tahun: ${book.year}</p>
        <div class="action">
          <button class="green">${shelf === "incomplete" ? "Selesai Dibaca" : "Belum Selesai Dibaca"}</button>
          <button class="red">Hapus Buku</button>
        </div>
      `;
  
      const deleteButton = bookElement.querySelector(".red");
      deleteButton.addEventListener("click", function () {
        showDialog(book);
      });
  
      const toggleButton = bookElement.querySelector(".green");
      toggleButton.addEventListener("click", function () {
        const books = getFromLocalStorage();
        const index = books.findIndex((item) => item.id === book.id);
        if (index !== -1) {
          books[index].isComplete = !books[index].isComplete;
          saveToLocalStorage(books);
          renderBookshelf();
        }
      });
  
      bookshelf[shelf].appendChild(bookElement);
    }
  
    function renderBookshelf() {
      const books = getFromLocalStorage();
      bookshelf.incomplete.innerHTML = "";
      bookshelf.complete.innerHTML = "";
  
      books.forEach((book) => {
        const shelf = book.isComplete ? "complete" : "incomplete";
        renderBook(book, shelf);
      });
    }
  
    function showDialog(book) {
      const dialogBackground = document.createElement("div");
      dialogBackground.classList.add("dialog_background");
  
      const dialog = document.createElement("div");
      dialog.classList.add("dialog");
  
      dialog.innerHTML = `
        <p>Apakah Anda yakin ingin menghapus buku '${book.title}'?</p>
        <div class="dialog_buttons">
          <button class="dialog_cancel">Batal</button>
          <button class="dialog_confirm">Hapus</button>
        </div>
      `;
  
      dialogBackground.appendChild(dialog);
      document.body.appendChild(dialogBackground);
  
      const cancelButton = dialog.querySelector(".dialog_cancel");
      cancelButton.addEventListener("click", function () {
        document.body.removeChild(dialogBackground);
      });
  
      const confirmButton = dialog.querySelector(".dialog_confirm");
      confirmButton.addEventListener("click", function () {
        const books = getFromLocalStorage();
        const index = books.findIndex((item) => item.id === book.id);
        if (index !== -1) {
          books.splice(index, 1);
          saveToLocalStorage(books);
          renderBookshelf();
          document.body.removeChild(dialogBackground);
        }
      });
    }
  
    const formAddBook = document.getElementById("inputBook");
    formAddBook.addEventListener("submit", function (event) {
      event.preventDefault();
  
      const title = document.getElementById("inputBookTitle").value;
      const author = document.getElementById("inputBookAuthor").value;
      const year = document.getElementById("inputBookYear").value;
      const isComplete = document.getElementById("inputBookIsComplete").checked;
  
      const newBook = {
        id: +new Date(),
        title,
        author,
        year: parseInt(year),
        isComplete,
      };
  
      const books = getFromLocalStorage();
      books.push(newBook);
      saveToLocalStorage(books);
  
      renderBookshelf();
      formAddBook.reset();
    });
  
    const formSearchBook = document.getElementById("searchBook");
    formSearchBook.addEventListener("submit", function (event) {
      event.preventDefault();
  
      const searchTitle = document.getElementById("searchBookTitle").value.toLowerCase();
      const books = getFromLocalStorage();
      const filteredBooks = books.filter((book) => book.title.toLowerCase().includes(searchTitle));
  
      bookshelf.incomplete.innerHTML = "";
      bookshelf.complete.innerHTML = "";
  
      filteredBooks.forEach((book) => {
        const shelf = book.isComplete ? "complete" : "incomplete";
        renderBook(book, shelf);
      });
    });
  
    renderBookshelf();
});