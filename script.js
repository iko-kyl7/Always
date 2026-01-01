// ============================================
// EMAILJS CONFIGURATION
// ============================================
// Initialize EmailJS with your public key
// Replace 'YOUR_PUBLIC_KEY' with your actual EmailJS public key
emailjs.init('YOUR_PUBLIC_KEY');

// EmailJS Configuration
// Replace these with your actual EmailJS details
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';

// ============================================
// WELCOME POPUP
// ============================================
const welcomeOverlay = document.getElementById('welcomeOverlay');
const agreeCheckbox = document.getElementById('agreeCheckbox');
const doneBtn = document.getElementById('doneBtn');

agreeCheckbox.addEventListener('change', function() {
    if (this.checked) {
        doneBtn.classList.add('active');
    } else {
        doneBtn.classList.remove('active');
    }
});

doneBtn.addEventListener('click', function() {
    if (agreeCheckbox.checked) {
        welcomeOverlay.classList.add('hidden');
    }
});

// ============================================
// NAVIGATION
// ============================================
const navLinks = document.querySelectorAll('.nav-link');
const footerIcons = document.querySelectorAll('.footer-icon');
const pages = document.querySelectorAll('.page');

function showPage(pageName) {
    // Hide all pages
    pages.forEach(page => page.classList.remove('active'));
    
    // Remove active class from all nav links
    navLinks.forEach(link => link.classList.remove('active'));
    
    // Show selected page
    const selectedPage = document.getElementById(pageName);
    if (selectedPage) {
        selectedPage.classList.add('active');
    }
    
    // Add active class to clicked nav link
    const activeLink = document.querySelector(`[data-page="${pageName}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
    
    // Scroll to top
    window.scrollTo(0, 0);
    
    // Show popups for specific pages
    if (pageName === 'music' && !sessionStorage.getItem('musicPopupShown')) {
        setTimeout(() => {
            document.getElementById('musicPopup').classList.add('show');
            sessionStorage.setItem('musicPopupShown', 'true');
        }, 300);
    }
    
    if (pageName === 'letters' && !sessionStorage.getItem('lettersPopupShown')) {
        setTimeout(() => {
            document.getElementById('lettersPopup').classList.add('show');
            sessionStorage.setItem('lettersPopupShown', 'true');
        }, 300);
    }
}

// Add event listeners to nav links
navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const pageName = this.getAttribute('data-page');
        showPage(pageName);
    });
});

// Add event listeners to footer icons
footerIcons.forEach(icon => {
    icon.addEventListener('click', function(e) {
        e.preventDefault();
        const pageName = this.getAttribute('data-page');
        showPage(pageName);
    });
});

// ============================================
// POLAROID IMAGE UPLOAD
// ============================================
function setupPolaroidUploads() {
    for (let i = 1; i <= 4; i++) {
        const fileInput = document.getElementById(`fileInput${i}`);
        const polaroidImage = document.getElementById(`polaroid${i}`);
        
        if (fileInput && polaroidImage) {
            fileInput.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file && file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = function(event) {
                        polaroidImage.innerHTML = `<img src="${event.target.result}" alt="Uploaded photo">`;
                        // Save to localStorage
                        localStorage.setItem(`polaroid${i}`, event.target.result);
                    };
                    reader.readAsDataURL(file);
                }
            });
            
            // Load saved image from localStorage
            const savedImage = localStorage.getItem(`polaroid${i}`);
            if (savedImage) {
                polaroidImage.innerHTML = `<img src="${savedImage}" alt="Uploaded photo">`;
            }
        }
    }
}

setupPolaroidUploads();

// ============================================
// MOOD CHECKER
// ============================================
const moodButtons = document.querySelectorAll('.mood-btn');
const moodMessage = document.getElementById('moodMessage');

const moodMessages = {
    happy: "I'm so glad you're feeling happy! Your happiness means the world to me. Keep smiling that beautiful smile, and remember that your joy is contagious. May your day be filled with even more reasons to smile! 😊",
    sad: "I'm sorry you're feeling sad. It's okay to feel this way sometimes. Remember that difficult moments don't last forever, and brighter days are ahead. You are strong, you are loved, and you matter more than you know. I'm here for you, always. 💙",
    excited: "Your excitement is wonderful! I love seeing you full of energy and enthusiasm. Whatever has you feeling this way, embrace it fully! Life is beautiful when we let ourselves feel joy and anticipation. Keep that amazing spirit alive! 🌟",
    tired: "You sound tired, and that's completely okay. Remember to be gentle with yourself and take the rest you need. You work so hard, and you deserve moments of peace and relaxation. Take care of yourself—you're precious and worth it. 😴",
    stressed: "I can feel that you're stressed, and I wish I could take that burden away. Remember to breathe deeply and take things one step at a time. You're stronger than you think, and you will get through this. Don't forget to take breaks and be kind to yourself. 💪",
    loved: "I'm so happy you're feeling loved! You deserve all the love in the world and so much more. Never forget how special you are and how much you mean to those around you. Keep that warmth in your heart always. 💕"
};

moodButtons.forEach(button => {
    button.addEventListener('click', function() {
        const mood = this.getAttribute('data-mood');
        if (mood && moodMessages[mood]) {
            moodMessage.textContent = moodMessages[mood];
            moodMessage.classList.remove('show');
            setTimeout(() => {
                moodMessage.classList.add('show');
            }, 10);
        }
    });
});

// ============================================
// MESSAGE BOX (EMAILJS)
// ============================================
const rantTextarea = document.getElementById('rantTextarea');
const charCount = document.getElementById('charCount');
const sendMessageBtn = document.getElementById('sendMessageBtn');

// Character counter
rantTextarea.addEventListener('input', function() {
    const length = this.value.length;
    charCount.textContent = length;
    
    if (length > 0) {
        sendMessageBtn.disabled = false;
    } else {
        sendMessageBtn.disabled = true;
    }
});

// Send message via EmailJS
sendMessageBtn.addEventListener('click', function() {
    const message = rantTextarea.value.trim();
    
    if (!message) {
        alert('Please write something before sending.');
        return;
    }
    
    // Disable button while sending
    sendMessageBtn.disabled = true;
    sendMessageBtn.innerHTML = '<span>Sending...</span>';
    
    // Prepare template parameters
    const templateParams = {
        message: message,
        timestamp: new Date().toLocaleString(),
        from_name: 'Langga' // You can customize this
    };
    
    // Send email using EmailJS
    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
        .then(function(response) {
            console.log('SUCCESS!', response.status, response.text);
            alert('Your message has been sent! Thank you for sharing with me. ♥');
            rantTextarea.value = '';
            charCount.textContent = '0';
            sendMessageBtn.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="white"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg> Send';
        })
        .catch(function(error) {
            console.error('FAILED...', error);
            alert('Failed to send message. Please try again later.');
            sendMessageBtn.disabled = false;
            sendMessageBtn.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="white"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg> Send';
        });
});

// ============================================
// LETTERS PAGE
// ============================================
const lettersPopup = document.getElementById('lettersPopup');
const closeLettersPopupBtn = document.getElementById('closeLettersPopup');

if (closeLettersPopupBtn) {
    closeLettersPopupBtn.addEventListener('click', function() {
        lettersPopup.classList.remove('show');
    });
}

// Letter data
const letters = [
    {
        title: "The Beginning",
        content: `From the moment I met you, my world changed. You brought color to my days and warmth to my heart. This is where our story began, and I cherish every moment since.
        
        I remember the first time I saw you, how my heart skipped a beat. Everything felt different from that moment on. You became the person I thought about when I woke up and the last person on my mind before sleep.
        
        Every conversation, every laugh, every shared moment became a treasure I held close. You showed me what it means to truly care for someone, to want their happiness above all else.`
    },
    {
        title: "My Promise",
        content: `I promise to always remember the way you made me feel. No matter what happens, these feelings are real, and they matter. You matter to me, more than words can say.
        
        I promise that even if distance separates us, even if time passes, the love I have for you will remain unchanged. It's not conditional, it's not temporary—it's a part of who I am now.
        
        You've changed me in the most beautiful ways, and for that, I will be forever grateful.`
    },
    {
        title: "Gratitude",
        content: `Thank you for existing. Thank you for every smile, every conversation, every moment. Even if this is my goodbye, I'm grateful for every second we shared.
        
        Thank you for teaching me what it means to love selflessly. Thank you for showing me kindness, even when I didn't deserve it. Thank you for being exactly who you are.
        
        You've given me memories that I'll carry with me always. Moments that made me laugh, moments that made me think, moments that made me feel truly alive.`
    },
    {
        title: "Hope",
        content: `I hope you find happiness. I hope life gives you everything beautiful that you deserve. And I hope, somewhere in your heart, you'll remember that someone loved you truly.
        
        I hope your days are filled with laughter and your nights are peaceful. I hope you achieve every dream you've ever had and discover new ones along the way.
        
        Most of all, I hope you know how special you are. How deserving you are of all the good things life has to offer. Never doubt your worth.`
    },
    {
        title: "Always",
        content: `This isn't just a website. It's a piece of my heart, carefully crafted for you. Whenever you need to know that someone believes in you, come back here. This place will always be here, waiting.
        
        On days when you feel alone, remember this exists. Remember that someone took the time to create something beautiful just for you. Remember that you are loved.
        
        This is my way of making sure a part of me is always with you, always supporting you, always believing in you.`
    },
    {
        title: "My Final Words",
        content: `I built this because love isn't about expecting something in return. It's about giving all you have, even when no one asks. You were worth every effort, every sleepless night, every hope and dream. Always.
        
        This is my last effort, my final gift. Not because I'm giving up on you, but because I've given you everything I have. Every ounce of love, every bit of effort, every piece of my heart.
        
        Whatever happens next, know that you were loved deeply, truly, and completely. You were worth it all.`
    }
];

