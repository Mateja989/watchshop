window.onload=function(){
    let url = window.location.pathname;

    console.log(url)

    if(url == "/watchshop/index.html" || url == "/"){
        dohvati("satovi.json",najnovijiProizvodi)
        dohvati("satovi.json",malaKartica)
        slider()
    }
    if(url == "/watchshop/shop.html"){
        dohvati("satovi.json",sviProizvodi)
        kreirajChb(brendovi,"#brend",'brendovi',".brendovi")
        kreirajChb(kategorije,"#kategorije",'kategorije',"#kategorije")
    }
    if(url == "/watchshop/checkout.html"){
        proveraForme()
    }

}
//slider na pocetnoj strani
var headerCover=['images/home/banner-01.jpg','images/home/banner-02.jpg','images/home/banner-03.jpg']
var headerDiv=document.getElementById("slider")
var len=headerCover.length
var i=0;

function slider(){
    if(i>len-1){
        i=0;
    }
    headerDiv.style.backgroundImage="url('"+ headerCover[i] + "')";
    i++;
    setTimeout('slider()',3500);
}

//dohvati("kategorije.json",ispisKat)
dohvati("brendovi.json",ispisBrendova)

dohvati("satovi.json", function(result){
    localStorage.setItem("nizSatova", JSON.stringify(result));
})
dohvati("brendovi.json", function(result){
    localStorage.setItem("nizBrendova", JSON.stringify(result));
})
dohvati("kategorije.json", function(result){
    localStorage.setItem("nizKategorija", JSON.stringify(result));
})

var satoviLS = JSON.parse(localStorage.getItem("nizSatova"))
var brendovi=JSON.parse(localStorage.getItem("nizBrendova"))
var kategorije=JSON.parse(localStorage.getItem("nizKategorija"))

console.log(satoviLS)

function filterPromeni() {
    dohvati("satovi.json",sviProizvodi);
}

//kategorije pocetna strana
function ispisKat(nizKategorija){
    let ispis="";
    for(let kat of nizKategorija){
        ispis +=`<div class="panel panel-default">
                        <div class="panel-heading">
                    <h4 class="panel-title lista"><a href="shop.html" data-idkat="${kat.id}">${kat.naziv}</a></h4>
                </div>
                </div>`
    }
    $("#accordian").html(ispis)
   /* $('.lista a').click(function() {
        localStorage.setItem("cekiranoKat", this.dataset.idkat);
        filterChange();
    });*/
}
//brendovi pocetna

function ispisBrendova(nizBrendova){
    let ispis=`<ul class="nav nav-pills nav-stacked">`
    for(let br of nizBrendova){
        ispis+=`<li class="lista1"><a href="shop.html" data-brendid="${br.id}"> <span class="pull-right">(${brojProizvoda(br.id)})</span>${br.naziv}</a></li>`
    }
    ispis+=`</ul>`
    $("#brendovi").html(ispis)
   /* $('.lista1 a').click(function() {
        localStorage.setItem("cekiranoBrend", this.dataset.brendid);
        filterChange();
    });*/
    dohvati("kategorije.json",ispisKat)
}
//${brojProizvoda(br.id)}



