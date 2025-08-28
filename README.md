# 🎮 Roleta da Champ - League of Legends Arena

Um aplicativo web com design ousado inspirado no League of Legends para formar times de duas pessoas para o modo Arena.

## ✨ Características

- **Design Inspirado no LoL**: Interface com cores e estilo visual do League of Legends
- **Formação Automática de Times**: Algoritmo que forma times de 2 jogadores automaticamente
- **Tratamento de Números Ímpares**: Quando há número ímpar de jogadores, um fica como "Jogador Solo"
- **🆕 Não Repetição do Jogador Solo**: O mesmo jogador não fica solo em rodadas consecutivas
- **Funcionalidade de Copiar**: Botão para copiar os times formados para a área de transferência
- **Interface Responsiva**: Funciona em desktop e dispositivos móveis
- **Interface Simplificada**: Sem roleta visual, foco na formação rápida de times

## 🎯 Como Usar

1. **Adicionar Jogadores**:
   - Digite o nome do jogador no campo de entrada
   - Clique em "Adicionar" ou pressione Enter
   - Repita para todos os jogadores

2. **Formar Times**:
   - Clique em "Formar Times" para gerar os times instantaneamente
   - Se houver número ímpar, um jogador ficará como "Solo"

3. **Nova Rodada**:
   - Clique em "Nova Rodada" para refazer a formação
   - **O jogador que foi solo na rodada anterior não será solo novamente**

4. **Copiar Resultados**:
   - Clique em "Copiar Times" para copiar os resultados formatados
   - Cole em qualquer aplicativo (Discord, WhatsApp, etc.)

5. **Controles**:
   - **Nova Rodada**: Mantém os jogadores mas refaz a formação de times (evita repetir jogador solo)
   - **Resetar Tudo**: Remove todos os jogadores e recomeça

## 🔄 Sistema Anti-Repetição

O aplicativo possui um sistema inteligente que:
- **Lembra** quem foi jogador solo nas rodadas anteriores
- **Evita** que o mesmo jogador seja solo consecutivamente
- **Prioriza** jogadores que ainda não foram solo
- **Reseta** o histórico quando você clica em "Resetar Tudo"

## 📋 Formato de Cópia

Quando você copia os times, o formato será:

```
🎮 TIMES FORMADOS - ROLETA DA CHAMP

⚔️ TIME 1:
• João
• Maria

⚔️ TIME 2:
• Pedro
• Ana

🔄 JOGADOR SOLO:
• Carlos
(Aguarda próxima rodada ou entra como substituto)

Inspirado no League of Legends Arena Mode
Boa sorte na Fenda do Invocador! ⚔️
```

## 🎨 Design

O aplicativo utiliza a paleta de cores oficial do League of Legends:
- **Azul Escuro**: #0A1428 (fundo principal)
- **Dourado**: #C89B3C (acentos e bordas)
- **Azul Brilhante**: #0596AA (elementos interativos)
- **Roxo Místico**: #7B68EE (efeitos mágicos)

## 🚀 Tecnologias

- **React**: Framework JavaScript para interface
- **Tailwind CSS**: Framework CSS para estilização
- **Lucide Icons**: Ícones modernos
- **Vite**: Build tool para desenvolvimento rápido

## 📱 Responsividade

O aplicativo é totalmente responsivo e funciona em:
- Desktop (1920x1080+)
- Tablets (768px+)
- Smartphones (320px+)

## 🌐 Acesso Online

O aplicativo está disponível permanentemente em:
**https://caio2909.github.io/roletadachamp/**

## 🎮 Inspiração

Inspirado no modo Arena do League of Legends, este aplicativo traz a atmosfera épica do jogo para a formação de times, com:
- Visual futurista e mágico
- Cores vibrantes e contrastantes
- Interface intuitiva e profissional
- Funcionalidade prática para compartilhamento
- Sistema justo de rotação de jogadores

---

**Boa sorte na Fenda do Invocador!** ⚔️

