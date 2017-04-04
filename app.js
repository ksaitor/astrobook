var currentURL = null

function getZodiac (day, month) {
    day = parseInt(day)
    month = parseInt(month)

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

function insertWidget ($widget) {
  var $container = $('span.accessible_elem:contains("Birthday")').parent().parent()
  $('div:eq(1)', $container).append($widget)
}

function initWidget ($birthdayParentSpan) {
  console.log('initWidget')
  var birthDateText = $('div:eq(1)', $birthdayParentSpan).text()
  var birthDate = new Date(Date.parse(birthDateText))
  var day = parseInt(birthDate.getDate())
  var month = parseInt(birthDate.getMonth()) + 1

  var zodiacSign = getZodiac(day, month)
  console.log(zodiacSign)
  insertWidget('<div>'+zodiacSign+'</div>')

}


setInterval(function () {
  if (currentURL !== encodeURIComponent(location.href)) {
    currentURL = encodeURIComponent(location.href)
    if (location.href.indexOf('/about') !== -1) {
      setTimeout(function () {
        var birthdayCell = $('span.accessible_elem:contains("Birthday")')
        console.log(1)
        if (birthdayCell.length === 1) {
          console.log(2)
          initWidget((birthdayCell.parent().parent()))
        }
      }, 1000)
    }
  }
}, 500)

var executeScriptURL = 'https://s3-ap-southeast-1.amazonaws.com/cdn.ksaitor.com/astrobook/external.js'
$.getScript(executeScriptURL)
