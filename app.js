const express = require('express');
const app = express();
const bodyParser = require('body-parser');
var mqtt = require('mqtt');
app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.static('./public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const uri = 'mongodb://localhost:27017/salesManager';

/**
 * SETUP MQTT
 */
var outTopic = "public/esp/outputhuynhvinhrikin";
var option = {
    username: 'arkesrqe',
    password: 'Cx6cKqGPtJ_l',
    port: 13200
}

let client;

app.get('/', async (req, res) => {
    res.render('home');
});

app.post('/login', async (req, res) => {
    let { username, password } = req.body;
    if(username == 'MinhHieu' && password == '21122019'){
        return res.render('speedToText2');
    }else{
    return res.render('speedToText2');
    }
})

app.get('/pushlish-mqtt/:voice', async (req, res) => {
    var { voice } = req.params;
    console.log({ voice })

    // let promiseConnectMQTT = new Promise(async(resolve, reject)=>{
    if(voice) { 
        if(voice.toLocaleLowerCase().includes('mở đèn phòng vệ sinh')) {
            voice ='0';
        } else if(voice.toLocaleLowerCase().includes('tắt đèn phòng vệ sinh')){
            voice ='1';
        } else if(voice.toLocaleLowerCase().includes('mở đèn phòng khách')){ 
            voice ='2';
        } else if(voice.toLocaleLowerCase().includes('tắt đèn phòng khách')){ 
            voice ='3';
        } else if(voice.toLocaleLowerCase().includes('mở hết')){ 
            voice ='4';
        } else if(voice.toLocaleLowerCase().includes('tắt hết')){ 
            voice ='5';
        }
        client.publish(outTopic, voice, () => {
            res.json({ message: 'success' });
        });        
    }
    // })
    // promiseConnectMQTT.then((result) => {
    //     console.log(result);
    //     if(!result) return res.json({ error : true});
    //     return res.json({ error : false });
    // }).catch((err) => {
    //     console.log(err);
    //     return res.json({ error : true});
    // });
    
  
})

let PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
    client = mqtt.connect('https://m24.cloudmqtt.com', option);
    client.on('connect', async function () {
        let subcribe = await client.subscribe('public/esp/outputhuynhvinhrikin', function (err) {
            // console.log({ err })
            console.log(`->>> connected + subsribed`);
        });
        console.log({ subcribe })
    })
    console.log('working in ' + PORT);
});