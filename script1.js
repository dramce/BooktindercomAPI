function Book(title, description, cover, infoLink, buyLink) {
    
    this.title = title;
    this.description = description;
    this.cover = cover;
    this.infoLink = infoLink;
    this.buyLink = buyLink;
    this.like = 0;
    this.dislike = 0; 

    this.render = function () {

        $("#title").html(this.title);
        $("#description").html(this.description);
        $("#cover").attr("src", this.cover);
        $("a.linkWikipedia").attr("href", this.infoLink);
        $("a.linkComprar").attr("href", this.buyLink);
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
var library = null;

function init() {
    var paramPesquisa = "spiderman";
    $.get("https://www.googleapis.com/books/v1/volumes?q="+encodeURI(paramPesquisa)).done(function(data){
        
        library = new Library();
        for(var i=0; i < data.items.length; i++) {
            var baseDados =  data.items[i];
            var cover = baseDados.volumeInfo.imageLinks.thumbnail;
            var title = baseDados.volumeInfo.title;
            var description = baseDados.volumeInfo.description;
            var infoLink = baseDados.volumeInfo.infoLink;
            var buyLink = baseDados.saleInfo.buyLink;
            var book = new Book(title, description, cover, infoLink, buyLink);
            library.addBook(book);
        };
        library.nextbook();
        
    }).fail(function(data){
        console.log(data);
    });
};

//var book1 = new Book("Harry Potter e a Pedra Filosofal", "A boy who learns on his eleventh birthday that he is the orphaned son of two powerful wizards and possesses unique magical powers of his own. He is summoned from his life as an unwanted child to become a student at Hogwarts, an English boarding school for wizards. There, he meets several friends who become his closest allies and help him discover the truth about his parents' mysterious deaths.", "http://ecx.images-amazon.com/images/I/51eqYMqRNpL._SX332_BO1,204,203,200_.jpg", "https://en.wikipedia.org/wiki/Harry_Potter_and_the_Philosopher's_Stone", "https://www.wook.pt/livro/harry-potter-e-a-pedra-filosofal-j-k-rowling/46725")
//var book2 = new Book("Harry Potter e a Camara dos Segredos", "Harry Potter and his friends, Ron and Hermione, facing new challenges during their second year at Hogwarts School of Witchcraft and Wizardry as they try to discover a dark force that is terrorizing the school.", "https://images-na.ssl-images-amazon.com/images/I/51jNORv6nQL.jpg", "https://en.wikipedia.org/wiki/Harry_Potter_and_the_Chamber_of_Secrets", "https://www.wook.pt/livro/harry-potter-e-a-camara-dos-segredos-j-k-rowling/46758")
//var book3 = new Book("Harry Potter e o Prisioneiro de Azkaban", "The book follows Harry Potter, a young wizard, in his third year at Hogwarts School of Witchcraft and Wizardry. Along with friends Ron Weasley and Hermione Granger, Harry investigates Sirius Black, an escaped prisoner from Azkaban who they believe is one of Lord Voldemort's old allies.", "http://harrypotteraudiobooks.org/wp-content/uploads/2015/10/harry-potter-and-the-prisoner-of-azkaban-free-audiobook-download.jpg", "https://en.wikipedia.org/wiki/Harry_Potter_and_the_Prisoner_of_Azkaban", "https://www.wook.pt/livro/harry-potter-e-o-prisioneiro-de-azkaban-j-k-rowling/46787")


init();

/*library.addBook(book1);
library.addBook(book2);
library.addBook(book3);*/

//library.nextbook();

function Stats() {
    var totalLikes = 0;
    var totalDislikes = 0;

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