import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Card } from '@/components/ui/card.jsx'
import { Trash2, Users, UserX, RotateCcw, Copy } from 'lucide-react'
import './App.css'

function App() {
  const [players, setPlayers] = useState([])
  const [currentInput, setCurrentInput] = useState('')
  const [teams, setTeams] = useState([])
  const [soloPlayer, setSoloPlayer] = useState(null)
  const [soloPlayerHistory, setSoloPlayerHistory] = useState([])
  const [previousTeams, setPreviousTeams] = useState([])
  const [rollCount, setRollCount] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const addPlayer = () => {
    if (currentInput.trim() && !players.includes(currentInput.trim())) {
      setPlayers([...players, currentInput.trim()])
      setCurrentInput('')
    }
  }

  const removePlayer = (playerToRemove) => {
    setPlayers(players.filter(player => player !== playerToRemove))
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addPlayer()
    }
  }

  const shuffleArray = (array) => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  const generateTeams = () => {
    if (players.length < 2) {
      return
    }

    setShowResults(false)
    setRollCount(prev => prev + 1)

    let currentPlayers = [...players]
    let solo = null

    if (currentPlayers.length % 2 !== 0) {
        const availableSoloPlayers = currentPlayers.filter(p => !soloPlayerHistory.includes(p));
        if (availableSoloPlayers.length > 0) {
            solo = availableSoloPlayers[Math.floor(Math.random() * availableSoloPlayers.length)];
        } else {
            solo = currentPlayers[Math.floor(Math.random() * currentPlayers.length)];
        }
        currentPlayers = currentPlayers.filter(p => p !== solo);
        setSoloPlayerHistory(prev => [...prev.slice(-players.length + 1), solo]);
    } else {
      setSoloPlayer(null)
    }

    const findUniqueTeamSet = (playersToPair, pairs) => {
      if (playersToPair.length === 0) return []
      const player1 = playersToPair[0]
      const potentialPairs = shuffleArray(pairs.filter(p => p.includes(player1)))
      for (const pair of potentialPairs) {
        const player2 = pair.find(p => p !== player1)
        const remainingPlayers = playersToPair.filter(p => p !== player1 && p !== player2)
        const remainingPairs = pairs.filter(p => !p.includes(player1) && !p.includes(player2))
        const result = findUniqueTeamSet(remainingPlayers, remainingPairs)
        if (result !== null) {
          return [pair, ...result]
        }
      }
      return null
    }

    const allPossiblePairs = []
    for (let i = 0; i < currentPlayers.length; i++) {
      for (let j = i + 1; j < currentPlayers.length; j++) {
        allPossiblePairs.push([currentPlayers[i], currentPlayers[j]].sort())
      }
    }

    // Tenta gerar times com as duplas inéditas
    const previousTeamsSet = new Set(previousTeams.map(team => JSON.stringify(team)))
    const availablePairs = allPossiblePairs.filter(
      pair => !previousTeamsSet.has(JSON.stringify(pair))
    )

    let generatedTeams = findUniqueTeamSet(currentPlayers, availablePairs)
    let isNewHistory = false

    // Se falhar (histórico esgotado), entra na lógica de fallback
    if (!generatedTeams) {
      isNewHistory = true;
      // Filtra para usar todas as duplas, EXCETO as da última rodada
      const lastTeamsSet = new Set(teams.map(t => JSON.stringify(t)));
      const pairsForFallback = allPossiblePairs.filter(
        p => !lastTeamsSet.has(JSON.stringify(p))
      );

      // Tenta gerar com as duplas filtradas. Se não for possível (caso raro de haver apenas 1 combinação), usa todas.
      generatedTeams = findUniqueTeamSet(currentPlayers, pairsForFallback) || findUniqueTeamSet(currentPlayers, allPossiblePairs);
    }

    setTeams(generatedTeams || []);
    setSoloPlayer(solo);

    // Atualiza o histórico de forma inteligente
    if (isNewHistory) {
      // Se o histórico foi resetado, ele começa de novo apenas com os times gerados agora
      setPreviousTeams(generatedTeams || []);
    } else {
      // Se não, apenas adiciona os novos times ao histórico existente
      setPreviousTeams(prev => [...prev, ...(generatedTeams || [])]);
    }

    setShowResults(true);
  }

  const reset = () => {
    setTeams([])
    setSoloPlayer(null)
    setSoloPlayerHistory([])
    setPreviousTeams([])
    setRollCount(0)
    setShowResults(false)
    setPlayers([])
  }

  const resetResults = () => {
    setTeams([])
    setSoloPlayer(null)
    setShowResults(false)
  }

  const copyTeamsToClipboard = () => {
    let textToCopy = "🎮 TIMES FORMADOS - ROLETA DA CHAMP\n\n"

    teams.forEach((team, index) => {
      textToCopy += `⚔️ TIME ${index + 1}:\n`
      team.forEach(player => {
        textToCopy += `• ${player}\n`
      })
      textToCopy += "\n"
    })

    if (soloPlayer) {
      textToCopy += `🔄 JOGADOR SOLO:\n• ${soloPlayer}\n(Aguarda próxima rodada ou entra como substituto)\n\n`
    }

    textToCopy += "Inspirado no League of Legends Arena Mode\nBoa sorte na Fenda do Invocador! ⚔️"

    navigator.clipboard.writeText(textToCopy).then(() => {
      alert('Times copiados para a área de transferência!')
    }).catch(err => {
      console.error('Erro ao copiar para a área de transferência:', err)
      alert('Erro ao copiar para a área de transferência')
    })
  }

  return (
    <div className="min-h-screen p-4 flex flex-col items-center">
      {/* Header */}
      <div className="lol-container w-full max-w-4xl p-8 mb-8">
        <h1 className="lol-title text-center mb-4">
          Roleta da Champ
        </h1>
        <p className="text-center text-lg text-gray-300 mb-6">
          Gerador de Times para Arena - League of Legends
        </p>

        {/* Input Section */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Input
            className="lol-input flex-1"
            placeholder="Digite o nome do jogador..."
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <Button
            className="lol-button px-6"
            onClick={addPlayer}
            disabled={!currentInput.trim()}
          >
            <Users className="w-4 h-4 mr-2" />
            Adicionar
          </Button>
        </div>

        {/* Players List */}
        {players.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xl font-bold text-yellow-400 mb-3">
              Jogadores ({players.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {players.map((player, index) => (
                <div
                  key={index}
                  className="flex items-center bg-blue-900/50 border border-yellow-400 rounded px-3 py-1"
                >
                  <span className="text-white mr-2">{player}</span>
                  <button
                    onClick={() => removePlayer(player)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            className="lol-button px-8 py-3"
            onClick={generateTeams}
            disabled={players.length < 2}
          >
            Formar Times
          </Button>

          {showResults && (
            <Button
              className="lol-button px-6 py-3"
              onClick={resetResults}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Nova Rodada
            </Button>
          )}

          <Button
            className="lol-button px-6 py-3 bg-red-600 hover:bg-red-700"
            onClick={reset}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Resetar Tudo
          </Button>
        </div>
      </div>

      {/* Results */}
      {showResults && (
        <div className="w-full max-w-4xl fade-in">
          <div className="flex justify-between items-center mb-6">
            <h2 className="lol-title text-2xl">
              Times Formados
            </h2>
            <Button
              className="lol-button px-6 py-3"
              onClick={copyTeamsToClipboard}
            >
              <Copy className="w-4 h-4 mr-2" />
              Copiar Times
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teams.map((team, index) => (
              <Card key={index} className="team-card">
                <div className="team-title">
                  Time {index + 1}
                </div>
                {team.map((player, playerIndex) => (
                  <div key={playerIndex} className="player-name">
                    {player}
                  </div>
                ))}
              </Card>
            ))}

            {soloPlayer && (
              <Card className="team-card solo-player">
                <div className="team-title flex items-center">
                  <UserX className="w-5 h-5 mr-2" />
                  Jogador Solo
                </div>
                <div className="player-name">
                  {soloPlayer}
                </div>
                <p className="text-sm text-gray-300 mt-2">
                  Aguarda próxima rodada ou entra como substituto
                </p>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-12 text-center text-gray-400">
        <p>Inspirado no League of Legends Arena Mode</p>
        <p className="text-sm mt-1">Boa sorte na Fenda do Invocador!</p>
      </div>
    </div>
  )
}

export default App
