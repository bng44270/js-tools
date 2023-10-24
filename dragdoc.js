/*

Make content within a DOM container dragable

Usage:

  <div id="content"></div>
  
  var container = new DragDoc('content');

*/

class DragDoc {
  constructor(id) {
    this.DOC = document.getElementById(id);

    this.DOC.style.left = "0px";
    this.DOC.style.top = "0px";
    
    this.mouseDown = false;
    this.pos = { top: 0, left: 0, x: 0, y: 0 };
    document.addEventListener('mousedown',this.mouseDownHandler.bind(this),false);
    document.addEventListener('mousemove', this.mouseMoveHandler.bind(this),false);
    document.addEventListener('mouseup', this.mouseUpHandler.bind(this),false);
  }

  mouseDownHandler(e) {
    if (!this.mouseDown) {
      var left = parseInt(this.DOC.style.left.replace(/px$/,''));
      var top = parseInt(this.DOC.style.top.replace(/px$/,''));
      
      this.pos = {
          // The current scroll
          left: left,
          top: top,
          // Get the current mouse position
          x: e.clientX,
          y: e.clientY,
      };

      this.DOC.style.cursor = 'grabbing';
    
      this.mouseDown = true;
    }
  }
  
  mouseMoveHandler(e) {
    if (this.mouseDown) {
      const dx = e.clientX - this.pos.x;
      const dy = e.clientY - this.pos.y;
  
      // Scroll the element
      this.DOC.style.top = (this.pos.top + dy).toString() + "px";
      this.DOC.style.left = (this.pos.left + dx).toString() + "px";
    }
  }
  
  mouseUpHandler(e) {
    if (this.mouseDown) {
      this.DOC.style.cursor = 'grab';
      
      this.mouseDown = false;
    }
  }
}
