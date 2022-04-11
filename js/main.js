/*Konsultacije pitanje*/
//mesanje jquery i native js
//smestanje u ls
//da li je forma intuitivna
//new i sale da li je okej
//kod za dokumentaciju posto je templejt



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
//funkcije za localstorage
function vratiLS(name){
    return JSON.parse(localStorage.getItem(name))
}
function skladistiLS(naziv,data){
    localStorage.setItem(naziv,JSON.stringify(data))
}
//pocetak
window.onload=function(){
    let url = window.location.pathname;

    var brendovi=vratiLS('nizBrendova')
    var kategorije=vratiLS('nizKategorija')
    var kolekcije=vratiLS('nizKolekcija')

    console.log(url)
    brojProizvodaUKorpi()

    if(url == "/watchshop/index.html" || url == "/watchshop/"){
        dohvati("satovi.json",najnovijiProizvodi)
        dohvati("satovi.json",rasprodaja)
        dohvati("kategorije.json",ispisKat)
        dohvati("brendovi.json",ispisBrendova)
        slider()
    }
    if(url == "/watchshop/shop.html"){
        dohvati("satovi.json",sviProizvodi)
        kreirajChb(brendovi,"#brend",'brendovi',".brendovi")
        kreirajChb(kategorije,"#kategorije",'kategorije',"#kategorije")
        kreirajChb(kolekcije,'#kolekcija','kolekcije','.kolekcije')
    }
    if(url == "/watchshop/checkout.html"){
        proveraForme()
        ispisProizvodaZaKorpu()
        obrisiKorpu()
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

//smestanje u localstorage
dohvati("satovi.json", function(result){
    skladistiLS('nizSatova',result)
})
dohvati("kolekcija.json", function(result){
    skladistiLS('nizKolekcija',result)
})
dohvati("brendovi.json", function(result){
    skladistiLS('nizBrendova',result)
})
dohvati("kategorije.json", function(result){
    skladistiLS('nizKategorija',result)
})
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
    document.querySelector('.kategorije').innerHTML=ispis
    skladistiLS('nizKategorija',nizKategorija)
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
    document.querySelector('#brendovi').innerHTML=ispis
    skladistiLS('nizBrendova',nizBrendova)
   /* $('.lista1 a').click(function() {
        localStorage.setItem("cekiranoBrend", this.dataset.brendid);
        filterChange();
    });*/
}

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
        <div class="product-image-wrapper" >
            <div class="single-products" >
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
               <div class="product-overlay mesto" data-id = "${proizvod.id}">
                    <div class="overlay-content">
                    </div>
                </div>
            </div>
        </div>
    </div>`  
    } 
    document.querySelector(idBloka).innerHTML=ispis
}

//obrada kartica
function brojProizvoda(id){
    var sat=vratiLS('nizSatova')
    let filterprod = sat.filter(el => el.brendId == id)
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

//rasprodaja
function rasprodaja(nizProizvoda){
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
                    <a href="#" class="btn btn-default add-to-cart klikni mesto" data-id="${p.id}" id="dodavanje">Pogledaj više</a>
                </div>
                <div id="kolekcijaOznaka">
                ${obradaKolekcije(p.kolekcijaId)}
                </div> 
            </div>
        </div>
    </div>`
    }
    document.querySelector('#rasprodajaSatovi').innerHTML=ispis
    document.querySelectorAll('.mesto').forEach(x=>x.addEventListener('click',function(e){
        e.preventDefault()
        id = $(this).data("id");
        $(".modal-bg").html("");
        $(".modal-bg").css("visibility", "visible");
        dohvati('satovi.json',ispisiModal);
    }))
}

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

//modal
let id = 0;
function ispisiModal(nizProizvoda){
    let ispis=""
    for(let p of nizProizvoda){
        if (p.id == id)
      ispis +=`<div class="nes modal d-flex flex-row">
        <div class="left1 col-sm-2">
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
                       ${obradaSpecifikacije(p.specifikacije)}
                    </tbody>
                </table>
            </div>
            <div class="btn-box">
                <input type="button" id="add-to-cart" class="btn-mm"  value="Dodaj u korpu"/>
            </div>
            <h3 class="" id="proizvodUKorpi"></h3>
        </div>
    </div>`
    }
    $(".modal-bg").html(ispis);
    document.querySelector('#add-to-cart').addEventListener('click',dodajUKorpu)
}

$(document).on("click",".mesto", function() {
    id = $(this).data("id");
    $(".modal-bg").html("");
    $(".modal-bg").css("visibility", "visible");
    dohvati('satovi.json',ispisiModal);
    
})
$(document).on("click",".zatvori", function(){
    $(".modal-bg").css("visibility", "hidden");
})


//funkcija za ispis specifikacija modal
function obradaSpecifikacije(specObj){
    let html = "";

    for(let objSpec of specObj){
        if(objSpec.naziv=='Garancija'){
            html += `<tr>
                    <td>${objSpec.naziv}:</td>
                    <td> ${objSpec.vrednost} meseci</td>
                 </tr>`
        }
        else{
            html += `<tr>
                    <td>${objSpec.naziv}:</td>
                    <td> ${objSpec.vrednost}</td>
                 </tr>`
        }
    }
    return html;
}

