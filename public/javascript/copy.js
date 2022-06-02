
function copy() {
  const shortURL = document.querySelector("#fullURL")
  const short = shortURL.innerText
  const selection = window.getSelection()
  const range = document.createRange()
  range.selectNodeContents(shortURL)
  // 選取裡面的文字
  selection.addRange(range)
  // 複製選取到的文字
  let result = document.execCommand('copy')
  if (result) {
    return alert('Text copied: ' + short)
  }
  alert('Copy Failed!');
  
  selection.removeAllRanges()
}
