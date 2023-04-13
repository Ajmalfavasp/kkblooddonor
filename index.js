const express=require("express");
const body_parser=require("body-parser");
const axios=require("axios");
require('dotenv').config();

const app=express().use(body_parser.json());

// const token=process.env.TOKEN;
// const mytoken=process.env.MYTOKEN;
const token='EAAKnkLmOpa8BAAwmM8d8mBdHkt2OZAlEOvrZAWyZAN5FfzdHV8hRisRZBGky52cUDhOqXq0cJdZBkgfJ2DPudfHI5uGuHJGb433efzxIaDW9gR1vrrZAJGCYOMcibtvdSM5O2zBzOZBZA2aZBM9PXcv1QmXIAurYxXLjRenTYZCqo4ZBKFVkOQdikZBsKjFC9gOZAyRr5jeSZBV39ZAOwZDZD';
const mytoken='kkblooddonorapp';

app.listen(process.env.PORT,()=>{
    console.log("webhook is listening");
});

//to verify the callback url from dashboard side - cloud api side
app.get("/webhook",(req,res)=>{
    console.log("webhook is");
   let mode=req.query["hub.mode"];
   let challange=req.query["hub.challenge"];
   let token=req.query["hub.verify_token"];


    if(mode && token){

        if(mode==="subscribe" && token===mytoken){
            res.status(200).send(challange);
        }else{
            res.status(403);
        }
    }
});

app.post("/webhook",(req,res)=>{ //i want some 

    let body_param=req.body;

    console.log(JSON.stringify(body_param,null,2));

    if(body_param.object){
        if(body_param.entry && 
            body_param.entry[0].changes && 
            body_param.entry[0].changes[0].value.messages && 
            body_param.entry[0].changes[0].value.messages[0]  
            ){
               let phon_no_id=body_param.entry[0].changes[0].value.metadata.phone_number_id;
               let from = body_param.entry[0].changes[0].value.messages[0].from; 
               let msg_body = body_param.entry[0].changes[0].value.messages[0].text.body;

               console.log("phone number "+phon_no_id);
               console.log("from "+from);
               console.log("boady param "+msg_body);

               axios({
                   method:"POST",
                   url:"https://graph.facebook.com/v13.0/"+phon_no_id+"/messages?access_token="+token,
                   data:{
                       messaging_product:"whatsapp",
                       to:from,
                       text:{
                           body:"Hi.. I'm Ajmal, your message is "+msg_body
                       }
                   },
                   headers:{
                       "Content-Type":"application/json"
                   }

               });

               res.sendStatus(200);
            }else{
                res.sendStatus(404);
            }
    }

});

app.get("/",(req,res)=>{
    res.status(200).send("hello this is webhook setup");
});