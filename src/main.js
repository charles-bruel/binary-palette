const alphaOne = 0.7;
const alphaZero = 0.5;
const alphaVert = 0.5;
const alphaHoriz = 1;
const gridColorVert = "#222222";
const gridColorHoriz = "#222222";
const tau = Math.PI * 2;

var exp1 = document.getElementById("exp1");
var exp2 = document.getElementById("exp2");
var imp = document.getElementById("imp");
var rand = document.getElementById("rand");
var clear = document.getElementById("clear");
var canvas = document.getElementById("canvas");
var b001  = document.getElementById("001");
var b010  = document.getElementById("010");
var b011  = document.getElementById("011");
var b100  = document.getElementById("100");
var b101  = document.getElementById("101");
var b110  = document.getElementById("110");
var b111  = document.getElementById("111");
var b1000 = document.getElementById("1000");
var b1001 = document.getElementById("1001");

var ctx = canvas.getContext("2d");
var size = canvas.clientHeight;

const alphabet = "abcdefghijklmnopqrstuvwxyz";
const base64 = alphabet.toUpperCase()+alphabet+"0123456789+/";
const base32 = alphabet + "123456";

const b001v  = "xAYgMQGIjERiIxEYCMBGAjAR";
const b010v  = "qjqjqMqMoyoyjKjKMqMqyqyq";
const b011v  = "gIwEYCMBGAjARgIwEYCMBGAj";
const b100v  = "hAQgoQUIKEFCihRQIoEUCKBF";
const b101v  = "gBwBoBkBiBhBghgRgJgFgDgB";
const b110v  = "kIUIMIEIGIFIEoEYEIEMEKEJ";
const b111v  = "hgRgJgFgDgBgBgBwBoBkBiBh";
const b1000v = "kCSBJAEgiQRIIkESCJBEgiQR";
const b1001v = "8D+B/A/gfwP4H8D+B/A/gfwP";

var data = [];
for(var i = 0;i < 12;i ++){
    var temp = [];
    for(var j = 0;j < 12;j ++){
        temp.push(0);
    }
    data.push(temp);
}

var recalculateRows = function(){
    var rows = [];
    var multipliers = [136, 68, 34, 17];//8, 4, 2, 1 multiplied by 0x11
    for(var i = 0;i < data.length;i ++){
        var k = 0;
        var r = 0;
        for(var j = 0;j < 4;j ++,k ++){
            r += multipliers[j] * data[i][k];
        }
        r = r.toString(16).padStart(2, "0");
        var g = 0;
        for(var j = 0;j < 4;j ++,k ++){
            g += multipliers[j] * data[i][k];
        }
        g = g.toString(16).padStart(2, "0");
        var b = 0;
        for(var j = 0;j < 4;j ++,k ++){
            b += multipliers[j] * data[i][k];
        }
        b = b.toString(16).padStart(2, "0");
        rows.push("#"+r+g+b);
    }
    return rows;
}

var drawColors = function(rows){
    for(var i = 0;i < rows.length;i ++){
        ctx.fillStyle = rows[i];
        ctx.fillRect(0, i * (size/12), size, (size/12));
        ctx.fill();
        ctx.lineWidth = 1;
        for(var j = 0;j < data[i].length;j ++){
            if(data[i][j]){
                ctx.globalAlpha = alphaOne;
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(j * (size/12) + (size/30), i * (size/12) + (size/120), (size/60), (size/15));
                ctx.fill();
            } else {
                ctx.globalAlpha = alphaZero;
                ctx.beginPath();
                ctx.strokeStyle = '#000000';
                ctx.arc(j * (size/12) + (size/24), i * (size/12) + (size/24), (size/30), 0, tau);
                ctx.stroke();
                ctx.beginPath();
            }
        }
        ctx.globalAlpha = 1;
    }
}

var drawGrid = function(){
    ctx.globalAlpha = alphaVert;
    ctx.fillStyle = gridColorVert;
    for(var i = 1;i <12;i ++){
        ctx.fillRect(i*(size/12)-1, 0, 1, size);
        ctx.fill();
    }
    ctx.globalAlpha = alphaHoriz;
    ctx.fillStyle = gridColorHoriz;
    for(var i = 1;i < 12;i ++){
        ctx.fillRect(0, i*(size/12)-1, size, 1);
        ctx.fill();
    }
    ctx.globalAlpha = 1;
}

var drawPalette = function(){
    drawColors(recalculateRows());
    drawGrid();
}

function getCursorPosition(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    x = Math.floor(x/(size/12));
    y = Math.floor(y/(size/12));
    data[y][x] = !data[y][x];
    drawPalette();
}


