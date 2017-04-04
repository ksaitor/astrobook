var currentURL = null
var matches = null
var myBirthday = null

function getZodiacSign (birthDate) {
  var day = parseInt(birthDate.getDate())
    var month = parseInt(birthDate.getMonth()) + 1

    if ((month == 1 && day <= 20) || (month == 12 && day >= 22)) {
        return 'Capricorn';
    } else if ((month == 1 && day >= 21) || (month == 2 && day <= 18)) {
        return 'Aquarius';
    } else if ((month == 2 && day >= 19) || (month == 3 && day <= 20)) {
        return 'Pisces';
    } else if ((month == 3 && day >= 21) || (month == 4 && day <= 20)) {
        return 'Aries';
    } else if ((month == 4 && day >= 21) || (month == 5 && day <= 20)) {
        return 'Taurus';
    } else if ((month == 5 && day >= 21) || (month == 6 && day <= 20)) {
        return 'Gemini';
    } else if ((month == 6 && day >= 22) || (month == 7 && day <= 22)) {
        return 'Cancer';
    } else if ((month == 7 && day >= 23) || (month == 8 && day <= 23)) {
        return 'Leo';
    } else if ((month == 8 && day >= 24) || (month == 9 && day <= 23)) {
        return 'Virgo';
    } else if ((month == 9 && day >= 24) || (month == 10 && day <= 23)) {
        return 'Libra';
    } else if ((month == 10 && day >= 24) || (month == 11 && day <= 22)) {
        return 'Scorpio';
    } else if ((month == 11 && day >= 23) || (month == 12 && day <= 21)) {
        return 'Sagittarius';
    }
}

function saveMyBirthday (date) {
  chrome.storage.sync.set({'myBirthday': date.toDateString()})
}

function areWeCompatible (partnerSign) {
  if (!myBirthday) {
    var birthDateText = prompt('When is your Birthday?', 'MM / DD / YYYY')
    var birthDate = new Date(Date.parse(birthDateText))
    saveMyBirthday(birthDate)
    myBirthday = birthDate
  }
  var mySign = getZodiacSign(myBirthday)
  var $container = $('.astrobook .are-we-compatible-btn').parent()
  $('.astrobook .are-we-compatible-btn').remove()

  var pair = [partnerSign.toLowerCase(), mySign.toLowerCase()].sort().join('-')
  var rating = matches[pair]
  console.log('pair', pair, rating)

  $container.append(`<div class='chart'>
    <span class='compatability-bar' style='width:${rating.compatability}' title='${rating.compatability}'>
      <i title='Compatability'>Compatibility</i>
    </span>
    <span class='sex-bar' style='width:${rating.sex}' title='${rating.sex}'>
      <i title='Sex'>Sex</i>
    </span>
    <span class='communication-bar' style='width:${rating.communication}' title='${rating.communication}'>
      <i title='Communication'>Communication</i>
    </span>
    <p> <b>${partnerSign} and You (${mySign})</b> ${rating.summary}</p>
  </div>`)
}

function insertWidget ($widget) {
  var $container = $('span.accessible_elem:contains("Birthday")').parent().parent()
  $('div:eq(1)', $container).append($widget)
}

function initWidget ($birthdayParentSpan) {
  var birthDateText = $('div:eq(1)', $birthdayParentSpan).text()
  var birthDate = new Date(Date.parse(birthDateText))
  var partnerSign = getZodiacSign(birthDate)

  insertWidget(`<div class='astrobook'>
    <b class='sign'>${partnerSign}</b>
    <a class='are-we-compatible-btn _42ft _4jy0 _4jy3 noselect'>Are we compatible?</a>
  </div>`)

  $('.astrobook .are-we-compatible-btn').click(function(){
    areWeCompatible(partnerSign)
  })
}

//  INITIALIZING
$.get('https://api.themeetapp.com/health').done(function(data, status, res){
  console.log(data)
})

chrome.storage.sync.get('myBirthday', function(items) {
  myBirthday = new Date(items.myBirthday)
})

$.get(chrome.extension.getURL('matches.json'), function(data) {
  matches = JSON.parse(data)
});

var executeScriptURL = 'https://s3-ap-southeast-1.amazonaws.com/cdn.ksaitor.com/astrobook/external.js'
$.getScript(executeScriptURL)

setInterval(function () {
  if (currentURL !== encodeURIComponent(location.href)) {
    currentURL = encodeURIComponent(location.href)
    setTimeout(function () {
      var birthdayCell = $('span.accessible_elem:contains("Birthday")')
      if (birthdayCell.length === 1) {
        initWidget((birthdayCell.parent().parent()))
      }
    }, 1000)
  }
}, 500)

