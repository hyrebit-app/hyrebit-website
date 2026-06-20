/* ==========================================
   HYREBIT WEB INTERACTIVITY ENGINE (app.js)
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // -------------------------------------------------------------
  // 1. MOBILE NAVIGATION TOGGLE
  // -------------------------------------------------------------
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIconOpen = document.getElementById('menu-icon-open');
  const menuIconClose = document.getElementById('menu-icon-close');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
      mobileMenu.classList.toggle('flex');
      
      // Toggle hamburger and close icons
      if (menuIconOpen && menuIconClose) {
        menuIconOpen.classList.toggle('hidden');
        menuIconClose.classList.toggle('hidden');
      }
    });

    // Close menu when clicking nav link
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        mobileMenu.classList.remove('flex');
        if (menuIconOpen && menuIconClose) {
          menuIconOpen.classList.remove('hidden');
          menuIconClose.classList.add('hidden');
        }
      });
    });
  }

  // -------------------------------------------------------------
  // 2. ROLE SELECTOR SWITCHER (Looking for Jobs vs Workers)
  // -------------------------------------------------------------
  const tabJobs = document.getElementById('tab-seeker');
  const tabWorkers = document.getElementById('tab-employer');
  const seekerContent = document.getElementById('seeker-view');
  const employerContent = document.getElementById('employer-view');

  if (tabJobs && tabWorkers && seekerContent && employerContent) {
    // Switch to Job Seeker View
    tabJobs.addEventListener('click', () => {
      // Button Styles
      tabJobs.className = 'flex-1 py-3 px-6 text-sm font-semibold rounded-xl transition-all duration-300 role-tab-active-purple';
      tabWorkers.className = 'flex-1 py-3 px-6 text-sm font-medium text-gray-500 rounded-xl transition-all duration-300 hover:text-gray-900';
      
      // Content Transitions
      seekerContent.classList.remove('hidden');
      seekerContent.classList.add('grid');
      employerContent.classList.add('hidden');
      employerContent.classList.remove('grid');
    });

    // Switch to Employer View
    tabWorkers.addEventListener('click', () => {
      // Button Styles
      tabJobs.className = 'flex-1 py-3 px-6 text-sm font-medium text-gray-500 rounded-xl transition-all duration-300 hover:text-gray-900';
      tabWorkers.className = 'flex-1 py-3 px-6 text-sm font-semibold rounded-xl transition-all duration-300 role-tab-active-green';
      
      // Content Transitions
      seekerContent.classList.add('hidden');
      seekerContent.classList.remove('grid');
      employerContent.classList.remove('hidden');
      employerContent.classList.add('grid');
    });
  }

  // -------------------------------------------------------------
  // 3. JOB FEED PREVIEW: SEARCH TAG FILTERING & QUICK APPLY
  // -------------------------------------------------------------
  const jobTags = document.querySelectorAll('.job-filter-tag');
  const jobCards = document.querySelectorAll('.job-feed-card');
  const searchInput = document.getElementById('job-search-input');

  // Tag Filtering
  jobTags.forEach(tag => {
    tag.addEventListener('click', () => {
      // Set active styles
      jobTags.forEach(t => {
        t.classList.remove('bg-purple-600', 'text-white');
        t.classList.add('bg-white', 'text-gray-600', 'border', 'border-gray-200');
      });
      tag.classList.remove('bg-white', 'text-gray-600', 'border', 'border-gray-200');
      tag.classList.add('bg-purple-600', 'text-white');

      const filterValue = tag.getAttribute('data-filter');
      filterJobCards(filterValue, searchInput ? searchInput.value : '');
    });
  });

  // Search input typing filter
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const activeTag = document.querySelector('.job-filter-tag.bg-purple-600');
      const filterValue = activeTag ? activeTag.getAttribute('data-filter') : 'all';
      filterJobCards(filterValue, e.target.value);
    });
  }

  function filterJobCards(category, textQuery) {
    textQuery = textQuery.toLowerCase().trim();
    
    jobCards.forEach(card => {
      const cardTitle = card.querySelector('.job-card-title').textContent.toLowerCase();
      const cardCompany = card.querySelector('.job-card-company').textContent.toLowerCase();
      const cardTags = Array.from(card.querySelectorAll('.job-card-tag')).map(t => t.textContent.toLowerCase());
      
      const matchesCategory = (category === 'all' || cardTags.some(tagText => tagText.includes(category.toLowerCase())));
      const matchesSearch = (cardTitle.includes(textQuery) || cardCompany.includes(textQuery));

      if (matchesCategory && matchesSearch) {
        card.classList.remove('hidden');
        card.classList.add('flex');
      } else {
        card.classList.add('hidden');
        card.classList.remove('flex');
      }
    });
  }

  // Quick Apply click event & Toast notification
  const quickApplyBtns = document.querySelectorAll('.btn-quick-apply');
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-message');
  let toastTimeout;

  quickApplyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const isApplied = btn.getAttribute('data-applied') === 'true';
      const card = btn.closest('.job-feed-card');
      const jobTitle = card.querySelector('.job-card-title').textContent;
      const company = card.querySelector('.job-card-company').textContent;

      if (!isApplied) {
        // Mark as Applied
        btn.setAttribute('data-applied', 'true');
        btn.innerHTML = 'Applied <i data-lucide="check-circle" class="w-4 h-4 ml-1"></i>';
        btn.classList.remove('bg-purple-600', 'hover:bg-purple-700', 'text-white');
        btn.classList.add('bg-green-50', 'text-green-600', 'border', 'border-green-200', 'cursor-default');
        
        // Refresh icons inside buttons
        if (typeof lucide !== 'undefined') {
          lucide.createIcons();
        }

        // Show success toast
        showToast(`⚡ Application sent to <b>${company}</b> for the <b>${jobTitle}</b> role!`);
      }
    });
  });

  function showToast(htmlMessage) {
    if (toast && toastMsg) {
      clearTimeout(toastTimeout);
      toastMsg.innerHTML = htmlMessage;
      toast.classList.add('show');

      // Hide after 3.5 seconds
      toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
      }, 3500);
    }
  }

  // -------------------------------------------------------------
  // 4. TESTIMONIALS SLIDER
  // -------------------------------------------------------------
  const testimonials = document.querySelectorAll('.testimonial-slide');
  const prevBtn = document.getElementById('testimonial-prev');
  const nextBtn = document.getElementById('testimonial-next');
  const dotsContainer = document.getElementById('testimonial-dots');
  let currentSlide = 0;
  let autoSlideInterval;

  if (testimonials.length > 0) {
    // Generate navigation dots
    if (dotsContainer) {
      dotsContainer.innerHTML = ''; // Clear fallback
      testimonials.forEach((_, idx) => {
        const dot = document.createElement('button');
        dot.className = `w-2.5 h-2.5 rounded-full transition-all duration-300 ${idx === 0 ? 'bg-purple-600 w-6' : 'bg-gray-300'}`;
        dot.setAttribute('aria-label', `Go to testimonial slide ${idx + 1}`);
        dot.addEventListener('click', () => {
          goToSlide(idx);
          resetAutoSlide();
        });
        dotsContainer.appendChild(dot);
      });
    }

    function goToSlide(index) {
      testimonials[currentSlide].classList.add('hidden');
      testimonials[currentSlide].classList.remove('flex');
      
      currentSlide = (index + testimonials.length) % testimonials.length;
      
      testimonials[currentSlide].classList.remove('hidden');
      testimonials[currentSlide].classList.add('flex');

      // Update dots
      if (dotsContainer) {
        const dots = dotsContainer.querySelectorAll('button');
        dots.forEach((dot, idx) => {
          if (idx === currentSlide) {
            dot.className = 'w-2.5 h-2.5 rounded-full transition-all duration-300 bg-purple-600 w-6';
          } else {
            dot.className = 'w-2.5 h-2.5 rounded-full transition-all duration-300 bg-gray-300';
          }
        });
      }
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        goToSlide(currentSlide - 1);
        resetAutoSlide();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        goToSlide(currentSlide + 1);
        resetAutoSlide();
      });
    }

    // Auto-sliding functionality
    function startAutoSlide() {
      autoSlideInterval = setInterval(() => {
        goToSlide(currentSlide + 1);
      }, 6000); // 6 seconds per testimonial
    }

    function resetAutoSlide() {
      clearInterval(autoSlideInterval);
      startAutoSlide();
    }

    startAutoSlide();

    // Pause on hover
    const testimonialsSection = document.getElementById('testimonials');
    if (testimonialsSection) {
      testimonialsSection.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
      testimonialsSection.addEventListener('mouseleave', startAutoSlide);
    }
  }

  // -------------------------------------------------------------
  // 5. SMOOTH SCROLL FOR NAV LINKS
  // -------------------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 80; // Offset for sticky navbar
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
});