// Letter modal
const letterModal = document.getElementById('letterModal');
const closeLetterModal = document.getElementById('closeLetterModal');
const modalBody = document.getElementById('modalBody');
const letterCards = document.querySelectorAll('.letter-card');

letterCards.forEach(card => {
    card.addEventListener('click', function() {
        const letterIndex = parseInt(this.getAttribute('data-letter'));
        const letter = letters[letterIndex];
        
        if (letter) {
            modalBody.innerHTML = `
                <h3>${letter.title}</h3>
                ${letter.content.split('\n\n').map(p => `<p>${p.trim()}</p>`).join('')}
            `;
            letterModal.classList.add('active');
        }
    });
});

closeLetterModal.addEventListener('click', function() {
    letterModal.classList.remove('active');
});

letterModal.addEventListener('click', function(e) {
    if (e.target === this) {
        this.classList.remove('active');
    }
});

// ============================================
// MUSIC PLAYER
// ============================================
const musicPopup = document.getElementById('musicPopup');
const closeMusicPopupBtn = document.getElementById('closeMusicPopup');

if (closeMusicPopupBtn) {
    closeMusicPopupBtn.addEventListener('click', function() {
        musicPopup.classList.remove('show');
    });
}

// Song data
const songs = [
    {
        title: "Thousand Years",
        artist: "Christina Perri",
        src: "music/Thousand.mp3",
        description: "There's a certain peace in these lyrics that makes me think of us. I want you to know that my love for you isn't something that flickers out, it's a constant. Even if life gets loud or if I need a quiet moment to myself for a bit, my feelings for you remain unchanged. You are my forever, no matter how many years it takes for us to get there."
    },
    {
        title: "You'll be in My Heart",
        artist: "NIKI",
        src: "music/InMyHeart.mp3",
        description: "If ever the world feels loud and heavy, you don't have to be strong always. You can rest here, even quietly. Even from a distance, my care for you doesn't fade. I'm holding space for you in the gentlest way so you can have some rest. You'll always be in my heart."
    },
    {
        title: "Give me your Forever",
        artist: "Zack Tabudlo",
        src: "music/GiveMeYourForever.mp3",
        description: "A reminder that loving you was never just for a moment. It was never halfway. It wasn't just for the moment or for comfort. I loved you for who you are, even on the days it wasn't easy. This song is my quiet reminder that what I gave you was real. Its always sincere, even when things weren't perfect."
    },
    {
        title: "Tahanan",
        artist: "El Manu",
        src: "music/Tahanan.mp3",
        description: "El Manu"
    },
    {
        title: "Hindi Ako Mawawala",
        artist: "El Manu",
        src: "music/HindiMawawala.mp3",
        description: "El Manu"
    },
    {
        title: "Ako Nalang",
        artist: "The Juans",
        src: "music/AkoNalang.mp3",
        description: "The Juans"
    },
    {
        title: "Nahanap Kita",
        artist: "Amiel Sol",
        src: "music/Nahanap Kita.mp3",
        description: "Amiel Sol"
    },
    {
        title: "Darating Rin",
        artist: "TJ Montero",
        src: "music/Darating rin.mp3",
        description: "TJ Montero"
    },
    {
        title: "Ginintuan Tanawin",
        artist: "Wilbert Ross",
        src: "music/Ginintuan Tanawin.mp3",
        description: "Wilbert Ross"
    },
    {
        title: "Palagi",
        artist: "TJ Montero and KZ Tandigan",
        src: "music/Palagi.mp3",
        description: "TJ Montero and KZ Tandigan"
    },
    {
        title: "I Do Cherish You",
        artist: "Michael Pangilinan (cover)",
        src: "music/I do cherish you.mp3",
        description: "Michael Pangilinan cover"
    },
    {
        title: "Ikaw At Ako",
        artist: "TJ Montero",
        src: "music/Ikaw at Ako.mp3",
        description: "TJ Montero"
    },
    {
        title: "Puhon",
        artist: "TJ Montero",
        src: "music/Puhon.mp3",
        description: "TJ Montero"
    },
    {
        title: "Ikaw Ang Patutunguhan",
        artist: "Amiel Sol",
        src: "music/Ikaw Lang Patutunguhan.mp3",
        description: "Amiel Sol"
    },
    {
        title: "Sa Bawat Sandali",
        artist: "Amiel Sol",
        src: "music/Sa Bawat Sandali.mp3",
        description: "Amiel Sol"
    }
];

