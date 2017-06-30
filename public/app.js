(function () {
  var CANVAS_WIDTH = 600
  var CANVAS_HEIGHT = 550
  var TITLE_OFFSET = 125
  var MAX_SCRIBBLE_STEPS = 10
  var MAX_NUM_OF_INSTRUMENTS = 5
  var DEBUG
  
  var canvas = document.getElementById('the-loot')
  canvas.setAttribute('width', CANVAS_WIDTH)
  canvas.setAttribute('height', CANVAS_HEIGHT)
  
  var button = document.getElementById('the-warrant')
  button.addEventListener('click', function (ev) {
    ev.preventDefault()
    setup()
  })
  
  var context = canvas.getContext('2d')
  
  setup()

  function setup () {
    DEBUG = {}
    context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    setupSheetMusic(context, '#999')
    scribble(context, '#1e1e1e')
    
    var title = generateTitle()
    var subtitle = generateSubtitle()
    
    appendTitle(context, title, subtitle)
    appendDownloadLink(title, subtitle)
    
    console.log(DEBUG)
  }
  
  function staff (ctx, startX, startY, length, color) {
    if (!color) {
      color = '#000'
    }
    
    if (!length) {
      length = CANVAS_WIDTH
    }
    
    ctx.beginPath()
    ctx.moveTo(startX, startY)
    ctx.strokeStyle = color
    
    for (var i = 0; i < 5; i++) {
      var newY = i * 10 + startY
      ctx.moveTo(startX, newY)
      ctx.lineTo(length, newY)
    }
    
    ctx.stroke()
  }
  
  function setupSheetMusic (ctx, color, numberOfStaves) {
    if (!numberOfStaves) {
      numberOfStaves = Math.floor((CANVAS_HEIGHT - TITLE_OFFSET) / 80)
    }
    
    var length = CANVAS_WIDTH

    for (var i = 0; i < numberOfStaves; i++) {
      staff(ctx, 0, TITLE_OFFSET + (i * 80), length, color)
    }
  }
  
  function scribble (ctx, color, steps) {
    ctx.beginPath()
  
    if (!steps) {
      do {
        steps = Math.floor(Math.random() * MAX_SCRIBBLE_STEPS)
      } while (steps === 0)
    }
    
    DEBUG['steps'] = steps
    
    if (!color) {
      color = '#000'
    }
    
    ctx.strokeStyle = color
    ctx.moveTo(randomX(), randomY())
    
    for (var i = 0; i < steps; i++) {
      drawRandomThing(ctx)
    }
    
    ctx.stroke()
  }
  
  function drawRandomThing(context) {
    var x = randomX()
    var y = randomY()
    
    var coinflip = Math.random() > .75
    
    if (coinflip) {
      context.lineTo(x, y)
    }
    
    else {
      if (coinflip < .5) {
        context.quadraticCurveTo(randomX(), randomY(), x, y)
      }
      
      else {
        context.bezierCurveTo(randomX(), randomY(), randomX(), randomY(), x,  y)
      }
    }
    
    if (coinflip < .25) {
      context.moveTo(randomX(), randomY())
    }
  }
  
  function randomX () {
    return Math.floor(Math.random() * CANVAS_WIDTH)
  }
  
  function randomY () {
    var y = Math.floor(Math.random() * CANVAS_HEIGHT)
    
    if (y < TITLE_OFFSET) {
      y = y + TITLE_OFFSET
    }
    
    return y
  }
  
  function appendDownloadLink (title, subtitle) {
    var buttonArea = document.getElementById('button-area')
    var link = document.getElementById('the-crook')
    
    if (link) {
      document.body.removeChild(link)
    }
    
    var filename = title.toLowerCase().replace(/#/g, '').replace(/\s+/g, '-')
      + '--'
      + subtitle.toLowerCase().replace(/\s+/g, '-').replace(/,/g, '')
      + '.png'
    
    var a = document.createElement('a')
    a.setAttribute('id', 'the-crook')
    
    a.setAttribute('download', filename)
    
    var data = canvas.toDataURL().replace(/^data\/[^;]+/, 'data:application/octet-stream')
    a.setAttribute('href', data)
    
    a.textContent = 'download score'
    
    buttonArea.appendChild(a)
  }
    
  function appendTitle (context, title, subtitle) {
    context.font = '36px "Crimsom Text", serif'
    context.fillText(title, 0, 36)
    
    if (!subtitle) {
      return
    }
    
    context.font = 'italic 24px "Crimsom Text", serif'
    context.fillText(subtitle, 0, (36 + 24 + 5))
  }
    
  function generateTitle () {
    var descriptors = [
      'obstinate', 'absent', 'calm', 'quiet',
      'empty', 'pertinent', 'blocked', 'pure',
      'glimmering', 'set',
    ]
    
    var terms = [
      'barrier', 'tremor', 'extract', 'clock',
      'abstract', 'forge', 'echo', 'path',
      'area', 'point',
    ]
    
    var d = descriptors[Math.floor(Math.random() * descriptors.length)]
    var t = terms[Math.floor(Math.random() * terms.length)]
    
    var dTitle = d.slice(0,1).toUpperCase() + d.slice(1)
    var tTitle = t.slice(0,1).toUpperCase() + t.slice(1)
    
    var coinflip = Math.random()
    var includeDescriptor = !(coinflip <= .25 && coinflip >= .125)
    var includeTerm = !(coinflip <= .25 && coinflip <= .125)
    
    var title = (
      (includeDescriptor ? dTitle : '') +
      ' ' +
      (includeTerm ? tTitle : '')
    ).trim()
    
    if (includeTerm && (coinflip > .25 && coinflip < .5)) {
      if (title[title.length - 1] !== 'o') {
        title = title + 's'
      } else {
        title = title + 'es'
      }
    }
    
    title = title + ' #' + Math.ceil(Math.random() * 30)
    
    DEBUG['title'] = title
    
    return title
  }
    
  function generateSubtitle () {
    var instruments = [
      'flute', 'cello', 'violin', 'harp',
      'oboe', 'clarinet', 'guitar', 'harpsicord',
      'piano', 'voice', 'orchestra'
    ]
    
    var numberOfInstruments = Math.floor(Math.random() * MAX_NUM_OF_INSTRUMENTS)
    
    if (numberOfInstruments === 0 && Math.random() > .66) {
      numberOfInstruments = numberOfInstruments + 1
    }
    
    var subtitle
    
    if (numberOfInstruments > 0) {
      var forInsts = []

      for (var i = 0; i < numberOfInstruments; i++) {
        var inst

        do {
          inst = instruments[Math.floor(Math.random() * instruments.length)]  
        } while (forInsts.indexOf(inst) > -1)

        if (inst) {
          forInsts.push(inst)
        }
      }
      
      if (numberOfInstruments === 1) {
        subtitle = 'for ' + forInsts[0]
      }
      
      else if (numberOfInstruments === 2) {
        subtitle = 'for ' + forInsts[0] + ' and ' + forInsts[1]
      }

      else {
        subtitle = 'for ' + forInsts.slice(0, forInsts.length - 1).join(', ')
        subtitle = subtitle + ', and ' + forInsts[forInsts.length - 1]
      }
    } else {
      subtitle = ''
    }
     
    DEBUG['instruments'] = forInsts
    DEBUG['subtitle'] = subtitle
    
    return subtitle
  }
}())

