# 🔐 FileEncrypta

A file encryption and decryption web application. Files are processed by the Node.js backend using AES-256-CBC encryption, with an optional custom key.

## 🚀 Features

- 🔑 **Custom Key Encryption** – Encrypt your file using your own secret key.
- 🔓 **Decryption with or without key** – If encryption was done without a key, decryption won't require one.
- 🧠 **Simple UI/UX** – Built for speed and usability.
- 📂 **Supports All File Types** – PDF, DOCX, MP4, PNG, TXT, etc.
- 🔐 **AES-256-CBC Encryption** – Strong and secure industry-standard encryption.
- 💻 **Backend-Powered Security** – Secure operations handled using Node.js & Crypto module.

## 🛠️ Tech Stack

| Layer     | Technology                         |
|-----------|------------------------------------|
| Frontend  | React.js, Tailwind CSS             |
| Backend   | Node.js, Express.js                |
| Database  | MongoDB (via Mongoose)             |
| Crypto    | AES-256-CBC via Node.js `crypto`   |
| UUID      | `uuid` for file identifiers        |

## 📥 How to Use



// Step 1:
cd server
node server.js

// Step 2:
cd client
npm run dev
```

### 🔐 Step 3: Encrypt a File
- Upload your file
- Enter a custom key (or skip if you want non-key encryption)
- Click **Encrypt**
- Your encrypted file will be ready for download

### 🔓 Step 4: Decrypt a File
- Upload an encrypted file
- Enter the same key used during encryption (or skip if it was encrypted without key)
- Click **Decrypt**
- The original file will be available for download

## 🚀 Deployment

Host instantly on:
[Deploy on Vercel](https://file-cryptography-encryption.vercel.app/)

## 🛡️ Security Note

Uses AES-256-CBC with secure key derivation (PBKDF2 + salt + IV)
- Files are encrypted with a combination of:
- Random salt (to derive the key)
-- Random iv (for cipher variation)
-- Only encrypted data + metadata is stored. Your actual file is never exposed.
- Files are never shared publicly or stored insecurely 

⚠️ **Important**: Always test the encryption/decryption process with dummy data before using it for critical files. The author is not responsible for any data loss.

## 🤝 Contributing

Pull requests are welcome! If you have suggestions for improvements or want to add new features (drag & drop, file history, etc.), feel free to open an issue or PR.


Made with ❤️ by [Naik Muhammad](https://github.com/NaikMuhammadAnsari)
