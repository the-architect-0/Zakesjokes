const jokeContent = document.getElementById('jokeContent');
const getJokeBtn = document.getElementById('getJokeBtn');
const copyBtn = document.getElementById('copyBtn');
const tweetBtn = document.getElementById('tweetBtn');
const notification = document.getElementById('notification');
const emojiContainer = document.getElementById('emojiContainer');
const jokeCountElement = document.getElementById('jokeCount');

// State variables
let currentJoke = '';
let jokeCount = 0;

// Emoji options for random display
const emojis = ['😂', '🤣', '😆', '😅', '🙃', '😜', '🤪', '😝', '🥴', '😬', '🤭', '🤫', '🤔', '🧐', '😎', '🥸', '🤓', '🙄', '😏', '🫠'];

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
  // Load joke count from localStorage
  const savedCount = localStorage.getItem('dadJokeCount');
  if (savedCount) {
    jokeCount = parseInt(savedCount);
    jokeCountElement.textContent = jokeCount;
  }
  
  // Generate random emojis on load
  generateRandomEmojis();
  
  // Set up event listeners
  getJokeBtn.addEventListener('click', fetchNewJoke);
  copyBtn.addEventListener('click', copyToClipboard);
  tweetBtn.addEventListener('click', shareOnTwitter);
  
  // Fetch first joke automatically
  setTimeout(() => {
    fetchNewJoke();
  }, 1000);
});

// Generate random emojis for the header
function generateRandomEmojis() {
  emojiContainer.innerHTML = '';
  const numEmojis = Math.floor(Math.random() * 5) + 3; // 3 to 7 emojis
  
  for (let i = 0; i < numEmojis; i++) {
    const emoji = document.createElement('span');
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    emoji.textContent = randomEmoji;
    emoji.classList.add('emoji');
    emoji.style.animationDelay = `${i * 0.1}s`;
    emojiContainer.appendChild(emoji);
  }
}

// Fetch a new joke from the API
async function fetchNewJoke() {
  try {
    // Show loading state
    getJokeBtn.innerHTML = '<span class="spinner"></span> Thinking...';
    getJokeBtn.classList.add('loading');
    
    // Fade out current joke
    jokeContent.classList.add('fade-out');
    
    // Wait for fade out animation
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Fetch joke from API with required header
    const response = await fetch('https://icanhazdadjoke.com/', {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'DadJokeVault (https://github.com/yourusername)'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch joke');
    }
    
    const data = await response.json();
    currentJoke = data.joke;
    
    // Update joke count
    jokeCount++;
    jokeCountElement.textContent = jokeCount;
    localStorage.setItem('dadJokeCount', jokeCount);
    
    // Generate new random emojis
    generateRandomEmojis();
    
    // Fade in new joke
    jokeContent.textContent = currentJoke;
    jokeContent.classList.remove('fade-out');
    jokeContent.classList.add('fade-in');
    
    // Show notification
    showNotification('New joke loaded successfully! 😄');
    
  } catch (error) {
    console.error('Error fetching joke:', error);
    jokeContent.textContent = "Oops! Couldn't fetch a joke. Maybe try again? The dad jokes are on strike! 😅";
    jokeContent.classList.remove('fade-out');
    jokeContent.classList.add('fade-in');
    showNotification('Failed to fetch joke. Please try again.', 'error');
  } finally {
    // Reset button state
    getJokeBtn.innerHTML = '<i class="fas fa-laugh-beam"></i> Get New Joke';
    getJokeBtn.classList.remove('loading');
  }
}

// Copy joke to clipboard
async function copyToClipboard() {
  if (!currentJoke) {
    showNotification('No joke to copy! Get a joke first.', 'error');
    return;
  }
  
  try {
    await navigator.clipboard.writeText(currentJoke);
    showNotification('Joke copied to clipboard! 📋');
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    showNotification('Failed to copy joke. Please try again.', 'error');
  }
}

// Share joke on Twitter
function shareOnTwitter() {
  if (!currentJoke) {
    showNotification('No joke to share! Get a joke first.', 'error');
    return;
  }
  
  // Truncate joke if it's too long for Twitter
  let tweetText = currentJoke;
  const maxLength = 280 - 25; // 25 characters for hashtag and URL
  
  if (tweetText.length > maxLength) {
    tweetText = tweetText.substring(0, maxLength - 3) + '...';
  }
  
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&hashtags=DadJokes`;
  window.open(twitterUrl, '_blank');
}

// Show notification
function showNotification(message, type = 'success') {
  notification.textContent = message;
  notification.className = 'notification show';
  
  if (type === 'error') {
    notification.style.backgroundColor = 'var(--accent-red)';
  } else {
    notification.style.backgroundColor = 'var(--secondary-blue)';
  }
  
  // Hide notification after 3 seconds
  setTimeout(() => {
    notification.classList.remove('show');
  }, 3000);
}