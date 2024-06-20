
let mscnt = 0
let recvString = ""
let TStoSendStr = ""

function sendAT(command: string, wait: number = 0) {
    serial.writeString(`${command}\u000D\u000A`)
    basic.pause(wait)
}
function uploadData() {
    sendAT(TStoSendStr, 100)
    while (1) {
        recvString = "" + recvString + serial.readString()
        basic.pause(1)
        mscnt += 1
        if (recvString.includes("OK")) {
            //basic.showString("upload ok")
            break;
        }
        if (mscnt >= 500) {
            //basic.showString("timeout")
            break;
        }
        if (recvString.includes("ERROR")) {
            //basic.showString("upload error")
            break;
        }
    }
    recvString = " "
    basic.pause(200)
}
function setData(write_api_key: string, n1: number = 0, n2: number = 0, n3: number = 0, n4: number = 0, n5: number = 0, n6: number = 0, n7: number = 0, n8: number = 0) 
{
    TStoSendStr = "AT+HTTPCLIENT=2,0,\"http://api.thingspeak.com/update?api_key="
        + write_api_key + "&field1=" + n1 + "&field2=" + n2 + "&field3=" + n3 + "&field4=" + n4 + "&field5=" + n5 + "&field6=" + n6 + "&field7=" + n7 + "&field8=" + n8
        + "\",,,1"
}
function setGoogleData(n1: number = 0, n2: number = 0, n3: number = 0, n4: number = 0) 
{   TStoSendStr = "AT+HTTPCLIENT=2,0,\"https://script.google.com/macros/s/AKfycbxyqd9J-kKcGrBqnon3XGHomYaRLoKVLxUqErWafPweHA05HWJwYVGquzSUVl8bAsjRHw/exec?"        
        + "&field1=" + n1 + "&field2=" + n2 + "&field3=" + n3 + "&field4=" + n4
        + "\",,,1"
}
function SendGoogleData() {
    let vlight = input.lightLevel()
    let vtemperature = input.temperature()
    let vaccelX = input.acceleration(Dimension.X)
    let vsound = input.soundLevel();

    setGoogleData(vlight, vtemperature, vaccelX, vsound);
    uploadData()
}

basic.showString("start!")

ESP8266_IoT.initWIFI(SerialPin.P8, SerialPin.P12, BaudRate.BaudRate115200)
ESP8266_IoT.connectWifi("AOffice", "88888888")

if (ESP8266_IoT.wifiState(true)) {
    basic.showString("C")
    basic.pause(1000)

    let count = 0;

    while (ESP8266_IoT.wifiState(true)) {
        SendGoogleData();
        basic.pause(500)
        ++count;
        //basic.showNumber(count);        
        basic.showString("!" + count )
    }

} else {
    basic.showString("N")
}

