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
            console.log(index)
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
