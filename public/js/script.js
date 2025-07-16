// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })()



  // GST Toggle
document.getElementById("switchCheckDefault")?.addEventListener("click", () => {
  const infos = document.querySelectorAll(".tax-info");
  infos.forEach(info => {
    info.style.display = info.style.display === "inline" ? "none" : "inline";
  });
});

// Heart toggle
function toggleHeart(el) {
  const icon = el.querySelector("i");
  icon.classList.toggle("fa-solid");
  icon.classList.toggle("fa-regular");
  el.classList.toggle("active");
}



  function toggleHeart(element) {
    const listingId = element.closest('.listing-card').dataset.listingId; // Get the listing ID from the card
    const userId = '<%= currentUser._id %>'; // Assuming the current user is available on the frontend

    fetch(`/like/${listingId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userId}`, // Send userId as authorization (assuming JWT or session)
      },
    })
    .then(response => response.json())
    .then(data => {
      if (data.likes !== undefined) {
        // Update the like count and icon
        const likeIcon = element.querySelector('i');
        if (likeIcon.classList.contains('active')) {
          likeIcon.classList.remove('active');
        } else {
          likeIcon.classList.add('active');
        }

        // Optionally update the like count in the UI
        element.closest('.card-body').querySelector('.card-price').innerHTML = `₹${data.likes} Likes`; 
      }
    })
    .catch(error => {
      console.error('Error toggling like:', error);
    });
  }


  // cancelBooking
  // Form validation
  (function() {
    'use strict';
    const form = document.getElementById('cancelForm');
    
    form.addEventListener('submit', function(event) {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add('was-validated');
    }, false);
  })();


  // contact
  const form = document.getElementById('contactForm');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    form.classList.add('was-validated');

    if (!form.checkValidity()) return;

    const formData = {
      name: form.name.value,
      email: form.email.value,
      subject: form.subject.value,
      message: form.message.value,
    };

    try {
      const response = await fetch('/listings/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.success) {
        Swal.fire({
          icon: 'success',
          title: 'Message Sent!',
          text: result.message,
          confirmButtonColor: '#ff5a5f'
        });

        form.reset();
        form.classList.remove('was-validated');
      } else {
        throw new Error(result.message || 'Failed to send message.');
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err.message,
        confirmButtonColor: '#ff5a5f'
      });
    }
  });


  // help

  document.addEventListener("DOMContentLoaded", async () => {
    const input = document.querySelector('input[name="q"]');
    const datalist = document.getElementById("search-suggestions");

    try {
      const res = await fetch("/api/listing-terms");
      const terms = await res.json();
      terms.forEach(term => {
        const option = document.createElement("option");
        option.value = term;
        datalist.appendChild(option);
      });
    } catch (err) {
      console.error("Auto-suggestions failed:", err);
    }
  });

// index

  // Toggle tax info visibility
  document.getElementById("switchCheckDefault").addEventListener("change", function() {
    document.querySelectorAll(".tax-info").forEach(el => {
      el.style.display = this.checked ? "inline" : "none";
    });
  });

  // Toggle heart icon
  document.querySelectorAll(".heart-button").forEach(button => {
    button.addEventListener("click", function(e) {
      e.preventDefault();
      e.stopPropagation();
      const icon = this.querySelector("i");
      icon.classList.toggle("fa-regular");
      icon.classList.toggle("fa-solid");
      icon.classList.toggle("text-danger");
    });
  });

  // Filter category selection
  document.querySelectorAll(".filter").forEach(filter => {
    filter.addEventListener("click", function() {
      document.querySelectorAll(".filter").forEach(f => f.classList.remove("active"));
      this.classList.add("active");
      // Add your filter logic here
    });
  });


  // new
 
  // Enable Bootstrap form validation
  (function () {
    'use strict'
    window.addEventListener('load', function () {
      var forms = document.getElementsByClassName('needs-validation')
      Array.prototype.filter.call(forms, function (form) {
        form.addEventListener('submit', function (event) {
          if (form.checkValidity() === false) {
            event.preventDefault()
            event.stopPropagation()
          }
          form.classList.add('was-validated')
        }, false)
      })
    }, false)
  })();


  // login
    // Enable Bootstrap validation for the form
    (function () {
        'use strict'
        window.addEventListener('load', function () {
            var forms = document.getElementsByClassName('needs-validation')
            Array.prototype.filter.call(forms, function (form) {
                form.addEventListener('submit', function (event) {
                    if (form.checkValidity() === false) {
                        event.preventDefault()
                        event.stopPropagation()
                    }
                    form.classList.add('was-validated')
                }, false)
            })
        }, false)
    })()

// script



  // Form validation
  (function() {
    'use strict';
    const form = document.querySelector('.needs-validation');
    
    form.addEventListener('submit', function(event) {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add('was-validated');
    }, false);
  })();


  // script

  // Dark Mode Toggle with Emoji Change
  const darkModeToggle = document.getElementById('darkModeToggle');
  
  darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    darkModeToggle.textContent = isDarkMode ? '☀️' : '🌙';
  });

  // Initialize dark mode from localStorage
  if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    darkModeToggle.textContent = '☀️';
  }

  // Enhanced Form Validation
  document.getElementById('searchForm').addEventListener('submit', function(e) {
    const fields = this.querySelectorAll('[required]');
    let isValid = true;
    
    fields.forEach(field => {
      if (!field.value) {
        field.classList.add('is-invalid');
        isValid = false;
        
        // Add error icon
        const icon = field.previousElementSibling;
        if (icon && icon.classList.contains('position-absolute')) {
          icon.style.color = 'var(--travelnest-red)';
        }
      } else {
        field.classList.remove('is-invalid');
        // Reset icon color
        const icon = field.previousElementSibling;
        if (icon && icon.classList.contains('position-absolute')) {
          icon.style.color = '#999';
        }
      }
    });
    
    if (!isValid) {
      e.preventDefault();
      // Add shake animation to search bar
      this.classList.add('animate__animated', 'animate__headShake');
      setTimeout(() => {
        this.classList.remove('animate__animated', 'animate__headShake');
      }, 1000);
    }
  });

  // Add focus effects to search inputs
  const searchInputs = document.querySelectorAll('.search-bar input, .search-bar select');
  searchInputs.forEach(input => {
    input.addEventListener('focus', () => {
      const icon = input.previousElementSibling;
      if (icon && icon.classList.contains('position-absolute')) {
        icon.style.color = 'var(--travelnest-blue)';
      }
    });
    
    input.addEventListener('blur', () => {
      const icon = input.previousElementSibling;
      if (icon && icon.classList.contains('position-absolute')) {
        icon.style.color = '#999';
      }
    });
  });


  