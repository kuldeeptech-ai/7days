document.addEventListener('DOMContentLoaded', () => {
  // Preloader
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.style.opacity = '0';
      setTimeout(() => preloader.style.display = 'none', 500);
    }, 800);
  });

  // Navbar Scroll & Toggle
  const navbar = document.getElementById('navbar');
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('navbar-scrolled', window.scrollY > 50);
  });

  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    navToggle.innerHTML = navLinks.classList.contains('active') ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
  });

  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('active'));
  });

  // Scroll Reveal
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // Dynamic Year
  document.getElementById('year').textContent = new Date().getFullYear();

  // Toast System
  window.showToast = (message, type = 'info') => {
    const container = document.querySelector('.toast-container') || document.body;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);  };

  // Menu Data & Rendering
  const menuData = [
    { cat: 'noodles', name: 'Veg Noodles', price: '₹30 / ₹60', veg: true },
    { cat: 'noodles', name: 'Paneer Noodles', price: '₹50 / ₹100', veg: true },
    { cat: 'noodles', name: 'Chicken Noodles', price: '₹50 / ₹100', veg: false },
    { cat: 'noodles', name: 'Egg Noodles', price: '₹50 / ₹90', veg: false },
    { cat: 'noodles', name: 'Hakka Noodles', price: '₹35 / ₹70', veg: true },
    { cat: 'noodles', name: 'Sejwan Noodles', price: '₹35 / ₹70', veg: true },
    { cat: 'noodles', name: 'Chilli Garlic Noodles', price: '₹40 / ₹75', veg: true },
    { cat: 'burgers', name: 'Veg Burger', price: '₹25', veg: true },
    { cat: 'burgers', name: 'Paneer Burger', price: '₹40', veg: true },
    { cat: 'burgers', name: 'Cheese Burger', price: '₹40', veg: true },
    { cat: 'burgers', name: 'Double Cheese Burger', price: '₹60', veg: true },
    { cat: 'burgers', name: 'Chicken Burger', price: '₹50', veg: false },
    { cat: 'fries', name: 'Finger Chips', price: '₹20 / ₹40', veg: true },
    { cat: 'fries', name: 'Chilli Potato', price: '₹30 / ₹60', veg: true },
    { cat: 'fries', name: 'Honey Chilli Potato', price: '₹40 / ₹80', veg: true },
    { cat: 'fries', name: 'Chicken Fry', price: '₹80', veg: false },
    { cat: 'fries', name: 'Chicken Chilli', price: '₹80 / ₹155', veg: false },
    { cat: 'momos', name: 'Veg Momos', price: '₹30 / ₹50', veg: true },
    { cat: 'momos', name: 'Paneer Momos', price: '₹50 / ₹90', veg: true },
    { cat: 'momos', name: 'Fry Momos', price: '₹40 / ₹70', veg: true },
    { cat: 'momos', name: 'Chilli Momos', price: '₹45 / ₹85', veg: true },
    { cat: 'momos', name: 'Kurkure Momos', price: '₹50 / ₹90', veg: true },
    { cat: 'momos', name: 'Paneer Fry Momos', price: '₹55 / ₹100', veg: true },
    { cat: 'momos', name: 'Chicken Momos', price: '₹50 / ₹90', veg: false }
  ];

  const menuGrid = document.getElementById('menu-grid');
  if (menuGrid) {
    const renderMenu = (items) => {
      menuGrid.innerHTML = '';
      items.forEach((item, index) => {
        const imgQuery = `https://source.unsplash.com/600x400/?food,${item.name.replace(/ /g, ',')}`;
        // Fallback stable Unsplash links to prevent 404s in static env
        const fallbacks = [
          'https://images.unsplash.com/photo-1552611052-33e04de081de?w=600',
          'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600',
          'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=600',
          'https://images.unsplash.com/photo-1513639776629-7b89247b6251?w=600',
          'https://images.unsplash.com/photo-1541592106381-b31e9867c413?w=600'
        ];
        const bg = fallbacks[index % fallbacks.length];
        
        menuGrid.innerHTML += `
          <div class="menu-item glass" data-cat="${item.cat}">
            <div class="menu-img-wrap">
              <span class="badge-veg">${item.veg ? 'VEG' : 'NON-VEG'}</span>              <img src="${bg}" alt="${item.name}" loading="lazy">
            </div>
            <div class="menu-content">
              <h3>${item.name}</h3>
              <p class="menu-price">${item.price}</p>
              <button class="btn btn-primary full-width" style="margin-top:10px; font-size:0.9rem" onclick="orderItem('${item.name}')">Order via WhatsApp</button>
            </div>
          </div>`;
      });
    };
    renderMenu(menuData);

    // Filter & Search
    const filters = document.querySelectorAll('.filter-btn');
    const search = document.getElementById('menu-search');

    filters.forEach(btn => btn.addEventListener('click', () => {
      filters.forEach(f => f.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.cat;
      const filtered = cat === 'all' ? menuData : menuData.filter(i => i.cat === cat);
      renderMenu(filtered);
    }));

    search.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase();
      const filtered = menuData.filter(i => i.name.toLowerCase().includes(term));
      renderMenu(filtered);
      document.querySelector('.filter-btn.active').classList.remove('active');
      document.querySelector('[data-cat="all"]').classList.add('active');
    });
  }

  // Counter Animation (About Page)
  const counters = document.querySelectorAll('[data-target]');
  if (counters.length > 0) {
    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = +el.dataset.target;
          let current = 0;
          const inc = Math.ceil(target / 60);
          const timer = setInterval(() => {
            current += inc;
            if (current >= target) { current = target; clearInterval(timer); }
            el.textContent = current.toLocaleString() + (target < 20 ? '⭐' : '+');
          }, 20);
          countObserver.unobserve(el);
        }      });
    }, { threshold: 0.5 });
    counters.forEach(c => countObserver.observe(c));
  }

  // Contact Form
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Message sent successfully! We will reply shortly.', 'success');
      form.reset();
    });
  }

  // Global WhatsApp Order Helper
  window.orderItem = (itemName) => {
    const msg = `Hello! I'd like to order: ${itemName} from 7-DAY'S RESTAURANT.`;
    window.open(`https://wa.me/918052885895?text=${encodeURIComponent(msg)}`, '_blank');
  };
});
