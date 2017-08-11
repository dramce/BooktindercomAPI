function Book(title, description, cover, infoLink) {
    
    this.title = title;
    this.description = description;
    this.cover = cover;
    this.infoLink = infoLink;
    this.like = 0;
    this.dislike = 0; 

    this.render = function () {

        $("#title").html(this.title);
        $("#description").html(this.description);
        $("#cover").attr("src", this.cover);
        $(".linkWikipedia").attr("href", this.infoLink);
    }
}

function Queue () {

    this.data = [];

    this.enqueue = function(element) {
        this.data.push(element);
    }
    this.dequeue = function() {
        var result = this.data[0];
        this.data.shift();
        return result;
    }
}

function Library() {

    this.books = new Queue();
    this.booksViewed = new Queue();
    this.actualBook = null;
    
    this.addBook = function (book) {
        this.books.enqueue(book);
    }
    this.nextbook = function () {
        this.actualBook = this.books.dequeue();
        if (this.actualBook == undefined) {
            return false;
        }
        this.booksViewed.enqueue(this.actualBook);
        this.actualBook.render();
    }
    this.like = function () {
        this.actualBook.like++;
    }
    this.dislike = function () {
        this.actualBook.dislike++;
    }
}
var library = new Library();
var contador = 1;
function init(paramPesquisa) {
    $.get(" https://www.googleapis.com/books/v1/volumes?q="+encodeURI(paramPesquisa)+"&maxResults=2&startIndex=" +contador).done(function(data){    
        for(var i=0; i < data.items.length; i++) {
            var baseDados =  data.items[i];
            var cover = baseDados.volumeInfo.imageLinks != null ? baseDados.volumeInfo.imageLinks.thumbnail: "http://demo.vdiscovery.org/aum/images/no-image.png";
            var title = baseDados.volumeInfo.title != null ? baseDados.volumeInfo.title: "N/A";
            var description = baseDados.volumeInfo.description != null ? baseDados.volumeInfo.description: "N/A";
            var infoLink = baseDados.volumeInfo.infoLink != null ? baseDados.volumeInfo.infoLink: "N/A";
            var book = new Book(title, description, cover, infoLink);
            library.addBook(book);
        };
        library.nextbook();
    }).fail(function(data){
        console.log(data);
    });
};

init("benfica");
var totalLikes = 0;
var totalDislikes = 0;
function Stats() {


    var book;
    //while we can dequeue books
    while ((book = library.booksViewed.dequeue()) !== undefined) {
        //counting total likes and total dislikes for all books
        totalLikes += book.like;
        totalDislikes += book.dislike;

        var html = "<tr>";
        html += "<td>";
        html += book.title;
        html += "</td>";
        html += "<td>";
        html += book.like;
        html += "</td>";
        html += "<td>";
        html += book.dislike;
        html += "</td>";
        html += "</tr>";
        $('#counter').append(html);
    }

    $("#contador1").text(totalLikes);
    $("#contador2").text(totalDislikes);
}

$("#executa_pesquisa").click(function(){
    var paramPesquisa = $("#pesquisa").val();
    init(paramPesquisa);
})

$(".landing").on("click", ".landingbutton", function () {

    $landing = $(this).parent();
    $landing.hide();
    $("#mainPage").show();

});

$("#buttonDislike").click(function () {
    library.dislike();
    if (library.nextbook() === false) {
         $("#mainPage").hide();
         $("#endPage").show();
         Stats();
    }
});
$("#buttonLike").click(function () {
    library.like();
    if (library.nextbook() === false) {
         $("#mainPage").hide();
         $("#endPage").show();
         Stats();
    }
});

$("#endPage").on("click", ".buttonrestart", function () {
    $("#endPage").hide();
    $("#mainPage").show();
    contador += 2;
    init("books");
});

var input = $("#pesquisa").val();

$("#executa_pesquisa").click(function(){
    $("#endPage").hide();
    $("#mainPage").show();
    init(input);
})