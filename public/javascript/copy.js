
function copy() {
  const shortURL = document.querySelector("#fullURL").innerText
  navigator.clipboard.writeText(shortURL)
  alert('Text copied: ' + shortURL)
}
