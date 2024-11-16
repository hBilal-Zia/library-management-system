// Initialize WebSocket connection and handle events
let socket = null
function initializeSocket(user, accessToken) {
  if (socket) {
    console.log('Reusing existing socket');
    return socket; // If socket is already initialized, return it
  }
    const socket = io('http://localhost:8080', {
      query: { userId: user.id, accessToken }
    });
  
    socket.on('connect', () => {
      console.log(`Connected to server with Socket ID: ${socket.id}`);
      const genres = user.Genres.map(genre => ({ id: genre.id, name: genre.name }));
      socket.emit('registerUser', user.id, genres);
    });
  
    // Listen for real-time updates on books
    socket.on('bookAdded', ({ bookId, title, genreId, genreName }) => {
      displayNotification(`Book Added in genre ${genreName}: ${title}`);
      if (window.location.pathname === '/home') {
        addBookToList(bookId, title, genreName);
      }
    });
  
    socket.on('bookUpdated', ({ bookId, title, genreId, genreName }) => {
      displayNotification(`Book Updated in genre ${genreName}: ${title}`);
      if (window.location.pathname === '/home') {
        console.log(window.location.pathname)
        updateBookInList(bookId, title, genreName);
      }
    });
  
    socket.on('bookDeleted', ({ bookId, title, genreId, genreName }) => {
      displayNotification(`Book Deleted in genre ${genreName}: ${title}`);
      if (window.location.pathname === '/home') {
        removeBookFromList(bookId);
      }
    });

    socket.on('bookAvailable', (data) => {
      // const { message } = data
      console.log(data.message)
      displayNotification(`${data.message}`);
    });
  
    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    socket.on('bookUnavailable', ({message, bookId}) => {
      const room = `book-${bookId}`;
      console.log(message); // Notify the user about the unavailability
      displayNotification(message)
  
      // Join the room to get updates about the book's availability
      socket.emit('joinRoom', room);
      console.log('room joined')
  });
  
    return socket;
  }
  
  // Function to display notifications
  function displayNotification(message) {
    console.log('displaying notification')
    const notificationBar = document.getElementById('notification-bar');
    notificationBar.style.display = 'block';
    notificationBar.textContent = message;
    setTimeout(() => {
      notificationBar.style.display = 'none';
    }, 5000);
  }
  
  // Functions to handle book updates (only for home page)
  function addBookToList(bookId, title, genreName) {
    const listItem = document.createElement('li');
    listItem.innerHTML = `<a href="/books/${bookId}">${title} (Genre: ${genreName})</a>`;
    document.getElementById('booksList').appendChild(listItem);
  }
  
  function updateBookInList(bookId, title, genreName) {
    const bookLink = document.querySelector(`#booksList a[href="/books/${bookId}"]`);
    if (bookLink) bookLink.textContent = `${title} (Genre: ${genreName})`;
  }
  
  function removeBookFromList(bookId) {
    const bookLink = document.querySelector(`#booksList a[href="/books/${bookId}"]`);
    if (bookLink) bookLink.parentElement.remove();
  }
  