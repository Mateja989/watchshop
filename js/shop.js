function shop(){
    let brendovi=[]
    let kategorije=[]
    
    
    dohvati('kategorije.json',kreirajKat)//chb
    dohvati("satovi.json",karticeProizvod)//divovi
    dohvati('brendovi.json',kreirajBrend)//chb
    dohvati('kolekcija.json',kreirajKolekciju)//rb
    
    
    /********************************** PROIZVODI  **********************************************/
    /*function karticeProizvod1(books){ //SHOP-PAGE
        let ispis=''
        if(books.length == 0){
             ispis+='<div><p>Nema proizvoda</p></div>' 
        }
        else{
            for(let proizvod of books){
                ispis+=`<div class="col-sm-4">
                <div class="product-image-wrapper">
                    <div class="single-products">
                        <div class="productinfo text-center">
                            <img src="${proizvod.slika.src}" alt="${proizvod.slika.alt}" />
                            <div class="stara">${proizvod.cena.nova}</div>
                            <p>"${proizvod.naziv}"</p>
                            <div>
                                
                            </div>
                        </div>
                        <div class="choose">
                           <ul class="nav nav-pills nav-justified text-center">
                               <li>Šifra artikla:</li>
                               <li>${proizvod.sifraArtikla}</li>
                           </ul>
                       </div>
                        <div class="product-overlay">
                            <div class="overlay-content" id="klikni">
                                <h2>"${proizvod.cena.nova},00RSD"</h2>
                                <p>"${proizvod.naziv}"</p>
                                <a href="#" class="btn btn-default add-to-cart" ><i class="fa fa-shopping-cart"></i>Pogledaj</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`  
           }
           $('.features-items').html(ispis)
        }
    }*/
    /********************************************************************************/
    
    
    
    /********************************** BRENDOVI  **********************************************/
    
    function kreirajBrend(nizBrendova){
        let ispis="";
        for(let brend of nizBrendova){
            ispis+=`<li>
                        <input type="checkbox" class="brend" value="${brend.id}"/>${brend.naziv}
                    </li>`
        }
        $('#brendovi').html(ispis);
        
        dohvati("satovi.json",karticeProizvod1)
        dohvati('kolekcija.json',kreirajKolekciju)
    }
    
    
    
    
    /********************************** KOLEKCIJA  **********************************************/
    
    function kreirajKolekciju(nizKolekcije){
        let ispis="";
        for(let brend of nizKolekcije){
            ispis+=`<li>
                        <input type="checkbox" class="brend" value="${brend.id}"/>${brend.naziv}
                    </li>`
        }
        $('#kolekcija').html(ispis);
    }
    
    
    /********************************** KATEGORIJA  **********************************************/
    
    function kreirajKat(niz){
        let ispis="";
        for(let brend of niz){
            ispis+=`<li>
                        <input type="checkbox" class="brend" value="${brend.id}"/>${brend.naziv}
                    </li>`
        }
        $('#kategorije').html(ispis);
        dohvati('brendovi.json',kreirajBrend)
    }
    
    /*****************************************************CALLBACK*********************************/
    
    
    function dohvati(url,callback){
        $.ajax({
            url: "data/" + url,
            method: "get",
            dataType: "json",
            success:function(result){
                callback(result);
            },
            error:function(err){
                console.log(err)
            }
        })
    }
    
    
    }