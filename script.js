// document.addEventListener('DOMContentLoaded', () => {
//     // ================== DOM Elements ==================
//     const bookList = document.getElementById("bookList");
//     const bookmarkList = document.getElementById("bookmarkList");
//     const searchInput = document.getElementById("q");
//     const clearBtn = document.getElementById("clearBtn");
//     const stats = document.getElementById("stats");
//     const bookmarkStats = document.getElementById("bookmark-stats");
//     const loader = document.getElementById("loader");
//     const navToggle = document.getElementById("navToggle");
//     const mobileNavContainer = document.querySelector(".mobile-nav-container");
//     const mobileNavList = document.getElementById('navListMobile');
//     const toggleBtn = document.getElementById("toggle-btn");
//     const body = document.body;

//     // ================== App State ==================
//     let allBooks = [];
//     let userBookData = JSON.parse(localStorage.getItem("userBookData")) || {};
//     let statusChart;

//     // ================== Initial Load ==================
//     setTimeout(() => {
//         loader.style.opacity = "0";
//         setTimeout(() => (loader.style.display = "none"), 500);
//     }, 1500);

//     const savedTheme = localStorage.getItem("theme") || "dark";
//     body.classList.add(savedTheme);
//     updateThemeButton(savedTheme);

//     fetch("books.json")
//         .then((res) => res.json())
//         .then((data) => {
//             allBooks = data;
//             renderAll();
//         });

//     // ================== Rendering Functions ==================
//     function renderAll() {
//         const query = searchInput.value.toLowerCase();
//         const filteredBooks = filterBooks(query);
//         renderBooks(filteredBooks);
//         renderBookmarks();
//         renderDashboard();
//     }

//     function renderBooks(data) {
//         bookList.innerHTML = "";
//         stats.textContent = `Showing ${data.length} of ${allBooks.length} book(s)`;
//         data.forEach(book => bookList.appendChild(createBookCard(book)));
//     }

//     function renderBookmarks() {
//         bookmarkList.innerHTML = "";
//         const bookmarkedBooks = allBooks.filter(book => userBookData[book.id]?.status === 'bookmarked');

//         bookmarkStats.textContent = `You have ${bookmarkedBooks.length} book(s) on your list.`;
//         if (bookmarkedBooks.length > 0) {
//             bookmarkedBooks.forEach(book => bookmarkList.appendChild(createBookCard(book)));
//         }
//     }

//     function renderDashboard() {
//         const statuses = { bookmarked: 0, reading: 0, read: 0 };
//         Object.values(userBookData).forEach(data => {
//             if (statuses[data.status] !== undefined) {
//                 statuses[data.status]++;
//             }
//         });

//         document.getElementById('bookmarked-stat').textContent = statuses.bookmarked;
//         document.getElementById('reading-stat').textContent = statuses.reading;
//         document.getElementById('read-stat').textContent = statuses.read;

//         renderChart([statuses.bookmarked, statuses.reading, statuses.read]);
//     }

//     function createBookCard(book) {
//         const li = document.createElement("li");
//         li.className = "card";

//         const bookStatus = userBookData[book.id]?.status;

//         li.innerHTML = `
//             <div class="card-inner">
//                 <div class="card-front">
//                     <div class="card-content">
//                         <h3>${book.title}</h3>
//                         <p><strong>Author:</strong> ${book.author}</p>
//                         <p><strong>Year:</strong> ${book.year} | <strong>Rating:</strong> ${book.rating} ★</p>
//                         <div class="tags">${book.tags.map(tag => `<span class="tag">${tag}</span>`).join(" ")}</div>
//                     </div>
//                     <div class="book-actions">
//                         <button class="status-btn ${bookStatus === 'bookmarked' ? 'active' : ''}" data-id="${book.id}" data-status="bookmarked" title="Want to Read">
//                             <i class="fa-solid fa-bookmark"></i>
//                         </button>
//                         <button class="status-btn ${bookStatus === 'reading' ? 'active' : ''}" data-id="${book.id}" data-status="reading" title="Currently Reading">
//                             <i class="fa-solid fa-book-open"></i>
//                         </button>
//                         <button class="status-btn ${bookStatus === 'read' ? 'active' : ''}" data-id="${book.id}" data-status="read" title="Read">
//                             <i class="fa-solid fa-check"></i>
//                         </button>
//                     </div>
//                 </div>
//                 <div class="card-back">
//                     <h3>${book.title}</h3>
//                     <p>${book.description}</p>
//                 </div>
//             </div>
//         `;

//         const cardInner = li.querySelector('.card-inner');
//         cardInner.addEventListener('click', (event) => {
//             if (!event.target.closest('button')) {
//                 li.classList.toggle('is-flipped');
//             }
//         });

