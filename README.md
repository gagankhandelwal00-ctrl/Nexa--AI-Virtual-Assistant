# Nexa — AI Virtual Assistant

A professional AI-powered virtual assistant built with pure HTML, CSS, and JavaScript.
Supports both voice commands and text input with a modern chat-based UI.

---

## Project Structure

```
own Virtual assisstant/
├── index.html        → Main HTML structure
├── style.css         → All styles, animations, dark/light theme
├── script.js         → All logic, speech recognition, commands
└── README.md         → Project reference (this file)
```

---

## Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Page structure and layout |
| CSS3 | Styling, animations, dark/light theme |
| JavaScript (Vanilla) | All logic, commands, speech |
| Web Speech API | Voice recognition and text-to-speech |
| Font Awesome 6.4 | Icons for UI elements |
| Google Fonts (Inter) | Typography |

---

## Features

- Voice input using microphone
- Text input with Enter key or send button
- Text-to-speech responses using Web Speech API
- Live chat bubbles showing conversation history
- Voice visualizer bars while speaking or listening
- Dark / Light mode toggle
- Status indicator (listening / speaking / ready)
- Animated spinning rings around logo
- Floating background particles
- Quick command chips for one-click commands
- Command history panel (last 20 commands)
- Fully mobile responsive

---

## Voice & Text Commands

### Greetings
| Command | Response |
|---|---|
| hello / hey / hi | Greets the user |
| how are you | Responds with status |
| who are you | Describes Nexa |
| what is my name | Says Gagan Khandelwal |
| thank you | Acknowledges thanks |
| bye / goodbye | Says farewell |

### Time & Date
| Command | Response |
|---|---|
| what time is it | Speaks current time |
| what is today date | Speaks full date |
| what day is it | Speaks current day |

### Open Websites
| Command | Opens |
|---|---|
| open google | google.com |
| open youtube | youtube.com |
| open instagram | instagram.com |
| open facebook | facebook.com |
| open twitter | twitter.com |
| open linkedin | linkedin.com |
| open whatsapp | web.whatsapp.com |
| open github | github.com |
| open gmail | mail.google.com |
| open netflix | netflix.com |
| open maps | maps.google.com |
| open spotify / play music | spotify.com |
| weather | weather.com |

### Search
| Command | Action |
|---|---|
| search youtube for [query] | Searches YouTube |
| translate [text] | Opens Google Translate |
| what is [topic] | Opens Wikipedia |
| who is [person] | Opens Wikipedia |
| [anything else] | Google search fallback |

### Fun
| Command | Response |
|---|---|
| joke / tell me a joke | Tells a random joke |
| fun fact / fact | Shares a random fact |

### Utilities
| Command | Action |
|---|---|
| set a timer for 5 minutes | Sets a countdown timer |
| open calculator | Opens calculator app |

---

## How It Works

### Speech Recognition
Uses the browser's built-in `Web Speech API` (`SpeechRecognition`).
Only works in **Google Chrome**.

```js
var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
var rec = new SR();
rec.lang = "en-US";
rec.continuous = false;
rec.interimResults = false;
```

### Text-to-Speech
Uses `SpeechSynthesisUtterance` to speak responses.
Waits for voices to load via `onvoiceschanged` before greeting.

```js
var u = new SpeechSynthesisUtterance(text);
u.lang = "en-US";
u.rate = 1;
u.pitch = 1;
window.speechSynthesis.speak(u);
```

### Command Matching
All commands use `indexOf()` for reliable string matching.
Jokes and facts are checked first with `return` to prevent any conflicts.

```js
if (msg.indexOf("joke") !== -1) {
    s(pick(jokes));
    return;
}
```

---

## External Libraries Used

| Library | Version | CDN Link |
|---|---|---|
| Font Awesome | 6.4.0 | cdnjs.cloudflare.com |
| Google Fonts (Inter) | Latest | fonts.googleapis.com |

---

## Browser Support

| Browser | Voice Input | Text Input |
|---|---|---|
| Google Chrome | Yes | Yes |
| Microsoft Edge | Partial | Yes |
| Firefox | No | Yes |
| Safari | Partial | Yes |

> Voice recognition works best in **Google Chrome**.

---

## How to Run

1. Open the `own Virtual assisstant` folder
2. Open `index.html` in **Google Chrome**
3. Allow microphone permission when prompted
4. Click the mic button or type in the input box

---

## Developer

**Gagan Khandelwal**
- BTech Computer Science Student
- Web Developer
- GitHub: [gagankhandelwal00-ctrl](https://github.com/gagankhandelwal00-ctrl)
- LinkedIn: [gagan-khandelwal](https://www.linkedin.com/in/gagan-khandelwal-8368853a7)
- Email: gagankhandelwal335@gmail.com

---

## Project Version

- Version: 1.0.0
- Built: 2024
- Type: Frontend Web Project
- Language: HTML, CSS, JavaScript
