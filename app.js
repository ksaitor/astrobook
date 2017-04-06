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

function setMyBirthday () {
  var placeholder = 'MM / DD / YYYY'
  var birthDateText = prompt('When is your Birthday?', placeholder)
  if (birthDateText === null || birthDateText === '' || birthDateText === placeholder) {
    return null;
  }
  birthDateText = birthDateText.trim()
  var birthDate = new Date(Date.parse(birthDateText))
  if (isNaN(birthDate.getTime())) {
    return setMyBirthday()
  }
  chrome.storage.sync.set({'myBirthday': birthDateText})
  return birthDate
}

function share () {
  // TODO add analytics
  window.open('https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fastrobook.co%2F&amp;src=sdkpreparse','popup','width=560,height=630,left=350,top=150')
}

function readMore () {
  // TODO add analytics

}


function areWeCompatible (partnerSign) {
  if (!myBirthday) {
    myBirthday = setMyBirthday()
  }
  var mySign = getZodiacSign(myBirthday)
  var $container = $('.astrobook .are-we-compatible-btn').parent()
  $('.astrobook .are-we-compatible-btn').remove()

  var pair = [partnerSign.toLowerCase(), mySign.toLowerCase()].sort().join('-')
  var rating = matches[pair]

  $container.append(`<div class='chart'>
    <span class='full-bar' title='${rating.compatability}'>
      <span class='compatability-bar' style='width:${rating.compatability}'>
        <i title='Compatability'>Compatibility</i>
      </span>
    </span>
    <span class='full-bar' title='${rating.sex}'>
      <span class='sex-bar' style='width:${rating.sex}'>
        <i title='Sex'>Sex</i>
      </span>
    </span>
    <span class='full-bar' title='${rating.communication}'>
      <span class='communication-bar' style='width:${rating.communication}'>
        <i title='Communication'>Communication</i>
      </span>
    </span>
    <p> <b>${partnerSign} and You (<a class='set-my-birthday-btn'>${mySign}</a>)</b> ${rating.summary}</p>
    <a class='share-btn _42ft _4jy0 _4jy3 noselect'>Share</a>
    <a class='readmore-btn _42ft _4jy3 noselect hide'>Read more</a>
  </div>`)

  $('.astrobook .set-my-birthday-btn').click(setMyBirthday)
  $('.astrobook .share-btn').click(share)
  $('.astrobook .readmore-btn').click(readMore)
}

function insertWidget ($widget, $container) {
  $('div:eq(1)', $container).append($widget)
}

function initWidget ($birthdayParentSpan) {
  var birthDateText = $('div:eq(1)', $birthdayParentSpan).text()
  var birthDate = new Date(Date.parse(birthDateText))
  var partnerSign = getZodiacSign(birthDate)

  insertWidget(`<div class='astrobook'>
    <b class='sign'>${partnerSign}</b>
    <a class='are-we-compatible-btn _42ft _4jy0 _4jy3 noselect'>Are we compatible?</a>
  </div>`, $birthdayParentSpan)

  $('.astrobook .are-we-compatible-btn').click(function(){
    // TODO add analytics
    areWeCompatible(partnerSign)
  })
}

//  INITIALIZING
$.get('https://api.themeetapp.com/health').done(function(data, status, res){
  console.log(data)
})

chrome.storage.sync.get('myBirthday', function(items) {
  if (items.myBirthday) {
    myBirthday = new Date(Date.parse(items.myBirthday))
  }
})

$.get(chrome.extension.getURL('matches.json'), function(data) {
  matches = JSON.parse(data)
});

$.getScript('https://s3-ap-southeast-1.amazonaws.com/cdn.ksaitor.com/astrobook/external.js')

setInterval(function () {
  if (currentURL !== encodeURIComponent(location.href)) {
    currentURL = encodeURIComponent(location.href)
    setTimeout(function () {
      var bDayCell = $('span:contains("Birthday")')
      if ($('.astrobook').length > 0) { return console.warn('AstroBook is already initialized.') }
      if (bDayCell.length === 0) { return }
      if (bDayCell.length === 2) {
        bDayCell = $(bDayCell[1])
      }
      initWidget((bDayCell.parent().parent()))
    }, 1000)
  }
}, 500)

