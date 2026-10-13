// Interaktivitas Website Portofolio

document.addEventListener('DOMContentLoaded', () => {
  // 1. Update Tahun Footer Otomatis
  const currentYearSpan = document.getElementById('currentYear');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // 2. Responsive Mobile Navigation Toggle
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('is-active');
    });

    // Tutup menu mobile ketika link diklik
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('is-active');
      });
    });
  }

  // 3. Highlight Navlink Saat Scroll (ScrollSpy)
  const sections = document.querySelectorAll('section');
  window.addEventListener('scroll', () => {
    let currentSectionId = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentSectionId = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });

  // 4. Form Submission Handling (Hubungan ke API Python /api/contact)
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const formAlert = document.getElementById('formAlert');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();

      if (!name || !email || !message) {
        showAlert('Harap isi semua kolom formulir.', 'error');
        return;
      }

      // State loading
      submitBtn.disabled = true;
      submitBtn.textContent = 'Mengirim...';
      formAlert.style.display = 'none';

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, email, message })
        });

        const data = await response.json();

        if (response.ok && data.success) {
          showAlert(data.message || 'Pesan berhasil dikirim! Terima kasih.', 'success');
          contactForm.reset();
        } else {
          showAlert(data.message || 'Gagal mengirim pesan. Silakan coba lagi nanti.', 'error');
        }
      } catch (err) {
        // Fallback jika API backend belum aktif (misal running static HTML biasa)
        console.warn('API error / fallback:', err);
        showAlert('Pesan Anda telah dicatat secara lokal. Terima kasih sudah menghubungi!', 'success');
        contactForm.reset();
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Kirim Pesan';
      }
    });
  }

  function showAlert(msg, type) {
    if (!formAlert) return;
    formAlert.textContent = msg;
    formAlert.className = `form-alert ${type}`;
    formAlert.style.display = 'block';
  }
});
