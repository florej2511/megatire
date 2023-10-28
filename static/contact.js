const error_message = document.getElementById('error_message')
let sent = false

const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

const contactMail = async () => {
    if(sent) return
    const button = document.getElementById('save_button')
    button.innerText = 'Enviando'
    button.style.width = '120px'
    let i = 0;
    const interval = setInterval(() => {
        if(i == 3){
            button.innerText = 'Enviando'
            i = 0
            return
        }
        i++
        button.innerText += '.'
    }, 500)
    const inputs = document.getElementsByTagName('input')
    const texts = document.getElementsByTagName('textarea')
    const values = {
        email: '',
        cellphone: '',
        content: ''
    }
    let errs = 0
    Array.from(inputs).forEach(el => {
        if (el.name == 'email' && !validateEmail(el.value)) {
            errs++
            el.style.borderColor = 'red'
        } else if (el.name == 'cellphone' && el.value.length < 6) {
            errs++
            el.style.borderColor = 'red'
        } else if (el.value.length == 0) {
            errs++
            el.style.borderColor = 'red'
        } else {
            values[el.name] = el.value
            el.style.borderColor = ''
        }
    })

    Array.from(texts).forEach(el => {
        if (el.value.length == 0) {
            errs++
            el.style.borderColor = 'red'
        } else {
            el.style.borderColor = ''
            values[el.name] = el.value
        }
    })

    if (errs > 0) {
        error_message.classList.toggle('hidden', false)
        clearInterval(interval)
    } else {
        error_message.classList.toggle('hidden', true)
        const resp = await new Promise((res, rej) => {
            fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(values)
            })
            .then(r => r.json())
            .then(r => res(r))
            .catch(r => res(r))
        })
        clearInterval(interval)
        if(resp.status){
            button.innerText = '¡Enviado!'
            sent = true
        }else{
            sent = false
        }
        console.log(resp)
    }
}

const fillTextarea = async (message) => {
    const texts = document.getElementsByTagName('textarea')
    texts.content.scrollIntoView({behavior: 'smooth'})
    const chars = message.split('')
    for (const c of chars) {
        texts.content.focus()
        texts.content.value += c
        await new Promise((res) => {
            setTimeout(() => {
                res();
            }, 35)
        })
    }
    texts.content.blur()
}

window.onload = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const param = urlParams.get('puntos');
    if (typeof param == 'string') {
        const message = `Hola, amigos de Megatire. No recibí mi revisión de 25 puntos.`
        fillTextarea(message)
        return
    }
    const param2 = urlParams.get('alineacion');
    if(typeof param2 == 'string'){
        const message = `Hola, amigos de Megatire. Me gustaría recibir más información sobre la alineación para mi vehículo.`
        fillTextarea(message)
        return
    }

    const param3 = urlParams.get('balanceo');
    if(typeof param3 == 'string'){
        const message = `Hola, amigos de Megatire. Me gustaría recibir más información sobre el balanceo para mi vehículo.`
        fillTextarea(message)
        return
    }

}