// Music player variables
let currentSongIndex = 0;
let isPlaying = false;
let isRepeat = false;
let isShuffle = false;

const audio = document.getElementById('audioPlayer');
const vinyl = document.getElementById('vinyl');
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const repeatBtn = document.getElementById('repeatBtn');
const shuffleBtn = document.getElementById('shuffleBtn');
const progressBar = document.getElementById('progressBar');
const progressFill = document.getElementById('progressFill');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const currentSongEl = document.getElementById('currentSong');
const currentArtistEl = document.getElementById('currentArtist');
const playlistItemsContainer = document.getElementById('playlistItems');

// Format time helper
function formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Initialize playlist
function initPlaylist() {
    playlistItemsContainer.innerHTML = '';
    songs.forEach((song, index) => {
        const item = document.createElement('div');
        item.className = 'playlist-item';
        if (index === currentSongIndex) item.classList.add('active');
        item.innerHTML = `
            <span class="playlist-number">${index + 1}</span>
            <div class="playlist-info">
                <h5>${song.title}</h5>
                <p>${song.description}</p>
            </div>
        `;
        item.addEventListener('click', () => playSong(index));
        playlistItemsContainer.appendChild(item);
    });
}

// Play song
function playSong(index) {
    currentSongIndex = index;
    const song = songs[index];
    
    currentSongEl.textContent = song.title;
    currentArtistEl.textContent = song.artist;
    
    // Update playlist items
    document.querySelectorAll('.playlist-item').forEach((item, i) => {
        if (i === index) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
    
    audio.src = song.src;
    audio.currentTime = 0;
    
    if (isPlaying) {
        audio.play().catch(err => console.error('Playback error:', err));
    } else {
        togglePlay();
    }
}

// Toggle play/pause
function togglePlay() {
    if (isPlaying) {
        audio.pause();
        vinyl.classList.remove('spinning');
        playBtn.innerHTML = '<svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
        isPlaying = false;
    } else {
        if (!audio.src || audio.src === window.location.href) {
            audio.src = songs[currentSongIndex].src;
        }
        audio.play().then(() => {
            vinyl.classList.add('spinning');
            playBtn.innerHTML = '<svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor"><path d="M6 4h4v16H6zM14 4h4v16h-4z"/></svg>';
            isPlaying = true;
        }).catch(err => {
            console.error('Playback error:', err);
            alert('Unable to play music. Please check if the audio files exist in the music folder.');
        });
    }
}

// Previous song
function previousSong() {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    playSong(currentSongIndex);
}

// Next song
function nextSong() {
    if (isShuffle) {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * songs.length);
        } while (newIndex === currentSongIndex && songs.length > 1);
        currentSongIndex = newIndex;
    } else {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
    }
    playSong(currentSongIndex);
}

