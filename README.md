# ⚽ Bolão Brasil – Copa do Mundo 2026

> Palpites interativos para os jogos do Brasil na Copa do Mundo FIFA 2026.

**Live demo:** [prof-ramos.github.io/bolao-copa-2026](https://prof-ramos.github.io/bolao-copa-2026/)

---

## 🇧🇷 Sobre

Aplicativo web single-page para preencher palpites dos jogos do Brasil na fase de grupos da Copa do Mundo 2026 (Grupo C). Sem necessidade de cadastro ou instalação — basta abrir no navegador, preencher e compartilhar.

### Jogos incluídos

| Jogo | Data | Horário (BRT) | Adversário | Local |
|------|------|---------------|------------|-------|
| 1 | Sáb, 13 Jun 2026 | 19h | 🇲🇦 Marrocos | MetLife Stadium, Nova Jersey |
| 2 | Sex, 19 Jun 2026 | 22h | 🇭🇹 Haiti | Lincoln Financial Field, Filadélfia |
| 3 | Qua, 24 Jun 2026 | 19h | 🏴󠁧󠁢󠁳󠁣󠁴󠁿 Escócia | Hard Rock Stadium, Miami |

### Pontuação

| Critério | Pontos |
|----------|--------|
| Resultado correto (V/E/D) | 1 pt |
| Placar exato | 3 pts |
| **Total possível** | **9 pts** |

---

## ✨ Funcionalidades

- **Tema claro/escuro** com toggle automático baseado na preferência do sistema
- **Auto-save** — palpites salvos automaticamente no `localStorage`
- **Compartilhar** — link com palpites codificados na URL (Web Share API no mobile, clipboard no desktop)
- **Exportar imagem** — salva o bolão preenchido como PNG via `html2canvas`
- **Imprimir** — layout otimizado para A4 com cores forçadas
- **Mobile-first** — responsivo para qualquer tamanho de tela
- **Acessibilidade** — labels, ARIA, semântica HTML5
- **Zero dependências de build** — HTML/CSS/JS puro, self-contained

---

## 🚀 Uso

### Acesso online

Acesse [prof-ramos.github.io/bolao-copa-2026](https://prof-ramos.github.io/bolao-copa-2026/), preencha seus palpites e compartilhe o link.

### Localmente

```bash
# Clone o repositório
git clone https://github.com/prof-ramos/bolao-copa-2026.git
cd bolao-copa-2026

# Abra no navegador
open index.html
# ou
npx serve .
```

Não requer `npm install` nem build.

---

## 🛠️ Stack

| Tecnologia | Uso |
|------------|-----|
| HTML5 | Estrutura semântica |
| CSS3 | Estilos com variáveis, mobile-first, dark mode |
| JavaScript (ES6+) | Lógica de interação, localStorage, share |
| [html2canvas](https://html2canvas.hertzen.com/) | Exportar como imagem (CDN) |
| [lz-string](https://pieroxy.net/blog/pages/lz-string/index.html) | Compressão de URL params (CDN) |
| [Bebas Neue](https://fonts.google.com/specimen/Bebas+Neue) | Fonte display |
| [Inter](https://fonts.google.com/specimen/Inter) | Fonte body |

---

## 📁 Estrutura

```
bolao-copa-2026/
├── index.html          # Aplicação completa (self-contained)
├── docs/
│   ├── index.html      # Cópia para GitHub Pages
│   └── .nojekyll       # Desabilita processamento Jekyll
├── ANALISE-FRONTEND.md # Relatório de análise técnica
└── README.md
```

---

## 🔗 Links

- **Repositório:** [github.com/prof-ramos/bolao-copa-2026](https://github.com/prof-ramos/bolao-copa-2026)
- **Live demo:** [prof-ramos.github.io/bolao-copa-2026](https://prof-ramos.github.io/bolao-copa-2026/)
- **Deploy:** GitHub Pages (branch `main`, path `/docs`)

---

## 📄 Licença

Este projeto é de uso livre para fins pessoais e não comerciais.

---

<p align="center">
  <img src="https://img.shields.io/badge/Copa-do-Mundo-2026-gold?style=for-the-badge" alt="Copa do Mundo 2026">
  <img src="https://img.shields.io/badge/Grupo-C-006b2b?style=for-the-badge" alt="Grupo C">
  <img src="https://img.shields.io/badge/Mobile--First-3daa60?style=for-the-badge" alt="Mobile First">
</p>
