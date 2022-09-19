function myFunction() {
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
        x.className += " responsive";
    } else {
        x.className = "topnav";
    }
}



console.clear()

const navExpand = [].slice.call(document.querySelectorAll('.nav-expand'))
const backLink = `<li class="nav-item">
	<a class="nav-link nav-back-link" href="javascript:;">
		Back
	</a>
</li>`

navExpand.forEach(item => {
    item.querySelector('.nav-expand-content').insertAdjacentHTML('afterbegin', backLink)
    item.querySelector('.nav-link').addEventListener('click', () => item.classList.add('active'))
    item.querySelector('.nav-back-link').addEventListener('click', () => item.classList.remove('active'))
})


// ---------------------------------------
// not-so-important stuff starts here

const ham = document.getElementById('ham')
ham.addEventListener('click', function() {
    document.body.classList.toggle('nav-is-toggled')
})


function checkSiret() {
    const check = document.getElementById('check-siret');
    const siret = document.getElementById('siret-input');
    const siret_input = document.getElementById('siret-req');
    console.log('true')
    if (check.checked == true) {
        siret.classList.remove('hidden');
        siret_input.required = true;
    } else {
        siret.classList.add('hidden');
        siret_input.required = false;
    }
}