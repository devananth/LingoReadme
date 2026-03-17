# 🌍 GitLocalize: Because open-source should speak your language.

[![Hackathon Project](https://img.shields.io/badge/Hackathon-Project-blueviolet?style=for-the-badge)](#)
[![Manifest V3](https://img.shields.io/badge/Chrome-Manifest_V3-4285F4?style=for-the-badge&logo=google-chrome&logoColor=white)](#)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](#)

## 📖 Description
**GitLocalize** is an AI-powered Chrome Extension and Node.js backend that translates GitHub READMEs instantly while preserving the original Markdown formatting. By injecting a native "Translate" button directly into the GitHub UI, it allows developers from anywhere in the world to read complex technical documentation in their native language without leaving the repository.

## 🎯 Why This Idea? (Pain Points)
Open-source software powers the world, but it has a massive barrier to entry: **Language**. 
* **The "Google Translate" Problem:** If a non-English speaker right-clicks and translates a GitHub page using standard browser tools, the HTML manipulation destroys technical context. Bash commands get translated into literal verbs, JSON keys get altered, and Markdown tables break.
* **Friction in Collaboration:** Developers waste time copying and pasting text chunk-by-chunk into external translators just to understand how to install a library or contribute to a project.
* **Our Solution:** GitLocalize fetches the raw `.md` file, translates it using the context-aware Lingo.dev AI engine, and safely renders it back to the screen—ensuring that code snippets, terminal commands, and technical jargon remain perfectly intact.

## 🎥 Demo

[![Watch the demo](https://img.youtube.com/vi/H2K9IT2te4s/0.jpg)](https://www.youtube.com/watch?v=H2K9IT2te4s)


## 🛠 Tech Stack
* **Frontend (Extension):** JavaScript (Manifest V3), HTML/CSS, Chrome Storage API, `marked.js` (for Markdown-to-HTML rendering).
* **Backend (API):** Node.js, Express.js, CORS.
* **Translation Engine:** Lingo.dev SDK.
* **Optimization:** `p-limit` (for managing highly concurrent API requests and avoiding rate limits).
* **Hosting:** Render (Backend).

## 📂 File Structure
```text
gitlocalize/
│
├── backend/                  # Express server for API handling
│   ├── .env                  # Environment variables (Lingo.dev API Key)
│   ├── package.json          # Backend dependencies
│   └── server.js             # Express app, chunking logic, and Lingo.dev integration
│
└── extension/                # Chrome Extension files
    ├── manifest.json         # Manifest V3 configuration
    ├── background.js         # Service worker for API calls
    ├── content.js            # GitHub DOM manipulation & UI injection
    ├── marked.min.js         # Local copy of marked.js parser
    ├── popup.html            # Extension dropdown UI
    └── popup.js              # Language selection & storage logic
```

## 💻 How to Clone and Run Locally

We built GitLocalize to be plug-and-play. The backend is already live-hosted on Render, so **you can test the extension instantly without running the local server.**

### Option 1: Quick Test (Using our Live Backend)
1. Download or clone this repository: `git clone https://github.com/your-username/gitlocalize.git`
2. Open Google Chrome and navigate to `chrome://extensions`.
3. Toggle on **Developer Mode** (top right corner).
4. Click **Load Unpacked** and select the `/extension` folder from this repo.
5. Pin the extension, select your language from the popup, and visit any GitHub repo (e.g., [facebook/react](https://github.com/facebook/react)) to see it in action!
   
   ⚠️ IMPORTANT NOTE: Our backend is hosted on Render's free tier. If the server has been inactive, the very first translation request may take up to 60 seconds while the container spins up from a cold start. Please be patient! All subsequent translation requests will process rapidly in just a few seconds.

### Option 2: Full Local Setup (Run your own API)
If you want to run the translation engine locally on your machine:

**1. Start the Backend:**
1. Navigate to the backend directory: `cd backend`
2. Install dependencies: `npm install`
3. Create a `.env` file and add your Lingo.dev key:
   ```env
   LINGODOTDEV_API_KEY=your_api_key_here
   PORT=3000
   ```
4. Start the server: `node server.js`

**2. Point the Extension to Localhost:**
1. Open `extension/content.js` (or `background.js`, depending on your architecture).
2. Change the fetch URL from our live Render link to your local server:
   ```javascript
   // Change from: const API_URL = "[https://your-app.onrender.com/api/translate](https://your-app.onrender.com/api/translate)";
   const API_URL = "http://localhost:3000/api/translate";
   ```
3. Go back to `chrome://extensions` and click the **Refresh** icon on the GitLocalize extension card.

## 🚀 Future Scopes
* **💾 Offline Persistence & Export:** Allow users to persist generated translations and download the localized `.md` files directly to their machine for offline viewing or direct repository commits.
* **💬 PR & Issue Translation:** Extend the DOM injection script to detect and translate real-time discussions, code review comments, and descriptions within GitHub Pull Requests and Issues.
* **🌐 Auto-Language Detection:** Leverage the browser's `Accept-Language` header to automatically detect the user's native language and trigger the appropriate translation without requiring manual popup selection.
