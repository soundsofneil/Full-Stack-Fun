/* E2 Library - JS */

/*-----------------------------------------------------------*/
/* Starter code - DO NOT edit the code below. */
/*-----------------------------------------------------------*/

// global counts
let numberOfBooks = 0; // total number of books
let numberOfPatrons = 0; // total number of patrons

// global arrays
const libraryBooks = [] // Array of books owned by the library (whether they are loaned or not)
const patrons = [] // Array of library patrons.

// Book 'class'
class Book {
	constructor(title, author, genre) {
		this.title = title;
		this.author = author;
		this.genre = genre;
		this.patron = null; // will be the patron objet

		// set book ID
		this.bookId = numberOfBooks;
		numberOfBooks++;
	}

	setLoanTime() {
		// Create a setTimeout that waits 3 seconds before indicating a book is overdue

		const self = this; // keep book in scope of anon function (why? the call-site for 'this' in the anon function is the DOM window)
		setTimeout(function() {

			console.log('overdue book!', self.title)
			changeToOverdue(self);

		}, 3000)

	}
}

// Patron constructor
const Patron = function(name) {
	this.name = name;
	this.cardNumber = numberOfPatrons;

	numberOfPatrons++;
}


// Adding these books does not change the DOM - we are simply setting up the
// book and patron arrays as they appear initially in the DOM.
libraryBooks.push(new Book('Harry Potter', 'J.K. Rowling', 'Fantasy'));
libraryBooks.push(new Book('1984', 'G. Orwell', 'Dystopian Fiction'));
libraryBooks.push(new Book('A Brief History of Time', 'S. Hawking', 'Cosmology'));

patrons.push(new Patron('Jim John'))
patrons.push(new Patron('Kelly Jones'))

// Patron 0 loans book 0
libraryBooks[0].patron = patrons[0]
// Set the overdue timeout
libraryBooks[0].setLoanTime()  // check console to see a log after 3 seconds


/* Select all DOM form elements you'll need. */
const bookAddForm = document.querySelector('#bookAddForm');
const bookInfoForm = document.querySelector('#bookInfoForm');
const bookLoanForm = document.querySelector('#bookLoanForm');
const patronAddForm = document.querySelector('#patronAddForm');

/* bookTable element */
const bookTable = document.querySelector('#bookTable')
/* bookInfo element */
const bookInfo = document.querySelector('#bookInfo')
/* Full patrons entries element */
const patronEntries = document.querySelector('#patrons')

/* Event listeners for button submit and button click */

bookAddForm.addEventListener('submit', addNewBookToBookList);
bookLoanForm.addEventListener('submit', loanBookToPatron);
patronAddForm.addEventListener('submit', addNewPatron)
bookInfoForm.addEventListener('submit', getBookInfo);

/* Listen for click patron entries - will have to check if it is a return button in returnBookToLibrary */
patronEntries.addEventListener('click', returnBookToLibrary)

/*-----------------------------------------------------------*/
/* End of starter code - do *not* edit the code above. */
/*-----------------------------------------------------------*/


/** ADD your code to the functions below. DO NOT change the function signatures. **/


/*** Functions that don't edit DOM themselves, but can call DOM functions
     Use the book and patron arrays appropriately in these functions.
 ***/

// Adds a new book to the global book list and calls addBookToLibraryTable()
function addNewBookToBookList(e) {
	e.preventDefault();

	// Add book book to global array
	let addBookInputArray = e.target.elements;
	let newBook = new Book(addBookInputArray[0].value, addBookInputArray[1].value, addBookInputArray[2].value);
	libraryBooks.push(newBook);

	// Call addBookToLibraryTable properly to add book to the DOM
	addBookToLibraryTable(newBook);
}

// Changes book patron information, and calls
function loanBookToPatron(e) {
	e.preventDefault();

	// Get correct book and patron
	let loanBookIdInputArray = e.target.elements;
	let loanBook = libraryBooks[loanBookIdInputArray[0].value];
	let loanPatron = patrons[loanBookIdInputArray[1].value];

	// Add patron to the book's patron property
	loanBook.patron = loanPatron;


	// Add book to the patron's book table in the DOM by calling addBookToPatronLoans()
	addBookToPatronLoans(loanBook);

	// Start the book loan timer.
	loanBook.setLoanTime();
}
// Changes book patron information and calls returnBookToLibraryTable()
function returnBookToLibrary(e){
	e.preventDefault();
	// check if return button was clicked, otherwise do nothing.
	if (e.target.innerHTML == "return")
	{

	// Call removeBookFromPatronTable()
	let bookID = e.target.parentElement.parentElement.children[0].innerHTML.trim();
	let returnBook = libraryBooks[bookID]
	removeBookFromPatronTable(returnBook);

	// Change the book object to have a patron of 'null'
	returnBook.patron = null;
	}
}

// Creates and adds a new patron
function addNewPatron(e) {
	e.preventDefault();

	// Add a new patron to global array
	let addPatronInput = e.target.elements;
	let newPatron = new Patron(addPatronInput[0].value);
	patrons.push(newPatron);

	// Call addNewPatronEntry() to add patron to the DOM
	addNewPatronEntry(newPatron);

}

