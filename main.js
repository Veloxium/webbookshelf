const localStorageKey = "DATA_BOOKS";
const addBook = document.querySelector(".add-book");
const btnAdd = document.querySelector(".btn-add");
const btnBatal = document.querySelector(".batal");
const btnSelesei = document.querySelector(".selesei");
const formBook = document.querySelector("#form-book");
const textForm = document.querySelector(".tambah");
const searchBook = document.querySelector(".search-input");

let books = [];
let bookFilter = [];
let isEdit = [false, 0];

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

function loadDataFromStorage() {
  const booksData = localStorage.getItem(localStorageKey);
  let dataStorage = JSON.parse(booksData);
  if (dataStorage !== null) {
    for (const book of dataStorage) {
      books.push(book);
      bookFilter.push(book);
    }
  }
  renderBook();
}

document.addEventListener("DOMContentLoaded", function () {
  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

function updateStorage() {
  const parsed = JSON.stringify(books);
  localStorage.setItem(localStorageKey, parsed);
}

btnAdd.addEventListener("click", () => {
  addBook.style.display = "flex";
});

btnBatal.addEventListener("click", (event) => {
  event.preventDefault();
  isEdit = false;
  textForm.innerHTML = "Tambah Buku";
  addBook.style.display = "none";
});

btnBatal.addEventListener("click", (event) => {
  event.preventDefault();
  addBook.style.display = "none";
  resetForm();
});

function resetForm() {
  const titleInput = document.querySelector(".title-input");
  const authorInput = document.querySelector(".author-input");
  const yearInput = document.querySelector(".year-input");
  const isCompleteInput = document.querySelector(".check-input");

  titleInput.value = "";
  authorInput.value = "";
  yearInput.value = "";
  isCompleteInput.checked = false;
}

function search() {
  if (searchBook.value === "") {
    return;
  }
  value = searchBook.value.toLowerCase();
  bookFilter = books.filter((item) => {
    return item.title.toLowerCase().includes(value);
  });
  searchBook.value = "";
  renderBook();
}

function refresh() {
  bookFilter = books;
  renderBook();
  console.log(books);
}

function dialogShow(text, color) {
  const showDialog = document.querySelector(".custom-dialog");
  const dialog = document.querySelector(".text-dialog");

  showDialog.style.display = "flex";
  dialog.innerHTML = text;
  showDialog.style.backgroundColor = color;
  setTimeout(() => {
    showDialog.style.display = "none";
  }, 1500);
}

formBook.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = document.querySelector(".title-input").value;
  const author = document.querySelector(".author-input").value;
  const yearString = document.querySelector(".year-input").value;
  const isComplete = document.querySelector(".check-input").checked;
  if (title === "" || author === "" || yearString === "") {
    dialogShow("Data tidak boleh kosong", "#d80032");
    return;
  }
  const year = Number(yearString.trim());
  const book = {
    id: +new Date(),
    title,
    author,
    year,
    isComplete,
  };
  if (isEdit[0] === true) {
    editBook(isEdit[1], book);
    isEdit = false;
    textForm.innerHTML = "Tambah Buku";
    addBook.style.display = "none";
    resetForm();
    return;
  }
  books.push(book);
  addBook.style.display = "none";
  updateStorage();
  renderBook();
  formBook.reset();
  refresh();
  dialogShow("Buku Berhasil ditambahkan", "#47a992");
});

function renderBook() {
  const bookList = document.querySelector(".container-books-belum");
  const bookList2 = document.querySelector(".container-books-selesei");
  bookList.innerHTML = "";
  bookList2.innerHTML = "";
  bookFilter.forEach((book) => {
    if (book.isComplete === false) {
      const bookItem = document.createElement("div");
      bookItem.classList.add("list-book");
      bookItem.attributes.id = book.id;
      bookItem.innerHTML = `
              <div>
              <p class="title-book">${book.title}</p>
                <p>Penulis : ${book.author}</p>
                <p>Tahun : ${book.year}</p>
              </div>
              <div class="option">
                <div class="option-two">
                <button class="selesei" onclick="isComplete(${book.id})">
                    Selesei
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="bi bi-journal-check"
                      viewBox="0 0 16 16"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10.854 6.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 8.793l2.646-2.647a.5.5 0 0 1 .708 0z"
                      />
                      <path
                        d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2z"
                      />
                      <path
                        d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1z"
                      />
                    </svg>
                  </button>
                <div class="row">
                  <button class="edit" onclick="showEditBook(${book.id})">
                  Edit
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                 </svg>
                    </button>
                    <button class="hapus" onclick="deleteBook(${book.id})">
                    Hapus
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-trash"
                    viewBox="0 0 16 16"
                    >
                    <path
                    d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"
                    />
                    <path
                    d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"
                    />
                    </svg>
                    </button>
                    </div>
                </div>
              </div>
            `;
      bookList.appendChild(bookItem);
    } else {
      const bookItem = document.createElement("div");
      bookItem.classList.add("list-book");
      bookItem.attributes.id = book.id;
      bookItem.innerHTML = `
              <div>
              <p class="title-book">${book.title}</p>
                <p>Penulis : ${book.author}</p>
                <p>Tahun : ${book.year}</p>
              </div>
              <div class="option">
                <div class="option-two">
                  <button class="kembalikan" onclick="isComplete(${book.id})">
                    Kembalikan
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-journal-arrow-up" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M8 11a.5.5 0 0 0 .5-.5V6.707l1.146 1.147a.5.5 0 0 0 .708-.708l-2-2a.5.5 0 0 0-.708 0l-2 2a.5.5 0 1 0 .708.708L7.5 6.707V10.5a.5.5 0 0 0 .5.5z"/>
                    <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2z"/>
                    <path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1z"/>
                    </svg>
                  </button>
                <div class="row">
                  <button class="edit" onclick="showEditBook(${book.id})">
                  Edit
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                 </svg>
                    </button>
                    <button class="hapus" onclick="deleteBook(${book.id})">
                    Hapus
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-trash"
                    viewBox="0 0 16 16"
                    >
                    <path
                    d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"
                    />
                    <path
                    d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"
                    />
                    </svg>
                    </button>
                    </div>
                </div>
              </div>
            `;
      bookList2.appendChild(bookItem);
    }
  });
}

function isComplete(id) {
  const index = books.findIndex((item) => item.id === id);
  books[index].isComplete = !books[index].isComplete;
  updateStorage();
  renderBook();
}

function deleteBook(id) {
  const dataBooks = books.filter((item) => item.id !== id);
  books = dataBooks;
  updateStorage();
  renderBook();
  refresh();
  dialogShow("Buku Berhasil dihapus", "#d80032");
}

function showEditBook(id) {
  const addBook = document.querySelector(".add-book");
  const titleInput = document.querySelector(".title-input");
  const authorInput = document.querySelector(".author-input");
  const yearInput = document.querySelector(".year-input");
  const isCompleteInput = document.querySelector(".check-input");

  const index = books.findIndex((item) => item.id === id);

  const book = books[index];
  titleInput.value = book.title || "";
  authorInput.value = book.author || "";
  yearInput.value = book.year || "";
  isCompleteInput.checked = book.isComplete || false;
  addBook.style.display = "flex";
  isEdit = [true, id];
  textForm.innerHTML = "Simpan Perubahan";
}

function editBook(id, book) {
  const updateBooks = books.filter((item) => item.id !== id);
  books = [...updateBooks, book];
  updateStorage();
  renderBook();
  refresh();
  dialogShow("Buku Berhasil diubah", "#f4e869");
}
