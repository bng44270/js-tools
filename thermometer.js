/*
Display a progress thermometer

Usage:

1)  Add tag to <head> of your page.
      <script type="text/javascript" src="https://bng44270.github.io/f6a914479e3c99351d8d43a603f84124/fundraiser-thermometer.js"></script>

2) Add a the following tag on your page.  This tag will contain the thermometer.  (you can change the "id" value)
      <div id="mythermometer"></div>

3) Add the following code to the document onLoad event:
      //The arguments in order are ID of container, width, height,complete color, and percent complete (percent complete is optional)
      var thermometer = new Thermometer('mythermometer',275,500,"#ff0000",40);

4) Use the following code to update the completed value of the thermometer:
      //Update the thermometer to display a new percent
      thermometer.update(64);
*/
class Thermometer {
  constructor(div,width,height,color,percent) {
    this.container = document.getElementById(div);
    this.BASEID = div;
    this.WIDTH = width;
    this.HEIGHT = height;
    this.COLOR = color;
    this.current = (percent) ? percent : 0;
    
    this.build();
    
    this.update();
  }
  
  build() {
    this.thermometerEmpty = document.createElement('div');
    this.thermometerEmpty.id = this.BASEID + '_empty';
    this.thermometerEmpty.style.borderColor = '#000000';
    this.thermometerEmpty.style.borderStyle = 'solid';
    this.thermometerEmpty.style.borderLeftWidth = '5px';
    this.thermometerEmpty.style.borderTopWidth = '5px';
    this.thermometerEmpty.style.borderRightWidth = '5px';
    this.thermometerEmpty.style.borderBottomWidth = '0px';
    this.thermometerEmpty.style.width = this.WIDTH.toString() + "px";
    this.thermometerEmpty.style.backgroundColor = "#ffffff";
    
    this.thermometerFull = document.createElement('div');
    this.thermometerFull.id = this.BASEID + '_full';
    this.thermometerFull.style.borderColor = '#000000';
    this.thermometerFull.style.borderStyle = 'solid';
    this.thermometerFull.style.borderLeftWidth = '5px';
    this.thermometerFull.style.borderTopWidth = '0px';
    this.thermometerFull.style.borderRightWidth = '5px';
    this.thermometerFull.style.borderBottomWidth = '0px';
    this.thermometerFull.style.width = this.WIDTH.toString() + "px";
    this.thermometerFull.style.backgroundColor = this.COLOR;
    
    
    this.thermometerBottom = document.createElement('div');
    this.thermometerBottom.style.borderColor = '#000000';
    this.thermometerBottom.style.borderStyle = 'solid';
    this.thermometerBottom.style.borderLeftWidth = '5px';
    this.thermometerBottom.style.borderTopWidth = '0px';
    this.thermometerBottom.style.borderRightWidth = '5px';
    this.thermometerBottom.style.borderBottomWidth = '5px';
    this.thermometerBottom.style.borderBottomRightRadius = '50px';
    this.thermometerBottom.style.borderBottomLeftRadius = '50px';
    this.thermometerBottom.style.width = this.WIDTH.toString() + "px";
    this.thermometerBottom.style.height = "50px";
    this.thermometerBottom.style.backgroundColor = this.COLOR;
    
    this.thermometerLabel = document.createElement('div');
    this.thermometerLabel.id = this.BASEID + '_label';
    this.thermometerLabel.style.fontSize = '4vw';
    this.thermometerLabel.style.fontWeight = "bold";
    this.thermometerLabel.style.textAlign = "center";
    this.thermometerLabel.style.width = this.WIDTH.toString() + "px";
    this.thermometerLabel.style.height = "50px";
    
    this.container.style.height = this.HEIGHT.toString() + "px";
    this.container.style.width = this.WIDTH.toString() + "px";
    
    this.container.appendChild(this.thermometerEmpty);
    this.container.appendChild(this.thermometerFull);
    this.container.appendChild(this.thermometerBottom);
    this.container.appendChild(this.thermometerLabel);
  }
  
  update(percent) {
    var updatedPercent = (percent) ? percent : this.current;
    
    var doneHeight = (this.HEIGHT - 50) * (updatedPercent / 100);
    var remainingHeight = (this.HEIGHT - 50) * ((100 - updatedPercent) / 100);
    
    document.getElementById(this.BASEID + '_empty').style.height = remainingHeight.toString() + "px";
    document.getElementById(this.BASEID + '_full').style.height = doneHeight.toString() + "px";
    
    document.getElementById(this.BASEID + '_label').innerText = updatedPercent.toString() + "%";
  }
}