// Toggle repeat
function toggleRepeat() {
    isRepeat = !isRepeat;
    repeatBtn.classList.toggle('active', isRepeat);
}

// Toggle shuffle
function toggleShuffle() {
    isShuffle = !isShuffle;
    shuffleBtn.classList.toggle('active', isShuffle);
}

// Seek in progress bar
function seek(event) {
    if (audio.duration) {
        const rect = progressBar.getBoundingClientRect();
        const percent = (event.clientX - rect.left) / rect.width;
        audio.currentTime = percent * audio.duration;
    }
}

// Audio event listeners
audio.addEventListener('loadedmetadata', function() {
    durationEl.textContent = formatTime(audio.duration);
});

audio.addEventListener('timeupdate', function() {
    if (audio.duration) {
        const progress = (audio.currentTime / audio.duration) * 100;
        progressFill.style.width = progress + '%';
        currentTimeEl.textContent = formatTime(audio.currentTime);
    }
});

audio.addEventListener('ended', function() {
    if (isRepeat) {
        audio.currentTime = 0;
        audio.play();
    } else {
        nextSong();
    }
});

audio.addEventListener('error', function(e) {
    console.error('Error loading audio:', e);
});

// Music player controls
playBtn.addEventListener('click', togglePlay);
prevBtn.addEventListener('click', previousSong);
nextBtn.addEventListener('click', nextSong);
repeatBtn.addEventListener('click', toggleRepeat);
shuffleBtn.addEventListener('click', toggleShuffle);
progressBar.addEventListener('click', seek);

// Initialize
initPlaylist();
audio.src = songs[0].src;

// ============================================
// COUNTDOWN TIMER
// ============================================
function updateCountdown() {
    const now = new Date();
    const birthday = new Date(2026, 8, 7, 0, 0, 0); // September 7, 2026
    
    const diff = birthday - now;
    
    if (diff > 0) {
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');
        
        if (daysEl) daysEl.textContent = days;
        if (hoursEl) hoursEl.textContent = hours;
        if (minutesEl) minutesEl.textContent = minutes;
        if (secondsEl) secondsEl.textContent = seconds;
    } else {
        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');
        
        if (daysEl) daysEl.textContent = '0';
        if (hoursEl) hoursEl.textContent = '0';
        if (minutesEl) minutesEl.textContent = '0';
        if (secondsEl) secondsEl.textContent = '0';
    }
}

updateCountdown();
setInterval(updateCountdown, 1000);