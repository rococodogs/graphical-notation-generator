(function () {
  // the area of the score fits within
  // (CANVAS_HEIGHT - TITLE_OFFSET) x CANVAS_WIDTH
  var CANVAS_WIDTH = 600
  var CANVAS_HEIGHT = 550
  var TITLE_OFFSET = 125
  
  // maximum # of strokes in a piece (this is randomly generated)
  var MAX_SCRIBBLE_STEPS = 10
  
  // for the title, the maximum # of instruments listed
  var MAX_NUMBER_OF_INSTRUMENTS = 5

  // also for the title, the maximum # to follow a piece name
  // (ex: 'Pertinent Forge #16')
  var MAX_NUMBER_OF_PIECES = 50
  
  // debug is an object that is refreshed on `setup` + filled
  // with some pertinant info
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
    // clear the debug object
    DEBUG = {}
    
    // clear out the canvas for a new piece
    context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    
    setupSheetMusic(context, '#999')
    scribble(context, '#1e1e1e')
    
    var title = generateTitle()
    var subtitle = generateSubtitle()
    
    appendTitle(context, title, subtitle)
    appendDownloadLink(title, subtitle)
    
    console.log(DEBUG)
  }
  
  // creates a music staff
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
  
  // if no # of staves is provided, figures out the most that will fit within
  // the canvas:
  // - each line/gap is 11px (10px spacing + 1px line)
  // - 5 lines per staff (55px)
  // - + 25px padding below
  // = 80px
  function setupSheetMusic (ctx, color, numberOfStaves) {
    if (!numberOfStaves) {
      numberOfStaves = Math.floor((CANVAS_HEIGHT - TITLE_OFFSET) / 80)
    }
    
    var length = CANVAS_WIDTH

    for (var i = 0; i < numberOfStaves; i++) {
      staff(ctx, 0, TITLE_OFFSET + (i * 80), length, color)
    }
  }
  
  // the main drawing function. if no # of steps is provided,
  // a number is randomly generated between 1 and MAX_SCRIBBLE_STEPS
  function scribble (ctx, color, steps) {
    ctx.beginPath()
  
    if (!steps) {
      do {
        steps = Math.ceil(Math.random() * MAX_SCRIBBLE_STEPS)
      } while (steps === 0)
    }
    
    DEBUG['steps'] = steps
    
    if (!color) {
      color = '#000'
    }
    
    ctx.strokeStyle = color
      
    // move to a random spot on the canvas
    ctx.moveTo(randomX(), randomY())
    
    // for each step, make a random line
    for (var i = 0; i < steps; i++) {
      drawRandomThing(ctx)
    }
    
    ctx.stroke()
  }
  
  // this is where the ~*~ fun ~*~ happens. we're picking from three
  // random line strategies and based on some arbitrary choices, deciding
  // what kind of line to draw:
  // - straight line (~ 25%)
  // - curve - quadratic (~ 50%)
  // - curve - bezier (~ 25%)
  function drawRandomThing(context) {
    var x = randomX()
    var y = randomY()
    
    var coinflip = Math.random()
    
    if (coinflip > .75) {
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
  
  // generate a random X coordinate within the range of 0 - CANVAS_WIDTH
  function randomX () {
    return Math.floor(Math.random() * CANVAS_WIDTH)
  }
  
  // generate a random Y coordinate within the range of TITLE_OFFSET - CANVAS_HEIGHT
  function randomY () {
    var y = Math.floor(Math.random() * CANVAS_HEIGHT)
    
    if (y < TITLE_OFFSET) {
      y = y + TITLE_OFFSET
    }
    
    return y
  }
  
  // appends a link to download the score as a .png using `canvas.toDataURL()`
  // and a hack to replace the data type to `data:application/octet-stream`
  // (see: https://stackoverflow.com/a/20633822)
  function appendDownloadLink (title, subtitle) {
    var buttonArea = document.getElementById('button-area')
    var link = buttonArea.querySelector('#the-crook')
    
    if (link) {
      buttonArea.removeChild(link)
    }
    
    var filename = title.toLowerCase().replace(/#/g, '').replace(/\s+/g, '-')
    
    if (subtitle) {
      filename = filename + '--' 
        + subtitle.toLowerCase().replace(/\s+/g, '-').replace(/,/g, '')
    }
    
    filename = filename + '.png'
    
    var a = document.createElement('a')
    a.setAttribute('id', 'the-crook')
    
    a.setAttribute('download', filename)
    
    var data = canvas.toDataURL().replace(/^data\/[^;]+/, 'data:application/octet-stream')
    a.setAttribute('href', data)
    
    a.textContent = 'download score'
    
    buttonArea.appendChild(a)
  }
    
  // write the title to the svg (which allows it to be downloaded
  // along with the score)
  function appendTitle (context, title, subtitle) {
    context.font = '36px "Crimsom Text", serif'
    context.fillText(title, 0, 36)
    
    if (!subtitle) {
      return
    }
    
    context.font = 'italic 24px "Crimsom Text", serif'
    context.fillText(subtitle, 0, (36 + 24 + 5))
  }
    
  // pulls two random words together (sometimes pluralizing)
  // and adds a piece number
  function generateTitle () {
    var descriptors = [
      'obstinate', 'absent', 'calm', 'quiet',
      'empty', 'pertinent', 'blocked', 'pure',
      'glimmering', 'set', 'explicit', 'abject',
      'solemn',
    ]
    
    var terms = [
      'barrier', 'tremor', 'extract', 'clock',
      'abstract', 'forge', 'echo', 'path',
      'area', 'point', 'ridge', 'space',
      ''
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
    
    title = title + ' #' + Math.ceil(Math.random() * MAX_NUMBER_OF_PIECES)
    
    DEBUG['title'] = title
    
    return title
  }
  
  // determines which instruments should be specified to perform the piece
  function generateSubtitle () {
    var instruments = [
      'flute', 'cello', 'violin', 'harp',
      'oboe', 'clarinet', 'guitar', 'harpsicord',
      'piano', 'voice', 'orchestra'
    ]
    
    var numberOfInstruments = Math.floor(Math.random() * MAX_NUMBER_OF_INSTRUMENTS)
    
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

