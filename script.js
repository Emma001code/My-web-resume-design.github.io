// Wait until page fully loads before running scripts
document.addEventListener('DOMContentLoaded', () => {
// -------- TYPEWRITER EFFECT FOR HERO SECTION --------
  // Creates animated text entry effect for main heading
  const heroText = document.querySelector('.hero h1');
  const heroSubtext = document.querySelector('.hero p');
  const text = "Hi, I'm Emmanuel Ngwoke";
  let index = 0;

  function typeWriter() {
    if (index < text.length) {
       // Create each letter as separate span with gradient text
      const letter = document.createElement('span');
      letter.textContent = text.charAt(index);
      // Stagger animation delays for each character
      letter.style.animationDelay = `${index * 0.1}s`;
      // Add gradient text effect
      letter.style.background = 'linear-gradient(45deg, #FF6B35, #004E89)';
      letter.style.webkitBackgroundClip = 'text';
      letter.style.webkitTextFillColor = 'transparent';
      heroText.appendChild(letter);
      index++;
      // Recursive call for next character
      setTimeout(typeWriter, 100);
    } else {
      heroSubtext.style.opacity = '1';
    }
  }
  typeWriter();

 // -------- MOBILE MENU HANDLING --------
  const menuIcon = document.querySelector('.menu-icon');
  const navLinks = document.querySelector('.nav-links');
 // Toggle menu visibility
  function toggleMenu() {
    navLinks.classList.toggle('active');
  }

    // Mobile menu button click
  menuIcon.addEventListener('click', toggleMenu);

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-links') && !e.target.closest('.menu-icon')) {
      navLinks.classList.remove('active');
    }
  });

// Set active navigation link
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      document.querySelectorAll('.nav-links a').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      navLinks.classList.remove('active');
    });
  });

  // -------- SMOOTH SCROLLING --------
  // Handles all anchor links starting with '#'
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault(); // Stop default jump behavior
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'  // Align to top of viewport
        });
      }
    });
  });


  // -------- CONTACT FORM HANDLING --------
  const form = document.getElementById('contactForm');
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Stop default form submission
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;
    
    try {
       // Disable button during submission
      submitButton.disabled = true;
      submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

      // Prepare form data for submission
      const formData = new FormData(form);

      // Send to Formspree endpoint
      const response = await fetch(form.action, {
        method: 'POST',
        body: new URLSearchParams(formData),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      if (response.ok) {
           // Success handling
        showNotification('Message sent successfully!');
        form.reset();
      } else {
        // Handle server-side errors
        const errorData = await response.json();
        showNotification(errorData.error || 'Failed to send message', true);
      }
    } catch (error) {
      // Network errors
      console.error('Form submission error:', error);
      showNotification('Network error. Please try again.', true);
    } finally {
      // Reset button state
      submitButton.disabled = false;
      submitButton.innerHTML = originalButtonText;
    }
  });

  // -------- SCROLL ANIMATIONS --------
  // Animate elements when they enter viewport
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });  // Trigger when 10% visible

   // Watch all elements with animate-on-scroll class
  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
  });

  // -------- PROJECT CARD ANIMATIONS --------
  const projectsSection = document.getElementById('projects');
  const projectCards = document.querySelectorAll('.project-card');

// Special observer for staggered card animations
const projectObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
      if (entry.isIntersecting) {
         // Add each card's animation with staggered delay
          projectCards.forEach((card, index) => {
              setTimeout(() => {
                  card.classList.add('active');
              }, index * 300);
          });
      }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
});

// Start watching projects section
  projectObserver.observe(projectsSection);

  // Trigger animations when navigating via nav button
  document.querySelectorAll('.nav-links a[href="#projects"]').forEach(link => {
    link.addEventListener('click', () => {
      setTimeout(() => {
        projectCards.forEach((card, index) => {
          setTimeout(() => {
            card.classList.add('active');
          }, index * 300);
        });
      }, 1000); // 1 second delay
    });
  });
});

// -------- NOTIFICATION SYSTEM --------
// Shows temporary messages at bottom-right
function showNotification(message, isError = false) {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  // Set color based on error state
  notification.style.backgroundColor = isError ? '#ff4444' : '#FF6B35';
  
   // Add to page
  document.body.appendChild(notification);
  
  // Animation timing
  setTimeout(() => notification.classList.add('show'), 10);
   // Auto-remove after 3 seconds
  setTimeout(() => {
    notification.classList.remove('show');
     // Wait for fade-out before removing
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}


