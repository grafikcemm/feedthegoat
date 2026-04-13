import confetti from 'canvas-confetti'

// Task tamamlama — küçük patlama
export function fireTaskConfetti() {
  confetti({
    particleCount: 40,
    spread: 60,
    origin: { y: 0.6 },
    colors: ['#22c55e', '#16a34a', '#fbbf24', '#f59e0b'],
    ticks: 80,
    gravity: 1.2,
    scalar: 0.8,
  })
}

// Günü bitir — büyük patlama
export function fireDayCompleteConfetti() {
  confetti({
    particleCount: 150,
    spread: 100,
    origin: { y: 0.5 },
    colors: ['#22c55e', '#16a34a', '#fbbf24', '#f59e0b', '#ffffff'],
    ticks: 200,
    gravity: 0.9,
    scalar: 1.2,
  })

  setTimeout(() => {
    confetti({
      particleCount: 80,
      angle: 60,
      spread: 80,
      origin: { x: 0, y: 0.6 },
      colors: ['#22c55e', '#fbbf24'],
    })
    confetti({
      particleCount: 80,
      angle: 120,
      spread: 80,
      origin: { x: 1, y: 0.6 },
      colors: ['#22c55e', '#fbbf24'],
    })
  }, 200)
}
