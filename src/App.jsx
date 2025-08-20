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
      alert('Adicione pelo menos 2 jogadores!')
      return
    }

    const shuffledPlayers = shuffleArray(players)
    const newTeams = []
    let solo = null

    // Incrementa o contador de rolagens
    const newRollCount = rollCount + 1
    setRollCount(newRollCount)

    // Se número ímpar, um jogador fica sozinho
    if (shuffledPlayers.length % 2 !== 0) {
      // Após players.length rolagens, permite repetição dos últimos 2 jogadores solo
      const shouldRestrictHistory = newRollCount <= players.length
      const restrictedPlayers = shouldRestrictHistory ? soloPlayerHistory : soloPlayerHistory.slice(-2)
      
      // Tenta escolher um jogador solo que não esteja na lista restrita
      const availableSoloPlayers = shuffledPlayers.filter(player => !restrictedPlayers.includes(player))
      if (availableSoloPlayers.length > 0) {
        const soloIndex = Math.floor(Math.random() * availableSoloPlayers.length)
        solo = availableSoloPlayers[soloIndex]
        shuffledPlayers.splice(shuffledPlayers.indexOf(solo), 1)
      } else {
        // Se todos foram solo recentemente, ou não há opção, escolhe o último
        solo = shuffledPlayers.pop()
      }
      
      // Mantém apenas os dois últimos jogadores solo no histórico
      setSoloPlayerHistory(prevHistory => {
        const newHistory = [...prevHistory, solo]
        return newHistory.slice(-2)
      })
    }

    // Forma os times de 2
    for (let i = 0; i < shuffledPlayers.length; i += 2) {
      newTeams.push([shuffledPlayers[i], shuffledPlayers[i + 1]])
    }

    setTeams(newTeams)
    setSoloPlayer(solo)
    setShowResults(true)
  }

  const reset = () => {
    setTeams([])
    setSoloPlayer(null)
    setSoloPlayerHistory([])
    setRollCount(0)
    setShowResults(false)
    setPlayers([])
  }

  const resetResults = () => {
    setTeams([])
    setSoloPlayer(null)
    setRollCount(0)
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
      textToCopy += `🔄 JOGADOR SOLO:\n• ${soloPlayer}\n(Jogará sozinho)\n\n`
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
                  Jogará a Arena sozinho 😭
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