// Gets book info and then displays
function getBookInfo(e) {
	e.preventDefault();

	// Get correct book
	let getBookInput = e.target.elements;
	let bookToGet = libraryBooks[getBookInput.bookInfoId.value];
	// Call displayBookInfo()
	displayBookInfo(bookToGet);

}


/*-----------------------------------------------------------*/
/*** DOM functions below - use these to create and edit DOM objects ***/

// Adds a book to the library table.
function addBookToLibraryTable(book) {
	// Add code here
	let newRow = bookTable.insertRow(bookTable.rows.length);
	let bookIDCell = newRow.insertCell(0);
 	let titleCell = newRow.insertCell(1);
	let patronCell = newRow.insertCell(2);

	bookIDCell.innerHTML = book.bookId;
	titleCell.innerHTML = '<strong> ' + book.title + '</strong>';
	patronCell.innerHTML = book.patron;
}


// Displays deatiled info on the book in the Book Info Section
function displayBookInfo(book) {
	// Add code here
		bookInfo.children[0].children[0].innerText = book.bookId;
		bookInfo.children[1].children[0].innerText = book.title;
		bookInfo.children[2].children[0].innerText = book.author;
		bookInfo.children[3].children[0].innerText = book.genre;
		if (book.patron == null)
		{
			bookInfo.children[4].children[0].innerText = 'N/A';
		}
		else {
			bookInfo.children[4].children[0].innerText = book.patron.name;
		}

}

// Adds a book to a patron's book list with a status of 'Within due date'.
// (don't forget to add a 'return' button).
function addBookToPatronLoans(book) {
	// Add code here

	//Update List of Books table
	bookTable.rows[book.bookId+1].cells[2].innerHTML = book.patron.cardNumber;

	//Update Patron's book list
	let patronBookSection = document.createElement("tr");
	let bookIDNumber = document.createElement("td");
	bookIDNumber.innerHTML = book.bookId;
	let bookTitle = document.createElement("td");
	bookTitle.innerHTML = "<strong>" + book.title + "</strong>";
	let bookStatus = document.createElement("td");
	bookStatus.innerHTML = '<span class="green">Within due date</span>';
	let returnBook = document.createElement("td");
	let returnButton = document.createElement("button");
	returnButton.classList.add("return");
	returnButton.innerHTML = "return";
	returnBook.appendChild(returnButton);

	patronBookSection.appendChild(bookIDNumber);
	patronBookSection.appendChild(bookTitle);
	patronBookSection.appendChild(bookStatus);
	patronBookSection.appendChild(returnBook);

	let patronTable = patronEntries.children[book.patron.cardNumber];
	let patronTableBody = patronTable.children[3].firstElementChild;

	patronTableBody.appendChild(patronBookSection);

}

// Adds a new patron with no books in their table to the DOM, including name, card number,
// and blank book list (with only the <th> headers: BookID, Title, Status).
function addNewPatronEntry(patron) {
	// Add code here
	let newPatronNode = document.createElement("div");
	newPatronNode.classList.add("patron");
	let nameSection = document.createElement("p");
	nameSection.innerHTML = 'Name: <span class="bold"> ' + patron.name + '</span>';
	let cardSection = document.createElement("p");
	cardSection.innerHTML = 'Card Number: <span class="bold"> ' + patron.cardNumber + '</span>';
	let booksSection = document.createElement("h4");
	booksSection.innerHTML = 'Books on loan:';
	newPatronNode.appendChild(nameSection);
	newPatronNode.appendChild(cardSection);
	newPatronNode.appendChild(booksSection);

	let tableNode = document.createElement("table");
	tableNode.classList.add("patronsLoanTable");
	let tableBody = document.createElement("tbody");
	let tableHeaderSection = document.createElement("tr");
	let bookIDHeader = document.createElement("th");
	bookIDHeader.innerHTML = 'BookID';
	let titleHeader = document.createElement("th");
	titleHeader.innerHTML = 'Title';
	let statusHeader = document.createElement("th");
	statusHeader.innerHTML = 'Status';
	let returnHeader = document.createElement("th");
	returnHeader.innerHTML = 'Return';
	tableHeaderSection.appendChild(bookIDHeader);
	tableHeaderSection.appendChild(titleHeader);
	tableHeaderSection.appendChild(statusHeader);
	tableHeaderSection.appendChild(returnHeader);
	tableBody.appendChild(tableHeaderSection);

	tableNode.appendChild(tableBody);


	newPatronNode.appendChild(tableNode);
	patronEntries.appendChild(newPatronNode);
}


// Removes book from patron's book table and remove patron card number from library book table
function removeBookFromPatronTable(book) {
	// Add code here
	//Remove from patron's book table
	let patronTable = patronEntries.children[book.patron.cardNumber];
	let patronTableBookInfo = patronTable.children[3].firstElementChild;
	let patronBookToRemove = patronTableBookInfo.lastElementChild;
	patronTableBookInfo.removeChild(patronBookToRemove);

	//Remove patron card number from library book table
	bookTable.rows[book.bookId+1].cells[2].innerHTML = null;
}

// Set status to red 'Overdue' in the book's patron's book table.
function changeToOverdue(book) {
	// Add code here
	let patronTable = patronEntries.children[book.patron.cardNumber];
	let patronTableBookInfo = patronTable.children[3].firstElementChild.lastElementChild;
	patronTableBookInfo.children[2].innerHTML = "<span class='red'>Overdue</span>";

}
