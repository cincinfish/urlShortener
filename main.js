// 遊戲狀態
const GAME_STATE = {
  FirstCardAwaits: 'FirstCardAwaits',
  SecondCardAwaits: 'SecondCardAwaits',
  CardsMatchFailed: 'CardsMatchFailed',
  CardsMatched: 'CardMatched',
  GameFinished: 'GameFinished',
}

// 花色圖片
const Symbols = [
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17989/__.png', // 黑桃
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17992/heart.png', // 愛心
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17991/diamonds.png', // 方塊
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17988/__.png' // 梅花
]

const view = {
  // 生成卡片內容圖案
  getCardContent(index) {
    const number = this.transformNumber((index % 13) + 1)
    const symbol = Symbols[Math.floor(index / 13)]
    return `
      <p>${number}</p>
      <img src="${symbol}">
      <p>${number}</p>`
  },
  // 生成卡片內容牌背
  getCardElement(index) {
    return `<div data-index="${index}" class="card back"></div>`
  },
  // 數字轉換英文
  transformNumber(number) {
    switch (number) {
      case 1:
        return "A"
      case 11:
        return "J"
      case 12:
        return "Q"
      case 13:
        return "K"
      default:
        return number
    }
  },
  // 抽換
  displayCards(indexes) {
    const rootElement = document.querySelector("#cards")

    rootElement.innerHTML = indexes.map(index => this.getCardElement(index)).join("")
  },

  // 翻牌
  flipCards(...cards) {
    cards.map(card => {
      if (card.classList.contains("back")) {
        card.classList.remove("back")
        card.innerHTML = this.getCardContent(Number(card.dataset.index))
        return
      }

      card.classList.add("back")
      card.innerHTML = null
    })
  },
  // 陪對成功增加灰底
  pairCards(...card) {
    card.map(card => {
      card.classList.add('paired')
    })
  },
  // 分數
  renderScore(score) {
    document.querySelector('.score').textContent = `Score: ${score}`
  },
  // 遊玩次數
  renderTriedTimes(times) {
    document.querySelector('.tried').textContent = `You've tried: ${times} times`
  },
  // 配對失敗動化
  appendWrongAnimation(...cards) {
    cards.map(card => {
      card.classList.add('wrong')
      card.addEventListener('animationend', event => {
        event.target.classList.remove('wrong')
      }, { once: true })
    })
  },
  showGameFinished() {
    const div = document.createElement('div')
    div.classList.add('completed')
    div.innerHTML = `
      <p>Complete!<p>
      <p>Score:${model.score}</p>
      <p>You've tried: ${model.triedTimes} times</p>
    `
    const header = document.querySelector('#header')
    header.before(div)
  }
}
const utility = {
  // 洗牌
  getRandomNumberArray(count) {
    const number = Array.from(Array(count).keys())
    for (let index = number.length - 1; index > 0; index--) {
      let randomIndex = Math.floor(Math.random() * (index + 1))
        // 解構賦值
        ;[number[index], number[randomIndex]] = [number[randomIndex], number[index]]
    }
    return number
  }
}
// 定義遊戲初始狀態
const controller = {
  currentState: GAME_STATE.FirstCardAwaits,

  generateCards() {
    view.displayCards(utility.getRandomNumberArray(52))
  },
  //依據不同狀態做不同行為
  dispatchCardAction(card) {
    if (!card.classList.contains('back')) {
      return
    }
    switch (this.currentState) {
      case GAME_STATE.FirstCardAwaits:
        view.flipCards(card)
        model.revealedCards.push(card)
        this.currentState = GAME_STATE.SecondCardAwaits
        break
      case GAME_STATE.SecondCardAwaits:
        view.renderTriedTimes(++model.triedTimes)
        view.flipCards(card)
        model.revealedCards.push(card)
        if (model.isRevealedCardsMatched()) {
          // 配對正確
          view.renderScore((model.score += 10))
          this.currentState = GAME_STATE.CardMatchFailed
          view.pairCards(...model.revealedCards)
          model.revealedCards = []
          if (model.score === 260) {
            console.log('showGameFinished')
            this.currentState = GAME_STATE.GameFinished
            view.showGameFinished()
            return
          }
          this.currentState = GAME_STATE.FirstCardAwaits
        } else {
          // 配對失敗
          this.currentState = GAME_STATE.CardsMatchFailed
          view.appendWrongAnimation(...model.revealedCards)
          setTimeout(this.resetCard, 1000)
        }
        break
    }
    console.log('this.currentState', this.currentState)
    console.log('revealedCards', model.revealedCards.map(card => card.dataset.index))
  },
  resetCard() {
    view.flipCards(...model.revealedCards)
    model.revealedCards = []
    controller.currentState = GAME_STATE.FirstCardAwaits
  }
}
// 集中管理
const model = {
  revealedCards: [],

  isRevealedCardsMatched() {
    return this.revealedCards[0].dataset.index % 13 === this.revealedCards[1].dataset.index % 13
  },

  score: 0,
  triedTimes: 0
}

controller.generateCards()

// 點擊翻牌
document.querySelectorAll(".card").forEach(card => {
  card.addEventListener("click", event => {
    controller.dispatchCardAction(card)
  })
});