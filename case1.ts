function handleClick (event) {

  // Make sure clicked element has the .save-data class
  if (event.target.matches('.save-data')) {

    // Get the value of the [data-id] attribute
    let id = event.target.getAttribute('data-id');

    // Make sure there's an ID
    if (id) {

      // Get the user token from localStorage
      let token = localStorage.getItem('token');

      // Make sure there's a token
      if (token) {

        // Save the ID to localStorage
        localStorage.setItem(`${token}_${id}`, true);

      }

    }

  }

}