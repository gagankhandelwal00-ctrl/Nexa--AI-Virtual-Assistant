window.addEventListener("load", function () {

    // Elements
    var btn        = document.getElementById("btn");
    var micIcon    = document.getElementById("micIcon");
    var content    = document.getElementById("content");
    var chatBox    = document.getElementById("chatBox");
    var dot        = document.getElementById("dot");
    var statusText = document.getElementById("statusText");
    var themeBtn   = document.getElementById("themeBtn");
    var visualizer = document.getElementById("visualizer");
    var histBtn    = document.getElementById("histBtn");
    var histPanel  = document.getElementById("histPanel");
    var textInput  = document.getElementById("textInput");
    var sendBtn    = document.getElementById("sendBtn");
    var chatDate   = document.getElementById("chatDate");
    var pContainer = document.getElementById("particles");

    var isListening = false;
    var history     = [];

    // Date
    chatDate.textContent = new Date().toLocaleDateString("en-US", {
        weekday: "long", year: "numeric", month: "long", day: "numeric"
    });

    // Particles
    for (var i = 0; i < 18; i++) {
        var p    = document.createElement("div");
        p.className = "particle";
        var sz   = Math.random() * 5 + 2;
        p.style.width             = sz + "px";
        p.style.height            = sz + "px";
        p.style.left              = (Math.random() * 100) + "%";
        p.style.background        = Math.random() > 0.5 ? "#1591cf" : "#d42b7a";
        p.style.animationDuration = (Math.random() * 12 + 8) + "s";
        p.style.animationDelay    = (Math.random() * 8) + "s";
        pContainer.appendChild(p);
    }

    // Theme
    themeBtn.addEventListener("click", function () {
        document.body.classList.toggle("light");
        themeBtn.innerHTML = document.body.classList.contains("light")
            ? '<i class="fas fa-sun"></i>'
            : '<i class="fas fa-moon"></i>';
    });

    // History panel
    histBtn.addEventListener("click", function () {
        histPanel.classList.toggle("open");
        histBtn.innerHTML = histPanel.classList.contains("open")
            ? '<i class="fas fa-times"></i> Close History'
            : '<i class="fas fa-history"></i> Command History';
    });

    // Add message
    function addMsg(text, sender) {
        var div       = document.createElement("div");
        div.className = "msg " + (sender === "user" ? "user-msg" : "nexa-msg");
        var icon      = sender === "user" ? "fa-user" : "fa-robot";
        div.innerHTML = '<div class="av"><i class="fas ' + icon + '"></i></div><div class="bubble">' + text + '</div>';
        chatBox.appendChild(div);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // Add history
    function addHistory(cmd) {
        if (!cmd.trim()) return;
        history.unshift(cmd);
        if (history.length > 20) history.pop();
        histPanel.innerHTML = history.map(function (c) {
            return '<div class="hist-item" onclick="window.runCmd(\'' + c.replace(/'/g, "\\'") + '\')"><i class="fas fa-chevron-right"></i> ' + c + '</div>';
        }).join("");
    }

    // Speak — the correct way
    function speak(text) {
        var synth = window.speechSynthesis;
        if (synth.speaking) synth.cancel();

        var u    = new SpeechSynthesisUtterance(text);
        u.lang   = "en-US";
        u.rate   = 1;
        u.pitch  = 1;
        u.volume = 1;

        // pick a good voice if available
        var voices = synth.getVoices();
        for (var i = 0; i < voices.length; i++) {
            if (voices[i].lang === "en-US" && voices[i].name.indexOf("Google") !== -1) {
                u.voice = voices[i];
                break;
            }
        }

        u.onstart = function () {
            dot.className          = "dot speaking";
            statusText.textContent = "Nexa is speaking...";
            visualizer.classList.add("on");
        };
        u.onend = function () {
            dot.className          = "dot ready";
            statusText.textContent = "Ready to assist";
            visualizer.classList.remove("on");
        };
        u.onerror = function () {
            dot.className          = "dot ready";
            statusText.textContent = "Ready to assist";
            visualizer.classList.remove("on");
        };

        synth.speak(u);
    }

    // Greet after voices load
    function greet() {
        var h = new Date().getHours();
        var g = h < 12 ? "Good Morning" : h < 17 ? "Good Afternoon" : "Good Evening";
        speak(g + " Gagan! I am Nexa, your personal AI assistant. How can I help you today?");
        dot.className = "dot ready";
    }

    var voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
        setTimeout(greet, 500);
    } else {
        window.speechSynthesis.onvoiceschanged = function () {
            setTimeout(greet, 300);
        };
    }

    // Reset mic
    function resetBtn() {
        isListening            = false;
        btn.classList.remove("listening");
        micIcon.className      = "fas fa-microphone";
        content.textContent    = "Click to speak";
        dot.className          = "dot ready";
        statusText.textContent = "Ready to assist";
        visualizer.classList.remove("on");
    }

    // Speech Recognition
    var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
        content.textContent = "Voice not supported. Use Chrome or type below.";
        btn.disabled        = true;
        btn.style.opacity   = "0.5";
    } else {
        var rec             = new SR();
        rec.lang            = "en-US";
        rec.continuous      = false;
        rec.interimResults  = false;
        rec.maxAlternatives = 1;

        rec.onstart = function () {
            isListening            = true;
            dot.className          = "dot listening";
            statusText.textContent = "Listening...";
            content.textContent    = "Listening...";
            btn.classList.add("listening");
            micIcon.className      = "fas fa-stop";
            visualizer.classList.add("on");
        };

        rec.onresult = function (e) {
            var t = e.results[e.resultIndex][0].transcript;
            content.textContent = t;
            addMsg(t, "user");
            addHistory(t.toLowerCase());
            takeCommand(t.toLowerCase());
        };

        rec.onerror = function (e) {
            resetBtn();
            if (e.error === "not-allowed") {
                addMsg("Microphone access denied. Please allow mic permission.", "nexa");
            } else if (e.error === "no-speech") {
                addMsg("No speech detected. Please try again or type below.", "nexa");
            } else {
                addMsg("Error: " + e.error + ". Please try again.", "nexa");
            }
        };

        rec.onend = resetBtn;

        btn.addEventListener("click", function () {
            if (isListening) { rec.stop(); return; }
            try { rec.start(); } catch (err) { resetBtn(); }
        });
    }

    // Text input
    function sendText() {
        var val = textInput.value.trim();
        if (!val) return;
        addMsg(val, "user");
        addHistory(val.toLowerCase());
        takeCommand(val.toLowerCase());
        textInput.value = "";
    }
    sendBtn.addEventListener("click", sendText);
    textInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter") sendText();
    });

    // Chip command — global
    window.runCmd = function (cmd) {
        addMsg(cmd, "user");
        addHistory(cmd.toLowerCase());
        takeCommand(cmd.toLowerCase());
    };

    // Data
    var jokes = [
        "Why do scientists not trust atoms? Because they make up everything!",
        "Why do programmers prefer dark mode? Because light attracts bugs!",
        "I told my computer I needed a break. Now it keeps sending me Kit Kat ads.",
        "What did one ocean say to the other? Nothing, they just waved!",
        "Why did the scarecrow win an award? He was outstanding in his field!",
        "How do you comfort a JavaScript bug? You console it!",
        "Why was the math book sad? It had too many problems.",
        "What do you call a fake noodle? An impasta!",
        "Why did the bicycle fall over? Because it was two tired!",
        "What do you call a bear with no teeth? A gummy bear!"
    ];

    var facts = [
        "Honey never spoils. Archaeologists found 3000 year old honey in Egyptian tombs!",
        "A day on Venus is longer than a year on Venus.",
        "Octopuses have three hearts and blue blood.",
        "The Eiffel Tower grows about 6 inches taller in summer due to heat expansion.",
        "Bananas are berries, but strawberries are not.",
        "A group of flamingos is called a flamboyance.",
        "The human brain uses about 20 percent of the total body energy.",
        "A snail can sleep for 3 years.",
        "The shortest war in history lasted only 38 minutes.",
        "Cows have best friends and get stressed when separated."
    ];

    function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

    // ── COMMAND HANDLER ──────────────────────────────────────
    function takeCommand(msg) {

        // s() — speak and show in chat
        function s(text) {
            speak(text);
            addMsg(text, "nexa");
        }

        // ── JOKES — always first ──────────────────────────────
        if (msg.indexOf("joke") !== -1) {
            s(pick(jokes));
            return;
        }

        // ── FACTS — always second ─────────────────────────────
        if (msg.indexOf("fact") !== -1) {
            s("Here is a fun fact: " + pick(facts));
            return;
        }

        // ── GREETINGS ─────────────────────────────────────────
        if (msg.indexOf("hello") !== -1 || msg.indexOf("hey") !== -1 || msg.indexOf("hi") !== -1) {
            s("Hello Gagan! How can I assist you today?");

        } else if (msg.indexOf("how are you") !== -1) {
            s("I am doing great Gagan! How about you?");

        } else if (msg.indexOf("who are you") !== -1 || msg.indexOf("what are you") !== -1) {
            s("I am Nexa, your AI powered virtual assistant. I can open websites, tell jokes, give you the time and much more!");

        } else if (msg.indexOf("my name") !== -1 || msg.indexOf("who am i") !== -1) {
            s("Your name is Gagan Khandelwal, a talented web developer and CSE student!");

        } else if (msg.indexOf("thank") !== -1) {
            s("You are always welcome Gagan! That is what I am here for.");

        } else if (msg.indexOf("bye") !== -1 || msg.indexOf("goodbye") !== -1) {
            s("Goodbye Gagan! Have an amazing day. I will be here whenever you need me!");

        // ── TIME ──────────────────────────────────────────────
        } else if (msg.indexOf("time") !== -1) {
            var t = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
            s("The current time is " + t);

        // ── DATE ──────────────────────────────────────────────
        } else if (msg.indexOf("date") !== -1 || msg.indexOf("today") !== -1) {
            var d = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
            s("Today is " + d);

        } else if (msg.indexOf("day") !== -1) {
            var day = new Date().toLocaleDateString("en-US", { weekday: "long" });
            s("Today is " + day);

        // ── YOUTUBE ───────────────────────────────────────────
        } else if (msg.indexOf("search youtube") !== -1) {
            var q = msg.replace("search youtube for", "").replace("search youtube", "").trim();
            s("Searching YouTube for " + q);
            window.open("https://www.youtube.com/results?search_query=" + encodeURIComponent(q), "_blank");

        } else if (msg.indexOf("youtube") !== -1) {
            s("Opening YouTube!");
            window.open("https://www.youtube.com", "_blank");

        // ── WEBSITES ──────────────────────────────────────────
        } else if (msg.indexOf("google") !== -1 && msg.indexOf("maps") === -1) {
            s("Opening Google!");
            window.open("https://www.google.com", "_blank");

        } else if (msg.indexOf("instagram") !== -1) {
            s("Opening Instagram!");
            window.open("https://www.instagram.com", "_blank");

        } else if (msg.indexOf("facebook") !== -1) {
            s("Opening Facebook!");
            window.open("https://www.facebook.com", "_blank");

        } else if (msg.indexOf("twitter") !== -1) {
            s("Opening Twitter!");
            window.open("https://www.twitter.com", "_blank");

        } else if (msg.indexOf("linkedin") !== -1) {
            s("Opening LinkedIn!");
            window.open("https://www.linkedin.com", "_blank");

        } else if (msg.indexOf("whatsapp") !== -1) {
            s("Opening WhatsApp!");
            window.open("https://web.whatsapp.com", "_blank");

        } else if (msg.indexOf("github") !== -1) {
            s("Opening GitHub!");
            window.open("https://www.github.com", "_blank");

        } else if (msg.indexOf("gmail") !== -1) {
            s("Opening Gmail!");
            window.open("https://mail.google.com", "_blank");

        } else if (msg.indexOf("netflix") !== -1) {
            s("Opening Netflix!");
            window.open("https://www.netflix.com", "_blank");

        } else if (msg.indexOf("maps") !== -1) {
            s("Opening Google Maps!");
            window.open("https://maps.google.com", "_blank");

        } else if (msg.indexOf("spotify") !== -1 || msg.indexOf("music") !== -1) {
            s("Opening Spotify!");
            window.open("https://www.spotify.com", "_blank");

        } else if (msg.indexOf("calculator") !== -1) {
            s("Opening Calculator!");
            window.open("calculator://");

        } else if (msg.indexOf("weather") !== -1) {
            s("Opening weather for you!");
            window.open("https://www.weather.com", "_blank");

        } else if (msg.indexOf("translate") !== -1) {
            var q2 = msg.replace("translate", "").trim();
            s("Opening Google Translate!");
            window.open("https://translate.google.com/?text=" + encodeURIComponent(q2), "_blank");

        // ── TIMER ─────────────────────────────────────────────
        } else if (msg.indexOf("timer") !== -1) {
            var match = msg.match(/(\d+)/);
            if (match) {
                var mins = parseInt(match[1]);
                s("Timer set for " + mins + " minute" + (mins > 1 ? "s" : "") + "! I will notify you.");
                setTimeout(function () {
                    speak("Time is up Gagan! Your timer has ended.");
                    addMsg("Time is up! Your timer has ended.", "nexa");
                }, mins * 60 * 1000);
            } else {
                s("Please tell me how many minutes for the timer.");
            }

        // ── WIKIPEDIA ─────────────────────────────────────────
        } else if (msg.indexOf("what is") !== -1 || msg.indexOf("who is") !== -1 || msg.indexOf("tell me about") !== -1) {
            var q3 = msg.replace("what is", "").replace("who is", "").replace("tell me about", "").trim();
            s("Searching Wikipedia for " + q3);
            window.open("https://en.wikipedia.org/wiki/" + encodeURIComponent(q3), "_blank");

        // ── DEFAULT GOOGLE SEARCH ─────────────────────────────
        } else {
            var q4 = msg.replace(/nexa|mexa/g, "").trim();
            s("Here is what I found for: " + q4);
            window.open("https://www.google.com/search?q=" + encodeURIComponent(q4), "_blank");
        }
    }

});
