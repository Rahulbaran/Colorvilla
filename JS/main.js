/* The app is designed by Rahul Kumar where someone can generate a random color 
with color codes in rgb, hsl and hex just by clicking the random color generating
button  */
// Here I have followed the module patterns and created 3 modules .
// colorHandler, appHadler and UIHandler
// IIFE and closure concepts have been used a lot here.


// ================Data related functionality=================
var colorHandler = (function () {

    // array to generate r,g and b values
    var rgbArray = []; 

    //function to generate random color in rgb format
    var randomRGB = function () {
        var r,g,b;
        //generate random r,g and b
        r = Math.ceil(Math.random() * 255);
        g = Math.ceil(Math.random() * 255);
        b = Math.ceil(Math.random() * 255);
        
        //storing the generated values in array rgbArray.
        rgbArray[0] = r;
        rgbArray[1] = g;
        rgbArray[2] = b;
    };


    //function for conversion of r,g and b in corresponding hex code
    var rgbToHex = function () {
        var  _r, _g, _b;

        //conversion of r,g and b codes in their corresponding hex code
        _r = rgbArray[0].toString(16);
        _g = rgbArray[1].toString(16);
        _b = rgbArray[2].toString(16);

        // checking if any hex code section has one digit and adding 0 before them
        if ( _r.length === 1) {
            _r = "0" + _r; 
        }
        if ( _g.length === 1) {
            _g = "0" + _g; 
        }
        if ( _b.length === 1) {
            _b = "0" + _b; 
        }

        // returning the hex code
        return `#${_r}${_g}${_b}`;
    };

    
    //function for conversion of r,g and b into hsl code
    var rgbTohsl = function()  {
        var  _r, _g, _b,  min, max, delta;
        var h = 0,
            s = 0,
            l = 0;

        // conversion of r,g and b in  their corresponding fraction
        _r = rgbArray[0] / 255;
        _g = rgbArray[1] / 255;
        _b = rgbArray[2] / 255;

        // selecting min and max fraction value of rgb
        min = Math.min(_r, _g, _b);
        max = Math.max(_r, _g, _b);

        // calculating luminosity range
        delta = max - min;

        //luminosity calculation  ---> l = (min + max)/2 --> l => [0,1]
        l = (min + max) / 2;
        
        //saturation calculation s ---> [0,1]
        //if delta === 0;s = 0
        //else s = (delta)/(1 - Math.abs(2*l - 1));
        s = delta === 0 ? 0 : delta / (1 - Math.abs(2*l - 1)); //ternary operator

        //--------hue calculation---------
        if(delta === 0) {
            h = 0;
        } else if(_r === max) {
            h = ((_g - _b) / delta) % 6;
        } else if(_g === max) {
            h = ((_b - _r) / delta) + 2;
        } else if(_b === max) {
            h = ((_r - _g) / delta) + 4;
        }
        
        //converting hue in degree
        h = Math.round(h * 60);
        // checking for  (-)ve value
        h = h > 0 ? h : h + 360;

        // ----converting l and s in percentage
        l = (l * 100).toFixed(0);
        s = (s * 100).toFixed(0);

        return `hsl(${h}deg,${s}%,${l}%)`;
    };



    // exposing part of code publicly 
    return {
        returnRandomColor () {
            randomRGB();           
            return {
                HexCode : rgbToHex(),
                hslCode : rgbTohsl(),
                rgbCode : `rgb(${rgbArray[0]},${rgbArray[1]},${rgbArray[2]})`
            };
        }
    }

})();





// ===================UI related functionality===================
var UIHandler = (function () {

    var domSelectors = {
        colorScreen : '.color__screen__section',
        hslCode : '.hsl__code',
        rgbCode : '.rgb__code',
        hexCode : '.hex__code',
        randomBtn : '.random__btn'
    }
    
    // displaying the color with color codes in ui
    return {
        displayColor (obj) {

            document.querySelector(domSelectors.colorScreen).style.backgroundColor = obj.rgbCode;
            document.querySelector(domSelectors.hexCode).value = obj.HexCode;
            document.querySelector(domSelectors.rgbCode).value = obj.rgbCode;
            document.querySelector(domSelectors.hslCode).value = obj.hslCode;
        },
        getSelectors () {
            return domSelectors;
        }
    };


})();





// ==============event handlers related functionality==============
var appHandler = (function (colorCtrl, UICtrl) {


    var setEventListeners = function () {
        var domStr = UICtrl.getSelectors ();

        //event handlers for generating colors
        document.querySelector(domStr.randomBtn).addEventListener('click',randomColorGenerator);
        document.addEventListener('keydown',function(e) {
            if (e.code === "Enter") {
                randomColorGenerator();
            }
        });

        // selecting all copy buttons
        var btns = document.querySelectorAll('.copy__btn');

        btns[0].addEventListener('click',function () {
            copyFunction(domStr.hslCode);
        });
        btns[1].addEventListener('click',function () {
            copyFunction(domStr.rgbCode);
        });
        btns[2].addEventListener('click',function() {
            copyFunction(domStr.hexCode);
        });
    };


    var copyFunction = function (selector) {
        var copyText = document.querySelector(selector);
            copyText.select();
            document.execCommand("copy");
    };


    // function to handle all the actions happen after button clicking/pressing return key
    var randomColorGenerator = function () {

        //1.generate & return random color with its corresponding color code
        var colorCodes = colorCtrl.returnRandomColor();
        
        //2.update the UI 
        UICtrl.displayColor(colorCodes);
    };


    return {
        init () {
            setEventListeners ();
            UICtrl.displayColor (
                {
                rgbCode : 'rgb(255,255,255)',
                HexCode : '#ffffff',
                hslCode : 'hsl(0deg,0%,100%)'
            }); 
        }
    };

})(colorHandler, UIHandler);
appHandler.init();

