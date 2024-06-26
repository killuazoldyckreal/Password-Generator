document.addEventListener("DOMContentLoaded", function() { 
});
const passwordOutput = document.getElementById('passwordOutput');
const lengthSlider = document.getElementById('lengthSlider');
const passwordLengthSpan = document.getElementById('passwordLength');
const passIndicator = document.querySelector(".pass-indicator");
const copyIcon = document.getElementById('copyIcon');
const generateButton = document.getElementById('generateButton');

copyIcon.addEventListener('click', () => {
    navigator.clipboard.writeText(passwordOutput.value);
    // Replace the copy icon with a green tick icon temporarily
    copyIcon.innerHTML = 'check';
    copyIcon.style.color = '#43A047';
    setTimeout(() => {
        // Reset the copy icon to its original state after 2 seconds
        copyIcon.innerHTML = 'copy_all';
        copyIcon.style.color = ''; // Reset color
    }, 2000);
});


generateButton.addEventListener('click', async () => {
    const length = parseInt(lengthSlider.value);
    let optionid = '';
    const checkedOption = document.querySelector('input[name="passwordOption"]:checked');
    let password = '';

    if (checkedOption) {
        optionid = checkedOption.id;
    }

    if (!optionid) {
        // If no option is selected, default to 'randompass' and check it
        const option = document.getElementById('randompass');
        option.checked = true;
        optionid = option.id;
    }

    switch (optionid) {
        case 'randompass':
            password = generateRandomPassword(length);
            break;
        case 'passphrases':
            password = generatePassphrase(length);
            break;
        case 'patternpass':
            password = generatePatternPassword(length);
            break;
        case 'entropy':
            password = generateEntropyPassword(length);
            break;
        case 'cryptographic':
            const supportedAlgorithms = ['SHA-1', 'SHA-512', 'SHA-384', 'SHA-256'];
            const algorithm = supportedAlgorithms[Math.floor(Math.random() * supportedAlgorithms.length)];
            password = await generateCryptographicHashPassword(generateEntropyPassword(length), algorithm, length);
            break;
    }

    passwordOutput.value = password;
    logPasswordCrackingTime(password);
});

function generateRandomPassword(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
}

function generatePassphrase(length) {
    const words = [
        // Fruits
        'apple', 'banana', 'cherry', 'date', 'elderberry', 'fig', 'grape', 'honeydew', 'kiwi', 'lemon', 
        'mango', 'orange', 'papaya', 'quince', 'raspberry', 'strawberry', 'tangerine', 'ugli', 'vanilla', 'watermelon', 
        // City Names
        'paris', 'london', 'tokyo', 'newyork', 'berlin', 'sydney', 'mumbai', 'istanbul', 'rome', 'moscow', 
        'seoul', 'rio', 'cairo', 'athens', 'dublin', 'toronto', 'amsterdam', 'beijing', 'dakar', 'delhi', 
        // People Names
        'john', 'mary', 'peter', 'susan', 'michael', 'linda', 'william', 'elizabeth', 'james', 'jennifer', 
        'robert', 'patricia', 'david', 'barbara', 'richard', 'jessica', 'joseph', 'sarah', 'thomas', 'karen', 
        // Dishes
        'pizza', 'sushi', 'pasta', 'burger', 'taco', 'curry', 'soup', 'salad', 'steak', 'sandwich', 
        'kebab', 'sashimi', 'ramen', 'risotto', 'padthai', 'lasagna', 'samosa', 'pancake', 'gnocchi', 'paella', 
        // Pet Names
        'buddy', 'molly', 'max', 'lucy', 'charlie', 'daisy', 'bailey', 'rocky', 'bella', 'jack', 
        'sadie', 'oliver', 'lily', 'toby', 'sophie', 'cooper', 'rosie', 'sam', 'mia', 'oscar', 
        // Animal Types
        'lion', 'tiger', 'elephant', 'zebra', 'giraffe', 'panda', 'kangaroo', 'koala', 'gorilla', 'cheetah', 
        'rhinoceros', 'hippopotamus', 'crocodile', 'leopard', 'panther', 'wolf', 'fox', 'bear', 'lynx', 'hyena'
    ];
    const symbols = {
        'a': ['@', '4', 'A'],
        'e': ['3', 'E'],
        'i': ['1', '!', 'I'],
        'o': ['0', 'O'],
        's': ['$', '5', 'S'],
        't': ['7', 'T']
    };

    function replaceWithSymbol(word) {
        return word.split('').map(char => {
            if (symbols[char.toLowerCase()]) {
                return symbols[char.toLowerCase()][Math.floor(Math.random() * symbols[char.toLowerCase()].length)];
            } else {
                return char;
            }
        }).join('');
    }

    function randomlyCapitalize(word) {
        return word.split('').map(char => {
            if (Math.random() < 0.5) {
                return char.toUpperCase();
            } else {
                return char;
            }
        }).join('');
    }

    let passphrase = '';
    while (passphrase.length < length) {
        const randomWord = words[Math.floor(Math.random() * words.length)];
        let modifiedWord = replaceWithSymbol(randomWord);
        modifiedWord = randomlyCapitalize(modifiedWord);
        passphrase += modifiedWord;
    }
    return passphrase.slice(0, length);
}

