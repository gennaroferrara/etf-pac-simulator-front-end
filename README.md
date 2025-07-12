# 📈 ETF PAC Simulator

**Advanced ETF PAC Platform - University Project**

Una piattaforma per la simulazione di investimenti ETF con Piano di Accumulo del Capitale (PAC), sviluppata come project work universitario.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-18.2-blue.svg)
![Vite](https://img.shields.io/badge/Vite-4.4-green.svg)
![Tailwind](https://img.shields.io/badge/TailwindCSS-3.3-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 🚀 Caratteristiche Principali

### 💡 **Funzionalità Core**
- **Simulazione PAC Avanzata** con 6 strategie di investimento
- **Portfolio Multi-ETF** con allocazione dinamica personalizzabile
- **Backtesting Storico** su dati reali degli ultimi anni
- **Confronto Strategie** multiple in tempo reale
- **Sistema Notifiche** e gestione stato avanzata

### 📊 **Strategie Implementate**
1. **Dollar Cost Averaging (DCA)** - Investimento costante
2. **Value Averaging** - Aggiustamento basato su target
3. **Momentum Strategy** - Investimenti durante trend positivi
4. **Contrarian Strategy** - Investimenti durante ribassi
5. **Smart Beta** - Ottimizzazione multi-fattoriale
6. **Tactical Asset Allocation** - Allocazione dinamica

### 🎯 **Metriche Finanziarie**
- **Sharpe Ratio** - Rendimento aggiustato per il rischio
- **Calmar Ratio** - Rapporto rendimento/max drawdown
- **Maximum Drawdown** - Perdita massima storica
- **Volatilità** e **Beta** vs benchmark
- **VaR/CVaR** - Value at Risk e Conditional VaR
- **Alpha/Information Ratio** - Performance vs mercato

### 🛠️ **Stack Tecnologico**
- **Frontend**: React 18 + Vite + Tailwind CSS
- **Grafici**: Recharts per visualizzazioni avanzate
- **Icone**: Lucide React per UI moderna
- **State Management**: React Hooks personalizzati
- **Testing**: Vitest + Testing Library
- **Build**: Vite con ottimizzazioni avanzate

## 📋 Prerequisiti

- **Node.js** >= 16.0.0
- **npm** >= 8.0.0 o **yarn** >= 1.22.0
- **Git** per il version control

## ⚡ Quick Start

### 1. **Clone del Repository**
```bash
git clone https://github.com/gennaroferrara/etf-pac-simulator-front-end.git
cd etf-pac-simulator-front-end
```

### 2. **Installazione Dipendenze**
```bash
# Con npm
npm install

# Con yarn
yarn install
```

### 3. **Avvio Development Server**
```bash
# Con npm
npm run dev

# Con yarn
yarn dev
```

L'applicazione sarà disponibile su **http://localhost:5173** 🎉

## 📁 Struttura del Progetto

```
etf-pac-simulator/
├── public/                 # File statici
├── src/
│   ├── components/         # Componenti React
│   │   ├── Dashboard/      # Dashboard principale
│   │   ├── Configuration/  # Setup portfolio
│   │   ├── Results/        # Risultati simulazioni
│   │   ├── Comparison/     # Confronto strategie
│   │   ├── Backtest/       # Backtesting storico
│   │   └── UI/            # Componenti riutilizzabili
│   ├── hooks/             # Custom React hooks
│   ├── services/          # API services
│   ├── utils/             # Utilities e calcoli
│   ├── constants/         # Costanti e configurazioni
│   ├── App.jsx           # Componente principale
│   └── index.css         # Stili globali
├── package.json          # Dipendenze e scripts
├── vite.config.js        # Configurazione Vite
├── tailwind.config.js    # Configurazione Tailwind
└── README.md            # Documentazione
```

## 🔧 Comandi Disponibili

```bash
# Development
npm run dev                # Avvia server di sviluppo
npm run build              # Build per produzione
npm run preview            # Preview build locale

# Testing
npm run test               # Esegui test
npm run test:ui            # Test con interfaccia grafica
npm run test:coverage      # Test con coverage report

# Linting
npm run lint               # Controlla codice con ESLint
```

## 🎮 Utilizzo dell'Applicazione

### **1. Dashboard**
- Panoramica portfolio e simulazioni attive
- Quick actions per funzionalità principali
- Market intelligence real-time
- Simulazioni salvate e metriche

### **2. Configurazione**
- Setup portfolio con allocazione ETF personalizzabile
- Selezione strategia di investimento
- Parametri avanzati (stop loss, take profit, rebalancing)
- Validazione configurazione in tempo reale

### **3. Simulazione**
- Esecuzione simulazione con progress tracking
- Calcoli finanziari avanzati in tempo reale
- Generazione dati storico-sintetici
- Metriche di performance complete

### **4. Risultati**
- Dashboard KPI con metriche chiave
- Grafici interattivi (performance, allocazione, drawdown)
- Analisi rischio-rendimento dettagliata
- Export dati e reportistica

### **5. Backtesting**
- Test su dati storici reali (2019-2024)
- Analisi performance per anno
- Scenari di stress testing
- Confronto con benchmark

## 📊 Componenti Principali

### **useSimulation Hook**
```javascript
const {
  simulationData,
  results,
  isSimulating,
  runSimulation,
  runBacktest,
  resetSimulation
} = useSimulation();
```

### **Utilities Finanziarie**
```javascript
import {
  calculateSharpeRatio,
  calculateMaxDrawdown,
  calculateVaR,
  calculateBeta
} from '@/utils/calculations';
```

## 🎨 Personalizzazione

### **Colori e Temi**
Modifica `tailwind.config.js` per personalizzare:
- Color palette finanziaria
- Gradients e animazioni
- Componenti custom

### **Configurazione ETF**
Aggiorna `src/constants/index.js`:
- Lista ETF disponibili
- Strategie di investimento
- Configurazioni default

### **Metriche e Calcoli**
Estendi `src/utils/calculations.js`:
- Nuove metriche finanziarie
- Algoritmi di ottimizzazione
- Modelli di simulazione

## 🧪 Testing

### **Test Coverage**
```bash
npm run test:coverage
```

### **Test Structure**
```
src/
├── __tests__/
│   ├── components/
│   ├── hooks/
│   ├── utils/
│   └── setup.js
```

### **Example Test**
```javascript
import { render, screen } from '@testing-library/react';
import Dashboard from '../components/Dashboard/Dashboard';

test('renders dashboard with user data', () => {
  render(<Dashboard user={mockUser} />);
  expect(screen.getByText('Portfolio Totale')).toBeInTheDocument();
});
```

## 🚀 Deployment

### **Build per Produzione**
```bash
npm run build
```

### **Deploy su Vercel**
```bash
npm install -g vercel
vercel --prod
```

### **Deploy su Netlify**
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### **Docker**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 5173
CMD ["npm", "run", "preview"]
```
## 🤝 Contributing

1. Fork del repository
2. Crea feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

Questo progetto è rilasciato sotto licenza MIT. Vedi [LICENSE](LICENSE) per dettagli.

## 👨‍💻 Autore

**Genanro Ferrara**
- Email: gennaro.ferrara@pegaso.it

**🚀 Happy Investing!**
