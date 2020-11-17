var correctCards = 0;
var minus_minutes = 0;
$( init );

function init() {

  // Hide the success message
  $('#successMessage').hide();
  $('#successMessage').css( {
    left: '580px',
    top: '250px',
    width: 0,
    height: 0
  } );

  // Reset the game
  correctCards = 0;
  $('#cardPile').html( '' );
  $('#cardSlots').html( '' );

  // Create the pile of shuffled cards
  var numbers = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ];
  numbers.sort( function() { return Math.random() - .5 } );

  for ( var i=0; i<10; i++ ) {
    
    $('<div>' + '<img src="./images/'+(numbers[i])+'.jpg" height="78" width="78"' + '</div>').data( 'number', numbers[i] ).attr( 'id', 'card'+numbers[i] ).appendTo( '#cardPile' ).draggable( {
      containment: '#content',
      stack: '#cardPile div',
      cursor: 'move',
      revert: true
    } );
  }

  // Create the card slots
  var numbers_new = [ 11, 12, 13, 14, 15, 16, 17, 18, 19, 20 ];
  numbers_new.sort(function() { return Math.random() - .5} );
  for ( var i=0; i<10; i++ ) {
    $('<div>' + '<img src="./images/'+(numbers_new[i])+'.jpg" height="78" width="78"' + '</div>').data( 'number', numbers_new[i] ).appendTo( '#cardSlots' ).droppable( {
      accept: '#cardPile div',
      hoverClass: 'hovered',
      drop: handleCardDrop
    } );
  }


  var time_in_minutes = 10 - minus_minutes;
  var current_time = Date.parse(new Date());
  var deadline = new Date(current_time + time_in_minutes*60*1000);


  function time_remaining(endtime){
    var t = Date.parse(endtime) - Date.parse(new Date());
    var seconds = Math.floor( (t/1000) % 60 );
    var minutes = Math.floor( (t/1000/60) % 60 );
    var hours = Math.floor( (t/(1000*60*60)) % 24 );
    var days = Math.floor( t/(1000*60*60*24) );
    return {'total':t, 'days':days, 'hours':hours, 'minutes':minutes, 'seconds':seconds};
  }

  function run_clock(id,endtime){
    var clock = document.getElementById(id);
    function update_clock(){
      var t = time_remaining(endtime);
      clock.innerHTML = 'minutes: '+t.minutes+'<br>seconds: '+t.seconds;
      if(t.total<=0){ 
        clearInterval(timeinterval);
        alert('Game Over. Time is up');
        location.reload(); 
      }
    }
    update_clock(); // run function once at first to avoid delay
    var timeinterval = setInterval(update_clock,1000);
  }
  run_clock('countdownTimer', deadline);

}

function handleCardDrop(event, ui) {
  
  //Grab the slot number and card number
  var slotNumber = $(this).data('number');
  var cardNumber = ui.draggable.data('number');
  var score = $('#scoreInp').text();
  score = Number(score);
  console.log(score);
  console.log(cardNumber);
  console.log(slotNumber);
  
  slotNumber = slotNumber - 10;
  //If the cards was dropped to the correct slot,
  //change the card colour, position it directly
  //on top of the slot and prevent it being dragged again
  if (slotNumber === cardNumber) {
    score = score + 5;
    $('#scoreInp').html(score);
    ui.draggable.addClass('correct');
    ui.draggable.draggable('disable');
    $(this).droppable('disable');
    ui.draggable.position({
      of: $(this), my: 'left top', at: 'left top'
    });
    //This prevents the card from being
    //pulled back to its initial position
    //once it has been dropped
    ui.draggable.draggable('option', 'revert', false);
    correctCards++; //increment keep track correct cards
  }
  
  //If all the cards have been placed correctly then
  //display a message and reset the cards for
  //another go
  if (correctCards === 10) {
    var level = $('#levell').text();
    level = Number(level);
    level = level + 1;
    $('#levell').html(level);
    minus_minutes = minus_minutes + 1;
    $('#successMessage').show();
    $('#successMessage').animate({
      left: '380px',
      top: '200px',
      width: '400px',
      height: '100px',
      opacity: 1
    });
  }
  
  
  
}
 