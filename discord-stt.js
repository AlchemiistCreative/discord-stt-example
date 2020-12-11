const speech = require('@google-cloud/speech');
const Discord = require('discord.js');
const discordTTS=require("discord-tts");
const {
  prefix,
  token
} = require('./config.json');


const discordClient = new Discord.Client();

discordClient.login(token);


discordClient.once('ready', () => {
    console.log('Ready!');
    discordClient.user.setPresence({ activity: { name: '!cmdlist' }, status: 'available' },{ type: 'LISTENING'})


   });


discordClient.on('message', message => {
    var isReady = true;
    var voiceChannel = message.member.voice.channel;


const googleSpeechClient = new speech.SpeechClient();
const { Transform } = require('stream')
process.env.GOOGLE_APPLICATION_CREDENTIALS = "./yourgooglekey.json";
                            


  function convertBufferTo1Channel(buffer) {
    const convertedBuffer = Buffer.alloc(buffer.length / 2)
  
    for (let i = 0; i < convertedBuffer.length / 2; i++) {
      const uint16 = buffer.readUInt16LE(i * 4)
      convertedBuffer.writeUInt16LE(uint16, i * 2)
    }
  
    return convertedBuffer
  }
  
  class ConvertTo1ChannelStream extends Transform {
    constructor(source, options) {
      super(options)
    }
  
    _transform(data, encoding, next) {
      next(null, convertBufferTo1Channel(data))
    }
  }




if (isReady && message.content.startsWith(`${prefix}stt`)) {
    // +debug [userToListenTo]
    isReady = false;
    const userToListenTo = message.author;
    console.log(userToListenTo);
    var str = 'I am ready to listen...';


            if(voiceChannel != null){
                        voiceChannel.join().then(async connection =>
                          {

                            const dispatcher = connection.play(discordTTS.getVoiceStream(str));
                            dispatcher.on("finish", end => {
                              
                               console.log(str)

                            connection.on('speaking', (user, speaking) => {
                                if (!speaking) {
                                  return
                                }
                            const audioStream = connection.receiver.createStream(userToListenTo, { mode: 'pcm' })
                            const requestConfig = {
                              encoding: 'LINEAR16',
                              sampleRateHertz: 48000,
                              languageCode: 'en-US'
                            }
                            const request = {
                              config: requestConfig,
                              interimResults: true
                            }
                            const recognizeStream = googleSpeechClient
                              .streamingRecognize(request)
                              .on('error', console.error)
                              .on('data', response => {
                                const transcription = response.results
                                  .map(result => result.alternatives[0].transcript)
                                  .join('\n')
                                  .toLowerCase()
                                console.log(`Transcription: ${transcription}`)
                                if(transcription === "example"){
                                  const dispatcher = connection.play(discordTTS.getVoiceStream('It works very well!'));
                                  dispatcher.on("finish", end => {
                                      isReady = true;
                                      return;
                                  })}
                            
                                if(transcription === "leave"){
                                  const dispatcher = connection.play(discordTTS.getVoiceStream('It works very well!'));
                                  dispatcher.on("finish", end => {
                                      isReady = true;
                                      voiceChannel.leave();
                                    })}
                            })
                        
                            const convertTo1ChannelStream = new ConvertTo1ChannelStream()
                        
                            audioStream.pipe(convertTo1ChannelStream).pipe(recognizeStream)
                        
                            audioStream.on('end', async () => {
                              console.log('audioStream end')
                            })
                            
                            
                            })
                               


                              });

                        }).catch(err => console.log(err));
                                    
                          
             }else{

              return message.channel.send(` Nobody is there to listen me :(, ${message.author}!`);
                      
                  } 
                       
  }        
//------------------------------ STT END      


}

);
