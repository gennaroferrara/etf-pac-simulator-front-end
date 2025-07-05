# 🚀 Guida Installazione Completa - ETF PAC Simulator

Questa guida ti accompagnerà passo-passo nell'installazione e configurazione completa dell'applicazione ETF PAC Simulator.

## 📋 Prerequisiti

### **Software Richiesto**
- **Node.js** v16.0.0 o superiore
- **npm** v8.0.0 o superiore (incluso con Node.js)
- **Git** per il version control
- **Editor di codice** (consigliato: VS Code)

### **Verifica Installazioni**
```bash
# Verifica Node.js
node --version  # Dovrebbe mostrare v16.0.0 o superiore

# Verifica npm
npm --version   # Dovrebbe mostrare v8.0.0 o superiore

# Verifica Git
git --version   # Qualsiasi versione recente
```

## 🛠️ Installazione Step-by-Step

### **Step 1: Creazione Progetto**
```bash
# Metodo 1: Clone repository (se disponibile)
git clone https://github.com/marco-rossi/etf-pac-simulator.git
cd etf-pac-simulator

# Metodo 2: Creazione da zero
npm create vite@latest etf-pac-simulator -- --template react
cd etf-pac-simulator
```

### **Step 2: Installazione Dipendenze Base**
```bash
# Installa dipendenze del progetto
npm install

# Installa dipendenze specifiche per l'app
npm install recharts lucide-react

# Installa Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### **Step 3: Configurazione Tailwind CSS**

**Sostituisci il contenuto di `tailwind.config.js`:**
```javascript
// Usa il contenuto dal file tailwind-config che ho creato sopra
```

**Sostituisci il contenuto di `src/index.css`:**
```css
/* Usa il contenuto dal file main-css-file che ho creato sopra */
```

### **Step 4: Struttura delle Cartelle**
```bash
# Crea la struttura delle cartelle
mkdir -p src/components/{Dashboard,Configuration,Results,Comparison,Backtest,Analysis,UI}
mkdir -p src/{hooks,services,utils,constants}

# Verifica struttura
tree src/  # o ls -la src/ se tree non è disponibile
```

### **Step 5: Copia dei File**

**Crea i seguenti file nell'ordine:**

1. **`src/constants/index.js`** - Dati e configurazioni
2. **`src/hooks/useSimulation.js`** - Hook per simulazioni
3. **`src/hooks/useNotifications.js`** - Hook per notifiche
4. **`src/services/api.js`** - Servizi API
5. **`src/utils/calculations.js`** - Utilities finanziarie
6. **`src/utils/formatters.js`** - Utilities formattazione
7. **`src/components/UI/Header.jsx`** - Header componente
8. **`src/components/UI/Navigation.jsx`** - Navigazione
9. **`src/components/UI/NotificationSystem.jsx`** - Sistema notifiche
10. **`src/components/Dashboard/Dashboard.jsx`** - Dashboard principale
11. **`src/components/Configuration/Configuration.jsx`** - Configurazione
12. **`src/components/Results/Results.jsx`** - Risultati
13. **`src/components/Comparison/Comparison.jsx`** - Confronto
14. **`src/components/Backtest/Backtest.jsx`** - Backtesting
15. **`src/components/Analysis/Analysis.jsx`** - Analisi AI
16. **`src/App.jsx`** - App principale

### **Step 6: Configurazione Vite**

**Sostituisci `vite.config.js`:**
```javascript
// Usa il contenuto dal file vite-config che ho creato sopra
```

### **Step 7: Aggiorna package.json**

**Aggiungi le dipendenze mancanti:**
```bash
npm install --save-dev @vitejs/plugin-react
npm install --save-dev eslint eslint-plugin-react eslint-plugin-react-hooks
npm install --save-dev vitest jsdom @testing-library/react @testing-library/jest-dom
```

## ▶️ Primo Avvio

### **Avvia il Server di Sviluppo**
```bash
npm run dev
```

**L'applicazione dovrebbe:**
- Aprirsi automaticamente nel browser
- Essere disponibile su `http://localhost:5173`
- Mostrare la dashboard senza errori

