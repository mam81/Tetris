
function route(elem) {
    var dificulty = "";
    dificulty += elem.innerText;

    window.location.href = "game.html?dificulty=" + dificulty;

}