/***************** KORPA ****************/

function dodajUKorpu(){
    var proizvodiIzKorpe= vratiLS('proizvodiKorpa')
    if(proizvodiIzKorpe){
        if(dodatUKorpu()){
            document.querySelector('#proizvodUKorpi').innerHTML='Proizvod se već nalazi u korpi'
        }
        else{
            dodajNoviProizvod()
            brojProizvodaUKorpi()
        }
    }
    else{
        dodajPrviProizvod()
        brojProizvodaUKorpi()
    }

    function dodajPrviProizvod(){
        let proizvodi=[]
        proizvodi[0]={
            id:id,
        }
        skladistiLS('proizvodiKorpa',proizvodi)
        document.querySelector('#proizvodUKorpi').innerHTML='Proizvod je uspešno dodat u korpu'
    }
    
    function dodatUKorpu(){
        return proizvodiIzKorpe.filter(proizvod => proizvod.id == id).length
    
    }

    function dodajNoviProizvod(){
        let proizvodiLS=vratiLS('proizvodiKorpa')
        proizvodiLS.push({
            id:id,
        })
        skladistiLS('proizvodiKorpa',proizvodiLS)
        document.querySelector('#proizvodUKorpi').innerHTML='Proizvod je uspešno dodat u korpu'
    }
}

function brojProizvodaUKorpi(){
    var proizvodiKorpa=vratiLS('proizvodiKorpa')
    let broj
    let ispis=''
    if(proizvodiKorpa!=null){
        broj=proizvodiKorpa.length
        document.querySelector('#broj-korpa').innerHTML='Nesto'
    }else{
        document.querySelector('#broj-korpa').innerHTML='Nista'
    }
}

function ispisProizvodaZaKorpu(){
    var proizvodiKorpa=vratiLS('proizvodiKorpa')
    if(proizvodiKorpa==null){
        document.querySelector('#ispisSadrzajaKorpe').innerHTML=`<h4 class="text-center">Korpa je prazna</h4>`
    }
    else{
        IspisiSadrzajKorpe()
    }
}

function IspisiSadrzajKorpe(){
    var satoviIzKorpe=vratiLS('proizvodiKorpa')
    var sviProizvodi=vratiLS('nizSatova')
    let zaPrikaz=[]

    zaPrikaz=sviProizvodi.filter(p => {
        for(let proizvod of satoviIzKorpe){
            if(p.id == proizvod.id){
                p.kolicina=1
                return true
            }
        }
        return false
    })
    tabela(zaPrikaz)
}

//funkcija za kreiranje tabele za proizvode iz korpe
function tabela(niz){
    let ispis=''
    for(let proizvod of niz){
        ispis+=`<tr>
        <td class="cart_product">
            <a href=""><img src="${proizvod.slika.src}" alt="${proizvod.slika.alt}"></a>
            <h4><a href="">${proizvod.naziv}</a></h4>
        </td>
        <td class="cart_price">
            <p>RSD ${proizvod.cena.nova},00</p>
        </td>
        <td class="cart_quantity">
            <div class="cart_quantity_button">
                <a class="cart_quantity_up" href=""> + </a>
                <input class="cart_quantity_input" type="text" name="quantity" value="1" autocomplete="off" size="2">
                <a class="cart_quantity_down" href=""> - </a>
            </div>
        </td>
        <td class="cart_total">
            <p>RSD 12.650,00</p>
        </td>
        <td class="cart_delete">
            <a class="cart_quantity_delete brisiIzKorpe"  data-idproizvoda="${proizvod.id}" href=""><i class="fa fa-times"></i></a>
        </td>
    </tr>`
    }
    document.querySelector('#ispisSadrzajaKorpe').innerHTML=ispis
}

//brisanje jednog proizvoda iz korpe
$(document).on("click",".brisiIzKorpe", function(e) {
    e.preventDefault()
    let proizvodi=vratiLS('proizvodiKorpa')
    var sviProizvodi=vratiLS('nizSatova')
    let proizvod = $(this).data("idproizvoda");
    let ostaloUKorpi=proizvodi.filter(p => p.id != proizvod)
    let noviNizProizvoda=[]

    for(let x of ostaloUKorpi){
        for(let p of sviProizvodi){
            if(x.id==p.id){
                noviNizProizvoda.push(p)
                break
            }
        }
    }
    if(noviNizProizvoda.length){
        skladistiLS('proizvodiKorpa',noviNizProizvoda)
        tabela(noviNizProizvoda)
    }
    else{
        localStorage.removeItem('proizvodiKorpa')
        document.querySelector('#ispisSadrzajaKorpe').innerHTML=`<h4 class="text-center">Korpa je prazna</h4>`
        brojProizvodaUKorpi()
    }
    
})

//brisanje svih proizvoda iz korpe
function obrisiKorpu(){
    document.querySelector('#btnObrisi').addEventListener('click',function(){
        localStorage.removeItem('proizvodiKorpa')
        ispisProizvodaZaKorpu()
    })
}