### **Verifica Funzionamento**
1. ✅ Dashboard si carica correttamente
2. ✅ Navigation tabs funzionano
3. ✅ Configurazione accetta input
4. ✅ Simulazione si avvia (anche se con dati mock)
5. ✅ Grafici si renderizzano correttamente

## 🧪 Testing

### **Esegui i Test**
```bash
# Test base
npm run test

# Test con coverage
npm run test:coverage

# Test in modalità watch
npm run test -- --watch
```

### **Test Build di Produzione**
```bash
# Build per produzione
npm run build

# Preview build locale
npm run preview
```

## 🔧 Risoluzione Problemi Comuni

### **Errore: "Module not found"**
```bash
# Reinstalla node_modules
rm -rf node_modules package-lock.json
npm install
```

### **Errore Tailwind CSS non funziona**
```bash
# Verifica configurazione PostCSS
cat postcss.config.js

# Riavvia dev server
npm run dev
```

### **Errore importazioni React**
```bash
# Verifica versione React
npm list react react-dom

# Aggiorna se necessario
npm update react react-dom
```

### **Errore ESLint**
```bash
# Fix automatico
npm run lint -- --fix

# Disabilita temporaneamente
# Aggiungi /* eslint-disable */ all'inizio del file
```

## 🚀 Build e Deploy

### **Build Ottimizzata**
```bash
# Build per produzione
npm run build

# Verifica dimensioni bundle
npx vite-bundle-analyzer dist/
```

### **Deploy su Netlify**
```bash
# Installa Netlify CLI
npm install -g netlify-cli

# Login e deploy
netlify login
netlify deploy --prod --dir=dist
```

### **Deploy su Vercel**
```bash
# Installa Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

## 📝 Configurazione Sviluppo

### **VS Code Extensions Consigliate**
```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-react",
    "formulahendry.auto-rename-tag"
  ]
}
```

### **VS Code Settings**
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "tailwindCSS.emmetCompletions": true,
  "css.validate": false
}
```

## 🎯 Prossimi Passi

### **Personalizzazione**
1. **Modifica colori** in `tailwind.config.js`
2. **Aggiungi nuovi ETF** in `src/constants/index.js`
3. **Implementa nuove strategie** in `useSimulation.js`
4. **Estendi metriche** in `src/utils/calculations.js`

### **Integrazione Backend**
1. **Configura API endpoints** in `src/services/api.js`
2. **Implementa autenticazione** JWT
3. **Connetti database** PostgreSQL
4. **Setup cache** Redis

### **Testing Avanzato**
1. **Unit tests** per ogni componente
2. **Integration tests** per flussi completi
3. **E2E tests** con Cypress/Playwright
4. **Performance tests** con Lighthouse

## 🆘 Supporto

### **Debugging**
```bash
# Debug con source maps
npm run dev -- --debug

# Analisi bundle
npx vite-bundle-analyzer

# Check dependencies
npm audit
npm audit fix
```

### **Logs e Monitoring**
```bash
# Verifica console browser per errori
# Usa React Developer Tools
# Monitora Network tab per API calls
```

### **Contatti**
- **Email**: marco.rossi@studente.it
- **GitHub Issues**: [Repository Issues](https://github.com/marco-rossi/etf-pac-simulator/issues)
- **Documentazione**: [Wiki](https://github.com/marco-rossi/etf-pac-simulator/wiki)

---

**🎉 Congratulazioni! La tua installazione è completa!**

Ora puoi iniziare a utilizzare l'ETF PAC Simulator per il tuo project work universitario.

**📚 Next: Leggi il [README.md](README.md) per utilizzo avanzato e deployment.**