canvas.addEventListener('mousedown', function(e) {
    getCursorPosition(canvas, e);
});

drawPalette();

var generateRandom = function(){
    for(var i = 0;i < 12;i ++){
        for(var j = 0;j < 12;j ++){
            data[i][j] = (Math.random()>0.5);
        }
    }
    drawPalette();
}

var generateClear = function(){
    for(var i = 0;i < 12;i ++){
        for(var j = 0;j < 12;j ++){
            data[i][j] = 0;
        }
    }
    drawPalette();
}

var export1 = function(){
    var flat = [];
    for(var i = 0;i < 12;i ++){
        for(var j = 0;j < 12;j ++){
            flat.push(data[i][j]);
        }
    }
    var toExport = "";
    for(var i = 0;i < flat.length;i += 6){
        var a = flat.slice(i, i + 6);
        var b = a.reduce((res, x) => res << 1 | x);//Stole from https://stackoverflow.com/questions/35296676/convert-boolean-bit-array-to-number-in-typescript
        toExport += base64[b];
    }
    return toExport;
}

var export2 = function(){
    var flat = [];
    for(var i = 0;i < 12;i ++){
        for(var j = 0;j < 12;j ++){
            flat.push(data[i][j]);
        }
    }
    var toExport = "";
    flat.push(0);
    for(var i = 0;i < flat.length;i += 5){
        var a = flat.slice(i, i + 5);
        var b = a.reduce((res, x) => res << 1 | x);//Stole from https://stackoverflow.com/questions/35296676/convert-boolean-bit-array-to-number-in-typescript
        toExport += base32[b];
    }
    return toExport;
}

var padArray = function(arr,len,fill) {
    return (Array(len).fill(fill)).slice(0,len-arr.length).concat(arr);
  }

var read = function(input){
    if(input.length == 24){
        var values = [];
        for(var i = 0;i < input.length;i ++){
            var index = base64.indexOf(input[i]);
            if(index == -1){
                return false;
            }
            var a = index.toString(2).split('').map(x => x === '1');
            a = padArray(a, 6, false);
            values = values.concat(a);
        }
        var k = 0;
        for(var i = 0;i < 12;i ++){
            for(var j = 0;j < 12;j ++, k++){
                data[i][j] = values[k];
            }
        }
        drawPalette();
        return true;
    } else if(input.length == 29){
        var values = [];
        for(var i = 0;i < input.length;i ++){
            var index = base32.indexOf(input[i]);
            if(index == -1){
                return false;
            }
            var a = index.toString(2).split('').map(x => x === '1');
            a = padArray(a, 5, false);
            values = values.concat(a);
        }
        var k = 0;
        for(var i = 0;i < 12;i ++){
            for(var j = 0;j < 12;j ++, k++){
                data[i][j] = values[k];
            }
        }
        drawPalette();
        return true;
    } else {
        return false;
    }
}

if(rand != null){
    rand.addEventListener("click", function(){
        generateRandom();
    });
}

if(clear != null){
    clear.addEventListener("click", function(){
        generateClear();
    });
}

if(exp1 != null){
    exp1.addEventListener("click", function(){
        alert(export1());
    });
}

if(exp2 != null){
    exp2.addEventListener("click", function(){
        alert(export2());
    });
}

if(imp != null){
    imp.addEventListener("click", function(){
        var result = read(prompt("Please enter your code"));
        if(!result){
            alert("There was an error loading.");
        }
    });
}

if(b001 != null){
    b001.addEventListener("click", function(){
        read(b001v);
    });
}

if(b010 != null){
    b010.addEventListener("click", function(){
        read(b010v);
    });
}

if(b011 != null){
    b011.addEventListener("click", function(){
        read(b011v);
    });
}

if(b100 != null){
    b100.addEventListener("click", function(){
        read(b100v);
    });
}

if(b101 != null){
    b101.addEventListener("click", function(){
        read(b101v);
    });
}

if(b110 != null){
    b110.addEventListener("click", function(){
        read(b110v);
    });
}

if(b111 != null){
    b111.addEventListener("click", function(){
        read(b111v);
    });
}

if(b1000 != null){
    b1000.addEventListener("click", function(){
        read(b1000v);
    });
}

if(b1001 != null){
    b1001.addEventListener("click", function(){
        read(b1001v);
    });
}

//New button method
buttons = document.getElementsByClassName("bpautobutton");
for(var i = 0;i < buttons.length;i ++){
    buttons[i].addEventListener("click", function(){
        read(this.id);
    });
}