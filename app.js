var workTimerGoing = false;
var playTimerGoing = false;
var startingTime = null;
var activeTimer = null;
var intervalHandle = null;

var totalWorkTime = 0;
var totalPlayTime = 0;
var targetTime = 0;

var workPlayRatio = 10;

var targetDisplay = $('#target').find('h2');

//  ========= Helper Methods  =========
var convertToHourNotation = function(seconds) {
  // var hour = Math.floor(seconds / 3600);
  // seconds -= hour * 3600;
  // var minutes = Math.floor(seconds / 60);
  // seconds -= minutes * 60;
  // seconds = Math.floor(seconds);

  var hour = Math.floor(seconds / 3600);
  var minutes = Math.floor((seconds % 3600) / 60);
  var seconds = Math.floor(seconds % 60);

  var hString = toTwoCharacterFormat(hour);
  var mString = toTwoCharacterFormat(minutes);
  var sString = toTwoCharacterFormat(seconds);
  var notation = hString + ":" + mString + ":" + sString;

  return notation;
}

var toTwoCharacterFormat = function(number) {
  return number.toString().length >= 2 ? 
    number.toString() : '0' + number.toString();
}

var convertFromHourNotation = function(notation) {
  var split = notation.split(':');
  var hours = +split[0];
  var minutes = +split[1];
  var seconds = +split[2];

  return hours * 3600 + minutes * 60 + seconds;
}

var getCurrentTime = function() {
  return (new Date()).getTime();
}

var getOptimalPlayTime = function(workTime) {
  return workTime / workPlayRatio;
}

// ========= Timer Start/Stop Toggle methods  =========
var stopWorkTimer = function() {
  if (workTimerGoing) {
    workTimerGoing = false;
    $('#worktime').find('button').text('Start Working');
    window.clearInterval(intervalHandle);
    activeTimer = null;
    return true;
  }
  return false;
}

var stopPlayTimer = function() {
  if (playTimerGoing) {
    playTimerGoing = false;
    $('#playtime').find('button').text('Start Playing');
    window.clearInterval(intervalHandle);
    activeTimer = null;
    return true;
  }
  return false;
}

var startWorkTimer = function() {
  if(!workTimerGoing) {
    if (playTimerGoing) {
      stopPlayTimer();
    }

    workTimerGoing = true;
    $('#worktime').find('button').text('Stop Working');
    activeTimer = $('#worktime').find('h2');
    startingTime = getCurrentTime();

    intervalHandle = window.setInterval(updateTimer, 100);
    return true;
  }
  return false;
}

var startPlayTimer = function() {
  if (!playTimerGoing) {
    if (workTimerGoing) {
      stopWorkTimer();
    }

    playTimerGoing = true;
    $('#playtime').find('button').text('Stop Playing');
    activeTimer = $('#playtime').find('h2');
    startingTime = getCurrentTime();

    intervalHandle = window.setInterval(updateTimer, 100)
    return true;
  }
  return false;
}

var togglePlayTimer = function() {
  startPlayTimer() || stopPlayTimer();
}

var toggleWorkTimer = function() {
  startWorkTimer() || stopWorkTimer();
}

//  ========= Update target timer  =========

var updateTargetTimer = function() {
  targetTime = totalWorkTime / workPlayRatio;
  var hourNotationTarget = convertToHourNotation(targetTime / 1000);
  targetDisplay.text(hourNotationTarget);
}

//  ========= Update method: called through setInterval  =========
var updateTimer = function() {
  var ct = getCurrentTime();
  var elapsed = ct - startingTime;

  startingTime = ct;

  var currentTime;
  if (workTimerGoing) {
    totalWorkTime += elapsed;
    currentTime = totalWorkTime;
  } else if (playTimerGoing){
    totalPlayTime += elapsed;
    currentTime = totalPlayTime;
  }

  var hourNotation = convertToHourNotation(currentTime / 1000);

  activeTimer.text(hourNotation);

  updateTargetTimer();

  if (totalPlayTime > targetTime) {
    targetDisplay.addClass('toomuchprocrastination')
  } else {
    targetDisplay.removeClass('toomuchprocrastination');
  }
}

//  ========= Document listeners  =========

$(document).ready(function() {
  $('#worktime').on('click', 'button', function() {
    toggleWorkTimer();
  })

  $('#playtime').on('click', 'button', function() {
    togglePlayTimer();
  })

  $('.ratioinput').on('keyup', function() {
    workPlayRatio = +$(this).val();
    updateTargetTimer();
  })
});