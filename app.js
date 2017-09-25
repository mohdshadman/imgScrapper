var express = require("express");
var bodyParser = require('body-parser');
var cheerio = require('cheerio');
var jimp = require("jimp");
var mongoose = require('mongoose');
var request = require('request');

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine","ejs");


app.get("/",function(req,res){
    res.render("welcome");
});


app.get("/db",function(req,res){
   var text=req.query.searchtext;
    var url="https://www.google.co.in/search?q="+text+"&source=lnms&tbm=isch";
   var url_arr=[];
    
     obj={};
    // database connection code
    
    connection=   mongoose.connect('mongodb://localhost/img_scrap');
    //console.log("connection successsful");  
    imgSchema = new mongoose.Schema({
    src:String
    
});
     image=mongoose.model(text,imgSchema);
    
   mongoose.connection.on('open', function () {
    mongoose.connection.db.listCollections().toArray(function (err, names) {
      if (err) {
        console.log(err);
      } else { 
          //res.render("success",{list:names,text:text});
          //console.log(typeof names);
          //console.log(text);
      obj=names;
      
      
      }
   });
   });
    
    request(url,function(err,respose,body){
        if(!err&&respose.statusCode==200){
            $=cheerio.load(body);
            $('img').each(function(index,images){
                //console.log(images.attribs.src);
                var scrap_url=images.attribs.src;
                
                url_arr.push(scrap_url);
                //console.log(scrap_url);
                image.create({
                    src: scrap_url
                },function(err,result){
                    if(err){
                        console.log(err);    
                    }
                else{
                  //console.log("data added successfully");    
                    }
                });    
            });
        
        } 
       /*url_arr.forEach(function(result){
           console.log(result);
       }); */
       
        
        res.render("success",{list:obj,text:text,result:url_arr}); 
   
   });
    
    
    
  /* mongoose.connection.on('open', function () {
    mongoose.connection.db.listCollections().toArray(function (err, names) {
      if (err) {
        console.log(err);
      } else { 
          res.render("success",{list:names,text:text});
      }

     mongoose.connection.close();
    });
});*/
         
});




app.listen(3000,function(){
    console.log("Scrapper app ready");
});