//         li.querySelectorAll('.status-btn').forEach(btn => {
//             btn.addEventListener('click', handleStatusUpdate);
//         });

//         return li;
//     }

//     function renderChart(data) {
//         const ctx = document.getElementById('statusChart').getContext('2d');
//         const chartData = {
//             labels: ['Want to Read', 'Reading', 'Read'],
//             datasets: [{
//                 data: data,
//                 backgroundColor: ['#38bdf8', '#facc15', '#2dd4bf'],
//                 borderColor: 'var(--card-bg)',
//                 borderWidth: 2,
//             }]
//         };
//         if (statusChart) {
//             statusChart.data = chartData;
//             statusChart.update();
//         } else {
//             statusChart = new Chart(ctx, {
//                 type: 'pie',
//                 data: chartData,
//                 options: {
//                     responsive: true,
//                     maintainAspectRatio: false, // ✨ IMPORTANT: Allows chart to fit in the container ✨
//                     plugins: {
//                         legend: {
//                             position: 'top',
//                             labels: {
//                                 color: 'var(--muted)',
//                                 boxWidth: 10,
//                                 font: { size: 10 }
//                              }
//                         }
//                     }
//                 }
//             });
//         }
//     }

//     // ================== Event Handlers & Logic ==================
//     function handleStatusUpdate(event) {
//         event.stopPropagation();
//         const btn = event.currentTarget;
//         const { id, status } = btn.dataset;

//         if (userBookData[id]?.status === status) {
//             delete userBookData[id];
//         } else {
//             userBookData[id] = { status: status };
//         }

//         localStorage.setItem("userBookData", JSON.stringify(userBookData));
//         renderAll();
//     }

//     function filterBooks(query) {
//         if (!query) return allBooks;
//         return allBooks.filter(book =>
//             book.title.toLowerCase().includes(query) ||
//             book.author.toLowerCase().includes(query) ||
//             book.tags.some(tag => tag.toLowerCase().includes(query))
//         );
//     }

//     function updateThemeButton(theme) {
//         toggleBtn.textContent = theme === "dark" ? "🌞" : "🌙";
//     }

//     // ================== Event Listeners ==================
//     searchInput.addEventListener("input", () => renderAll());
//     clearBtn.addEventListener("click", () => {
//         searchInput.value = "";
//         renderAll();
//     });

//     toggleBtn.addEventListener("click", () => {
//         const newTheme = body.classList.contains("dark") ? "light" : "dark";
//         body.classList.remove("dark", "light");
//         body.classList.add(newTheme);
//         localStorage.setItem("theme", newTheme);
//         updateThemeButton(newTheme);
//     });

//     navToggle.addEventListener('click', () => {
//         const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
//         navToggle.setAttribute('aria-expanded', !isExpanded);
//         mobileNavContainer.classList.toggle('open');
//     });

//     mobileNavList.addEventListener('click', () => {
//         navToggle.setAttribute('aria-expanded', 'false');
//         mobileNavContainer.classList.remove('open');
//     });

//     const sections = document.querySelectorAll('.content-section');
//     const observer = new IntersectionObserver((entries) => {
//         entries.forEach(entry => {
//             if (entry.isIntersecting) {
//                 entry.target.classList.add('visible');
//                 observer.unobserve(entry.target);
//             }
//         });
//     }, { threshold: 0.1 });
//     sections.forEach(section => observer.observe(section));
// });

