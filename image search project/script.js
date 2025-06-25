 // DOM Elements
 const unsplashAccessKey = "lJNvj-GuGvL97q-D11jJjekJpsugAO2nO838fdiv-Qo";
 const pexelsAccessKey = "xe4J8CZyyOBSNZLECOHc8RUrStksWlg3D31udUYMZpWaX0RsZdvGDVH9";

 const heroSection = document.getElementById("hero-section");
 const contentSection = document.getElementById("content-section");
 const detailPage = document.getElementById("detail-page");
 const footer = document.getElementById("footer");
 const searchForm = document.getElementById("search-form");
 const searchBox = document.getElementById("search-box");
 const searchResult = document.getElementById("search-result");
 const showMoreBtn = document.getElementById("show-more-btn");
 const pageTitle = document.getElementById("page-title");
 const homeLink = document.getElementById("home-link");
 const photosLink = document.getElementById("photos-link");
 const videosLink = document.getElementById("videos-link");
 const heroPhotosLink = document.getElementById("hero-photos-link");
 const heroVideosLink = document.getElementById("hero-videos-link");
 const profileBtn = document.getElementById("profile-btn");
 const profileMenu = document.getElementById("profile-menu");
 const profileIcon = document.getElementById("profile-icon");
 const loginLink = document.getElementById("login-link");
 const logoutLink = document.getElementById("logout-link");
 const loginModal = document.getElementById("login-modal");
 const closeModal = document.getElementById("close-modal");
 const loginBtn = document.getElementById("login-btn");
 const hamburger = document.getElementById("hamburger");
 const navLinks = document.querySelector('.nav-links');
 const loginStatus = document.getElementById("login-status");
 const usernameInput = document.getElementById("username");
 const passwordInput = document.getElementById("password");

 // Detail page elements
 const detailImage = document.getElementById("detail-image");
 const detailVideo = document.getElementById("detail-video");
 const detailTitle = document.getElementById("detail-title");
 const detailDescription = document.getElementById("detail-description");
 const detailAuthor = document.getElementById("detail-author");
 const detailDate = document.getElementById("detail-date");
 const detailDownloads = document.getElementById("detail-downloads");
 const downloadBtn = document.getElementById("download-btn");
 const backBtn = document.getElementById("back-btn");

 // State variables
 let keyword = '';
 let page = 1;
 let isLoggedIn = false;
 let currentSection = 'home'; // 'home', 'photos', or 'videos'
 let currentMediaType = ''; // 'photo' or 'video'
 let currentMediaItem = null;
 let heroBackgroundInterval;

 // Hero background configuration
 const heroBackgrounds = [
   { type: 'unsplash', url: 'https://source.unsplash.com/random/1600x900/?nature,water' },
   { type: 'unsplash', url: 'https://source.unsplash.com/random/1600x900/?city,night' },
   { type: 'pexels', id: '3408744' },  // Pexels photo ID
   { type: 'pexels', id: '15286' },    // Pexels photo ID
   { type: 'pexels', id: '417074' }    // Pexels photo ID
 ];
 let currentHeroBgIndex = 0;

 // Initialize the page
 function init() {
   checkLogin();
   updatePageContent();
   setupEventListeners();
   startHeroBackgroundRotation();
 }

 // Rotate hero background images with fallback to Pexels when Unsplash fails
 function startHeroBackgroundRotation() {
   // Set initial background
   loadNextBackground();

   // Rotate every 5 seconds
   heroBackgroundInterval = setInterval(loadNextBackground, 5000);
 }

 // Function to load the next background
 function loadNextBackground() {
   currentHeroBgIndex = (currentHeroBgIndex + 1) % heroBackgrounds.length;
   const bg = heroBackgrounds[currentHeroBgIndex];

   if (bg.type === 'unsplash') {
     loadUnsplashBackground(bg.url).catch(() => {
       // If Unsplash fails, try Pexels fallback
       loadPexelsBackground(getRandomPexelsFallback());
     });
   } else {
     loadPexelsBackground(bg.id);
   }
 }

 // Function to load Unsplash background
 function loadUnsplashBackground(url) {
   return new Promise((resolve, reject) => {
     const img = new Image();
     img.src = url;
     img.onload = () => {
       setHeroBackground(url);
       resolve();
     };
     img.onerror = () => reject();
   });
 }

 // Function to load Pexels background
 function loadPexelsBackground(photoId) {
   fetch(`https://api.pexels.com/v1/photos/${photoId}`, {
     headers: {
       'Authorization': pexelsAccessKey
     }
   })
     .then(response => response.json())
     .then(data => {
       const imageUrl = data.src.large2x || data.src.large;
       setHeroBackground(imageUrl);
     })
     .catch(error => {
       console.error("Failed to load Pexels image:", error);
       // Fallback to a default image
       setHeroBackground('https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg');
     });
 }

 // Helper function to get a random Pexels fallback
 function getRandomPexelsFallback() {
   const pexelsIds = heroBackgrounds
     .filter(bg => bg.type === 'pexels')
     .map(bg => bg.id);

   return pexelsIds[Math.floor(Math.random() * pexelsIds.length)];
 }

 // Helper function to set hero background with fade effect
 function setHeroBackground(url) {
   heroSection.style.opacity = 0;
   setTimeout(() => {
     heroSection.style.backgroundImage = `url(${url})`;
     heroSection.style.opacity = 1;
   }, 500);
 }

 // Check if user is logged in
 function checkLogin() {
   const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
   if (loggedIn) {
     isLoggedIn = true;
     updateProfileButton();
   } else {
     setTimeout(() => {
       loginModal.style.display = 'flex';
     }, 1000);
   }
 }

 // Update profile button based on login status
 function updateProfileButton() {
   if (isLoggedIn) {
     profileIcon.className = 'fas fa-check';
     profileBtn.title = 'You are logged in';
     loginLink.style.display = 'none';
     logoutLink.style.display = 'block';
   } else {
     profileIcon.className = 'fas fa-user';
     profileBtn.title = 'Login';
     loginLink.style.display = 'block';
     logoutLink.style.display = 'none';
   }
 }

 // Update page content based on current section
 function updatePageContent() {
   if (currentSection === 'home') {
     heroSection.style.display = 'flex';
     contentSection.classList.remove('active');
     detailPage.classList.remove('active');
     footer.classList.add('active');
   } else if (currentSection === 'detail') {
     heroSection.style.display = 'none';
     contentSection.classList.remove('active');
     detailPage.classList.add('active');
     footer.classList.remove('active');
   } else {
     heroSection.style.display = 'none';
     contentSection.classList.add('active');
     detailPage.classList.remove('active');
     footer.classList.remove('active');

     if (currentSection === 'photos') {
       pageTitle.textContent = 'Search Images';
     } else if (currentSection === 'videos') {
       pageTitle.textContent = 'Search Videos';
     }
   }

   searchResult.innerHTML = '';
   searchBox.value = '';
   showMoreBtn.style.display = 'none';
 }

 // Show detail page for a media item
 function showDetailPage(mediaItem, type) {
   currentMediaType = type;
   currentMediaItem = mediaItem;
   currentSection = 'detail';

   // Hide both media elements first
   detailImage.style.display = 'none';
   detailVideo.style.display = 'none';

   if (type === 'photo') {
     // Show photo details
     detailImage.src = mediaItem.urls.regular;
     detailImage.style.display = 'block';
     detailTitle.textContent = mediaItem.alt_description || 'Beautiful Photo';
     detailDescription.textContent = mediaItem.description || 'No description available';
     detailAuthor.textContent = mediaItem.user.name || 'Unknown';
     detailDate.textContent = new Date(mediaItem.created_at).toLocaleDateString();
     detailDownloads.textContent = mediaItem.downloads ? mediaItem.downloads.toLocaleString() : 'N/A';

     // Set download link
     downloadBtn.onclick = () => {
       downloadMedia(mediaItem.urls.full, `photo-${mediaItem.id}.jpg`);
     };
   } else if (type === 'video') {
     // Show video details
     const videoFile = mediaItem.video_files.find(file => file.quality === 'hd') || mediaItem.video_files[0];
     detailVideo.src = videoFile.link;
     detailVideo.style.display = 'block';
     detailTitle.textContent = mediaItem.user?.name ? `${mediaItem.user.name}'s Video` : 'Amazing Video';
     detailDescription.textContent = 'Video content from our collection';
     detailAuthor.textContent = mediaItem.user?.name || 'Unknown';
     detailDate.textContent = 'N/A';
     detailDownloads.textContent = 'N/A';

     // Set download link
     downloadBtn.onclick = () => {
       downloadMedia(videoFile.link, `video-${mediaItem.id}.mp4`);
     };
   }

   updatePageContent();
 }

 // Download media file
 function downloadMedia(url, filename) {
   const a = document.createElement('a');
   a.href = url;
   a.download = filename;
   document.body.appendChild(a);
   a.click();
   document.body.removeChild(a);
 }

 // Search for images or videos
 async function searchContent() {
   keyword = searchBox.value.trim();
   if (!keyword) return;

   try {
     if (currentSection === 'photos') {
       await searchPhotos();
     } else if (currentSection === 'videos') {
       await searchVideos();
     }
   } catch (error) {
     console.error(`Error fetching ${currentSection}:`, error);
     searchResult.innerHTML = `<p style='text-align:center;width:100%;color:#ff3929;'>Failed to load ${currentSection}. Please try again later.</p>`;
     showMoreBtn.style.display = "none";
   }
 }

 // Search for photos using Unsplash API
 async function searchPhotos() {
   const url = `https://api.unsplash.com/search/photos?page=${page}&query=${keyword}&client_id=${unsplashAccessKey}&per_page=12`;

   const response = await fetch(url);
   if (!response.ok) throw new Error('Unsplash API request failed');

   const data = await response.json();

   if (page === 1) {
     searchResult.innerHTML = "";
   }

   if (!data.results || data.results.length === 0) {
     searchResult.innerHTML = `<p style='text-align:center;width:100%;'>No photos found. Try a different search term.</p>`;
     showMoreBtn.style.display = "none";
     return;
   }

   displayPhotoResults(data.results);
   showMoreBtn.style.display = "block";
 }

 // Search for videos using Pexels API
 async function searchVideos() {
   const url = `https://api.pexels.com/videos/search?query=${keyword}&page=${page}&per_page=12`;

   const response = await fetch(url, {
     headers: {
       'Authorization': pexelsAccessKey
     }
   });

   if (!response.ok) throw new Error('Pexels API request failed');

   const data = await response.json();

   if (page === 1) {
     searchResult.innerHTML = "";
   }

   if (!data.videos || data.videos.length === 0) {
     searchResult.innerHTML = `<p style='text-align:center;width:100%;'>No videos found. Try a different search term.</p>`;
     showMoreBtn.style.display = "none";
     return;
   }

   displayVideoResults(data.videos);
   showMoreBtn.style.display = "block";
 }

 // Display photo results
 function displayPhotoResults(photos) {
   photos.forEach((photo) => {
     const item = document.createElement("div");
     item.className = "result-item";

     const image = document.createElement("img");
     image.src = photo.urls.small;
     image.alt = photo.alt_description || keyword + " image";

     item.appendChild(image);

     item.addEventListener('click', () => {
       showDetailPage(photo, 'photo');
     });

     searchResult.appendChild(item);
   });
 }

 // Display video results
 function displayVideoResults(videos) {
   videos.forEach((video) => {
     const item = document.createElement("div");
     item.className = "result-item video-container";

     const videoElement = document.createElement("video");
     videoElement.src = video.video_files[0].link;
     videoElement.muted = true;

     item.appendChild(videoElement);

     item.addEventListener('click', () => {
       showDetailPage(video, 'video');
     });

     searchResult.appendChild(item);
   });
 }

 // Setup all event listeners
 function setupEventListeners() {
   // Navigation
   homeLink.addEventListener('click', (e) => {
     e.preventDefault();
     currentSection = 'home';
     updatePageContent();
   });

   photosLink.addEventListener('click', (e) => {
     e.preventDefault();
     currentSection = 'photos';
     updatePageContent();
   });

   videosLink.addEventListener('click', (e) => {
     e.preventDefault();
     currentSection = 'videos';
     updatePageContent();
   });

   // Hero section links
   heroPhotosLink.addEventListener('click', (e) => {
     e.preventDefault();
     currentSection = 'photos';
     updatePageContent();
   });

   heroVideosLink.addEventListener('click', (e) => {
     e.preventDefault();
     currentSection = 'videos';
     updatePageContent();
   });

   // Back button
   backBtn.addEventListener('click', (e) => {
     e.preventDefault();
     currentSection = currentMediaType === 'photo' ? 'photos' : 'videos';
     updatePageContent();
   });

   // Search form
   searchForm.addEventListener("submit", (e) => {
     e.preventDefault();
     page = 1;
     searchContent();
   });

   searchBox.addEventListener("keypress", (e) => {
     if (e.key === "Enter") {
       e.preventDefault();
       page = 1;
       searchContent();
     }
   });

   showMoreBtn.addEventListener("click", () => {
     page++;
     searchContent();
   });

   // Profile menu
   profileBtn.addEventListener('click', (e) => {
     e.stopPropagation();
     profileMenu.classList.toggle('active');
   });

   document.addEventListener('click', () => {
     profileMenu.classList.remove('active');
   });

   // Login/logout
   loginLink.addEventListener('click', (e) => {
     e.preventDefault();
     loginModal.style.display = 'flex';
     profileMenu.classList.remove('active');
   });

   logoutLink.addEventListener('click', (e) => {
     e.preventDefault();
     isLoggedIn = false;
     localStorage.removeItem('isLoggedIn');
     updateProfileButton();
     profileMenu.classList.remove('active');
     alert('You have been logged out.');
   });

   loginBtn.addEventListener('click', handleLogin);
   closeModal.addEventListener('click', () => {
     loginModal.style.display = 'none';
   });

   window.addEventListener('click', (e) => {
     if (e.target === loginModal) {
       loginModal.style.display = 'none';
     }
   });

   // Mobile menu
   hamburger.addEventListener('click', () => {
     navLinks.classList.toggle('active');
   });

   document.querySelectorAll('.nav-links a').forEach(link => {
     link.addEventListener('click', () => {
       navLinks.classList.remove('active');
     });
   });
 }

 // Handle login
 function handleLogin() {
   const username = usernameInput.value.trim();
   const password = passwordInput.value.trim();

   if (username && password) {
     isLoggedIn = true;
     localStorage.setItem('isLoggedIn', 'true');
     loginModal.style.display = 'none';
     updateProfileButton();
     loginStatus.textContent = '';
     usernameInput.value = '';
     passwordInput.value = '';
   } else {
     loginStatus.textContent = 'Please enter both username and password';
     loginStatus.style.color = 'deeppink';
   }
 }

 // Initialize the application
 init();