let encodedMessage = '';

// Load the encoded text file
async function loadEncodedText() {
    try {
        const response = await fetch('encoded_message.txt');
        encodedMessage = await response.text();
        document.getElementById('encodedText').textContent = encodedMessage;
    } catch (error) {
        document.getElementById('encodedText').textContent = 'Error loading the ancient inscriptions...';
        console.error('Error loading file:', error);
    }
}

// Vigenère cipher functions
function charToNum(char) {
    return char.charCodeAt(0) - 65; // A=0, B=1, ..., Z=25
}

function numToChar(num) {
    return String.fromCharCode(num + 65);
}

function asdasucyzxDecrypt(text, key) {
    if (!key) return '';

    key = key.toUpperCase();
    let result = '';
    let keyIndex = 0;

    for (let i = 0; i < text.length; i++) {
        const char = text[i];

        if ((char >= 'A' && char <= 'Z') || (char >= 'a' && char <= 'z')) {
            const upperChar = char.toUpperCase();
            const textNum = charToNum(upperChar);
            const keyNum = charToNum(key[keyIndex % key.length]);
            const decryptedNum = (textNum - keyNum + 26) % 26;
            const decryptedChar = numToChar(decryptedNum);

            // Preserve original case
            result += char >= 'a' && char <= 'z' ? decryptedChar.toLowerCase() : decryptedChar;
            keyIndex++;
        } else {
            result += char; // Keep special characters unchanged
        }
    }

    return result;
}

function repeatKey(key, textLength) {
    if (!key) return '';

    let repeated = '';
    let keyIndex = 0;

    for (let i = 0; i < textLength; i++) {
        const char = encodedMessage[i];
        if ((char >= 'A' && char <= 'Z') || (char >= 'a' && char <= 'z')) {
            repeated += key[keyIndex % key.length];
            keyIndex++;
        } else {
            repeated += ' '; // Space for non-alphabetic characters
        }
    }

    return repeated;
}

function processKey() {
    const keyInput = document.getElementById('keyInput');
    const key = keyInput.value.toUpperCase().replace(/[^A-Z]/g, ''); // Only allow A-Z

    // Update input to show only valid characters
    keyInput.value = key;

    // Add processing animation
    keyInput.classList.add('processing');
    setTimeout(() => keyInput.classList.remove('processing'), 500);

    if (key.length === 0) {
        document.getElementById('decodedText').textContent = 'The puzzle awaits your wisdom...';
        document.getElementById('decodedText').classList.remove('success');
        return;
    }

    // Update character count and progress
    // (removed for cleaner UI)

    // Decrypt the message
    const decoded = asdasucyzxDecrypt(encodedMessage, key);
    const decodedElement = document.getElementById('decodedText');

    decodedElement.textContent = decoded;    // Enhanced success detection
    const successWords = ['THE', 'AND', 'YOU', 'ARE', 'THIS', 'THAT', 'WITH', 'HAVE', 'FROM', 'THEY', 'WILL', 'BEEN', 'SAID', 'EACH', 'WHICH'];
    const wordsFound = successWords.filter(word => decoded.toUpperCase().includes(word)).length;

    if (wordsFound >= 2 || (decoded.length > 10 && wordsFound >= 1)) {
        decodedElement.classList.add('success');
        showSuccessMessage();
    } else {
        decodedElement.classList.remove('success');
    }
}

function showSuccessMessage() {
    // Add a brief success animation
    const container = document.querySelector('.container');
    container.style.animation = 'pulse 0.6s ease-in-out';
    setTimeout(() => {
        container.style.animation = '';
    }, 600);
}

// Load the encoded text when page loads
window.addEventListener('load', loadEncodedText);