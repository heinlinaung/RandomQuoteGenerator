const container =  $('#container');
const quote =  $('#quote');
const bgImage =  $('#bg-image');
const quoteText =  $('#quote>p.content');
const quoteAuthor =  $('#quote>span.author');
const btnNew =  $('.btn.new');
const btnTwt =  $('.btn.twt');
const animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';

//Move out the old quote
btnNew.click(()=>{
  quote.addClass('animated bounceOutLeft');
  getNewBackground()
});

//Get new quote from API
// quote.one(animationEnd, getNewBackground);
function getNewQuote(){
  $.ajax({
    url:'https://andruxnet-random-famous-quotes.p.mashape.com/cat=',
    type:'POST',
    dataType:'json',
    beforeSend:function(xhr){
      xhr.setRequestHeader("X-Mashape-Authorization", "PSKgJRegHBmsh1A157uuoGMhkUpxp1hW4VQjsn5BUUBMMF18AH");
    }
  })
  .done(function(data) {
    quoteText.text(data.quote)
    quoteAuthor.text(data.author)
    createTweetButtonFromQuote(data)
  })
  .fail(function() {
    quoteText.text('Err in parsing quote')
  })
  .always(function() {
    quote.removeClass('bounceOutLeft')
    quote.addClass('bounceInRight')
  });
}

function getNewBackground(){
  $.ajax({
    url:'https://api.unsplash.com/photos/random?client_id=cce18d6cabbfdd384a90ca4b1eced0f93cd8091d022de47be6322830b2cd3ad2',
    type:'get'
  })
  .done(function(data) {
    $('<img/>').attr('src', data.urls.regular).on('load', function() {
      $(this).remove();
      bgImage.css('background-image', 'url('+data.urls.regular+')');
    });
  })
  .fail(function() {
    //fail to get the background image (mostly, "Rate Limit Exceeded" of unsplash rule)
  })
  .always(function() {
    getNewQuote();
  });
}

// Generates tweet text and creates button
function createTweetButtonFromQuote( quote ) {
  console.log('createTweetButtonFromQuote',quote)
  btnTwt.unbind('click').bind( "click", function() {
    var tweetText = (quote.quote+ " -" + quote.author);
    var url='https://twitter.com/intent/tweet?text=' + encodeURIComponent(tweetText);
    window.open(url, "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=500,left=500,width=400,height=400")
  });
};

$(document).ready(function() {
  getNewQuote();
})