//ispis proizvoda na shop strani
function sviProizvodi(nizProizvoda){
    nizProizvoda = filtriraj(nizProizvoda,'input[class="kategorije"]:checked');
    nizProizvoda = filtriraj(nizProizvoda,'input[class="brendovi"]:checked');
    nizProizvoda = filtriraj(nizProizvoda,'input[class="kolekcije"]:checked');
    nizProizvoda=sortiraj(nizProizvoda)
    nizProizvoda=pretragaPoImenuISifri(nizProizvoda)
    nizProizvoda=dostupnostArtikla(nizProizvoda)
    let ispis=""
    if(nizProizvoda.length == ""){
         ispis+=`<div class="nije">
         <img src="images/home/ne.jpg" alt="ne postoji" />
         <p>Žao nam je,trenutno nemamo proizvode za zadati kriterijum</p>
         </div>` 
         document.querySelector('.features-items').innerHTML=ispis
    }
    else{
        proizvodiIspis(nizProizvoda,".features-items")
    }
}
//funkcija za ispis najnovijih proizvoda na pocetnoj strani
function najnovijiProizvodi(nizProizvoda){ 
        nizProizvoda.sort(function(a,b){
            const datum1=new Date(a.datum)
            const datum2=new Date(b.datum)
    
            return Date.UTC(datum2.getFullYear(),datum2.getMonth(),datum2.getDate())-Date.UTC(datum1.getFullYear(),datum1.getMonth(),datum1.getDate()) 
        })
        nizProizvoda=nizProizvoda.slice(0,6)
        proizvodiIspis(nizProizvoda,"#najnoviji")
}
//funkcija za ispis glavnog bloka proizvoda
function proizvodiIspis(nizProizvoda,idBloka){
    let ispis=""
    for(let proizvod of nizProizvoda){
        ispis+=`<div class="col-sm-12 col-md-6 col-lg-4">
        <div class="product-image-wrapper">
            <div class="single-products">
                <div class="productinfo text-center">
                    <img src="${proizvod.slika.src}" alt="${proizvod.slika.alt}" />
                    <div class="stara">
                        ${obradaCene(proizvod.cena)}
                    </div>
                    <p>"${proizvod.naziv}"</p>
                    <div>
                        ${proizvod.dostupnost ? `<p class="Dostupno">Odmah dostupno</p>`: `<p class="Nedostupno">Trenutno nije dostupno</p>`}
                    </div>
                </div>
                <div class="choose">
                   <ul class="nav nav-pills nav-justified text-center">
                       <li>Šifra artikla:</li>
                       <li>${proizvod.sifraArtikla}</li>
                   </ul>
               </div> 
               <div id="kolekcijaOznaka">
               ${obradaKolekcije(proizvod.kolekcijaId)}
               </div> 
               <div class="product-overlay mesto">
                    <div class="overlay-content">
                    </div>
                </div>
            </div>
        </div>
    </div>`  
    } 
    document.querySelector(idBloka).innerHTML=ispis
    dohvati("brendovi.json",ispisBrendova)
}
//obrada kartica
function brojProizvoda(id){
    let filterprod = satoviLS.filter(el => el.brendId == id)
    return filterprod.length;
    
}
//obrada kolekcije
function obradaKolekcije(id){
    let ispis=""
    if(id){
        if(id==1){
            ispis+=`<img src="images/home/new.png" class="new" alt="novo" />`
        }
        else{
            ispis+=`<img src="images/home/sale.png" class="new" alt="rasprodaja" />`
        }
    }
    else ispis=""
    return ispis;
}

//obrada cene
function obradaCene(cena){
    let ispis=""
    if(cena.stara!=null){
        ispis+=`<h2>${cena.nova},00RSD<p>${cena.stara},00RSD</p></h2>`
    }
    else{
        ispis+=`<h2>${cena.nova},00RSD</h2>`
    }
    return ispis
}

//mala kartica
function malaKartica(nizProizvoda){
    let ispis=""
    const rasprodajaNiz=nizProizvoda.filter(el => el.kolekcijaId==2)
    novi=rasprodajaNiz.slice(0,6)
    for(let p of novi){
        ispis+=`<div class="col-sm-2">
                    <div class="product-image-wrapper">
                    <div class="single-products">
                <div class="productinfo text-center">
                    <img src="${p.slika.src}" alt="${p.slika.alt}" />
                    <div class="stara">${obradaCene(p.cena)}</div>
                    <p>${p.naziv}</p>
                    <a href="#" class="btn btn-default add-to-cart klikni" ><i class="fa fa-shopping-cart"></i>Add to cart</a>
                </div>
                <div id="kolekcijaOznaka">
                ${obradaKolekcije(p.kolekcijaId)}
                </div> 
            </div>
        </div>
    </div>`
    }
    document.querySelector('#rasprodajaSatovi').innerHTML=ispis
}

/*************************************************SHOP **********************/

dohvati('kolekcija.json',kreirajKolekciju)//rb


let kolekcija=[]

