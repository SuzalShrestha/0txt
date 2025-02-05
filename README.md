# 0txt

**0txt** is a secure, privacy-focused, open-source text storage platform inspired by [ProtectedText](https://www.protectedtext.com/). It allows users to create, save, and manage encrypted notes without any central authority having access to their data.
<img width="1108" alt="Screenshot 2025-02-05 at 9 38 34 PM" src="https://github.com/user-attachments/assets/4bc05e7f-49fb-420b-92ae-3e2cdb2c9603" />

---

## 🚀 Features

- **End-to-End Encryption:** All notes are encrypted client-side, ensuring only you can read them.
- **Password Protection:** Password protection for enhanced security.
- **No Account Required:** Create and manage notes without registration.
- **Lightweight & Fast:** Optimized for performance with a minimalistic UI.
- **Mobile-Friendly:** Responsive design for seamless usage on mobile devices.

---

## ⚡ Getting Started

### Clone the Repository
```bash
# Clone the repository
git clone https://github.com/suzalshrestha/0txt.git
cd 0txt
```

### Install Dependencies
```bash
npm install
```

### Run Locally
```bash
npm run dev
# The app will be running at http://localhost:3000
```

### Build for Production
```bash
npm run build
npm start
```

---

## 🚀 CI/CD Pipeline

### GitHub Actions Workflow
- **Trigger:** On every push to the `production` branch.
- **Tasks:** SSH into the production server, pull the latest changes, run lint checks, build the project, and restart the server using PM2.


> **Note:** Never commit `.env` to version control.

---

## 🧪 Linting & Code Quality
- **Linting:** Uses [ESLint](https://eslint.org/)
- **Run Linter:**
```bash
npm run lint
```

To auto-fix issues:
```bash
npm run lint -- --fix
```

---

## 🛡️ Security Considerations
- All encryption happens **client-side**.
- No sensitive data is stored on the server.
- Strong password recommendations for note protection.

> **Disclaimer:** Always audit open-source projects before using them in production for sensitive data.

---

## 🤝 Contributing

1. **Fork the repository**
2. **Create your feature branch:** `git checkout -b feature/YourFeature`
3. **Commit your changes:** `git commit -m 'Add new feature'`
4. **Push to the branch:** `git push origin feature/YourFeature`
5. **Open a Pull Request**

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- Inspired by [ProtectedText](https://www.protectedtext.com/)
- Special thanks to the open-source community ❤️

---

**Built with ❤️ by [sujal](https://github.com/suzalshrestha)**

