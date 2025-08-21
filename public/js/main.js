class WebSocketManager {
  constructor() {
    this.socket = null; // Placeholder for the socket instance
  }

  // Method to initialize the socket
  initialize(user, accessToken) {
    if (this.socket) {
      console.log('Reusing existing socket');
      return this.socket;
    }

    // Initialize socket instance
    this.socket = io('http://localhost:8080', {
      query: { userId: user.id, accessToken }
    });

    this.setupEventHandlers(user);

    return this.socket;
  }

  // Set up event handlers
  setupEventHandlers(user) {
    this.socket.on('connect', () => {
      console.log(`Connected to server with Socket ID: ${this.socket.id}`);
      console.log(user.Genres)
      const genres = user.Genres.map(genre => ({ id: genre.id, name: genre.name }));
      this.socket.emit('registerUser', user.id, genres);
    });

    this.socket.on('bookAdded', ({ bookId, title, genreId, genreName }) => {
      this.displayNotification(`Book Added in genre ${genreName}: ${title}`);
      if (window.location.pathname === '/home') {
        this.addBookToList(bookId, title, genreName);
      }
    });

    this.socket.on('bookUpdated', ({ bookId, title, genreId, genreName }) => {
      this.displayNotification(`Book Updated in genre ${genreName}: ${title}`);
      if (window.location.pathname === '/home') {
        this.updateBookInList(bookId, title, genreName);
      }
    });

    this.socket.on('bookDeleted', ({ bookId, title, genreId, genreName }) => {
      this.displayNotification(`Book Deleted in genre ${genreName}: ${title}`);
      if (window.location.pathname === '/home') {
        this.removeBookFromList(bookId);
      }
    });

    this.socket.on('bookAvailable', (data) => {
      console.log(data.message);
      this.displayNotification(data.message);
    });

    this.socket.on('bookUnavailable', ({ message, bookId }) => {
      console.log(message);
      this.displayNotification(message);
      this.socket.emit('joinRoom', `book-${bookId}`);
      console.log('Room joined');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });
  }

  // Utility functions
  displayNotification(message) {
    console.log('Displaying notification');
    const notificationBar = document.getElementById('notification-bar');
    notificationBar.style.display = 'block';
    notificationBar.textContent = message;
    setTimeout(() => {
      notificationBar.style.display = 'none';
    }, 5000);
  }

  addBookToList(bookId, title, genreName) {
    const listItem = document.createElement('li');
    listItem.innerHTML = `<a href="/books/${bookId}">${title} (Genre: ${genreName})</a>`;
    document.getElementById('booksList').appendChild(listItem);
  }

  updateBookInList(bookId, title, genreName) {
    const bookLink = document.querySelector(`#booksList a[href="/books/${bookId}"]`);
    if (bookLink) bookLink.textContent = `${title} (Genre: ${genreName})`;
  }

  removeBookFromList(bookId) {
    const bookLink = document.querySelector(`#booksList a[href="/books/${bookId}"]`);
    if (bookLink) bookLink.parentElement.remove();
  }
}