//dohvatanje iz local storage napisati funkciju    
var brendovi=JSON.parse(localStorage.getItem("nizBrendova"))
var kategorije=JSON.parse(localStorage.getItem("nizKategorija"))




//funkcija za kreiranje chb na shop strani
function kreirajChb(niz,id,klasa,svi){
    let ispis="";
    for(let clan of niz){
        ispis+=`<li>
                    <input type="checkbox" class=${klasa} value="${clan.id}"/>${clan.naziv}
                </li>`
    }
    document.querySelector(id).innerHTML=ispis
     document.querySelectorAll(svi).forEach(x => {
        x.addEventListener('change',filterPromeni)
    })
}

function kreirajKolekciju(nizKolekcije){
    let ispis="";
    for(let kolekcija of nizKolekcije){
        ispis+=`<li>
                    <input type="checkbox" class="kolekcije" value="${kolekcija.id}"/>${kolekcija.naziv}
                </li>`
    }
    kolekcija=nizKolekcije;
    $('#kolekcija').html(ispis);
    $('.kolekcije').change(filterPromeni);
}

//funkcija za filtriranje proizvoda na shop strani
function filtriraj(nizProizvoda,selektor) {
    const selektovani = document.querySelectorAll(selektor)
    let id = []
    
    selektovani.forEach(x => {
        id.push(Number(x.value))
    })
    if(id.length){
        if(selektor=='input[class="kategorije"]:checked'){
            return nizProizvoda.filter(proizvod => id.includes(proizvod.kategorijaId))
        }
        else if(selektor=='input[class="brendovi"]:checked'){
            return nizProizvoda.filter(proizvod => id.includes(proizvod.brendId))  
        }
        else{
            return nizProizvoda.filter(proizvod => id.includes(proizvod.kolekcijaId))  
        }
    }
    else{
        return nizProizvoda
    }
    
}
//funkcija za sortiranje na shop strani
function sortiraj(nizProizvoda){
    document.querySelector("#ddlSortiranje").addEventListener('change',filterPromeni);
    var tip=document.querySelector("#ddlSortiranje").value
    if(tip=="cenaAsc"){
        return nizProizvoda.sort((a,b)=> a.cena.nova > b.cena.nova ? 1:-1);
    }
    if(tip=="cenaDsc"){
        return nizProizvoda.sort((a,b)=> a.cena.nova < b.cena.nova ? 1:-1);
    }
    if(tip=="nazivAsc"){
        return nizProizvoda.sort((a,b)=> a.naziv > b.naziv ? 1:-1);
    }
    if(tip=="nazivDsc"){
        return nizProizvoda.sort((a,b)=> a.naziv < b.naziv ? 1:-1);
    }
    return nizProizvoda
}
//funkcija za pretragu po imenu na shop strani
function pretragaPoImenuISifri(nizProizvoda){
    document.querySelector('#pretraga').addEventListener('keyup',filterPromeni)
    var pretraga=document.querySelector('#pretraga').value.toLowerCase()
    if(pretraga){
        return nizProizvoda.filter(proizvod => proizvod.naziv.toLowerCase().indexOf(pretraga)!=-1)
    }
    return nizProizvoda
}
//funkcija dostupnost prozvioda na shop strani
document.querySelectorAll('.stanje').forEach(stanje => stanje.addEventListener('change',filterPromeni))
function dostupnostArtikla(nizProizvoda){
    var selektovani=document.querySelector('input[class="stanje"]:checked').value
    if(selektovani=="dostupno"){
        return nizProizvoda.filter(proizvod => proizvod.dostupnost)
    }
    if(selektovani=="nedostupno"){
        return nizProizvoda.filter(proizvod => !proizvod.dostupnost)
    }
    if(selektovani=="svi") return nizProizvoda
}
//glavna funkcija za proveru forme i placanje
function proveraForme(){
    //dohvatanje elemenata
    var korisnkickoIme=document.querySelector('#korisnik')
    var lozinka=document.querySelector('#lozinka')
    var btnNastavi=document.querySelector('#btnNastavi')
    var lozinkaProvera=document.querySelector('#btnProvera')
    var ime=document.querySelector('#ime')
    var prezime=document.querySelector('#prezime')
    var mejl=document.querySelector('#email')
    var ddlGrad=document.querySelector('#ddlGrad')
    var posta=document.querySelector('#posta')
    var ulica=document.querySelector('#ulica')
    var telefon=document.querySelector('#telefon')
    var pouzece=document.querySelector('#pouzece')
    var kartica=document.querySelector('#kartica')
    var karticaBroj=document.querySelector('#karticaBroj')
    var btnZavrsiKupovinu=document.querySelector('#btnZavrsi')
    var gradovi=["Beograd","Nis","Kragujevac","Kraljevo"]
    var postanskiBrojevi=['11000','18000','34000','36000']

    //regularni izrazi
    var regIme=/^[A-Z]{1}[a-z]{2,14}$/
    var regPrezime=/^[A-Z]{1}[a-z]{4,29}$/
    var regLozinka=/^[A-Z]{1}[a-z0-9!@#$%^.&*]{7,19}$/
    var regMejl=/^[a-zA-Z0-9]([a-z]|[0-9])+\.?-?_?([a-z]|[0-9])*\.?([a-z]|[0-9])*\@[a-z]{3,}\.([az]{2,4}\.)?([a-z]{2,4})$/
    var regKorisnickoIme=/^([a-z]{1})[a-z0-9]{4,29}$/
    var regKartica=/^[\d]{18}/
    var regTelefon=/^06[\d]{7,8}/
    var greska

    //provera prve forme
    logovanjeZaPlacanjeProvera()
    function logovanjeZaPlacanjeProvera(){
        btnNastavi.addEventListener('click',function(){

            proveraPolja(korisnkickoIme,regKorisnickoIme)
            proveraPolja(lozinka,regLozinka)

            if(!greska){
            otvoriZaPlacanje()
            }
        })
    }
    //provera kartice ako se izabere placanje karticom
    kartica.addEventListener('blur',function(){
        proveraPolja(kartica,regKartica)
        if(!greska){
            btnZavrsiKupovinu.removeAttribute('disabled')
        }
        else{
            btnZavrsiKupovinu.setAttribute('disabled')
        }
    })
    //provera forme posle klika i zavrsetak kupovine
    btnZavrsiKupovinu.addEventListener('click',function(){
        proveraPolja(ime,regIme)
        proveraPolja(prezime,regPrezime)
        proveraPolja(mejl,regMejl)
        proveraPolja(telefon,regTelefon)
        proveraPostanskiBroj()
        if(!greska){
            uspeh('#korisnikForma')
            uspeh('#zaPlacanje')
        } 
    })

    //funckija za brisanje forme posle uspesne kupovine
    function uspeh(id){
        var tagoviForme=document.querySelector(id)

            for(let i=0;i<tagoviForme.length;i++){
                tagoviForme[i].value=""
            }

        document.querySelector('.uspeh').classList.remove('nevidljiv')
    }
    //funkcija za prikazivanje lozinke u tekstualnom obliku lozinke
    function proveriLozinku(){
    
        lozinka.setAttribute("type", "text"); 
        function vratiLozinkuKriptovanu(){
            lozinka.setAttribute("type", "password");
        }
            setTimeout(vratiLozinkuKriptovanu,500)
        }
    lozinkaProvera.addEventListener('click',proveriLozinku)

    //aktiviranje druge forme
    function otvoriZaPlacanje(){
        var tagoviForme=document.querySelector('#zaPlacanje')
        btnZavrsiKupovinu.removeAttribute('disabled')
        for(let i=0;i<tagoviForme.length;i++){
            tagoviForme[i].removeAttribute('disabled')
            tagoviForme[i].style.background="#e6e6e6"
        }
    }

    //provera tekstualnih polja
    function proveraPolja(id,reg){
        if(reg.test(id.value)){
            id.nextElementSibling.classList.add('nevidljiv')
            greska=false
        }
        else if(id.value==""){
            id.nextElementSibling.classList.remove('nevidljiv')
            greska=true
        }
        else{
            id.nextElementSibling.classList.remove('nevidljiv')
            greska=true
        }
    }
    //ispisivanje gradova i provera grada i postanskog broja koji se automatski popunjava
    gradPostanskiBrojIspis()
    function gradPostanskiBrojIspis(){
        let ispis="<option value='Izaberite'>Grad*</option>"
        for(let grad of gradovi){
            ispis+=`<option value=${grad}>${grad}</option>`
        }
        ddlGrad.innerHTML=ispis
    }
    function proveraPostanskiBroj(){
        if(ddlGrad.value!="Izaberite"){
            ddlGrad.nextElementSibling.classList.add('nevidljiv')
            greska=false
        }
        else{
            ddlGrad.nextElementSibling.classList.remove('nevidljiv')
            greska=true
        }
    }
    gradoviPostanskiBroj()
    function gradoviPostanskiBroj(){
        ddlGrad.addEventListener('change',function(){
            if(ddlGrad.value!="Izaberite"){
                let index=gradovi.findIndex(grad => grad==ddlGrad.value)
                document.querySelector('#posta').value=postanskiBrojevi[index]
                ddlGrad.nextElementSibling.classList.add('nevidljiv')
                greska=false
            }
            else{
                ddlGrad.nextElementSibling.classList.remove('nevidljiv')
                greska=true
            }
        })
    }
}
//CALLBACK
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

$(document).on("click",".mesto", function() {
    $(".modal-bg").css("visibility", "visible");
    $(".zatvori").on("click", function() {
        $(".modal-bg").css("visibility", "hidden");
    })
})
/*dohvati('satovi.json',ispisiModal)
//modal 
function ispisiModal(nizProizvoda){

    let ispis=""
    for(let p of nizProizvoda){
      ispis +=`<div class="nes">
        <div class="left1 col-sm-3">
            <div class="big-img">
            <img src="${p.slika.src}" alt="${p.slika.alt}" />
            </div>
        </div>
        <div class="right col-sm-3">
            <div class="url">
                <p>Početna > Proizvodi</p>
                <div class="zatvori"><img src="images/home/close.png"/></div>
            </div>
            <div class="pname">${p.naziv}</div>
            <div class="price">${p.cena.nova}</div>
            <div class="spec">
                <table>
                    <thead>
                        <th>Specifikacije</th>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Mehanizam - vrsta:</td>
                            <td>Kvarcni</td>
                        </tr>
                        <tr>
                            <td>Kućište - materijal:</td>
                            <td>Hirurški čelik</td>
                        </tr>
                        <tr>
                            <td>Mehanizam - vrsta:</td>
                            <td>Kvarcni</td>
                        </tr>
                        <tr>
                            <td>Prečnik kućišta:</td>
                            <td>50mm</td>
                        </tr>
                        <tr>
                            <td>Staklo - materijal:</td>
                            <td>Mineralno</td>
                        </tr>
                    </tbody>
                    
                </table>
            </div>
            <div class="quantity">
                <p>Kolicina</p>
                <td class="cart_quantity">
                    <div class="cart_quantity_button">
                        <a class="cart_quantity_up" href=""> + </a>
                        <input class="cart_quantity_input" type="number" name="quantity" value="1"  size="2" max="5"
                        min="1">
                        <a class="cart_quantity_down" href=""> - </a>
                    </div>
                </td>
            </div>
            <div class="btn-box">
                <button class="btn-mm">Add to cart</button>
                <button class="buy-btn">Buy now</button>
            </div>
        </div>
    </div>`
    }
}

function obradaSpecifikacije(specObj){
    let html = "";

    for(let objSpec of specObj){
        html += `<li>${objSpec.naziv}: ${objSpec.vrednost}</li>`
    }
    return html;
}*/

  


// 36 proizvoda

// https://michalsnik.github.io/aos/

/*$(".pogledaj").on("click", function() {
    console.log("nesto")
    //let id = $(this).dataset.satid;
    //ispisiModal(id);
})
/*
$("#zatvori").on("click", function() {
    $(".modal-bg").css("visibiliy", "hidden");
})*/


/*function ispisiModal(id) {
    let html = "";
    // ispises sve
    // $(".modal-bg").css("visibiliy", "visible");
}*/