function generatePatternPassword(length) {
    const simplePatterns = ["qwerty", "asdfgh", "zxcvbn"];
    const complexPatterns = ["!QAZ2wsx", "1qaz2wsx", "qwe123!@#"];
    const numericPatterns = ["123456", "987654", "2580"];
    const alphanumericPatterns = ["abc123", "1a2b3c", "z9y8x7"];
    const customPatterns = ["Mnbvcxz", "Plmko0", "qazwsx"];

    const allPatterns = [
        ...simplePatterns,
        ...complexPatterns,
        ...numericPatterns,
        ...alphanumericPatterns,
        ...customPatterns
    ];

    function getRandomPattern() {
        const pattern = allPatterns[Math.floor(Math.random() * allPatterns.length)];
        if (pattern.length >= length) {
            return pattern.substring(0, length);
        } else {
            let extendedPattern = pattern;
            while (extendedPattern.length < length) {
                extendedPattern += pattern;
            }
            return extendedPattern.substring(0, length);
        }
    }

    return getRandomPattern();
}

// Function to shuffle a string
function shuffle(str) {
    const arr = str.split(''); // Convert string to array
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // Generate random index
        [arr[i], arr[j]] = [arr[j], arr[i]]; // Swap elements
    }
    return arr.join(''); // Convert array back to string
}

function generateEntropyPassword(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?';
    return Array.from({ length }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
}

async function generateCryptographicHashPassword(password, algorithm, length) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);

    let hashedPassword;

    switch (algorithm) {
        case 'SHA-1':
            hashedPassword = await window.crypto.subtle.digest('SHA-1', data);
            break;
        case 'SHA-256':
            hashedPassword = await window.crypto.subtle.digest('SHA-256', data);
            break;
        case 'SHA-384':
            hashedPassword = await window.crypto.subtle.digest('SHA-384', data);
            break;
        case 'SHA-512':
            hashedPassword = await window.crypto.subtle.digest('SHA-512', data);
            break;
        default:
            throw new Error('Unsupported hashing algorithm');
    }

    // Convert the hashed array buffer to a hex string
    const hashedPasswordHex = Array.from(new Uint8Array(hashedPassword))
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('');

    const truncatedPassword = hashedPasswordHex.slice(0, length);

    return truncatedPassword;
}

// Function to estimate the time to crack the password
function logPasswordCrackingTime(password) {
  if (password.length > 0) {
    // score password
    var r = zxcvbn(password);

    // Update crack time values
    document.getElementById('time-offline-slow').innerHTML = r.crack_times_display.offline_slow_hashing_1e4_per_second;
    document.getElementById('time-online-slow').innerHTML = r.crack_times_display.online_throttling_100_per_hour;
    document.getElementById('time-online-fast').innerHTML = r.crack_times_display.online_no_throttling_10_per_second;
    document.getElementById('time-offline-fast').innerHTML = r.crack_times_display.offline_fast_hashing_1e10_per_second;
  } else {
    console.log('No password entered.');
  }
}

const updatePassIndicator = () => {
    passIndicator.id = lengthSlider.value <= 8 ? "weak" : lengthSlider.value <= 16 ? "medium" : "strong";
}

const updateSlider = () => {
    document.querySelector(".pass-length span").innerText = lengthSlider.value;
    updatePassIndicator();
}

updateSlider();


lengthSlider.addEventListener("input", updateSlider);
