(function flexible(window, document) {
    var docEl = document.documentElement
    var dpr = window.devicePixelRatio || 1
   
    // adjust body font size
    function setBodyFontSize() {
      if (document.body) {
        document.body.style.fontSize = (12 * dpr) + 'px'
      }
      else {
        document.addEventListener('DOMContentLoaded', setBodyFontSize)
      }
    }
    setBodyFontSize();
   
    // set 1rem = viewWidth / 10 原版是10等分，这里把屏幕平均划分为24等分 1920
    function setRemUnit() {
      // 获取浏览器窗口的内部宽度
      var windowWidth = window.innerWidth;
      // console.log('屏幕宽度',windowWidth);
      var rem = null
      if(windowWidth>=800){
        rem = docEl.clientWidth / 24
      }else{
        rem = docEl.clientWidth / 12
      }
      
      docEl.style.fontSize = rem + 'px'
    }
   
    setRemUnit()
   
    // reset rem unit on page resize
    window.addEventListener('resize', setRemUnit)
    window.addEventListener('pageshow', function (e) {
      if (e.persisted) {
        setRemUnit()
      }
    })
   
    // detect 0.5px supports
    if (dpr >= 2) {
      var fakeBody = document.createElement('body')
      var testElement = document.createElement('div')
      testElement.style.border = '.5px solid transparent'
      fakeBody.appendChild(testElement)
      docEl.appendChild(fakeBody)
      if (testElement.offsetHeight === 1) {
        docEl.classList.add('hairlines')
      }
      docEl.removeChild(fakeBody)
    }
  }(window, document))