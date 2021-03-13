
function direcionamento(elem) {
    var dificuldade = "";
    dificuldade += elem.innerText;

    window.location.href = "game.html?dificuldade=" + dificuldade;

}
