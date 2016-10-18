// таймер с очисткой для корзины
$('#code').text(localStorage.getItem("code"));

var c = 10;
for (var i = 1; i <= (10 + 1); i++) {
  setTimeout(function () {
    if (c == 0) {
      localStorage.removeItem("basket");
      localStorage.removeItem("code");
      window.location.href = "index.html"
    }
    $('.e-cart-text').text(c-- + ' сек');
  }, 1000 * i)
}

$('#home').click(function () {
  window.location.href = "index.html";
});