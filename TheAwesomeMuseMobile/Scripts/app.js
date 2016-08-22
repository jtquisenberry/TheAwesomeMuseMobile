function appendCows(myString) {
    return myString + " cows";
}

function convertToLocalTime(time) {
    var offsetST = (new Date("2014-02-10T01:30:00-05:00")).getTimezoneOffset() / 60;
    var offsetDST = (new Date("2014-06-10T01:30:00-05:00")).getTimezoneOffset() / 60;
    var offsetBrowser = (new Date()).getTimezoneOffset() / 60;

    var timeArray = [];


    var year = time.substring(0, 4);
    var month = time.substring(5, 7);
    var day = time.substring(8, 10);
    var hour = time.substring(11, 13);
    var minute = time.substring(14, 16);
    var second = time.substring(17, 19);
    var millisecond = time.substring(20, 23);
    var offset = time.substring(23, 255);

    //var date = new Date(year, month, day, hour, minute, second, millisecond);
    //   var date2 = new Date(parseInt(year), parseInt(month) -1, parseInt(day), parseInt(hour), parseInt(minute));
    // console.log(year + ", " + month + ", " + day + ", " + hour + ", " + minute + ", " + second + ", " + millisecond);

    //console.log(date);
    //  data.addRow([date2, chartsdata[i].count]);
    var theDate = new Date(year + "-" + month + "-" + day + "T" + hour + ":" + minute + ":" + second + "-05:00");
    var theDate2 = new Date(year + "-" + month + "-" + day + "T" + hour + ":" + minute + ":" + second);
    //alert(theDate.getTimezoneOffset());

    //theDate.addHours(-5 + offsetBrowser + isDST(theDate.getTimezoneOffset() / 60, offsetST));


    /*var theDate2 = new Date(year + "-" + month + "-" + day + "T" + hour + ":" + minute + ":" + second + "-05:00");*/

    var isoString = theDate.toISOString();
    var finalString = isoString.substring(0, 4) + "-" + isoString.substring(5, 7) + "-" + isoString.substring(8, 10) + " " + isoString.substring(11, 13) + ":" + isoString.substring(14, 16);
    var date = theDate2.toDateString();
    var time = theDate2.toTimeString();
    //return finalString;
    return theDate2.getFullYear() + "-" + ("00" + (theDate2.getMonth() + 1)).slice(-2) + "-" + ("00" + theDate2.getDate()).slice(-2) + " " + time.substring(0, 2) + ":" + time.substring(3, 5);


}


var getYahooPrices = function (opening, last) {
    var output = opening.toFixed(4) + " " + last.toFixed(4) + " " + (last - opening).toFixed(4) + " " + ((last - opening) / opening * 100.0).toFixed(2) + "%";
    return output;
}

var getDaysURL = function (ticker, days) {


    ViewModel.ticker = "MINE";
    ViewModel.getSECFilings2();
    return days + "/" + ticker;

}

var changeTicker = function (ticker, days, cows) {
    ViewModel.setTicker2(ticker);
    ViewModel.getSECFilings2(ticker, 5);
    ViewModel.getTweets2(ticker, 5);
    ViewModel.getNews2(ticker, 5);
    ViewModel.getYahooQuotes2(ticker, 5);
    ViewModel.getPumpsAndDumps2(ticker, 5);
    displayChart(ticker, ViewModel.getDays());

    var output = "getDaysURL(" + "\"" + ticker + "\"" + ", " + days + ")";
    return output;
}


var changeDay = function (ticker, days, cows) {
    ViewModel.setDays2(days);
    ViewModel.getSECFilings2(ViewModel.ticker, 5);
    ViewModel.getTweets2(ViewModel.ticker, 5);
    ViewModel.getNews2(ViewModel.ticker, 5);
    ViewModel.getYahooQuotes2(ViewModel.ticker, 5);
    ViewModel.getPumpsAndDumps2(ViewModel.ticker, 5);
    displayChart(ViewModel.getTicker(), days);

    var output = "getDaysURL(" + "\"" + ticker + "\"" + ", " + days + ")";
    return output;
}




var ViewModel = function () {
    var self = this;
    self.error = ko.observable();
    self.RSSArticles = ko.observableArray();

    // Make functions available outside of the parent function scope.
    ViewModel.getRSSArticles = getRSSArticles;


    // Make variables available outside of the parent function scope.
    //ViewModel.ticker = self.ticker;
    
    var rssUri = 'http://www.theawesomemuse.com/feed';


    function article(title, link, comments, pubDate, description)
    {
        this.title = title;
        this.link = link;
        this.comments = comments;
        this.pubDate = pubDate;
        this.description = description;
    }

    var myArticle = new article("title","link","comments","pubDate","description");


    var outArray = [];
    



    function ajaxHelper(uri, method, data) {
        self.error(''); // Clear error message
        return $.ajax({
            type: "GET",
            url: 'http://www.theawesomemuse.com/feed',
            dataType: 'xml',
            success: function (data) {
                $(data).find("item").each(function () {
                    var el = $(this);
                    var myArticle = new article(
                        el.find("title").text(),
                        el.find("link").text(),
                        el.find("comments").text(),
                        el.find("pubDate").text(),
                        el.find("description").text());

                    outArray.push(myArticle);
                });






                //console.log(data);
                //var zzz = $(data).find("item").each(function () {
                //    var el = $(this);
                //    console.log(el.find("title").text());
                //    //$("#main-div")[0].append(el.find("title"));
                //    $("#main-ul").append("<li>" + el.find("title").text() +
                //        "<p>" + el.find("link").text() + "</p>" +
                //        "<p>" + el.find("comments").text() + "</p>" +
                //        "<p>" + el.find("pubDate").text() + "</p>" +
                //        "<p>" + el.find("description").text() + "</p>" +
                //    "</li>");

                //});

            },
            error: function (xhr, status, error) {
                console.log(error);
            },


        }).fail(function (jqXHR, textStatus, errorThrown) {
            self.error(errorThrown);
        });










        //$.ajax({
        //    type: method,
        //    url: uri,
        //    dataType: 'json',
        //    contentType: 'application/json',
        //    data: data ? JSON.stringify(data) : null
        //}).fail(function (jqXHR, textStatus, errorThrown) {
        //    self.error(errorThrown);
        //});
    }

    function getRSSArticles() {
        ajaxHelper(rssUri, 'GET').done(function (data) {
            self.RSSArticles(outArray);
        });
    }





    function setTicker() {
        self.ticker = "MJNA";
    }




    // Fetch the initial data.
    getRSSArticles();
    //setDays();


};

ko.applyBindings(new ViewModel());