document.addEventListener("DOMContentLoaded", () => {
  // ================== DOM Elements ==================
  const bookList = document.getElementById("bookList");
  const bookmarkList = document.getElementById("bookmarkList");
  const searchInput = document.getElementById("q");
  const clearBtn = document.getElementById("clearBtn");
  const stats = document.getElementById("stats");
  const bookmarkStats = document.getElementById("bookmark-stats");
  const loader = document.getElementById("loader");
  const navToggle = document.getElementById("navToggle");
  const mobileNavContainer = document.querySelector(".mobile-nav-container");
  const mobileNavList = document.getElementById("navListMobile");
  const toggleBtn = document.getElementById("toggle-btn");
  const ratingFilter = document.getElementById("ratingFilter");
  const toast = document.getElementById("toast");
  const body = document.body;

  // ================== App State ==================
  let allBooks = [];
  let userBookData = JSON.parse(localStorage.getItem("userBookData")) || {};
  let statusChart;

  // ================== Initial Load ==================
  setTimeout(() => {
    loader.style.opacity = "0";
    setTimeout(() => (loader.style.display = "none"), 500);
  }, 1500);

  const savedTheme = localStorage.getItem("theme") || "dark";
  body.classList.add(savedTheme);
  updateThemeButton(savedTheme);

  fetch("books.json")
    .then((res) => res.json())
    .then((data) => {
      allBooks = data;
      renderAll();
    });

  // ================== Rendering Functions ==================
  function renderAll() {
    const query = searchInput.value.toLowerCase();
    const ratingVal = parseFloat(ratingFilter.value);
    const filteredBooks = filterBooks(query, ratingVal);
    renderBooks(filteredBooks);
    renderBookmarks();
    renderDashboard();
  }

  function renderBooks(data) {
    bookList.innerHTML = "";
    stats.textContent = `Showing ${data.length} of ${allBooks.length} book(s)`;
    data.forEach((book) => bookList.appendChild(createBookCard(book)));
  }

  function renderBookmarks() {
    bookmarkList.innerHTML = "";
    const bookmarkedBooks = allBooks.filter(
      (book) => userBookData[book.id]?.status === "bookmarked"
    );
    bookmarkStats.textContent = `You have ${bookmarkedBooks.length} book(s) on your list.`;
    if (bookmarkedBooks.length > 0) {
      bookmarkedBooks.forEach((book) =>
        bookmarkList.appendChild(createBookCard(book))
      );
    }
  }

  function renderDashboard() {
    const statuses = { bookmarked: 0, reading: 0, read: 0 };
    Object.values(userBookData).forEach((data) => {
      if (statuses[data.status] !== undefined) {
        statuses[data.status]++;
      }
    });
    document.getElementById("bookmarked-stat").textContent =
      statuses.bookmarked;
    document.getElementById("reading-stat").textContent = statuses.reading;
    document.getElementById("read-stat").textContent = statuses.read;
    renderChart([statuses.bookmarked, statuses.reading, statuses.read]);
  }

  function createBookCard(book) {
    const li = document.createElement("li");
    li.className = "card";
    const bookStatus = userBookData[book.id]?.status;

    li.innerHTML = `
    <div class="card-inner">
      <div class="card-front">
        <div class="card-content">
          <h3>${book.title}</h3>
          <p><strong>Author:</strong> ${book.author}</p>
          <p><strong>Year:</strong> ${book.year}</p>
<div class="rating" title="Book Rating">
  <i class="fa-solid fa-star"></i> ${book.rating} <small>/5</small>
</div>

          <div class="tags">${book.tags
            .map((tag) => `<span class="tag">${tag}</span>`)
            .join(" ")}</div>
        </div>
        <div class="book-actions">
          <button class="status-btn ${
            bookStatus === "bookmarked" ? "active" : ""
          }" data-id="${book.id}" data-status="bookmarked" title="Want to Read">
            <i class="fa-solid fa-bookmark"></i>
          </button>
          <button class="status-btn ${
            bookStatus === "reading" ? "active" : ""
          }" data-id="${
      book.id
    }" data-status="reading" title="Currently Reading">
            <i class="fa-solid fa-book-open"></i>
          </button>
          <button class="status-btn ${
            bookStatus === "read" ? "active" : ""
          }" data-id="${book.id}" data-status="read" title="Read">
            <i class="fa-solid fa-check"></i>
          </button>
        </div>
      </div>
      <div class="card-back">
        <h3>${book.title}</h3>
        <p>${book.description || "No additional details available."}</p>
      </div>
    </div>
  `;

    const cardInner = li.querySelector(".card-inner");
    cardInner.addEventListener("click", (event) => {
      if (!event.target.closest("button")) {
        li.classList.toggle("is-flipped");
      }
    });

    li.querySelectorAll(".status-btn").forEach((btn) => {
      btn.addEventListener("click", handleStatusUpdate);
    });

    return li;
  }

  //   function createBookCard(book) {
  //     const li = document.createElement("li");
  //     li.className = "card";
  //     const bookStatus = userBookData[book.id]?.status;

  //     li.innerHTML = `
  //       <div class="card-inner">
  //         <div class="card-front">
  //           <div class="card-content">
  //             <h3>${book.title}</h3>
  //             <p><strong>Author:</strong> ${book.author}</p>
  //             <p><strong>Year:</strong> ${book.year} | <strong>Rating:</strong> ${book.rating} ★</p>
  //             <div class="tags">${book.tags.map(tag => `<span class="tag">${tag}</span>`).join(" ")}</div>
  //           </div>
  //           <div class="book-actions">
  //             <button class="status-btn ${bookStatus === 'bookmarked' ? 'active' : ''}" data-id="${book.id}" data-status="bookmarked" title="Want to Read">
  //               <i class="fa-solid fa-bookmark"></i>
  //             </button>
  //             <button class="status-btn ${bookStatus === 'reading' ? 'active' : ''}" data-id="${book.id}" data-status="reading" title="Currently Reading">
  //               <i class="fa-solid fa-book-open"></i>
  //             </button>
  //             <button class="status-btn ${bookStatus === 'read' ? 'active' : ''}" data-id="${book.id}" data-status="read" title="Read">
  //               <i class="fa-solid fa-check"></i>
  //             </button>
  //           </div>
  //         </div>
  //         <div class="card-back">
  //           <button class="back-btn"><i class="fa fa-arrow-left"></i> Back</button>
  //           <h3>${book.title}</h3>
  //           <p>${book.description || "No additional details available."}</p>
  //         </div>
  //       </div>
  //     `;

  //     const cardInner = li.querySelector('.card-inner');
  //     cardInner.addEventListener('click', (event) => {
  //       if (!event.target.closest('button')) {
  //         li.classList.toggle('is-flipped');
  //       }
  //     });

  //     li.querySelector('.back-btn').addEventListener('click', (e) => {
  //       e.stopPropagation();
  //       li.classList.remove('is-flipped');
  //     });

  //     li.querySelectorAll('.status-btn').forEach(btn => {
  //       btn.addEventListener('click', handleStatusUpdate);
  //     });

  //     return li;
  //   }

  // ================== Toast Function ==================
  function showToast(message, type = "info") {
    toast.textContent = message;
    toast.className = `show ${type}`;
    setTimeout(() => {
      toast.className = toast.className.replace("show", "").trim();
    }, 2000);
  }

  // ================== Chart ==================
  function renderChart(data) {
    const ctx = document.getElementById("statusChart").getContext("2d");
    const chartData = {
      labels: ["Want to Read", "Reading", "Read"],
      datasets: [
        {
          data: data,
          backgroundColor: ["#38bdf8", "#facc15", "#2dd4bf"],
          borderColor: "var(--card-bg)",
          borderWidth: 2,
        },
      ],
    };
    if (statusChart) {
      statusChart.data = chartData;
      statusChart.update();
    } else {
      statusChart = new Chart(ctx, {
        type: "pie",
        data: chartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "top",
              labels: {
                color: "var(--muted)",
                boxWidth: 10,
                font: { size: 10 },
              },
            },
          },
        },
      });
    }
  }

  // ================== Event Logic ==================
  function handleStatusUpdate(event) {
    event.stopPropagation();
    const btn = event.currentTarget;
    const { id, status } = btn.dataset;
    const book = allBooks.find((b) => b.id === id);

    if (userBookData[id]?.status === status) {
      showToast(
        `❌ Removed from ${
          status === "bookmarked" ? "Want to Read" : status
        } — ${book.title}`,
        "error"
      );
      delete userBookData[id];
    } else {
      userBookData[id] = { status: status };
      const actionLabel =
        status === "bookmarked"
          ? "Want to Read"
          : status.charAt(0).toUpperCase() + status.slice(1);
      showToast(`✅ Added to ${actionLabel} — ${book.title}`, "success");
    }

    localStorage.setItem("userBookData", JSON.stringify(userBookData));
    renderAll();
  }

  function filterBooks(query, minRating = 0) {
    return allBooks.filter((book) => {
      const matchesText =
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.tags.some((tag) => tag.toLowerCase().includes(query));
      const matchesRating = book.rating >= minRating;
      return matchesText && matchesRating;
    });
  }

  function updateThemeButton(theme) {
    toggleBtn.textContent = theme === "dark" ? "🌞" : "🌙";
  }

  // ================== Event Listeners ==================
  searchInput.addEventListener("input", renderAll);
  clearBtn.addEventListener("click", () => {
    searchInput.value = "";
    ratingFilter.value = "0";
    renderAll();
  });
  ratingFilter.addEventListener("change", renderAll);

  toggleBtn.addEventListener("click", () => {
    const newTheme = body.classList.contains("dark") ? "light" : "dark";
    body.classList.remove("dark", "light");
    body.classList.add(newTheme);
    localStorage.setItem("theme", newTheme);
    updateThemeButton(newTheme);
  });

  navToggle.addEventListener("click", () => {
    const isExpanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", !isExpanded);
    mobileNavContainer.classList.toggle("open");
  });

  mobileNavList.addEventListener("click", () => {
    navToggle.setAttribute("aria-expanded", "false");
    mobileNavContainer.classList.remove("open");
  });

  const sections = document.querySelectorAll(".content-section");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  sections.forEach((section) => observer.observe(section));
});
